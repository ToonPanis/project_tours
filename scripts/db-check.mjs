/**
 * Health check of the Hidden Pubs database, for whoever manages the site.
 * Read only: it changes nothing.
 *
 *   npm run db:check        (reads MONGODB_URI from .env.local)
 *
 * Checks that Atlas can be reached and logged in to, how long a ping takes, that
 * every collection and index exists, and how many games are active. Prints no
 * connection string, user name or password, and no game contents.
 *
 * (A script and not a web page: the site has no admin accounts, so a health
 * page would be open to everyone.)
 */
import { MongoClient } from "mongodb";
import { checkSchema, COLLECTIONS, errorLabel } from "../db/mongo-schema.mjs";
import { connectionHint } from "./lib/mongo-hints.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (put it in .env.local, see .env.example).");
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000, appName: "hidden-antwerp-check" });
try {
  const db = client.db();
  if (db.databaseName === "test") {
    throw Object.assign(new Error(), { name: "MissingDatabaseName" });
  }
  const started = performance.now();
  await db.command({ ping: 1 });
  console.log(`✔ Connected to database "${db.databaseName}" (ping ${Math.round(performance.now() - started)} ms)`);

  const problems = await checkSchema(db);
  if (problems.length === 0) {
    console.log("✔ All collections and indexes exist");
  } else {
    for (const problem of problems) console.log(`✘ ${problem}`);
    console.log("  Run: npm run db:setup");
    process.exitCode = 1;
  }

  const now = new Date();
  const active = await db.collection(COLLECTIONS.games).countDocuments({ expiresAt: { $gt: now } });
  const players = await db.collection(COLLECTIONS.players).countDocuments({ expiresAt: { $gt: now } });
  console.log(`  Active games: ${active}, players in them: ${players}`);
} catch (error) {
  console.error(`✘ Database check failed: ${errorLabel(error)}`);
  console.error(connectionHint(error));
  process.exitCode = 1;
} finally {
  await client.close();
}
