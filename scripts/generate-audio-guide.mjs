/**
 * Makes the audio guide's recordings for a walk, with the free local voices
 * (no API, no account). Only what is missing or changed is made: re-running it
 * after a text correction records just that stop or slide.
 *
 *   1. npm run dev                      (the job list comes from the dev server)
 *   2. node scripts/generate-audio-guide.mjs classics-of-antwerp [--base-url http://localhost:3000] [--locale nl,de]
 *
 * Needs the local voices: scripts/setup-local-tts.ps1 (once).
 *
 * Reads   GET /api/admin/audio-guide?walk=<walk>      (what to say, which voice, which file)
 * Writes  public/audio/<walk>/<lang>/<track>-<fingerprint>.mp3
 *         src/data/walks/<walk>/audio.json             (file + fingerprint + duration per track)
 * Deletes recordings in public/audio/<walk>/ that no track uses any more.
 */
import { spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readWalkFolderArg } from "./lib/script-utils.mjs";

const walk = readWalkFolderArg(
  process.argv[2],
  "node scripts/generate-audio-guide.mjs <walk-folder> [--base-url http://localhost:3000] [--locale nl,de]",
);
const option = (name) => {
  const index = process.argv.indexOf(name);
  return index > 0 ? process.argv[index + 1] : undefined;
};
const baseUrl = option("--base-url") ?? "http://localhost:3000";
// --locale nl,de: only these languages (another run can do the others at the same time).
const onlyLocales = option("--locale")?.split(",");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const AUDIO_JSON = path.join(ROOT, "src", "data", "walks", walk, "audio.json");
const PYTHON = path.join(ROOT, ".tts", "venv", process.platform === "win32" ? "Scripts\\python.exe" : "bin/python");

if (!existsSync(PYTHON)) throw new Error("The local voices are not installed: run scripts/setup-local-tts.ps1 first.");

const response = await fetch(`${baseUrl}/api/admin/audio-guide?walk=${walk}`).catch(() => null);
if (!response?.ok) throw new Error(`No job list from ${baseUrl}: is "npm run dev" running? (${response?.status ?? "no connection"})`);
const { jobs } = await response.json();

/** The fingerprint is in the file name: a file on disk is the recording of today's text. */
const isRecorded = (job) => existsSync(path.join(PUBLIC, job.file));

const todo = jobs.filter((job) => !isRecorded(job) && (!onlyLocales || onlyLocales.includes(job.locale)));
console.log(`${jobs.length} recordings, ${jobs.filter(isRecorded).length} up to date, ${todo.length} to make.`);

/** Runs one Python process for a list of jobs (one language: its voice loads once). */
function record(batch) {
  return new Promise((resolve, reject) => {
    const durations = new Map();
    const child = spawn(PYTHON, ["-I", path.join(ROOT, "scripts", "local-tts.py")], { windowsHide: true });
    let buffer = "";
    child.stdout.on("data", (chunk) => {
      buffer += chunk;
      let newline;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        const result = JSON.parse(line);
        durations.set(result.out, result.seconds);
        console.log(`  ✓ ${path.relative(PUBLIC, result.out)}  ${result.seconds} s  (${durations.size}/${batch.length})`);
      }
    });
    let errors = "";
    child.stderr.on("data", (chunk) => (errors += chunk));
    child.on("close", (code) => (code === 0 ? resolve(durations) : reject(new Error(errors.trim().split("\n").at(-1)))));
    const pythonJobs = batch.map((job) => ({
      ...job.voice,
      speed: job.speed,
      paragraphs: job.paragraphs,
      out: path.join(PUBLIC, job.file),
    }));
    child.stdin.end(JSON.stringify({ jobs: pythonJobs }));
  });
}

const durationByFile = new Map();

/**
 * audio.json: every track that has its file. Read again before writing, so two runs
 * at the same time (e.g. --locale nl,de and --locale en,fr) keep each other's work.
 * The duration comes from this run, else from audio.json, else from the file size
 * (the MP3s are 48 kbit/s constant bitrate).
 */
async function writeAudioJson() {
  let current = { locales: {} };
  try {
    current = JSON.parse(await readFile(AUDIO_JSON, "utf8"));
  } catch {
    // First run.
  }
  const locales = {};
  for (const job of jobs) {
    const filePath = path.join(PUBLIC, job.file);
    if (!existsSync(filePath)) continue;
    const known = current.locales?.[job.locale]?.tracks?.[job.trackId];
    const durationSeconds =
      durationByFile.get(filePath) ??
      (known?.hash === job.hash ? known.durationSeconds : Math.round(((statSync(filePath).size * 8) / 48_000) * 10) / 10);
    locales[job.locale] ??= { tracks: {} };
    locales[job.locale].tracks[job.trackId] = { file: job.file, hash: job.hash, durationSeconds };
  }
  await writeFile(AUDIO_JSON, `${JSON.stringify({ locales }, null, 2)}\n`);
}

for (const locale of [...new Set(todo.map((job) => job.locale))]) {
  const batch = todo.filter((job) => job.locale === locale);
  console.log(`\n${locale}: ${batch.length} recordings with ${batch[0].voice.engine} "${batch[0].voice.voice}"`);
  const started = Date.now();
  for (const [out, seconds] of await record(batch)) durationByFile.set(out, seconds);
  console.log(`${locale}: done in ${Math.round((Date.now() - started) / 1000)} s`);
  // Saved after every language: an interrupted run keeps what it made.
  await writeAudioJson();
}
await writeAudioJson();

// Old recordings (texts that changed since) are no longer needed.
const used = new Set(jobs.map((job) => path.join(PUBLIC, job.file)));
const walkFolder = path.join(PUBLIC, "audio", walk);
let removed = 0;
for (const locale of existsSync(walkFolder) ? await readdir(walkFolder) : []) {
  for (const name of await readdir(path.join(walkFolder, locale))) {
    const file = path.join(walkFolder, locale, name);
    if (!used.has(file)) {
      await rm(file);
      removed++;
    }
  }
}
console.log(`\nWrote ${path.relative(ROOT, AUDIO_JSON)}; removed ${removed} old recording(s).`);
