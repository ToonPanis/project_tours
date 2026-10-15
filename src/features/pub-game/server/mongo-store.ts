import { MongoServerError, type Db, type MongoClient } from "mongodb";
import type { PubGameAction, PubGameEvent, PubGameState } from "@/types/pub-game";
import { COLLECTIONS, errorLabel } from "../../../../db/mongo-schema.mjs";
import type { CommitInput, CommitResult, GameStore, StoredEvent, StoredGame } from "./game-store";

/** The documents as they're saved (collections and indexes: db/mongo-schema.mjs). */
interface GameDoc {
  /** The game code. */
  _id: string;
  walkSlug: string;
  state: PubGameState;
  version: number;
  createdAt: Date;
  expiresAt: Date;
  /** Tickets bought (P3); missing = no limit. */
  seatLimit?: number;
}
interface ActionDoc {
  gameCode: string;
  actionId: string;
  playerId: string;
  action: PubGameAction;
  /** The game version this action produced. */
  version: number;
  createdAt: Date;
  expiresAt: Date;
}
interface EventDoc {
  gameCode: string;
  version: number;
  position: number;
  event: PubGameEvent;
  expiresAt: Date;
}
interface PlayerDoc {
  gameCode: string;
  tokenHash: string;
  playerId: string;
  expiresAt: Date;
}

/**
 * Thrown when the database can't be reached or answers with an error. Its
 * message is always this fixed text, so nothing about the connection (host,
 * user, URI) can end up in a log or a response. The route then answers 500 and
 * the phones show "offline" and keep polling until it works again.
 */
export class GameStoreUnavailableError extends Error {
  constructor() {
    super("The game database is not available.");
    this.name = "GameStoreUnavailableError";
  }
}

/** A saved document that doesn't have the expected shape (it would break the game, so it isn't used). */
class StoredDataError extends Error {
  constructor(what: string) {
    super(`A stored ${what} has an unexpected shape.`);
    this.name = "StoredDataError";
  }
}

/** MongoDB's "this unique key already exists". */
const isDuplicateKey = (error: unknown) => error instanceof MongoServerError && error.code === 11000;

/**
 * Protection against NoSQL injection: only plain, short strings go into a
 * filter. An object such as { "$ne": "" } in place of a code would otherwise
 * match every document. (The game service already checks its input; this is
 * the last line of defence, right before the query.)
 */
function key(value: unknown): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 100) {
    throw new TypeError("A database key must be a short string.");
  }
  return value;
}

function wholeNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new TypeError("Expected a whole number.");
  }
  return value;
}

function isGameDoc(doc: unknown): doc is GameDoc {
  if (typeof doc !== "object" || doc === null) return false;
  const game = doc as Record<string, unknown>;
  return (
    typeof game._id === "string" &&
    typeof game.walkSlug === "string" &&
    typeof game.state === "object" &&
    game.state !== null &&
    typeof game.version === "number" &&
    Number.isInteger(game.version) &&
    game.createdAt instanceof Date &&
    game.expiresAt instanceof Date
  );
}

/**
 * Games in MongoDB Atlas. Behaves exactly like the memory store (the same tests
 * run against both: pub-game-store.test.ts).
 *
 * Saving an action is one transaction over the game, its action and its
 * events: either all of it is saved or nothing. Two phones saving at the same
 * moment: MongoDB lets one transaction change the game document; the other
 * gets a write conflict, the driver runs it again, and then it sees the new
 * version and answers "conflict" (the game service retries with fresh state).
 */
export class MongoGameStore implements GameStore {
  private readonly games;
  private readonly actions;
  private readonly events;
  private readonly players;

  constructor(
    private readonly client: MongoClient,
    db: Db,
  ) {
    this.games = db.collection<GameDoc>(COLLECTIONS.games);
    this.actions = db.collection<ActionDoc>(COLLECTIONS.actions);
    this.events = db.collection<EventDoc>(COLLECTIONS.events);
    this.players = db.collection<PlayerDoc>(COLLECTIONS.players);
  }

  /** Runs one database operation; any failure becomes a GameStoreUnavailableError (logged by name and code only). */
  private async guard<T>(operation: string, run: () => Promise<T>): Promise<T> {
    try {
      return await run();
    } catch (error) {
      if (error instanceof TypeError) throw error;
      console.error(`[Hidden Pubs] database ${operation} failed: ${errorLabel(error)}`);
      throw new GameStoreUnavailableError();
    }
  }

  createGame(game: StoredGame): Promise<boolean> {
    const code = key(game.code);
    return this.guard("createGame", async () => {
      // A code is free again once its game has expired. MongoDB's TTL job removes
      // expired documents about once a minute; this removes that one game's right away.
      const expired = { expiresAt: { $lte: new Date() } };
      await this.games.deleteOne({ _id: code, ...expired });
      await Promise.all([
        this.actions.deleteMany({ gameCode: code, ...expired }),
        this.events.deleteMany({ gameCode: code, ...expired }),
        this.players.deleteMany({ gameCode: code, ...expired }),
      ]);
      try {
        await this.games.insertOne({
          _id: code,
          walkSlug: game.walkSlug,
          state: game.state,
          version: wholeNumber(game.version),
          createdAt: new Date(game.createdAt),
          expiresAt: new Date(game.expiresAt),
          ...(game.seatLimit === undefined ? {} : { seatLimit: wholeNumber(game.seatLimit) }),
        });
        return true;
      } catch (error) {
        if (isDuplicateKey(error)) return false;
        throw error;
      }
    });
  }

