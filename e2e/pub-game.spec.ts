import { expect, test, type Browser, type Page } from "@playwright/test";
import { pubGameAnswerKey } from "../src/data/walks/hidden-pubs/game/answers.server";
import { pubGameCafes } from "../src/data/walks/hidden-pubs/game/cafes";
import { pubGameTexts } from "../src/data/walks/hidden-pubs/game/content";
import { pubGameDefinition } from "../src/data/walks/hidden-pubs/game/definition";
import { cafeDestination } from "../src/data/walks/hidden-pubs/game/navigation";
import { pubGameReveals } from "../src/data/walks/hidden-pubs/game/reveals/index.server";
import type { Translator } from "../src/i18n/translate";
import { coordinateTexts, en, everythingStored, tr, watchForProblems } from "./helpers";

/**
 * Hidden Pubs 2.0 in a real browser, several phones at once, against the
 * production build (games kept in memory: PUB_GAME_MEMORY_STORES in
 * playwright.config.ts). Labels come from the translations and answers from
 * the game data, so content can change without breaking these tests.
 */

const PHONE = { viewport: { width: 390, height: 844 }, locale: "en-GB" };
const texts = pubGameTexts.en.cafes;
const firstCafeId = pubGameDefinition.route[0].cafeIds[0];

// ─── Helpers ────────────────────────────────────────────────────────────────

async function newPhone(browser: Browser, locale = "en-GB"): Promise<Page> {
  const context = await browser.newContext({ ...PHONE, locale });
  return context.newPage();
}

/** The organiser creates a game; returns the game code. */
async function createGame(page: Page, hostName: string, teamCount: number, playersPerTeam?: number, t: Translator = en): Promise<string> {
  await page.goto("/games/new");
  const teams = page.getByRole("group", { name: t("pubgame.create.teamCount") });
  await teams.getByRole("button", { name: String(teamCount), exact: true }).click();
  if (playersPerTeam) {
    const players = page.getByRole("group", { name: t("pubgame.create.playersPerTeam") });
    await players.getByRole("button", { name: String(playersPerTeam), exact: true }).click();
  }
  await page.getByLabel(t("pubgame.create.yourName")).fill(hostName);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: t("pubgame.create.submit") }).click();
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
async function arrive(page: Page, t: Translator = en): Promise<string> {
  await page.getByRole("button", { name: t("pubgame.beery.letsGo") }).click();
  const withoutGps = page.getByRole("button", { name: t("gps.continueWithoutGps") });
  await withoutGps.or(page.getByRole("button", { name: t("gps.arrived") })).first().waitFor();
  if (await withoutGps.isVisible()) await withoutGps.click();
  await page.getByRole("button", { name: t("gps.arrived") }).click();
  const heading = await page.getByRole("heading", { level: 1 }).innerText();
  const cafe = Object.entries(pubGameCafes).find(([, info]) => heading.includes(info.name));
  if (!cafe) throw new Error(`Unknown café in "${heading}"`);
  return cafe[0];
}

/** Closes the popups a card sends to every phone (new buddies, buddy sips), so the game behind them can be used. */
async function closePopups(page: Page, t: Translator = en) {
  const ok = page.getByRole("button", { name: t("pubgame.popups.ok") });
  for (let popup = 0; popup < 5 && (await ok.first().isVisible().catch(() => false)); popup++) await ok.first().click();
}

/**
 * Taps a button on a phone that may get popups from other players' random cards at any
 * moment (they arrive with the next poll). A popup in the way: close it and tap again.
 */
async function tapPastPopups(page: Page, name: string, t: Translator = en) {
  const button = page.getByRole("button", { name });
  for (let attempt = 0; attempt < 4; attempt++) {
    await closePopups(page, t);
    try {
      await button.click({ timeout: 5_000 });
      return;
    } catch {
      // Blocked by a popup that arrived in between (or the screen isn't there yet): try again.
    }
  }
  await closePopups(page, t);
  await button.click();
}

