import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * A content-addressed cache for generated speech (SERVER ONLY: uses the file system).
 *
 * The file name is a hash of EVERYTHING that changes the sound: provider, model,
 * voice, settings, language and the exact text. So:
 * - the same text with the same voice is generated once, then always read from disk;
 * - a corrected text (or another voice/setting) gets a new hash, so new audio,
 *   automatically: no manual version numbers to forget.
 *
 * Stored in `.cache/tts/` in the project (git-ignored). Fine for local tools such
 * as the Voice Studio; the real audio guide will publish its files to storage
 * instead (see the plan in the Voice Studio report).
 */

export const CACHE_DIR = path.join(process.cwd(), ".cache", "tts");

/** "mp3" from Google, "wav" from the local voices. */
export type AudioFormat = "mp3" | "wav";

export function cachedSpeechPath(key: string, format: AudioFormat): string {
  return path.join(CACHE_DIR, `${key}.${format}`);
}

/** JSON with the keys of every object sorted, so { a, b } and { b, a } give the same text. */
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Everything that decides how the audio sounds → a hash (the cache file name). */
export function speechCacheKey(parts: Record<string, unknown>): string {
  return createHash("sha256").update(stableJson(parts)).digest("hex");
}

export async function readCachedSpeech(key: string, format: AudioFormat): Promise<Buffer | null> {
  try {
    return await readFile(cachedSpeechPath(key, format));
  } catch {
    return null;
  }
}

export async function writeCachedSpeech(key: string, format: AudioFormat, audio: Buffer): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  // Write to a temporary name first: a crash halfway never leaves a broken file behind.
  const target = cachedSpeechPath(key, format);
  await writeFile(`${target}.tmp`, audio);
  await rename(`${target}.tmp`, target);
}
