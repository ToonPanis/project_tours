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
 */
import { copyFile, mkdir } from "node:fs/promises";

const SOURCE_DIR = new URL("../node_modules/maplibre-gl/dist/", import.meta.url);
const TARGET_DIR = new URL("../public/maplibre/", import.meta.url);
const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

await mkdir(TARGET_DIR, { recursive: true });
for (const file of FILES) {
  await copyFile(new URL(file, SOURCE_DIR), new URL(file, TARGET_DIR));
}
console.log(`Copied MapLibre worker (${FILES.join(", ")}) to public/maplibre/`);
