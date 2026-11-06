import { expect, test, type Page } from "@playwright/test";
import { getClassicsWalk } from "../src/data/walks/classics-of-antwerp";
import { createWalkSession } from "../src/features/walk-session/logic/create-session";
import { applySessionAction } from "../src/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "../src/features/walk-session/playtest/fast-forward";
import { STORAGE_VERSION, storageKey } from "../src/features/walk-session/storage/session-storage";
import { getOrderedLocations } from "../src/lib/walk-locations";
import { en, watchForProblems } from "./helpers";

/**
 * The historical image galleries (Handelsbeurs, Vleeshuis, Scheldt) and the Spanish
 * Fury at the City Hall (slides) in a real browser: they load, swipe, and fit 390 px.
 */

const walk = getClassicsWalk("en");
const stops = getOrderedLocations(walk);

/** Opens the walk saved as arrived at `stopId`, as the app itself would have saved it. */
async function openStop(page: Page, stopId: string) {
  const stopNumber = stops.findIndex((location) => location.id === stopId) + 1;
  // Arrived; a stop with Spooky's "find a detail" task has that task done too (it opens on the story).
  const taskDone = stops[stopNumber - 1].quest?.type === "discovery" ? [{ type: "SHOW_STORY" as const }] : [];
  const session = [...getJumpToStopActions(walk, stopNumber, "2026-10-10T11:00:00.000Z"), { type: "ARRIVE" as const }, ...taskDone].reduce(
    (state, action) => applySessionAction(walk, state, action),
    createWalkSession({
      walk,
      sessionId: "e2e-images",
      startedAt: "2026-10-10T10:00:00.000Z",
    }),
  );
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: storageKey(walk.slug), value: JSON.stringify({ version: STORAGE_VERSION, session }) },
  );
  await page.goto(`/walks/${walk.slug}/play`);
  await page.getByRole("button", { name: new RegExp(en("guide.continueAt", { stop: stopNumber, total: stops.length }).replace(/[()]/g, "\\$&")) }).click();
}

/** Every image in `scope` has really loaded (a broken URL has no natural width). */
async function expectImagesLoaded(page: Page, alts: string[]) {
  for (const alt of alts) {
    const image = page.getByAltText(alt, { exact: true }).first();
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
}

/** Nothing sticks out sideways at 390 px. */
async function expectNoSideScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

for (const stopId of ["classics-handelsbeurs", "classics-vleeshuis", "classics-scheldt"]) {
  test(`${stopId}: the gallery swipes through its images, which load and fit the screen`, async ({ page }) => {
    const problems = watchForProblems(page);
    await openStop(page, stopId);
    const gallery = stops.find((location) => location.id === stopId)!.guide!.galleries![0];
    const last = gallery.images.length - 1;

    await expect(page.getByRole("heading", { level: 2, name: gallery.title })).toBeVisible();
    const track = page.getByLabel(en("guide.gallery.trackLabel", { title: gallery.title }));
    await track.scrollIntoViewIfNeeded();
    await expectImagesLoaded(page, gallery.images.map((image) => image.alt));

    // A swipe = the track scrolled sideways: here straight to the last image. The counter follows.
    await track.evaluate((element, index) => element.scrollTo({ left: index * element.clientWidth }), last);
    await expect(page.getByRole("status").filter({ hasText: gallery.images[last].caption })).toHaveCount(1);
    // And back with the button.
    await page.getByRole("button", { name: en("guide.gallery.previous") }).click();
    await expect(page.getByRole("status").filter({ hasText: gallery.images[last - 1].caption })).toHaveCount(1);

    await expectNoSideScroll(page);
    expect(problems).toEqual([]);
  });
}

test("City Hall: the three Spanish Fury slides show their images", async ({ page }) => {
  const problems = watchForProblems(page);
  await openStop(page, "classics-stadhuis");
  const cards = stops.find((location) => location.id === "classics-stadhuis")!.guide!.cards!;

  for (const card of cards) {
    await page.getByRole("button", { name: card.title, exact: true }).click();
    await expect(page.getByRole("heading", { level: 2, name: card.title })).toBeVisible();
    await expectImagesLoaded(page, [card.image!, ...(card.images ?? [])].map((image) => image.alt));
    await expectNoSideScroll(page);
  }
  expect(problems).toEqual([]);
});
