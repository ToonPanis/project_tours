import { expect, test, type Page } from "@playwright/test";
import { getClassicsWalk } from "../src/data/walks/classics-of-antwerp";
import { getRouteLegTo } from "../src/features/navigation/logic/route-legs";
import { pointAlongRoute } from "../src/features/navigation/logic/route-progress";
import { getOrderedLocations } from "../src/lib/walk-locations";
import type { GeoCoordinates } from "../src/types/common";
import { coordinateTexts, en, everythingStored, recordRequests, watchForProblems } from "./helpers";

/**
 * A walk with (emulated) GPS in a real browser: Classics of Antwerp from the
 * station to the second stop. Positions are fed along the pre-generated route,
 * as a phone would report them while walking.
 */

const walk = getClassicsWalk("en");
const [first, second] = getOrderedLocations(walk);
const legToSecond = getRouteLegTo(walk, second.id)!.route!;

/** Moves the emulated phone and gives the app a moment to take in the reading. */
async function walkTo(page: Page, position: GeoCoordinates) {
  await page.context().setGeolocation({ ...position, accuracy: 6 });
  await page.waitForTimeout(700);
}

test.describe("walking with GPS", () => {
  test.use({ permissions: ["geolocation"], geolocation: { ...first.coordinates!, accuracy: 6 } });

  test("arrives by GPS, walks a leg along the route, and never stores or sends a position", async ({ page, context }) => {
    const problems = watchForProblems(page);
    const requests = recordRequests(page);

    await page.goto(`/walks/${walk.slug}/play`);
    await page.getByRole("button", { name: en("guide.startWalk") }).click();

    // Location was already allowed: no explainer, straight to the live map.
    await expect(page.getByRole("heading", { level: 1, name: new RegExp(first.name) })).toBeVisible();
    await expect(page.locator(".maplibregl-canvas")).toBeVisible();

    // Standing at the station: two readings with a new timestamp → arrived.
    await walkTo(page, { latitude: first.coordinates!.latitude + 0.00002, longitude: first.coordinates!.longitude });
    await walkTo(page, first.coordinates!);
    await expect(page.getByRole("heading", { level: 1, name: first.name })).toBeVisible({ timeout: 15_000 });

    // On to the second stop, walking along the route line.
    await page.getByRole("button", { name: en("guide.startWalking") }).click();
    await expect(page.getByRole("heading", { level: 1, name: new RegExp(second.name) })).toBeVisible();
    const legLength = legToSecond.distanceMeters;
    for (let meters = 0; meters <= legLength; meters += Math.max(25, legLength / 12)) {
      await walkTo(page, pointAlongRoute(legToSecond.geometry, meters));
    }
    await walkTo(page, second.coordinates!);
    await walkTo(page, { latitude: second.coordinates!.latitude + 0.00001, longitude: second.coordinates!.longitude });
    await expect(page.getByRole("heading", { level: 1, name: second.name })).toBeVisible({ timeout: 15_000 });

    // The map worker came from our versioned folder; nothing of ours failed.
    expect(requests.some((url) => /\/maplibre\/\d+\.\d+\.\d+\/maplibre-gl-worker\.mjs$/.test(url))).toBe(true);
    expect(problems).toEqual([]);

    // PRIVACY: no position in any storage, cookie or request (map tiles use tile numbers, not coordinates).
    const stored = await everythingStored(page, context);
    const positionsUsed = [first.coordinates!, second.coordinates!, ...legToSecond.geometry];
    for (const position of positionsUsed) {
      for (const text of coordinateTexts(position.latitude, position.longitude)) {
        expect(stored).not.toContain(text);
        expect(requests.filter((url) => url.includes(text))).toEqual([]);
      }
    }
  });

  test("a reload in the middle of the walk continues at the same stop", async ({ page }) => {
    await page.goto(`/walks/${walk.slug}/play`);
    await page.getByRole("button", { name: en("guide.startWalk") }).click();
    await walkTo(page, { latitude: first.coordinates!.latitude + 0.00002, longitude: first.coordinates!.longitude });
    await walkTo(page, first.coordinates!);
    await expect(page.getByRole("heading", { level: 1, name: first.name })).toBeVisible({ timeout: 15_000 });

    await page.reload();
    await page.getByRole("button", { name: new RegExp(en("guide.continueAt", { stop: 1, total: getOrderedLocations(walk).length }).replace(/[()]/g, "\\$&")) }).click();
    await expect(page.getByRole("heading", { level: 1, name: first.name })).toBeVisible();
  });
});

test.describe("location refused", () => {
  // No permission granted: the browser refuses, as when a visitor taps "Don't allow".
  test("the map stays, the refusal is explained, and 'I'm here' still moves on", async ({ page }) => {
    await page.goto(`/walks/${walk.slug}/play`);
    await page.getByRole("button", { name: en("guide.startWalk") }).click();
    await page.getByRole("button", { name: en("gps.enableLocation") }).click();

    await expect(page.getByText(en("gps.permissionTitle"))).toBeVisible();
    await expect(page.locator(".maplibregl-canvas")).toBeVisible();
    await page.getByRole("button", { name: en("gps.imHere") }).click();
    await expect(page.getByRole("heading", { level: 1, name: first.name })).toBeVisible();
  });
});
