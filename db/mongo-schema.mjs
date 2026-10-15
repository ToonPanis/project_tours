/**
 * Hidden Pubs in MongoDB: the collections, their validation and their indexes.
 * The single source for `npm run db:setup`, `npm run db:check` and the database tests.
 * (Plain JavaScript so the scripts can use it without a build step.)
 *
 * Four collections, one per kind of record. Everything of one game is found by
 * its code, and everything disappears 7 days after the game was created (D29):
 * every document carries the game's `expiresAt`, and a TTL index on it lets
 * MongoDB delete it by itself (the TTL job runs about once a minute, so the
 * app also checks `expiresAt` when it reads a game).
 */

/** @typedef {import("mongodb").Db} Db */

export const COLLECTIONS = {
  /** One document per game: `_id` = the game code, the whole game state, and `version`. */
  games: "pub_games",
  /** Every accepted action. Unique (gameCode, actionId): a double tap or a retry is saved once. */
  actions: "pub_game_actions",
  /** What happened, for the popups on every phone ("events since version X"). */
  events: "pub_game_events",
  /** Which phone is which player: only a SHA-256 hash of the cookie secret. */
  players: "pub_game_players",
};

const text = (maxLength) => ({ bsonType: "string", minLength: 1, maxLength });
const whole = { bsonType: ["int", "long"], minimum: 0 };
const date = { bsonType: "date" };

/** The shape MongoDB itself checks on every insert and update ($jsonSchema validation). */
const VALIDATORS = {
  [COLLECTIONS.games]: {
    required: ["_id", "walkSlug", "state", "version", "createdAt", "expiresAt"],
    properties: {
      _id: text(40),
      walkSlug: text(100),
      state: { bsonType: "object" },
      version: whole,
      createdAt: date,
      expiresAt: date,
    },
  },
  [COLLECTIONS.actions]: {
    required: ["gameCode", "actionId", "playerId", "action", "version", "createdAt", "expiresAt"],
    properties: {
      gameCode: text(40),
      actionId: text(100),
      playerId: text(100),
      action: { bsonType: "object" },
      version: whole,
      createdAt: date,
      expiresAt: date,
    },
  },
  [COLLECTIONS.events]: {
    required: ["gameCode", "version", "position", "event", "expiresAt"],
    properties: {
      gameCode: text(40),
      version: whole,
      position: whole,
      event: { bsonType: "object" },
      expiresAt: date,
    },
  },
  [COLLECTIONS.players]: {
    required: ["gameCode", "tokenHash", "playerId", "expiresAt"],
    properties: {
      gameCode: text(40),
      tokenHash: text(100),
      playerId: text(100),
      expiresAt: date,
    },
  },
};

/** TTL: delete a document as soon as its `expiresAt` has passed. */
const expiry = { key: { expiresAt: 1 }, name: "expiresAt_ttl", expireAfterSeconds: 0 };

/** @type {Record<string, import("mongodb").IndexDescription[]>} */
export const INDEXES = {
  [COLLECTIONS.games]: [expiry],
  [COLLECTIONS.actions]: [{ key: { gameCode: 1, actionId: 1 }, name: "gameCode_actionId", unique: true }, expiry],
  [COLLECTIONS.events]: [
    { key: { gameCode: 1, version: 1, position: 1 }, name: "gameCode_version_position", unique: true },
    expiry,
  ],
  [COLLECTIONS.players]: [{ key: { gameCode: 1, tokenHash: 1 }, name: "gameCode_tokenHash", unique: true }, expiry],
};

/**
 * Creates the collections (with validation) and indexes that don't exist yet.
 * Safe to run any number of times: it never deletes or changes data.
 *
 * @param {Db} db
 * @returns {Promise<string[]>} what it did, one line per change (empty = already up to date)
 */
export async function ensureSchema(db) {
  const done = [];
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name));

  for (const [name, schema] of Object.entries(VALIDATORS)) {
    const validator = { $jsonSchema: { bsonType: "object", ...schema } };
    if (!existing.has(name)) {
      await db.createCollection(name, { validator, validationLevel: "strict", validationAction: "error" });
      done.push(`created collection ${name}`);
    } else {
      // Keep the validation up to date. Needs the dbAdmin role; without it, the old rules stay.
      try {
        await db.command({ collMod: name, validator, validationLevel: "strict", validationAction: "error" });
      } catch (error) {
        done.push(`could not update the validation of ${name} (${errorLabel(error)}); the existing rules stay`);
      }
    }
    const indexNames = new Set((await db.collection(name).listIndexes().toArray()).map((index) => index.name));
    const missing = INDEXES[name].filter((index) => !indexNames.has(index.name));
    if (missing.length > 0) {
      await db.collection(name).createIndexes(missing);
      done.push(`created index(es) ${missing.map((index) => index.name).join(", ")} on ${name}`);
    }
  }
  return done;
}

/**
 * What's missing compared with the schema above (read only).
 *
 * @param {Db} db
 * @returns {Promise<string[]>} the problems (empty = everything is there)
 */
export async function checkSchema(db) {
  const problems = [];
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name));
  for (const name of Object.values(COLLECTIONS)) {
    if (!existing.has(name)) {
      problems.push(`collection ${name} is missing`);
      continue;
    }
    const indexNames = new Set((await db.collection(name).listIndexes().toArray()).map((index) => index.name));
    for (const index of INDEXES[name]) {
      if (!indexNames.has(index.name)) problems.push(`index ${index.name} on ${name} is missing`);
    }
  }
  return problems;
}

/**
 * A safe description of a database error: its name and code, never its message
 * (a message could contain a host name or, for a badly formed URI, part of it).
 *
 * @param {unknown} error
 */
export function errorLabel(error) {
  if (!(error instanceof Error)) return "unknown error";
  const code = "code" in error && error.code !== undefined ? ` ${String(error.code)}` : "";
  return `${error.name}${code}`;
}
