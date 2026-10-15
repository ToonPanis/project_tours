import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { COLLECTIONS, ensureSchema } from "../../db/mongo-schema.mjs";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import type { CommitInput, GameStore, StoredGame } from "@/features/pub-game/server/game-store";
import { createGame, getGameUpdate, joinGame, performAction } from "@/features/pub-game/server/game-service";
import { MemoryMediaStore } from "@/features/pub-game/server/media-store";
import { MemoryGameStore } from "@/features/pub-game/server/memory-store";
import { MongoClient } from "mongodb";
import { createMongoClient, databaseOf, MONGO_CLIENT_OPTIONS } from "@/features/pub-game/server/mongo";
import { GameStoreUnavailableError, MongoGameStore } from "@/features/pub-game/server/mongo-store";

/**
 * The same tests for every GameStore, so the MongoDB store is proven to behave
 * exactly like the memory store the other tests use.
 *
 * MongoDB only runs when TEST_MONGODB_URI points to a TEST database (its name must
 * contain "test", e.g. hiddenantwerp_test, so it can never be the real one):
 *   npm run test:db        (reads TEST_MONGODB_URI from .env.local)
 * It creates the collections and indexes if they're missing and deletes only its own games.
 */

const testMongoUri = process.env.TEST_MONGODB_URI;
const runId = Math.random().toString(36).slice(2, 8).toUpperCase();
let codeCounter = 0;
/** Codes no real game can have (real codes have no "_"), so cleanup can't touch real games. */
const newCode = () => `T_${runId}_${++codeCounter}`;

const DAY = 24 * 60 * 60 * 1000;

function storedGame(code: string, expiresInMs = DAY): StoredGame {
  const now = Date.now();
  return {
    code,
    walkSlug: "hidden-pubs",
    state: createPubGame({
      teams: [{ id: "t1", name: "Röd — ёжик" }, { id: "t2", name: "Blue" }],
      playersPerTeam: 4,
      host: { id: "p1", name: "Host", teamId: "t1" },
    }),
    version: 0,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + expiresInMs).toISOString(),
  };
}

function commit(code: string, expectedVersion: number, actionId: string, state: StoredGame["state"]): CommitInput {
  return {
    code,
    expectedVersion,
    actionId,
    playerId: "p1",
    action: { type: "ARRIVE" },
    state,
    events: [{ type: "game-started" }, { type: "player-joined", playerId: "p1" }],
  };
}

type StoreFactory = { name: string; create: () => GameStore; cleanup?: () => Promise<void> };

const factories: StoreFactory[] = [{ name: "memory", create: () => new MemoryGameStore() }];

const mongoClient = testMongoUri ? createMongoClient(testMongoUri) : null;

/** Deletes everything of these games (test games only). */
async function deleteGames(codes: { $regex: string } | string) {
  if (!mongoClient) return;
  const db = databaseOf(mongoClient);
  await db.collection<{ _id: string }>(COLLECTIONS.games).deleteMany({ _id: codes });
  for (const name of [COLLECTIONS.actions, COLLECTIONS.events, COLLECTIONS.players]) {
    await db.collection(name).deleteMany({ gameCode: codes });
  }
}

if (mongoClient) {
  const db = databaseOf(mongoClient);
  if (!db.databaseName.includes("test")) {
    throw new Error(`TEST_MONGODB_URI must point to a test database (name with "test"), not "${db.databaseName}".`);
  }
  beforeAll(async () => {
    await ensureSchema(db);
  });
  factories.push({
    name: "mongodb",
    create: () => new MongoGameStore(mongoClient, db),
    cleanup: async () => {
      await deleteGames({ $regex: `^T_${runId}_` });
      await mongoClient.close();
    },
  });
}

