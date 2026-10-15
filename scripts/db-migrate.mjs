/**
 * Applies the SQL files in db/migrations/ that the database hasn't seen yet,
 * in name order (001_…, 002_…), each in its own transaction.
 *
 *   npm run db:migrate                 (reads DATABASE_URL from .env.local)
 *   DATABASE_URL=… node scripts/db-migrate.mjs
 *
 * Applied files are recorded in the table schema_migrations, so running it
 * twice is safe. No ORM: the migrations are plain SQL you can read.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (put it in .env.local, see .env.example).");
  process.exit(1);
}

const folder = join(process.cwd(), "db", "migrations");
const sql = postgres(url, { max: 1, onnotice: () => {} });

try {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text        PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`;
  const applied = new Set((await sql`SELECT name FROM schema_migrations`).map((row) => row.name));
  const files = (await readdir(folder)).filter((name) => name.endsWith(".sql")).sort();

  let count = 0;
  for (const name of files) {
    if (applied.has(name)) continue;
    const text = await readFile(join(folder, name), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(text);
      await tx`INSERT INTO schema_migrations (name) VALUES (${name})`;
    });
    console.log(`Applied ${name}`);
    count++;
  }
  console.log(count === 0 ? "Database is up to date." : `${count} migration(s) applied.`);
} finally {
  await sql.end();
}
