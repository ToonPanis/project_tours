import { expect, test, type Browser, type Page } from "@playwright/test";
import { pubGameAnswerKey } from "../src/data/walks/hidden-pubs/game/answers.server";
import { pubGameCafes } from "../src/data/walks/hidden-pubs/game/cafes";
import { pubGameTexts } from "../src/data/walks/hidden-pubs/game/content";
import { pubGameDefinition } from "../src/data/walks/hidden-pubs/game/definition";
import { pubGameReveals } from "../src/data/walks/hidden-pubs/game/reveals/index.server";
import { en, tr, watchForProblems } from "./helpers";

/**
 * Hidden Pubs 2.0 in a real browser, several phones at once, against the
 * production build (games kept in memory: PUB_GAME_MEMORY_STORES in
 * playwright.config.ts). Labels come from the translations and answers from
 * the game data, so content can change without breaking these tests.
 */

const PHONE = { viewport: { width: 390, height: 844 }, locale: "en-GB" };
const texts = pubGameTexts.en.cafes;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function newPhone(browser: Browser, locale = "en-GB"): Promise<Page> {
  const context = await browser.newContext({ ...PHONE, locale });
  return context.newPage();
}

/** The organiser creates a game; returns the game code. */
async function createGame(page: Page, hostName: string, teamCount: number): Promise<string> {
  await page.goto("/games/new");
  const teams = page.getByRole("group", { name: en("pubgame.create.teamCount") });
  await teams.getByRole("button", { name: String(teamCount), exact: true }).click();
  await page.getByLabel(en("pubgame.create.yourName")).fill(hostName);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: en("pubgame.create.submit") }).click();
  await page.waitForURL(/\/games\/[A-Z0-9]{6}$/);
  return page.url().split("/").pop()!;
}

/** A player opens the join link on their own phone (`t`: the phone's language). */
async function join(page: Page, code: string, name: string, teamName: string, t = en) {
  await page.goto(`/games/${code}`);
  await page.getByLabel(t("pubgame.join.yourName")).fill(name);
  await page.getByRole("button", { name: new RegExp(teamName) }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: t("pubgame.join.submit") }).click();
  await expect(page.getByText(t("pubgame.lobby.waitingForHost"))).toBeVisible();
}

async function noSidewaysScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
}

const visible = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).isVisible().catch(() => false);

/** Beery's popup → (location explainer) → "I've arrived". Returns the café's id. */
async function arrive(page: Page): Promise<string> {
  await page.getByRole("button", { name: en("pubgame.beery.letsGo") }).click();
  const withoutGps = page.getByRole("button", { name: en("gps.continueWithoutGps") });
  await withoutGps.or(page.getByRole("button", { name: en("gps.arrived") })).first().waitFor();
  if (await withoutGps.isVisible()) await withoutGps.click();
  await page.getByRole("button", { name: en("gps.arrived") }).click();
  const heading = await page.getByRole("heading", { level: 1 }).innerText();
  const cafe = Object.entries(pubGameCafes).find(([, info]) => heading.includes(info.name));
  if (!cafe) throw new Error(`Unknown café in "${heading}"`);
  return cafe[0];
}

/** Every phone of the team draws when it's their turn, answering whatever the card asks. */
async function cardRound(pages: Page[]) {
  const done = en("pubgame.cards.toPubtask");
  for (let turn = 0; turn < 30; turn++) {
    const finished = await Promise.all(pages.map((page) => visible(page, done)));
    if (finished.every(Boolean)) break;
    for (const page of pages) {
      if (await visible(page, en("pubgame.cards.draw"))) {
        await page.getByRole("button", { name: en("pubgame.cards.draw") }).click();
        await page.getByRole("button", { name: /face down/ }).first().click();
      }
      if (await page.getByRole("heading", { name: en("pubgame.cards.chooseTarget") }).isVisible().catch(() => false)) {
        await page.locator("section", { hasText: en("pubgame.cards.chooseTarget") }).getByRole("button").first().click();
      }
      if (await page.getByRole("heading", { name: en("pubgame.cards.chooseBuddy") }).isVisible().catch(() => false)) {
        await page.locator("section", { hasText: en("pubgame.cards.chooseBuddy") }).getByRole("button").first().click();
      }
      if (await page.getByLabel(en("pubgame.cards.writeRule")).isVisible().catch(() => false)) {
        await page.getByLabel(en("pubgame.cards.writeRule")).fill("Left hand only");
        await page.getByRole("button", { name: en("pubgame.cards.ruleSubmit") }).click();
      }
      if (await page.getByRole("heading", { name: en("pubgame.cards.reportLoser") }).isVisible().catch(() => false)) {
        await page.getByRole("button", { name: en("pubgame.cards.nobody") }).click();
      }
    }
    await pages[0].waitForTimeout(400);
  }
  for (const page of pages) await page.getByRole("button", { name: done }).click();
}

