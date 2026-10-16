/**
 * Backup of the commerce data (P9), until the database has automatic backups
 * (MongoDB Atlas' free tier has none: decision B12, a paid tier before launch).
 * Read only: it changes nothing in the database.
 *
 *   npm run db:export        (reads MONGODB_URI from .env.local)
 *
 * Writes every `com_*` collection as Extended JSON (dates and numbers kept
 * exactly) to backups/<date-time>/<collection>.json. Hidden Pubs games are left
 * out (they are deleted after 7 days anyway).
 *
 * ⚠ The files contain personal data (customers' emails, names, quote requests).
 * backups/ is git-ignored; keep the files on an encrypted disk, never in a
 * shared folder or email, and delete old ones (retention periods still apply).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// BSON comes with the mongodb package (no extra dependency).
import { BSON, MongoClient } from "mongodb";
import { COLLECTIONS, errorLabel } from "../db/mongo-schema.mjs";
import { connectionHint } from "./lib/mongo-hints.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (put it in .env.local, see .env.example).");
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000, appName: "hidden-antwerp-export" });
try {
  const db = client.db();
  const folder = join("backups", new Date().toISOString().replace(/[:.]/g, "-"));
  mkdirSync(folder, { recursive: true });
  let total = 0;
  for (const name of Object.values(COLLECTIONS).filter((collection) => collection.startsWith("com_"))) {
    const documents = await db.collection(name).find({}).toArray();
    writeFileSync(join(folder, `${name}.json`), BSON.EJSON.stringify(documents, undefined, 2, { relaxed: false }));
    console.log(`✔ ${name}: ${documents.length}`);
    total += documents.length;
  }
  console.log(`\nSaved ${total} documents from "${db.databaseName}" in ${folder}. They contain personal data: keep them safe.`);
} catch (error) {
  console.error(`✘ Export failed: ${errorLabel(error)}`);
  console.error(connectionHint(error));
  process.exitCode = 1;
} finally {
  await client.close();
}