describe.each(factories)("$name store", ({ create, cleanup }) => {
  const store = create();
  if (cleanup) afterAll(cleanup);

  test("saves and returns a game; a code can only be used once", async () => {
    const game = storedGame(newCode());
    expect(await store.createGame(game)).toBe(true);
    expect(await store.createGame({ ...game, walkSlug: "other" })).toBe(false);
    // Names with accents and Cyrillic survive the round trip through JSON.
    expect(await store.getGame(game.code)).toEqual(game);
    expect(await store.getGame(newCode())).toBeNull();
  });

  test("an action is saved once, only on the expected version, with its events in order", async () => {
    const game = storedGame(newCode());
    await store.createGame(game);
    const changed = { ...game.state, phase: "playing" as const };

    expect(await store.commitAction(commit(game.code, 0, "action-a", changed))).toEqual({
      status: "committed",
      version: 1,
    });
    // The same action id again (retry): recognised, nothing saved.
    expect(await store.commitAction(commit(game.code, 1, "action-a", game.state))).toEqual({
      status: "duplicate",
      version: 1,
    });
    // Computed from an old version: refused.
    expect(await store.commitAction(commit(game.code, 0, "action-b", game.state))).toEqual({ status: "conflict" });
    expect(await store.commitAction(commit(newCode(), 0, "action-c", game.state))).toEqual({ status: "conflict" });

    const saved = await store.getGame(game.code);
    expect(saved).toMatchObject({ version: 1, state: { phase: "playing" } });
    expect(await store.findAction(game.code, "action-a")).toBe(1);
    expect(await store.findAction(game.code, "action-b")).toBeNull();

    await store.commitAction(commit(game.code, 1, "action-d", changed));
    expect((await store.eventsSince(game.code, 0, 10)).map((item) => [item.version, item.event.type])).toEqual([
      [1, "game-started"],
      [1, "player-joined"],
      [2, "game-started"],
      [2, "player-joined"],
    ]);
    expect(await store.eventsSince(game.code, 1, 10)).toHaveLength(2);
    expect(await store.eventsSince(game.code, 0, 3)).toHaveLength(3);
    expect(await store.eventsSince(game.code, 2, 10)).toEqual([]);
  });

  test("two saves at the same moment: exactly one wins", async () => {
    const game = storedGame(newCode());
    await store.createGame(game);
    const results = await Promise.all([
      store.commitAction(commit(game.code, 0, "same-time-1", game.state)),
      store.commitAction(commit(game.code, 0, "same-time-2", game.state)),
    ]);
    expect(results.map((result) => result.status).sort()).toEqual(["committed", "conflict"]);
    expect((await store.getGame(game.code))?.version).toBe(1);
  });

  test("two games at the same time don't touch each other", async () => {
    const first = storedGame(newCode());
    const second = storedGame(newCode());
    await store.createGame(first);
    await store.createGame(second);
    const changed = { ...first.state, phase: "playing" as const };
    await Promise.all([
      store.commitAction(commit(first.code, 0, "shared-action-id", changed)),
      store.commitAction(commit(second.code, 0, "shared-action-id", second.state)),
    ]);
    // The same action id in two games is two different actions.
    expect(await store.getGame(first.code)).toMatchObject({ version: 1, state: { phase: "playing" } });
    expect(await store.getGame(second.code)).toMatchObject({ version: 1, state: { phase: second.state.phase } });
    expect(await store.eventsSince(second.code, 0, 10)).toHaveLength(2);
  });

  test("a code can be used again once its game has expired", async () => {
    const old = storedGame(newCode(), -1000);
    await store.createGame(old);
    await store.commitAction(commit(old.code, 0, "old-action", old.state));
    const fresh = storedGame(old.code);
    expect(await store.createGame(fresh)).toBe(true);
    expect(await store.getGame(old.code)).toEqual(fresh);
    expect(await store.eventsSince(old.code, 0, 10)).toEqual([]);
  });

  test("player tokens: found by hash, only in their own game", async () => {
    const game = storedGame(newCode());
    const other = storedGame(newCode());
    await store.createGame(game);
    await store.createGame(other);
    await store.savePlayerToken(game.code, "hash-1", "p1");
    await store.savePlayerToken(game.code, "hash-1", "p1");
    expect(await store.findPlayerByToken(game.code, "hash-1")).toBe("p1");
    expect(await store.findPlayerByToken(game.code, "hash-2")).toBeNull();
    expect(await store.findPlayerByToken(other.code, "hash-1")).toBeNull();
  });

  test("an expired game is gone, with its players", async () => {
    const game = storedGame(newCode(), -1000);
    await store.createGame(game);
    await store.savePlayerToken(game.code, "hash-1", "p1");
    expect(await store.getGame(game.code)).toBeNull();
    expect(await store.findPlayerByToken(game.code, "hash-1")).toBeNull();
  });

  test("a short game through the service: create, join, start, answer", async () => {
    let counter = 0;
    const ctx = {
      store,
      media: new MemoryMediaStore(),
      getGameData: () => ({ definition: pubGameDefinition, answerKey: pubGameAnswerKey }),
      random: Math.random,
      newId: () => `${runId}-id-${++counter}`,
      now: () => new Date(),
    };
    const host = await createGame(ctx, "hidden-pubs", {
      teamNames: ["Red", "Blue"],
      playersPerTeam: 2,
      hostName: "Host",
      hostTeamIndex: 0,
      adultsConfirmed: true,
    });
    if (!host.ok) throw new Error(host.error);
    const { code, token } = host.data;
    const bea = await joinGame(ctx, code, null, { name: "Bea", teamId: "t2", adultsConfirmed: true });
    expect(bea.ok).toBe(true);

    const run = async (actionId: string, action: unknown) => {
      const result = await performAction(ctx, code, token, { actionId: `${runId}-${actionId}`, action });
      if (!result.ok) throw new Error(`${actionId}: ${result.error}`);
      return result.data.view;
    };
    await run("start", { type: "START_GAME" });
    await run("arrive", { type: "ARRIVE" });
    await run("drinks", { type: "DRINKS_DONE" });
    await run("draw", { type: "DRAW_CARDS" });
    const afterPick = await run("pick", { type: "PICK_CARD", index: 0 });
    expect(afterPick.team.cardsLeft).toBe(51);

    const update = await getGameUpdate(ctx, code, token, 0);
    if (!update.ok || !update.data.changed) throw new Error("expected changes");
    expect(update.data.events.map((item) => item.event.type)).toContain("card-drawn");

    // This game has a real-looking code, so the cleanup by prefix misses it: remove it here.
    if (store instanceof MongoGameStore) await deleteGames(code);
  });
});