/** Answers every question right (first try), skips photo tasks and the bonus, reads the fun fact. */
async function pubtaskToFunFact(page: Page, cafeId: string) {
  const cafe = pubGameDefinition.cafes.find((candidate) => candidate.id === cafeId)!;
  for (const question of cafe.questions) {
    const option = texts[cafeId].questions[question.id].options[pubGameAnswerKey[question.id]];
    await page.getByRole("button", { name: option, exact: true }).click();
    await expect(page.getByText(en("pubgame.pubtask.correct", { points: 100 })).first()).toBeVisible();
  }
  for (const task of cafe.tasks.filter((candidate) => candidate.presentedAs === "pubtask")) {
    await page.locator("section", { hasText: texts[cafeId].tasks[task.id].title }).getByRole("button", { name: en("pubgame.tasks.skip") }).click();
  }
  await page.getByRole("button", { name: en("pubgame.pubtask.continue") }).click();
  if (cafe.tasks.some((task) => task.presentedAs === "bonus")) {
    await page.getByRole("button", { name: en("pubgame.beery.letsGo") }).click();
    await page.getByRole("button", { name: en("pubgame.bonus.skip") }).click();
  }
  await expect(page.getByRole("heading", { name: pubGameReveals.en.cafes[cafeId].funFact.title })).toBeVisible();
}

// ─── Tests ──────────────────────────────────────────────────────────────────

test("three phones, two teams: lobby, a café round, live scores, the host ends the game, results", async ({ browser }) => {
  const host = await newPhone(browser);
  const problems = watchForProblems(host);
  const code = await createGame(host, "Toon", 2);
  await noSidewaysScroll(host);
  // The QR code is there for the others to scan.
  await expect(host.getByRole("img", { name: en("pubgame.lobby.qrLabel", { code }) })).toBeVisible();
  await expect(host.getByRole("button", { name: en("pubgame.lobby.start") })).toBeDisabled();

  const bea = await newPhone(browser);
  await join(bea, code, "Bea", "Team 1");
  const cas = await newPhone(browser, "ru-RU");
  // Team names are the host's ("Team 2"); Cas's phone is in Russian.
  await join(cas, code, "Cas", "Team 2", tr("ru"));
  await noSidewaysScroll(cas);

  // The host's lobby updates by itself; then the game starts on every phone.
  await expect(host.getByText("Cas")).toBeVisible();
  await host.getByRole("button", { name: en("pubgame.lobby.start") }).click();
  for (const page of [host, bea]) await page.getByRole("button", { name: en("pubgame.beery.intro.skip") }).click();
  await expect(cas.getByRole("heading", { name: tr("ru")("pubgame.beery.intro.welcomeTitle") })).toBeVisible();

  // Team 1 plays Rococo: every team starts there.
  const cafeId = await arrive(host);
  expect(cafeId).toBe(pubGameDefinition.route[0].cafeIds[0]);
  await expect(bea.getByRole("heading", { name: en("pubgame.drinks.welcome", { cafe: pubGameCafes[cafeId].name }) })).toBeVisible();
  await bea.getByRole("button", { name: en("pubgame.drinks.alcoholFree") }).click();
  await bea.getByRole("button", { name: en("pubgame.drinks.ready") }).click();
  await cardRound([host, bea]);
  await noSidewaysScroll(bea);
  await pubtaskToFunFact(bea, cafeId);

  // The other team sees Team 1's points live.
  await cas.getByRole("button", { name: tr("ru")("pubgame.beery.intro.skip") }).click();
  await cas.getByRole("button", { name: tr("ru")("pubgame.beery.letsGo") }).click();
  await cas.getByRole("button", { name: tr("ru")("pubgame.menu.scores") }).click();
  await expect(cas.getByRole("dialog").getByText(tr("ru").plural("pubgame.leaderboard.points", 100))).toBeVisible();

  // The host ends the game: results on every phone.
  await host.goto(`/games/${code}/host`);
  await host.getByRole("button", { name: en("pubgame.host.endGame") }).click();
  await host.getByRole("dialog").getByRole("button", { name: en("pubgame.host.endConfirm") }).click();
  await expect(bea.getByRole("heading", { name: en("pubgame.results.winner", { name: "Team 1" }) })).toBeVisible({ timeout: 15_000 });
  await expect(cas.getByRole("heading", { level: 1 })).toContainText("Team 1");
  await noSidewaysScroll(bea);
  expect(problems).toEqual([]);
});