/** Every phone of the team draws when it's their turn, answering whatever the card asks. */
async function cardRound(pages: Page[], t: Translator = en) {
  const done = t("pubgame.cards.toPubtask");
  for (let turn = 0; turn < 30; turn++) {
    const finished = await Promise.all(pages.map((page) => visible(page, done)));
    if (finished.every(Boolean)) break;
    for (const page of pages) {
      await closePopups(page, t);
      if (await visible(page, t("pubgame.cards.draw"))) {
        await page.getByRole("button", { name: t("pubgame.cards.draw") }).click();
        await page.getByRole("button", { name: t("pubgame.cards.faceDown", { number: 1, total: 10 }) }).click();
      }
      if (await page.getByRole("heading", { name: t("pubgame.cards.chooseTarget") }).isVisible().catch(() => false)) {
        await page.locator("section", { hasText: t("pubgame.cards.chooseTarget") }).getByRole("button").first().click();
      }
      if (await page.getByRole("heading", { name: t("pubgame.cards.chooseBuddy") }).isVisible().catch(() => false)) {
        await page.locator("section", { hasText: t("pubgame.cards.chooseBuddy") }).getByRole("button").first().click();
      }
      if (await page.getByLabel(t("pubgame.cards.writeRule")).isVisible().catch(() => false)) {
        await page.getByLabel(t("pubgame.cards.writeRule")).fill("Left hand only");
        await page.getByRole("button", { name: t("pubgame.cards.ruleSubmit") }).click();
      }
      if (await page.getByRole("heading", { name: t("pubgame.cards.reportLoser") }).isVisible().catch(() => false)) {
        await page.getByRole("button", { name: t("pubgame.cards.nobody") }).click();
      }
    }
    await pages[0].waitForTimeout(400);
  }
  for (const page of pages) {
    await closePopups(page, t);
    await page.getByRole("button", { name: done }).click();
  }
}

/** Answers every question right (first try), skips photo tasks and the bonus, reads the fun fact. */
async function pubtaskToFunFact(page: Page, cafeId: string, t: Translator = en) {
  const cafe = pubGameDefinition.cafes.find((candidate) => candidate.id === cafeId)!;
  const cafeTexts = pubGameTexts[t.locale].cafes[cafeId];
  for (const question of cafe.questions) {
    const option = cafeTexts.questions[question.id].options[pubGameAnswerKey[question.id]];
    await page.getByRole("button", { name: option, exact: true }).click();
    await expect(page.getByText(t("pubgame.pubtask.correct", { points: 100 })).first()).toBeVisible();
  }
  for (const task of cafe.tasks.filter((candidate) => candidate.presentedAs === "pubtask")) {
    await page.locator("section", { hasText: cafeTexts.tasks[task.id].title }).getByRole("button", { name: t("pubgame.tasks.skip") }).click();
  }
  await page.getByRole("button", { name: t("pubgame.pubtask.continue") }).click();
  if (cafe.tasks.some((task) => task.presentedAs === "bonus")) {
    await page.getByRole("button", { name: t("pubgame.beery.letsGo") }).click();
    await page.getByRole("button", { name: t("pubgame.bonus.skip") }).click();
  }
  await expect(page.getByRole("heading", { name: pubGameReveals[t.locale].cafes[cafeId].funFact.title })).toBeVisible();
}

