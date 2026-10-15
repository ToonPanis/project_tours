/**
 * Creates the Hidden Pubs collections, their validation and indexes in MongoDB
 * (db/mongo-schema.mjs). Only adds what's missing: it never deletes or changes data,
 * so running it twice is safe. Run it once, and again when the schema file changes.
 *
 *   npm run db:setup        (reads MONGODB_URI from .env.local)
 *
 * Prints the database name, never the connection string.
 */
import { MongoClient } from "mongodb";
import { ensureSchema, errorLabel } from "../db/mongo-schema.mjs";
import { connectionHint } from "./lib/mongo-hints.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (put it in .env.local, see .env.example).");
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000, appName: "hidden-antwerp-setup" });
try {
  const db = client.db();
  if (db.databaseName === "test") {
    throw Object.assign(new Error(), { name: "MissingDatabaseName" });
  }
  const changes = await ensureSchema(db);
  console.log(`Database: ${db.databaseName}`);
  for (const change of changes) console.log(`- ${change}`);
  console.log(changes.length === 0 ? "Everything was already set up." : "Done.");
} catch (error) {
  console.error(`Setup failed: ${errorLabel(error)}`);
  console.error(connectionHint(error));
  process.exitCode = 1;
} finally {
  await client.close();
}
