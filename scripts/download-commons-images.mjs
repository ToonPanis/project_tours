/**
 * Downloads images from Wikimedia Commons for a walk, together with their
 * license metadata, and REFUSES any image whose license isn't clearly reusable.
 *
 *   node scripts/download-commons-images.mjs classics-of-antwerp
 *
 * Reads   src/data/walks/<walk>/image-sources.json   (what to download)
 * Writes  public/images/<folder>/…                   (the image files, 1280 px wide)
 *         src/data/walks/<walk>/images.json           (license + attribution per image)
 *
 * If an image that was fine before is now REFUSED (its license on Commons changed),
 * its previous metadata and file are kept and the script ends with exit code 1:
 * the image stays visible until someone checks it by hand and removes or replaces it.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readImageSize } from "./lib/image-size.mjs";
import { fetchWithRetry, isInsideDirectory, readWalkFolderArg, toHttps, USER_AGENT_CONTACT } from "./lib/script-utils.mjs";

const walk = readWalkFolderArg(process.argv[2], "node scripts/download-commons-images.mjs <walk-folder>");

const DATA_DIR = new URL(`../src/data/walks/${walk}/`, import.meta.url);
const PUBLIC_DIR = new URL("../public/", import.meta.url);
const IMAGES_DIR = new URL("images/", PUBLIC_DIR);
const API = "https://commons.wikimedia.org/w/api.php";
// Wikimedia's User-Agent policy asks for a way to contact the author.
const HEADERS = { "User-Agent": `HiddenAntwerp-image-downloader/0.1 (${USER_AGENT_CONTACT})` };

/** Licenses we accept. Anything else is refused and must be checked by hand. */
const ACCEPTED_LICENSE = /^(public domain|pd\b|pd-|cc0|cc by(-sa)? \d)/i;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const stripHtml = (text = "") => text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function getImageInfo(fileTitle) {
  const params = new URLSearchParams({
    action: "query",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: "1280",
    format: "json",
  });
  // Retries rate limits (429), server errors and timeouts; other errors stop the script.
  const response = await fetchWithRetry(`${API}?${params}`, { headers: HEADERS }, { retries: 4 });
  const data = await response.json();
  const page = data?.query?.pages ? Object.values(data.query.pages)[0] : undefined;
  if (!page?.imageinfo) throw new Error(`Not found on Commons: ${fileTitle}`);
  return page.imageinfo[0];
}

const { images: sources } = JSON.parse(await readFile(new URL("image-sources.json", DATA_DIR), "utf8"));
// The metadata from the previous run: kept for an image whose license check fails now,
// so a changed license on Commons is reported instead of silently dropping an image.
const previousById = new Map();
try {
  const previous = JSON.parse(await readFile(new URL("images.json", DATA_DIR), "utf8"));
  for (const image of previous.images ?? []) previousById.set(image.id, image);
} catch {
  // First run: nothing to keep.
}
const results = [];
const refused = [];

for (const source of sources) {
  // Only write inside public/images/ (a path like "../../x" in image-sources.json is refused).
  const target = new URL(source.localPath.replace(/^\//, ""), PUBLIC_DIR);
  if (!isInsideDirectory(target, IMAGES_DIR)) {
    throw new Error(`localPath must be inside public/images/: ${source.localPath}`);
  }

  const info = await getImageInfo(source.commonsTitle);
  const meta = info.extmetadata ?? {};
  const license = stripHtml(meta.LicenseShortName?.value);

  if (!ACCEPTED_LICENSE.test(license)) {
    refused.push(`${source.id} (license "${license}")`);
    const previous = previousById.get(source.id);
    if (previous) {
      results.push(previous);
      console.warn(`✗ REFUSED (license "${license}"): ${source.commonsTitle}. Kept the previous metadata: CHECK BY HAND.`);
    } else {
      console.warn(`✗ REFUSED (license "${license}"): ${source.commonsTitle}`);
    }
    continue;
  }

  const response = await fetchWithRetry(info.thumburl ?? info.url, { headers: HEADERS });
  await mkdir(new URL(".", target), { recursive: true });
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(target, bytes);
  // Record the size of the file we actually saved: Commons' reported thumbnail size
  // doesn't always match it (e.g. when the original is smaller than 1280 px).
  const savedSize = readImageSize(bytes);
  if (!savedSize) throw new Error(`Not a JPEG or PNG file: ${source.localPath}`);

  results.push({
    id: source.id,
    localPath: source.localPath,
    imageUrl: toHttps(info.url),
    sourceUrl: toHttps(info.descriptionurl),
    source: "Wikimedia Commons",
    title: source.commonsTitle.replace(/^File:/, ""),
    photographerOrArtist: stripHtml(meta.Artist?.value) || "Unknown",
    dateOnSource: stripHtml(meta.DateTimeOriginal?.value) || null,
    width: savedSize.width,
    height: savedSize.height,
    license,
    licenseUrl: toHttps(meta.LicenseUrl?.value ?? null),
    credit: stripHtml(meta.Credit?.value) || null,
  });
  console.log(`✓ ${source.id}  (${license})`);
  await wait(1500);
}

await writeFile(
  new URL("images.json", DATA_DIR),
  `${JSON.stringify({ _comment: "GENERATED by scripts/download-commons-images.mjs. Do not edit by hand.", generatedAt: new Date().toISOString(), images: results }, null, 2)}\n`,
);
console.log(`Saved metadata for ${results.length} images${refused.length > 0 ? ` (${refused.length} refused, see below)` : ""}.`);
if (refused.length > 0) {
  // Exit code 1, so a refused license can't go unnoticed (e.g. in a script chain).
  console.error(`\n${refused.length} image(s) refused, check by hand: ${refused.join("; ")}`);
  process.exitCode = 1;
}
