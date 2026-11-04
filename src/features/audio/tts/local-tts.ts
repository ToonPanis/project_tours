import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { LocalVoice } from "../voice-studio/voices";
import { CACHE_DIR } from "./audio-cache";
import { TtsError } from "./google-tts";

/**
 * Free local voices (Piper, Kokoro): SERVER ONLY, DEVELOPMENT ONLY.
 *
 * The voices are Python programs, installed in the git-ignored `.tts/` folder by
 * `scripts/setup-local-tts.ps1`. Node starts `scripts/local-tts.py` with that folder's
 * Python and gives it the job as JSON. Nothing goes over the internet.
 * (A Vercel server can't run them: the audio guide will use files made beforehand.)
 */

export const LOCAL_TTS_NAME = "Local voices (Piper, Kokoro)";

const ROOT = process.cwd();
// The virtual environment's Python: Scripts\python.exe on Windows, bin/python elsewhere.
const PYTHON =
  process.platform === "win32" ? path.join(ROOT, ".tts", "venv", "Scripts", "python.exe") : path.join(ROOT, ".tts", "venv", "bin", "python");
const SCRIPT = path.join(ROOT, "scripts", "local-tts.py");

export function isLocalTtsInstalled(): boolean {
  return existsSync(PYTHON);
}

/** Is this voice's model downloaded? (Piper: one file per voice; Kokoro: one file for all.) */
export function isLocalVoiceInstalled(voice: LocalVoice): boolean {
  const model =
    voice.engine === "piper" ? path.join(ROOT, ".tts", "piper", `${voice.voice}.onnx`) : path.join(ROOT, ".tts", "kokoro", "voices-v1.0.bin");
  return existsSync(model);
}

export interface LocalSpeechRequest {
  voice: LocalVoice;
  /** Spoken one by one, with a short pause in between. */
  paragraphs: string[];
  speakingRate: number;
  /** The cache key: the WAV is written to .cache/tts/<key>.wav. */
  key: string;
}

/** Generates a WAV file with a local voice; resolves when it's on disk. */
export async function synthesizeLocally({ voice, paragraphs, speakingRate, key }: LocalSpeechRequest): Promise<void> {
  if (!isLocalTtsInstalled()) {
    throw new TtsError("The local voices are not installed: run scripts/setup-local-tts.ps1 (see .env.example).", 503);
  }
  if (!isLocalVoiceInstalled(voice)) {
    throw new TtsError(`The voice model ${voice.voice} is not downloaded: run scripts/setup-local-tts.ps1.`, 503);
  }
  await mkdir(CACHE_DIR, { recursive: true });
  const job = {
    engine: voice.engine,
    voice: voice.voice,
    lang: voice.lang,
    speed: speakingRate,
    paragraphs,
    out: path.join(CACHE_DIR, `${key}.wav`),
  };

  await new Promise<void>((resolve, reject) => {
    // -I: Python ignores environment variables and the current folder (only the venv's packages).
    const child = execFile(PYTHON, ["-I", SCRIPT], { timeout: 180_000, windowsHide: true }, (error, _stdout, stderr) => {
      if (!error) return resolve();
      const lastLine = stderr.trim().split("\n").at(-1) ?? error.message;
      reject(new TtsError(`Local voice failed: ${lastLine}`, 500));
    });
    child.stdin?.end(JSON.stringify(job));
  });
}
