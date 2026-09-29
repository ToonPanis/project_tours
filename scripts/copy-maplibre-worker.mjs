/**
 * Copies MapLibre's web worker to public/maplibre/, so the browser can load it.
 *
 *   node scripts/copy-maplibre-worker.mjs   (runs automatically before dev/build and after npm install)
 *
 * Why: MapLibre GL 6 renders map tiles in a web worker and looks for the
 * worker file next to its own module (via import.meta.url). Once Next.js
 * bundles MapLibre into /_next/static/chunks/…, that file isn't there: the
 * server answers with a 404 HTML page, the worker never starts and the map
 * stays empty ("Worker failed to load"). We serve the two files ourselves and
 * point MapLibre at them with setWorkerUrl() (see features/navigation/config.ts).
 *
 * The worker imports ./maplibre-gl-shared.mjs, so both files are copied into
 * the same folder. Copying from node_modules keeps them the exact same version
 * as the installed library. The output folder is git-ignored.
 *
 * If a file is missing the script fails on purpose (exit code 1): a build
 * without the worker would ship a map that stays blank.
 *
 * The copy logic lives in ./lib/maplibre-worker.mjs so tests can import it
 * without running this command.
 */
import { copyMaplibreWorker, MissingWorkerFileError, WORKER_FILES } from "./lib/maplibre-worker.mjs";

const SOURCE_DIR = new URL("../node_modules/maplibre-gl/dist/", import.meta.url);
const TARGET_DIR = new URL("../public/maplibre/", import.meta.url);

try {
  await copyMaplibreWorker(SOURCE_DIR, TARGET_DIR);
  console.log(`Copied MapLibre worker (${WORKER_FILES.join(", ")}) to public/maplibre/`);
} catch (error) {
  // A missing file gets the friendly explanation; anything else (e.g. EPERM) is printed in full.
  console.error(error instanceof MissingWorkerFileError ? `\n[copy-maplibre-worker] ${error.message}\n` : error);
  process.exit(1);
}
