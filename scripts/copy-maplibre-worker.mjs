/**
 * Copies MapLibre's web worker to public/maplibre/<version>/, so the browser can load it.
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
 * The MapLibre version is part of the folder name, so the worker can be cached
 * for a year (next.config.ts): an upgrade changes the URL. Folders of older
 * versions are removed, so only the current worker is deployed. (A tab left open
 * across a MapLibre upgrade then shows "map unavailable" until it is reloaded,
 * instead of silently mixing an old worker with new code.)
 *
 * If a file is missing the script fails on purpose (exit code 1): a build
 * without the worker would ship a map that stays blank.
 *
 * The copy logic lives in ./lib/maplibre-worker.mjs so tests can import it
 * without running this command.
 */
import { readFile } from "node:fs/promises";
import {
  copyMaplibreWorker,
  MissingWorkerFileError,
  removeOtherWorkerVersions,
  WORKER_FILES,
} from "./lib/maplibre-worker.mjs";

const PACKAGE_DIR = new URL("../node_modules/maplibre-gl/", import.meta.url);
const SOURCE_DIR = new URL("dist/", PACKAGE_DIR);
const PUBLIC_DIR = new URL("../public/maplibre/", import.meta.url);

try {
  // The same version string the browser gets from maplibre-gl's getVersion().
  const { version } = JSON.parse(await readFile(new URL("package.json", PACKAGE_DIR), "utf8"));
  await copyMaplibreWorker(SOURCE_DIR, new URL(`${version}/`, PUBLIC_DIR));
  await removeOtherWorkerVersions(PUBLIC_DIR, version);
  console.log(`Copied MapLibre worker (${WORKER_FILES.join(", ")}) to public/maplibre/${version}/`);
} catch (error) {
  // A missing file gets the friendly explanation; anything else (e.g. EPERM) is printed in full.
  console.error(error instanceof MissingWorkerFileError ? `\n[copy-maplibre-worker] ${error.message}\n` : error);
  process.exit(1);
}
