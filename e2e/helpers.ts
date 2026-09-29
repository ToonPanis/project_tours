import type { BrowserContext, Page } from "@playwright/test";
import { MAP_STYLE_URL } from "../src/features/navigation/config";
import { createTranslator } from "../src/i18n/translate";
import type { Locale } from "../src/i18n/config";

/** The app's own translator, so tests click buttons by their real (translated) labels. */
export const en = createTranslator("en");
export const tr = (locale: Locale) => createTranslator(locale);

/** The map tile server (OpenFreeMap by default). */
const TILE_HOST = new URL(MAP_STYLE_URL).hostname;

/**
 * Collects what should never happen on a page: console errors, uncaught errors and
 * failed requests to our own site (a missing MapLibre worker would show up here).
 * External map tiles are left out: their availability isn't ours to test, and a
 * hiccup at the tile server must not fail CI (MapLibre logs a failed tile as a console error).
 */
export function watchForProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes(TILE_HOST)) problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.hostname === "localhost" && response.status() >= 400) problems.push(`${response.status()} ${url.pathname}`);
  });
  return problems;
}

/** Every request URL the page makes, to check that no position is ever sent anywhere. */
export function recordRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on("request", (request) => urls.push(request.url()));
  return urls;
}

/**
 * Everything the browser keeps for this site: localStorage, sessionStorage, cookies
 * and the names of IndexedDB databases. One string, to search for coordinates.
 */
export async function everythingStored(page: Page, context: BrowserContext): Promise<string> {
  const inPage = await page.evaluate(async () => {
    const dump = (storage: Storage) =>
      Array.from({ length: storage.length }, (_, index) => {
        const key = storage.key(index) ?? "";
        return `${key}=${storage.getItem(key)}`;
      });
    const databases = "databases" in indexedDB ? (await indexedDB.databases()).map((db) => `indexedDB:${db.name}`) : [];
    return [...dump(localStorage), ...dump(sessionStorage), ...databases].join("\n");
  });
  const cookies = (await context.cookies()).map((cookie) => `cookie:${cookie.name}=${cookie.value}`).join("\n");
  return `${inPage}\n${cookies}`;
}

/** "51.2172" and "4.4212": how a coordinate would look if it were stored or sent (4 decimals ≈ 10 m). */
export function coordinateTexts(latitude: number, longitude: number): string[] {
  return [latitude.toFixed(4), longitude.toFixed(4)];
}