/** The organiser alone: create, start, skip the rules. Returns the game code. */
async function startSoloGame(page: Page, name: string, t: Translator = en): Promise<string> {
  const code = await createGame(page, name, 1, undefined, t);
  await page.getByRole("button", { name: t("pubgame.lobby.start") }).click();
  await page.getByRole("button", { name: t("pubgame.beery.intro.skip") }).click();
  return code;
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

  // The other team sees Team 1's points live. Cas first closes the popups the random
  // cards may have sent (e.g. Cas became someone's drinking buddy).
  for (const key of ["pubgame.beery.intro.skip", "pubgame.beery.letsGo", "pubgame.menu.scores"] as const) {
    await tapPastPopups(cas, tr("ru")(key), tr("ru"));
  }
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

// ─── Stage 13: the remaining test points (HIDDEN_PUBS_TEST_PLAN.md) ─────────

test("test point 3 + 7: a full team of 10 phones joins, an 11th can't, and all 10 draw (2 decks)", async ({ browser }) => {
  test.setTimeout(6 * 60_000);
  const host = await newPhone(browser);
  const code = await createGame(host, "Player 1", 1, 10);
  const phones = [host];
  for (let number = 2; number <= 10; number++) {
    const phone = await newPhone(browser);
    await join(phone, code, `Player ${number}`, "Team 1");
    phones.push(phone);
  }

  // The 11th phone: the only team is full.
  const eleventh = await newPhone(browser);
  await eleventh.goto(`/games/${code}`);
  await expect(eleventh.getByRole("button", { name: new RegExp(en("pubgame.join.full")) })).toBeDisabled();

  // The host sees all ten; the game starts on every phone.
  for (let number = 2; number <= 10; number++) await expect(host.getByText(`Player ${number}`, { exact: true })).toBeVisible();
  await host.getByRole("button", { name: en("pubgame.lobby.start") }).click();
  for (const phone of phones) await phone.getByRole("button", { name: en("pubgame.beery.intro.skip") }).click();

  await arrive(host);
  await host.getByRole("button", { name: en("pubgame.drinks.ready") }).click();
  // Ten players, one card each, from two decks; every phone ends on the pubtask.
  await cardRound(phones);
  for (const phone of phones) await expect(phone.getByRole("heading", { name: en("pubgame.pubtask.title") })).toBeVisible();
  await noSidewaysScroll(host);
});

test("test point 16 + 9: a reload in the middle of a question, and a lost connection, keep the game", async ({ browser }) => {
  const phone = await newPhone(browser);
  await startSoloGame(phone, "Toon");
  const cafeId = await arrive(phone);
  await phone.getByRole("button", { name: en("pubgame.drinks.ready") }).click();
  await cardRound([phone]);
  const rulesBefore = await phone.getByText("Left hand only").count();

  // One wrong answer…
  const question = pubGameDefinition.cafes.find((cafe) => cafe.id === cafeId)!.questions[0];
  const wrong = question.optionIds.find((id) => id !== pubGameAnswerKey[question.id])!;
  const wrongText = texts[cafeId].questions[question.id].options[wrong];
  await phone.getByRole("button", { name: wrongText, exact: true }).click();
  await expect(phone.getByText(en.plural("pubgame.pubtask.wrong", 1))).toBeVisible();

  // …survives a reload: the same question, the wrong option struck, the next try worth 80.
  await phone.reload();
  await expect(phone.getByRole("heading", { name: texts[cafeId].questions[question.id].question })).toBeVisible();
  await expect(phone.getByRole("button", { name: new RegExp(wrongText) })).toBeDisabled();
  await expect(phone.getByText(en("pubgame.pubtask.worth", { attempt: 2, points: 80 }))).toBeVisible();
  // A rule written with a jack (if one was drawn) is still there too.
  expect(await phone.getByText("Left hand only").count()).toBe(rulesBefore);

  // No network: the phone says so; back online: the notice goes and the game goes on.
  await phone.context().setOffline(true);
  await expect(phone.getByText(en("pubgame.connection.offline"))).toBeVisible({ timeout: 10_000 });
  await phone.context().setOffline(false);
  await expect(phone.getByText(en("pubgame.connection.offline"))).toHaveCount(0, { timeout: 10_000 });
  const right = texts[cafeId].questions[question.id].options[pubGameAnswerKey[question.id]];
  await phone.getByRole("button", { name: right, exact: true }).click();
  await expect(phone.getByText(en("pubgame.pubtask.correct", { points: 80 }))).toBeVisible();
});

test("test point 20: a German phone plays a café at 390 px without sideways scrolling", async ({ browser }) => {
  const de = tr("de");
  const phone = await newPhone(browser, "de-DE");
  await startSoloGame(phone, "Jürgen", de);
  const cafeId = await arrive(phone, de);
  await noSidewaysScroll(phone);
  await phone.getByRole("button", { name: de("pubgame.drinks.ready") }).click();
  await cardRound([phone], de);
  await noSidewaysScroll(phone);
  await pubtaskToFunFact(phone, cafeId, de);
  await noSidewaysScroll(phone);
});

test.describe("test point 15: GPS in the pub game", () => {
  const cafe = cafeDestination(firstCafeId, 1).coordinates!;
  // Distinctive readings a few metres from the café, with digits that can't occur by chance.
  const readings = [0.0000123, 0.0000131, 0.0000147].map((offset) => ({ latitude: cafe.latitude + offset, longitude: cafe.longitude + offset }));
  test.use({ ...PHONE, permissions: ["geolocation"], geolocation: { latitude: cafe.latitude + 0.003, longitude: cafe.longitude, accuracy: 6 } });

  test("arrives at the first café by GPS, and no position reaches the game server or the phone's storage", async ({ page, context }) => {
    const sent: string[] = [];
    page.on("request", (request) => sent.push(`${request.url()}\n${request.postData() ?? ""}`));
    await startSoloGame(page, "Toon");
    await page.getByRole("button", { name: en("pubgame.beery.letsGo") }).click();
    const enable = page.getByRole("button", { name: en("gps.enableLocation") });
    if (await enable.isVisible().catch(() => false)) await enable.click();

    for (const reading of readings) {
      await context.setGeolocation({ ...reading, accuracy: 6 });
      await page.waitForTimeout(800);
    }
    // Arrived without tapping "I've arrived": the whole team is at the café.
    await expect(page.getByRole("heading", { name: en("pubgame.drinks.welcome", { cafe: pubGameCafes[firstCafeId].name }) })).toBeVisible({ timeout: 15_000 });

    const requests = sent.join("\n");
    const stored = await everythingStored(page, context);
    for (const reading of readings) {
      for (const text of [String(reading.latitude), String(reading.longitude), ...coordinateTexts(reading.latitude, reading.longitude)]) {
        expect(requests).not.toContain(text);
        expect(stored).not.toContain(text);
      }
    }
  });
});

test("a bonus photo: sent from the phone, approved by the host, and only then worth its points", async ({ browser }) => {
  test.setTimeout(8 * 60_000);
  const solo = await newPhone(browser);
  const problems = watchForProblems(solo);
  const code = await startSoloGame(solo, "Solo");

  // Play cafés (the route is random) until one has a bonus photo task.
  let answered = 0;
  for (let cafe = 0; cafe < 12; cafe++) {
    const cafeId = await arrive(solo);
    await solo.getByRole("button", { name: en("pubgame.drinks.ready") }).click();
    await cardRound([solo]);
    const definition = pubGameDefinition.cafes.find((candidate) => candidate.id === cafeId)!;
    const photoTask = definition.tasks.find((task) => task.presentedAs === "bonus" && task.evidence === "photo");
    if (!photoTask) {
      answered += definition.questions.length;
      await pubtaskToFunFact(solo, cafeId);
      await solo.getByRole("button", { name: en("pubgame.funFact.next") }).click();
      continue;
    }

    // The pubtask first (right answers), then Beery's bonus task.
    for (const question of definition.questions) {
      await solo.getByRole("button", { name: texts[cafeId].questions[question.id].options[pubGameAnswerKey[question.id]], exact: true }).click();
      await expect(solo.getByText(en("pubgame.pubtask.correct", { points: 100 })).first()).toBeVisible();
    }
    answered += definition.questions.length;
    await solo.getByRole("button", { name: en("pubgame.pubtask.continue") }).click();
    await solo.getByRole("button", { name: en("pubgame.beery.letsGo") }).click();

    const task = solo.locator("section", { hasText: texts[cafeId].tasks[photoTask.id].title });
    await task.getByLabel(en("pubgame.evidence.takePhoto")).setInputFiles({
      name: "evidence.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4]),
    });
    await expect(task.getByRole("img", { name: en("pubgame.evidence.previewPhoto") })).toBeVisible();
    await task.getByRole("button", { name: en("pubgame.evidence.send") }).click();
    // Sent: the bonus step is done, the team reads the fun fact. No points yet.
    await expect(solo.getByRole("heading", { name: pubGameReveals.en.cafes[cafeId].funFact.title })).toBeVisible();

    // The host (this phone) reviews it.
    await solo.goto(`/games/${code}/host`);
    await solo.getByRole("button", { name: en("pubgame.host.approve") }).click();
    await expect(solo.getByText(en("pubgame.host.noPendingEvidence"))).toBeVisible();

    // Back in the game: the approved photo counts.
    await solo.goto(`/games/${code}`);
    await tapPastPopups(solo, en("pubgame.menu.scores"));
    await expect(solo.getByRole("dialog").getByText(en.plural("pubgame.leaderboard.points", answered * 100 + photoTask.points))).toBeVisible();
    expect(problems).toEqual([]);
    return;
  }
  throw new Error("No café with a bonus photo task on the route");
});