  getGame(code: string): Promise<StoredGame | null> {
    const id = key(code);
    return this.guard("getGame", async () => {
      const doc = await this.games.findOne({ _id: id, expiresAt: { $gt: new Date() } });
      if (!doc) return null;
      if (!isGameDoc(doc)) throw new StoredDataError("game");
      return {
        code: doc._id,
        walkSlug: doc.walkSlug,
        state: doc.state,
        version: doc.version,
        createdAt: doc.createdAt.toISOString(),
        expiresAt: doc.expiresAt.toISOString(),
        ...(typeof doc.seatLimit === "number" ? { seatLimit: doc.seatLimit } : {}),
      };
    });
  }

  getVersion(code: string): Promise<number | null> {
    const id = key(code);
    return this.guard("getVersion", async () => {
      // Only the version leaves the database: a few bytes instead of the whole game.
      const doc = await this.games.findOne({ _id: id, expiresAt: { $gt: new Date() } }, { projection: { version: 1 } });
      if (!doc) return null;
      if (typeof doc.version !== "number") throw new StoredDataError("game");
      return doc.version;
    });
  }

  commitAction(input: CommitInput): Promise<CommitResult> {
    const code = key(input.code);
    const actionId = key(input.actionId);
    const playerId = key(input.playerId);
    const expectedVersion = wholeNumber(input.expectedVersion);

    return this.guard("commitAction", async () => {
      const session = this.client.startSession();
      try {
        let result: CommitResult = { status: "conflict" };
        // withTransaction runs the function again after a write conflict (another phone saved first).
        await session.withTransaction(async () => {
          const now = new Date();
          const earlier = await this.actions.findOne({ gameCode: code, actionId }, { session });
          if (earlier) {
            result = { status: "duplicate", version: earlier.version };
            return;
          }
          const version = expectedVersion + 1;
          // Saved only when the game is still at the expected version (and not expired): check
          // and save in one step. No match = someone else saved first (or the game is gone).
          const game = await this.games.findOneAndUpdate(
            { _id: code, version: expectedVersion, expiresAt: { $gt: now } },
            { $set: { state: input.state, version } },
            { session, projection: { expiresAt: 1 } },
          );
          if (!game) {
            result = { status: "conflict" };
            return;
          }
          const { expiresAt } = game;
          await this.actions.insertOne(
            { gameCode: code, actionId, playerId, action: input.action, version, createdAt: now, expiresAt },
            { session },
          );
          if (input.events.length > 0) {
            await this.events.insertMany(
              input.events.map((event, position) => ({ gameCode: code, version, position, event, expiresAt })),
              { session },
            );
          }
          result = { status: "committed", version };
        });
        return result;
      } finally {
        await session.endSession();
      }
    });
  }

  findAction(code: string, actionId: string): Promise<number | null> {
    const filter = { gameCode: key(code), actionId: key(actionId) };
    return this.guard("findAction", async () => {
      const doc = await this.actions.findOne(filter, { projection: { version: 1 } });
      return doc?.version ?? null;
    });
  }

  eventsSince(code: string, afterVersion: number, upToVersion: number, limit: number): Promise<StoredEvent[]> {
    const gameCode = key(code);
    const since = wholeNumber(afterVersion);
    const upTo = wholeNumber(upToVersion);
    // In MongoDB limit(0) means "no limit"; asking for no events gets none.
    if (wholeNumber(limit) === 0) return Promise.resolve([]);
    return this.guard("eventsSince", async () => {
      const docs = await this.events
        .find({ gameCode, version: { $gt: since, $lte: upTo } }, { projection: { _id: 0, version: 1, event: 1 } })
        .sort({ version: 1, position: 1 })
        .limit(limit)
        .toArray();
      return docs.map((doc) => ({ version: doc.version, event: doc.event }));
    });
  }

  savePlayerToken(code: string, tokenHash: string, playerId: string, expiresAt: string): Promise<void> {
    const gameCode = key(code);
    const filter = { gameCode, tokenHash: key(tokenHash) };
    const player = key(playerId);
    const expires = new Date(expiresAt);
    if (Number.isNaN(expires.getTime())) throw new TypeError("savePlayerToken: expiresAt is not a date");
    return this.guard("savePlayerToken", async () => {
      try {
        // Saved once: the same token again changes nothing.
        await this.players.updateOne(
          filter,
          { $setOnInsert: { ...filter, playerId: player, expiresAt: expires } },
          { upsert: true },
        );
      } catch (error) {
        // Two requests inserting the same token at the same moment: the other one saved it.
        if (!isDuplicateKey(error)) throw error;
      }
    });
  }

  findPlayerByToken(code: string, tokenHash: string): Promise<string | null> {
    const filter = { gameCode: key(code), tokenHash: key(tokenHash) };
    return this.guard("findPlayerByToken", async () => {
      const doc = await this.players.findOne({ ...filter, expiresAt: { $gt: new Date() } });
      return doc?.playerId ?? null;
    });
  }
}