test("one player plays all 12 cafés of the random route, to the results", async ({ browser }) => {
  test.setTimeout(8 * 60_000);
  const solo = await newPhone(browser);
  await createGame(solo, "Solo", 1);
  await solo.getByRole("button", { name: en("pubgame.lobby.start") }).click();
  await solo.getByRole("button", { name: en("pubgame.beery.intro.skip") }).click();

  const visited: string[] = [];
  for (let cafe = 0; cafe < 12; cafe++) {
    const cafeId = await arrive(solo);
    visited.push(cafeId);
    await solo.getByRole("button", { name: en("pubgame.drinks.ready") }).click();
    await cardRound([solo]);
    await pubtaskToFunFact(solo, cafeId);
    await solo.getByRole("button", { name: cafe === 11 ? en("pubgame.funFact.finish") : en("pubgame.funFact.next") }).click();
  }

  // Every café once, starting at Rococo and ending at Den Engel; 8 → 9 back to back.
  const groups = pubGameDefinition.route.map((group) => group.cafeIds);
  expect(new Set(visited).size).toBe(12);
  expect(visited[0]).toBe(groups[0][0]);
  expect(visited[11]).toBe(groups[4][0]);
  expect(visited.slice(7, 9)).toEqual(groups[2]);

  // Every question right first time: 100 points each (15 questions today: 1,500 points).
  const questionCount = pubGameDefinition.cafes.reduce((sum, cafe) => sum + cafe.questions.length, 0);
  await expect(solo.getByRole("heading", { name: en("pubgame.results.winner", { name: "Solo" }) })).toBeVisible();
  await expect(solo.getByText(en.plural("pubgame.leaderboard.points", questionCount * 100))).toBeVisible();
});

test("after the first card nobody can join freely; the host's personal link lets a late player in", async ({ browser }) => {
  const host = await newPhone(browser);
  const code = await createGame(host, "Toon", 1);
  await host.getByRole("button", { name: en("pubgame.lobby.start") }).click();
  await host.getByRole("button", { name: en("pubgame.beery.intro.skip") }).click();
  await arrive(host);
  await host.getByRole("button", { name: en("pubgame.drinks.ready") }).click();
  await host.getByRole("button", { name: en("pubgame.cards.draw") }).click();
  await host.getByRole("button", { name: /face down/ }).first().click();

  const late = await newPhone(browser);
  await late.goto(`/games/${code}`);
  await expect(late.getByText(en("pubgame.join.closed"))).toBeVisible();

  await host.goto(`/games/${code}/host`);
  await host.getByLabel(en("pubgame.host.addPlayerName")).fill("Late Lou");
  await host.getByRole("button", { name: en("pubgame.host.addPlayerSubmit") }).click();
  await host.getByRole("button", { name: en("pubgame.host.playerLinkFor", { name: "Late Lou" }) }).click();
  const link = await host.locator("p.break-all").innerText();
  expect(link).toMatch(new RegExp(`/games/${code}/claim#`));

  await late.goto(link);
  await late.waitForURL(new RegExp(`/games/${code}$`));
  // Lou is in the game (no join form), and the secret is gone from the address bar.
  await expect(late.getByText(en("pubgame.join.closed"))).toHaveCount(0);
  expect(late.url()).not.toContain("#");
});

test("answers, explanations and fun facts never reach the phone before they're earned", async ({ browser }) => {
  const phone = await newPhone(browser);
  const downloaded: string[] = [];
  phone.on("response", async (response) => {
    const type = response.headers()["content-type"] ?? "";
    if (type.includes("javascript") || type.includes("json") || type.includes("html")) {
      downloaded.push(await response.text().catch(() => ""));
    }
  });
  const code = await createGame(phone, "Toon", 1);
  await phone.getByRole("button", { name: en("pubgame.lobby.start") }).click();
  await phone.getByRole("button", { name: en("pubgame.beery.intro.skip") }).click();
  const cafeId = await arrive(phone);
  await phone.getByRole("button", { name: en("pubgame.drinks.ready") }).click();
  await cardRound([phone]);
  // On the pubtask screen, before answering.
  await expect(phone.getByRole("heading", { name: texts[cafeId].questions[pubGameDefinition.cafes[0].questions[0].id].question })).toBeVisible();
  await phone.waitForTimeout(3000);

  const everything = downloaded.join("\n");
  expect(everything).toContain(code);
  // No answer key, and no explanation or fun fact of any café.
  expect(everything).not.toMatch(/"pubs-rococo-gates"\s*:\s*"33"/);
  for (const cafe of Object.values(pubGameReveals.en.cafes)) {
    for (const explanation of Object.values(cafe.explanations)) expect(everything).not.toContain(explanation);
    expect(everything).not.toContain(cafe.funFact.paragraphs[0]);
  }
});
