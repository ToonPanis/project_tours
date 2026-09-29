import { expect, test, type Locator, type Page } from "@playwright/test";
import { getHiddenPubsWalk } from "../src/data/walks/hidden-pubs";
import { getWalkCopy } from "../src/features/walk-session/logic/walk-copy";
import { getCorrectAnswer } from "../src/features/walk-session/playtest/get-correct-answer";
import { getOrderedLocations } from "../src/lib/walk-locations";
import type { Challenge } from "../src/types/challenge";
import { en, watchForProblems } from "./helpers";

/**
 * A whole Hidden Pubs game in a real browser, without GPS ("I've arrived" at every café),
 * as a team of one: team setup, every café (drink vote skipped: never required),
 * every challenge answered with the answer from the data, bonus questions skipped,
 * the final puzzle, and the completion screen. Nothing may block the way.
 */

const walk = getHiddenPubsWalk("en");
const copy = getWalkCopy(walk, en);
const stops = getOrderedLocations(walk);

const button = (page: Page, name: string | RegExp) => page.getByRole("button", { name, exact: typeof name === "string" });

async function clickIfVisible(locator: Locator): Promise<boolean> {
  if (await locator.isVisible()) {
    await locator.click();
    return true;
  }
  return false;
}

async function answer(page: Page, challenge: Challenge) {
  const correct = getCorrectAnswer(challenge);
  switch (challenge.type) {
    case "multiple-choice":
      await page.getByRole("button", { name: new RegExp(challenge.options[Number(correct)].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).click();
      return;
    case "observation":
      await button(page, challenge.confirmLabel).click();
      return;
    default:
      await page.getByRole("textbox", { name: en("common.yourAnswer") }).fill(String(correct));
      await button(page, en("common.submit")).click();
  }
}

test("a complete game, from team setup to the closing story", async ({ page }) => {
  test.setTimeout(240_000);
  // Each step is quick: a missing button should fail in seconds, not after four minutes.
  page.setDefaultTimeout(10_000);
  const problems = watchForProblems(page);

  await page.goto(`/walks/${walk.slug}/play`);
  await button(page, en("game.start.newAdventure")).click();
  await button(page, "1").click();
  await page.getByRole("textbox").first().fill("Tester");
  await button(page, en("game.team.startAdventure")).click();
  await button(page, en("game.intro.begin")).click();

  for (const [index, stop] of stops.entries()) {
    // Navigation without GPS: the main button is "I've arrived".
    await expect(page.getByRole("heading", { level: 1, name: new RegExp(stop.name) })).toBeVisible();
    await clickIfVisible(button(page, en("gps.continueWithoutGps")));
    await button(page, en("gps.arrived")).click();

    // Drink vote: skipped (progress never depends on drinking).
    if (stop.drinkRound) await button(page, en("game.arrived.skipRound")).click();
    await button(page, en("game.story.toChallenge")).click();
    await answer(page, stop.challenge!);

    await expect(page.getByRole("heading", { name: copy.correctAnswer })).toBeVisible();

    // After the answer: history, an optional bonus question (skipped), the clue, in
    // whichever order this café has them, until the way to the next café (or the final page).
    const isLast = index === stops.length - 1;
    const onward = button(page, isLast ? en("game.solved.openFinalPage") : en("game.solved.startWalking"));
    for (let screen = 0; screen < 8 && !(await onward.isVisible()); screen++) {
      if (await clickIfVisible(button(page, en("game.solved.skipBonus")))) continue;
      if (await clickIfVisible(button(page, en("game.solved.discoverWhy")))) continue;
      if (await clickIfVisible(button(page, en("common.continue")))) continue;
      await page.waitForTimeout(200); // a screen is still animating in
    }
    if (!isLast) await onward.click();
  }

  // The final page: every question answered from the data.
  await button(page, en("game.solved.openFinalPage")).click();
  await button(page, en("game.finale.openFinalPage")).click();
  for (const question of walk.finale!.questions) {
    await page.getByRole("textbox", { name: en("common.yourAnswer") }).fill(String(getCorrectAnswer(question)));
    await button(page, en("common.submit")).click();
  }
  await button(page, en("game.completion.closeLedger")).click();

  await expect(page.getByRole("heading", { name: copy.completionTitle })).toBeVisible();
  await expect(page.getByText(`${stops.length} / ${stops.length}`).first()).toBeVisible();
  // Never count or celebrate drinks.
  await expect(page.getByText(/drinks? (ordered|consumed)/i)).toHaveCount(0);
  expect(problems).toEqual([]);
});
