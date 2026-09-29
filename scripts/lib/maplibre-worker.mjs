/**
 * Copies MapLibre's web worker files from `sourceDir` to `targetDir`.
 * Used by scripts/copy-maplibre-worker.mjs (the command) and by the tests.
 * See that script for why the worker has to be served from /public.
 */
import { access, copyFile, mkdir } from "node:fs/promises";

/** The worker imports ./maplibre-gl-shared.mjs, so both files must end up in the same folder. */
export const WORKER_FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

/** Thrown when a worker file is missing from the installed library. The message tells the developer what to do. */
export class MissingWorkerFileError extends Error {
  name = "MissingWorkerFileError";
}

/**
 * Copies every file in WORKER_FILES. `sourceDir` and `targetDir` are file: URLs ending in "/".
 * Checks that all source files exist before copying anything, so a failed run never
 * leaves a half-copied (mismatched) worker behind.
 */
export async function copyMaplibreWorker(sourceDir, targetDir) {
  for (const file of WORKER_FILES) {
    try {
      await access(new URL(file, sourceDir));
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      throw new MissingWorkerFileError(
        `MapLibre worker file "${file}" was not found in ${sourceDir.href}. ` +
          "Is maplibre-gl installed? Run `npm install`. " +
          "If maplibre-gl was upgraded, its dist/ layout may have changed: update WORKER_FILES in scripts/lib/maplibre-worker.mjs.",
        { cause: error },
      );
    }
  }

  await mkdir(targetDir, { recursive: true });
  for (const file of WORKER_FILES) {
    await copyFile(new URL(file, sourceDir), new URL(file, targetDir));
  }
}
