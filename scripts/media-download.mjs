/**
 * Downloads the Hidden Pubs evidence photos and videos from the PRIVATE Vercel Blob
 * store to this computer, so the organiser can look at them and keep them.
 * (Opening a private file's Blob link in the browser answers "Forbidden": that's the
 * protection. This script reads them with the store's token instead.)
 *
 *   npm run media:download -- J4ZNN5     one game
 *   npm run media:download               every game still in the store
 *
 * Saves to media-downloads/<CODE>/ (git-ignored). Files already downloaded are skipped.
 *
 * Needs MEDIA_DOWNLOAD_TOKEN in .env.local: the value of BLOB_READ_WRITE_TOKEN from
 * Vercel. Deliberately another name: with BLOB_READ_WRITE_TOKEN itself in .env.local,
 * `npm run dev` would upload its test photos into the real store.
 *
 * Privacy (D29): players were told their photos are deleted after 7 days. Keep the
 * downloaded copies only with their OK, and delete them when they're no longer needed.
 */
import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { get, list } from "@vercel/blob";

const token = process.env.MEDIA_DOWNLOAD_TOKEN;
if (!token) {
  console.error("MEDIA_DOWNLOAD_TOKEN is not set (put it in .env.local, see .env.example).");
  process.exit(1);
}

const code = process.argv[2]?.toUpperCase();
if (code !== undefined && !/^[A-Z0-9]{4,10}$/.test(code)) {
  console.error(`"${process.argv[2]}" is not a game code (e.g. J4ZNN5).`);
  process.exit(1);
}

const prefix = code ? `games/${code}/` : "games/";
const target = join(process.cwd(), "media-downloads");

/** True when this file was already downloaded completely. */
async function alreadyThere(path, size) {
  try {
    return (await stat(path)).size === size;
  } catch {
    return false;
  }
}

let downloaded = 0;
let skipped = 0;
let cursor;
try {
  do {
    const page = await list({ prefix, cursor, limit: 1000, token });
    for (const blob of page.blobs) {
      // games/<CODE>/<file> → media-downloads/<CODE>/<file>
      const path = join(target, ...blob.pathname.split("/").slice(1));
      if (await alreadyThere(path, blob.size)) {
        skipped++;
        continue;
      }
      const result = await get(blob.pathname, { access: "private", token });
      if (!result || result.statusCode !== 200) {
        console.log(`✘ ${blob.pathname}: not found`);
        continue;
      }
      await mkdir(dirname(path), { recursive: true });
      await pipeline(Readable.fromWeb(result.stream), createWriteStream(path));
      console.log(`✔ ${blob.pathname} (${Math.round(blob.size / 1024)} kB, uploaded ${blob.uploadedAt.toISOString().slice(0, 16).replace("T", " ")})`);
      downloaded++;
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
} catch (error) {
  // Name only: the message of a Blob error can contain the store's URL.
  console.error(`Download failed: ${error instanceof Error ? error.name : "unknown error"}`);
  console.error("  Check MEDIA_DOWNLOAD_TOKEN (Vercel → Storage → your Blob store → the token).");
  process.exit(1);
}

if (downloaded + skipped === 0) {
  console.log(code ? `No files for game ${code} (deleted after 7 days, or no photos sent).` : "No files in the store.");
} else {
  console.log(`${downloaded} downloaded, ${skipped} already there → ${target}`);
}
