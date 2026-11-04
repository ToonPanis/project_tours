import { expect, test, type Page } from "@playwright/test";
import { getClassicsWalk } from "../src/data/walks/classics-of-antwerp";
import { createWalkSession } from "../src/features/walk-session/logic/create-session";
import { applySessionAction } from "../src/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "../src/features/walk-session/playtest/fast-forward";
import { STORAGE_VERSION, storageKey } from "../src/features/walk-session/storage/session-storage";
import type { Locale } from "../src/i18n/config";
import { getOrderedLocations } from "../src/lib/walk-locations";
import { completeSpookyTask, en, tr, watchForProblems } from "./helpers";

/**
 * The audio guide in a real browser: the recordings exist and play, the controls
 * work, each slide has its own story, the language is followed, and Spooky's task
 * comes first (no audio before the visitor found the answer).
 */

const walk = getClassicsWalk("en");
const stops = getOrderedLocations(walk);

/** Opens the walk saved as arrived at `stopId` (with Spooky's task done unless `taskDone` is false). */
async function openStop(page: Page, stopId: string, { locale = "en" as Locale, taskDone = true } = {}) {
  const stopNumber = stops.findIndex((location) => location.id === stopId) + 1;
  const showStory = taskDone && stops[stopNumber - 1].quest?.type === "discovery" ? [{ type: "SHOW_STORY" as const }] : [];
  const session = [...getJumpToStopActions(walk, stopNumber, "2026-10-10T11:00:00.000Z"), { type: "ARRIVE" as const }, ...showStory].reduce(
    (state, action) => applySessionAction(walk, state, action),
    createWalkSession({
      walk,
      sessionId: "e2e-audio",
      startedAt: "2026-10-10T10:00:00.000Z",
    }),
  );
  await page.context().addCookies([{ name: "ha-locale", value: locale, url: "http://localhost:3300" }]);
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: storageKey(walk.slug), value: JSON.stringify({ version: STORAGE_VERSION, session }) },
  );
  await page.goto(`/walks/${walk.slug}/play`);
  const continueText = tr(locale)("guide.continueAt", { stop: stopNumber, total: stops.length });
  await page.getByRole("button", { name: new RegExp(continueText.replace(/[()]/g, "\\$&")) }).click();
}

const audioRequests = (page: Page) => {
  const urls: string[] = [];
  page.on("request", (request) => request.url().includes("/audio/") && urls.push(request.url()));
  return urls;
};

test("a stop's story: nothing downloads before Play; play, pause, speed", async ({ page }) => {
  const problems = watchForProblems(page);
  const requests = audioRequests(page);
  await openStop(page, "classics-grote-markt");

  const player = page.getByRole("region", { name: en("audio.listen") }).first();
  await expect(player).toBeVisible();
  await page.waitForTimeout(500);
  expect(requests).toEqual([]);

  await player.getByRole("button", { name: en("audio.play") }).click();
  const audio = player.locator("audio");
  // It really plays: the position moves.
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => element.currentTime), { timeout: 15_000 }).toBeGreaterThan(0.5);
  expect(requests.length).toBeGreaterThan(0);

  await player.getByRole("button", { name: "1.5×" }).click();
  expect(await audio.evaluate((element: HTMLAudioElement) => element.playbackRate)).toBe(1.5);
  await player.getByRole("button", { name: en("audio.pause") }).click();
  expect(await audio.evaluate((element: HTMLAudioElement) => element.paused)).toBe(true);

  // Fits a 390 px phone.
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(problems).toEqual([]);
});

test("the cathedral: the stop and each slide have their own recording", async ({ page }) => {
  await openStop(page, "classics-cathedral");
  const cards = stops.find((location) => location.id === "classics-cathedral")!.guide!.cards!;
  const sources = () => page.locator("audio").evaluateAll((elements) => elements.map((element) => element.getAttribute("src")));

  // The stop and the first slide.
  await expect.poll(sources).toHaveLength(2);
  const [stopAudio, firstSlide] = await sources();
  expect(stopAudio).toContain("/classics-cathedral-");
  expect(firstSlide).toContain(`.card.${cards[0].id}-`);

  await page.getByRole("button", { name: cards[1].title, exact: true }).click();
  await expect.poll(async () => (await sources())[1]).toContain(`.card.${cards[1].id}-`);
});

test("in Dutch: the Flemish recording, Dutch controls", async ({ page }) => {
  await openStop(page, "classics-grote-markt", { locale: "nl" });
  const nl = tr("nl");
  const player = page.getByRole("region", { name: nl("audio.listen") }).first();
  await expect(player).toBeVisible();
  expect(await player.locator("audio").getAttribute("src")).toContain("/audio/classics-of-antwerp/nl/");
  await expect(player.getByText(/RDH/)).toBeVisible();
  await expect(player.getByRole("button", { name: "0,75×" })).toBeVisible();
});

test("Spooky's task at the station comes first: no audio until it's found", async ({ page }) => {
  await openStop(page, "classics-central-station", { taskDone: false });
  await expect(page.getByRole("dialog", { name: en("quest.taskForYou") })).toBeVisible();
  await expect(page.locator("audio")).toHaveCount(0);
  await completeSpookyTask(page);
  await expect(page.getByRole("region", { name: en("audio.listen") })).toBeVisible();
});
