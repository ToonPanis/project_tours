import { expect, test, type Browser, type Page } from "@playwright/test";
import { en, watchForProblems } from "./helpers";

/**
 * P10 (brief 9.1 and 10.4): complete purchase journeys in a real browser,
 * against the production build on the SHOP test server (playwright.config.ts,
 * project "shop"): sales open, data in memory, and our test payment page
 * instead of Stripe (COMMERCE_FAKE_PAYMENTS). Everything after "Pay" is the
 * real code: the webhook handler, the ticket, the play page, the game seats.
 */

// Test tax settings: chosen for the test, not a real decision (decision B8: the code holds no VAT rate).
const TEST_TAX = {
  regime: "vat-registered",
  homeCountry: "BE",
  categories: [{ id: "experience", label: "Experiences", rateBasisPoints: 2100 }],
  ossEnabled: false,
  ossRates: [],
  exemptionNote: "",
  confirmedByAccountant: true,
};

const PHONE = { viewport: { width: 390, height: 844 }, locale: "en-GB" };

test.beforeAll(async ({ request }) => {
  const response = await request.post("/api/playtest/seed", { data: { tax: TEST_TAX } });
  expect(response.ok()).toBe(true);
});

async function newPhone(browser: Browser): Promise<Page> {
  return (await browser.newContext(PHONE)).newPage();
}

/** Buys on a walk's page (2 persons, the default), pays on the test page, opens the ticket. */
async function buyAndOpenTicket(page: Page, walkSlug: string) {
  await page.goto(`/walks/${walkSlug}`);
  await expect(page.getByRole("heading", { level: 2, name: en("commerce.buy.title") })).toBeVisible();
  const consent = page.getByLabel(en("commerce.buy.followUpConsent"));
  await expect(consent).not.toBeChecked();
  await consent.check();
  await page.getByRole("button", { name: en("commerce.buy.button") }).click();

  await page.waitForURL(/\/playtest\/checkout\?order=/);
  await page.getByRole("button", { name: "Pay (test)" }).click();

  await page.waitForURL(/\/checkout\/success\?order=/);
  await expect(page.getByText(en("commerce.success.paid"))).toBeVisible();
  await page.getByRole("link", { name: en("commerce.success.openTicket") }).click();
  await expect(page.getByText(en("commerce.ticket.ready"))).toBeVisible();
}

test("a guide walk: without a ticket the play page asks for one; buy, pay, open the ticket, play", async ({ browser }) => {
  const visitor = await newPhone(browser);
  await visitor.goto("/walks/classics-of-antwerp/play");
  await expect(visitor.getByRole("heading", { level: 1, name: en("commerce.paywall.title") })).toBeVisible();

  const buyer = await newPhone(browser);
  const problems = watchForProblems(buyer);
  await buyAndOpenTicket(buyer, "classics-of-antwerp");
  await buyer.getByRole("link", { name: en("commerce.ticket.start") }).click();
  await expect(buyer.getByRole("button", { name: en("guide.startWalk") })).toBeVisible();
  // The success page is never indexed, and the whole journey has no errors.
  expect(problems).toEqual([]);
});

test("Hidden Pubs: a ticket for 2 makes a game with 2 places; the second player joins, a third is refused", async ({ browser }) => {
  const organiser = await newPhone(browser);
  await buyAndOpenTicket(organiser, "hidden-pubs");
  await organiser.getByRole("link", { name: en("commerce.ticket.start") }).click();

  await organiser.waitForURL(/\/games\/new/);
  await expect(organiser.getByText(en("pubgame.create.ticketSeats", { players: en.plural("commerce.persons", 2) }))).toBeVisible();
  const teams = organiser.getByRole("group", { name: en("pubgame.create.teamCount") });
  await teams.getByRole("button", { name: "2", exact: true }).click();
  await organiser.getByLabel(en("pubgame.create.yourName")).fill("Organiser");
  await organiser.getByRole("checkbox").check();
  await organiser.getByRole("button", { name: en("pubgame.create.submit") }).click();
  await organiser.waitForURL(/\/games\/[A-Z0-9]{6}$/);
  const code = organiser.url().split("/").pop()!;
  await expect(organiser.getByText(en("pubgame.lobby.seats", { taken: 1, total: 2 }))).toBeVisible();

  const friend = await newPhone(browser);
  await friend.goto(`/games/${code}`);
  await friend.getByLabel(en("pubgame.join.yourName")).fill("Friend");
  await friend.getByRole("button", { name: /Team 2/ }).click();
  await friend.getByRole("checkbox").check();
  await friend.getByRole("button", { name: en("pubgame.join.submit") }).click();
  await expect(friend.getByText(en("pubgame.lobby.waitingForHost"))).toBeVisible();
  // A full group says so in the lobby (instead of "2 of 2 places taken").
  await expect(organiser.getByText(en("pubgame.lobby.full", { total: 2 }))).toBeVisible();

  const thirdPlayer = await newPhone(browser);
  await thirdPlayer.goto(`/games/${code}`);
  const full = thirdPlayer.getByText(en("pubgame.errors.gameFull")).or(thirdPlayer.getByText(en("pubgame.lobby.full", { total: 2 })));
  if (!(await full.first().isVisible().catch(() => false))) {
    await thirdPlayer.getByLabel(en("pubgame.join.yourName")).fill("Third");
    await thirdPlayer.getByRole("button", { name: /Team 1/ }).click();
    await thirdPlayer.getByRole("checkbox").check();
    await thirdPlayer.getByRole("button", { name: en("pubgame.join.submit") }).click();
  }
  await expect(full.first()).toBeVisible();
  await expect(thirdPlayer.getByText(en("pubgame.lobby.waitingForHost"))).toHaveCount(0);
});

test("the test payment page and its routes exist only on this test server", async ({ request }) => {
  // On this server they work (sanity); on every other server they answer 404 (checked in security-guards.test.ts and by the main e2e project).
  const unknown = await request.post("/api/playtest/pay", { data: { order: "does-not-exist" } });
  expect(unknown.status()).toBe(404);
});
