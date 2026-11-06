import { expect, test, type Page } from "@playwright/test";
import { getClassicsWalk } from "../src/data/walks/classics-of-antwerp";
import { createWalkSession } from "../src/features/walk-session/logic/create-session";
import { applySessionAction } from "../src/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "../src/features/walk-session/playtest/fast-forward";
import { STORAGE_VERSION, storageKey } from "../src/features/walk-session/storage/session-storage";
import { getOrderedLocations } from "../src/lib/walk-locations";
import type { GeoCoordinates } from "../src/types/common";
import { en, watchForProblems } from "./helpers";

/**
 * Spooky's quest on the Meir in a real browser with (emulated) GPS: the search
 * zone instead of a pin, automatic "found" near the real place, the popup once,
 * then the story. The walk starts saved on the way to the quest stop.
 */

const walk = getClassicsWalk("en");
const stops = getOrderedLocations(walk);
// The "find the place" quest (the Meir); the walk's other Spooky tasks are "find a detail".
const questIndex = stops.findIndex((location) => location.quest?.type === "location");
const questStop = stops[questIndex];
if (questStop.quest?.type !== "location") throw new Error("Classics of Antwerp should have a find-the-place quest");
const quest = questStop.quest;
const place = questStop.coordinates!;
const previous = stops[questIndex - 1];

/** A save on the way to the quest stop, as the app itself would write it. */
const saved = {
  version: STORAGE_VERSION,
  session: getJumpToStopActions(walk, questIndex + 1, "2026-10-10T11:00:00.000Z").reduce(
    (state, action) => applySessionAction(walk, state, action),
    createWalkSession({
      walk,
      sessionId: "e2e-quest",
      startedAt: "2026-10-10T10:00:00.000Z",
    }),
  ),
};

async function walkTo(page: Page, position: GeoCoordinates) {
  await page.context().setGeolocation({ ...position, accuracy: 6 });
  await page.waitForTimeout(700);
}

test.describe("Spooky's quest", () => {
  test.use({ permissions: ["geolocation"], geolocation: { ...previous.coordinates!, accuracy: 6 } });

  test.beforeEach(async ({ context }) => {
    // Only the first load: a reload must keep what the app saved itself.
    await context.addInitScript(
      ({ key, value }) => {
        if (!window.localStorage.getItem(key)) window.localStorage.setItem(key, value);
      },
      { key: storageKey(walk.slug), value: JSON.stringify(saved) },
    );
  });

  test("search zone instead of a pin, found by GPS, popup once, then the story", async ({ page }) => {
    const problems = watchForProblems(page);
    await page.goto(`/walks/${walk.slug}/play`);
    await page.getByRole("button", { name: new RegExp(en("guide.continueAt", { stop: questIndex + 1, total: stops.length }).replace(/[()]/g, "\\$&")) }).click();

    // Spooky's popup, then the drawing and the task.
    await expect(page.getByRole("dialog", { name: en("quest.taskForYou") })).toBeVisible();
    await page.getByRole("button", { name: en("quest.viewTask") }).click();
    await expect(page.getByRole("heading", { level: 1, name: quest.title })).toBeVisible();
    await expect(page.getByAltText(quest.clueImage.alt)).toBeVisible();
    await page.getByRole("button", { name: en("quest.startSearching") }).click();

    // Live map: the zone and its hint, no destination pin, nothing that names the place.
    await expect(page.locator(".maplibregl-canvas")).toBeVisible();
    await expect(page.getByText(quest.zoneHint)).toBeVisible();
    await expect(page.locator(".walking-map-destination")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(quest.revealedName);
    await expect(page.locator("body")).not.toContainText(quest.revealedAddress);

    // In the middle of the zone: searching, not found yet.
    await walkTo(page, quest.searchZone.center);
    await walkTo(page, { latitude: quest.searchZone.center.latitude + 0.00001, longitude: quest.searchZone.center.longitude });
    // (The visible panel comes after the always-present screen-reader status with the same text.)
    await expect(page.getByText(en("quest.inZoneTitle")).last()).toBeVisible();
    await expect(page.getByRole("dialog", { name: en("quest.foundTitle") })).toHaveCount(0);

    // Walk on to the place in steps, as a walker does (a sudden 40 m leap would be held back
    // as a GPS jump, see logic/tracking.ts), then two good readings in front of it → found.
    const center = quest.searchZone.center;
    await walkTo(page, { latitude: (center.latitude + place.latitude) / 2, longitude: (center.longitude + place.longitude) / 2 });
    await walkTo(page, place);
    await walkTo(page, { latitude: place.latitude + 0.00001, longitude: place.longitude });
    await expect(page.getByRole("dialog", { name: en("quest.foundTitle") })).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: en("quest.discoverStory") }).click();
    await expect(page.getByRole("heading", { level: 1, name: quest.revealedName })).toBeVisible();

    // GPS keeps reporting the same spot (and jitters around it): the popup doesn't come back.
    await walkTo(page, { latitude: place.latitude + 0.00002, longitude: place.longitude });
    await expect(page.getByRole("dialog", { name: en("quest.foundTitle") })).toHaveCount(0);

    // After a reload the place stays found: straight to the story.
    await page.reload();
    await page.getByRole("button", { name: new RegExp(en("guide.continueAt", { stop: questIndex + 1, total: stops.length }).replace(/[()]/g, "\\$&")) }).click();
    await expect(page.getByRole("heading", { level: 1, name: quest.revealedName })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    expect(problems).toEqual([]);
  });
});