test.skipIf(Boolean(testMongoUri))("MongoDB store tests are skipped: set TEST_MONGODB_URI to run them", () => {
  expect(testMongoUri).toBeUndefined();
});

/** These need no database: nothing listens on port 1, so every query fails. */
describe("MongoDB store without a database", () => {
  const unreachableUri = "mongodb://127.0.0.1:1/hiddenantwerp_test";

  test("an unreachable database: a fixed error, and only its name in the log", async () => {
    // The real settings, but give up after 0.3 s instead of 5.
    const client = new MongoClient(unreachableUri, { ...MONGO_CLIENT_OPTIONS, serverSelectionTimeoutMS: 300 });
    const store = new MongoGameStore(client, databaseOf(client));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const error = await store.getGame("ABCD").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(GameStoreUnavailableError);
    expect((error as Error).message).not.toContain("127.0.0.1");
    expect(log).toHaveBeenCalledWith("[Hidden Pubs] database getGame failed: MongoServerSelectionError");
    for (const call of log.mock.calls) expect(String(call)).not.toContain("127.0.0.1");
    await client.close();
  });

  test("NoSQL injection: an object where a code belongs is refused before any query", async () => {
    const client = createMongoClient(unreachableUri);
    const store = new MongoGameStore(client, databaseOf(client));
    const attack = { $ne: "" } as unknown as string;
    // A TypeError straight away: the query is never sent (an unreachable database would give a different error).
    expect(() => store.getGame(attack)).toThrow(TypeError);
    expect(() => store.findPlayerByToken("ABCD", attack)).toThrow(TypeError);
    expect(() => store.findAction(attack, "action-1")).toThrow(TypeError);
    expect(() => store.eventsSince("ABCD", -1, 10)).toThrow(TypeError);
    await client.close();
  });

  test("a connection string without a database name is refused", () => {
    expect(() => databaseOf(createMongoClient("mongodb://127.0.0.1:1/"))).toThrow(/must name the database/);
    expect(databaseOf(createMongoClient(unreachableUri)).databaseName).toBe("hiddenantwerp_test");
  });
});
