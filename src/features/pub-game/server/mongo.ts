import { MongoClient, type MongoClientOptions } from "mongodb";

/**
 * The connection settings for MongoDB Atlas (server only: MONGODB_URI is never
 * NEXT_PUBLIC_, and only src/features/pub-game/server/ imports this file).
 *
 * - One MongoClient per server instance (see context.ts): the client keeps a
 *   small pool of connections and reuses them for every request.
 * - Short time-outs: when Atlas can't be reached, a request fails after a few
 *   seconds (the phones then show "offline" and keep trying) instead of hanging.
 */
export const MONGO_CLIENT_OPTIONS: MongoClientOptions = {
  // A Vercel function handles one request at a time; a few connections per instance is plenty
  // (Atlas M0 allows 500 in total).
  maxPoolSize: 5,
  // Close connections nobody used for a minute.
  maxIdleTimeMS: 60_000,
  // How long to look for a reachable server before giving up (default 30 s).
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 10_000,
  // A single query that takes longer than this is broken off.
  socketTimeoutMS: 20_000,
  // Leave out fields that are `undefined` (the default saves them as null, and the game state uses undefined).
  ignoreUndefined: true,
  appName: "hidden-antwerp",
};

/** Atlas's default database name when the URI has none: never what we want. */
const DRIVER_DEFAULT_DB = "test";

/**
 * A client for this URI. It connects on the first query, so creating it never
 * fails or waits. The URI must name the database (…mongodb.net/hiddenantwerp?…).
 */
export function createMongoClient(uri: string): MongoClient {
  return new MongoClient(uri, MONGO_CLIENT_OPTIONS);
}

/** The database the URI names. Refuses a URI without one (the driver would silently use "test"). */
export function databaseOf(client: MongoClient) {
  const db = client.db();
  if (db.databaseName === DRIVER_DEFAULT_DB) {
    throw new Error("MONGODB_URI must name the database, e.g. …mongodb.net/hiddenantwerp?retryWrites=true&w=majority");
  }
  return db;
}
