import { expect, test } from "@playwright/test";
import { en, watchForProblems } from "./helpers";

/**
 * The payment pages in the production build with sales CLOSED and no Stripe
 * keys (playwright.config.ts): the site must work exactly as before, and the
 * new pages must handle visitors without an order or with a broken link.
 */

test("with sales closed, a walk's page shows no ticket box and its walk starts as before", async ({ page }) => {
  const problems = watchForProblems(page);
  await page.goto("/walks/classics-of-antwerp");
  await expect(page.getByRole("heading", { level: 2, name: en("commerce.buy.title") })).toHaveCount(0);
  await page.goto("/walks/classics-of-antwerp/play");
  await expect(page.getByRole("heading", { level: 1, name: en("commerce.paywall.title") })).toHaveCount(0);
  await expect(page.getByRole("button", { name: en("guide.startWalk") })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);
});

test("the success page without an order of this browser says where the ticket is, and is never indexed", async ({ page }) => {
  await page.goto("/checkout/success?order=does-not-exist");
  await expect(page.getByText(en("commerce.success.unknown"))).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("the canceled page links back to the walk (and only to our own pages)", async ({ page }) => {
  await page.goto("/checkout/canceled?walk=classics-of-antwerp");
  await expect(page.getByRole("link", { name: en("commerce.canceled.back") })).toHaveAttribute("href", "/walks/classics-of-antwerp");
  await page.goto("/checkout/canceled?walk=https://evil.example");
  await expect(page.getByRole("link", { name: en("commerce.canceled.back") })).toHaveAttribute("href", "/walks");
});

test("a broken ticket link gives a clear message and no ticket cookie", async ({ page, context }) => {
  await page.goto("/tickets/open#made-up.ticket");
  await expect(page.getByText(en("commerce.errors.invalid-ticket"))).toBeVisible();
  await page.goto("/tickets/open");
  await expect(page.getByText(en("commerce.ticket.missing"))).toBeVisible();
  expect((await context.cookies()).some((cookie) => cookie.name.startsWith("ha_ticket_"))).toBe(false);
});

test("with sales closed, organisers create a Hidden Pubs game without a ticket, as before", async ({ page }) => {
  await page.goto("/games/new");
  await expect(page.getByRole("heading", { level: 1, name: en("commerce.paywall.title") })).toHaveCount(0);
  await expect(page.getByRole("button", { name: en("pubgame.create.submit") })).toBeVisible();
  await expect(page.getByText(en("pubgame.create.ticketSeats", { players: "" }).split(",")[0])).toHaveCount(0);
});

test("the corporate page: loads without errors, fits a phone, and a quote request is thanked", async ({ page }) => {
  const problems = watchForProblems(page);
  await page.goto("/corporate");
  await expect(page.getByRole("heading", { level: 1, name: en("corporate.title") })).toBeVisible();
  // No sideways scrolling at 390 px (the price table scrolls inside its own box if needed).
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole("link", { name: en("navigation.forCompanies") })).toBeVisible();

  await page.getByLabel(en("corporate.form.company")).fill("Test Company");
  await page.getByLabel(en("corporate.form.contactName")).fill("Test Person");
  await page.getByLabel(en("corporate.form.email")).fill("test@example.com");
  await page.getByLabel(en("corporate.form.participants")).fill("25");
  // A person takes a few seconds; the server treats instant forms as bots.
  await page.waitForTimeout(3500);
  await page.getByRole("button", { name: en("corporate.form.submit") }).click();
  await expect(page.getByText(en("corporate.form.thanks"))).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);
});

test("the new admin pages need a session", async ({ page }) => {
  for (const path of ["/admin/orders", "/admin/tax", "/admin/discounts", "/admin/quotes", "/admin/groups", "/admin/documents", "/admin/partners", "/admin/reviews", "/admin/privacy"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/admin\/login$/);
  }
});

test("a partner link with an unknown code: the page opens as usual, without the parameter", async ({ page }) => {
  const problems = watchForProblems(page);
  await page.goto("/walks?ref=NOSUCHPARTNER&c=lobby");
  await expect(page).toHaveURL(/\/walks$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);
});

test("the partner portal needs a session; its sign-in page fits a phone and is never indexed", async ({ page }) => {
  await page.goto("/partner");
  await expect(page).toHaveURL(/\/partner\/login$/);
  await expect(page.getByRole("heading", { level: 1, name: en("partner.login.title") })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("the review page without a valid link says so, fits a phone and is never indexed", async ({ page }) => {
  const problems = watchForProblems(page);
  await page.goto("/review#not-a-real-token");
  await expect(page.getByRole("heading", { level: 1, name: en("feedback.review.title") })).toBeVisible();
  await expect(page.getByText(en("feedback.review.invalid"))).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(problems.filter((problem) => !problem.includes("404"))).toEqual([]);
});

test("the unsubscribe page only acts on a button press, and refuses a broken link", async ({ page }) => {
  await page.goto("/unsubscribe#broken.link");
  await expect(page.getByRole("heading", { level: 1, name: en("feedback.unsubscribe.title") })).toBeVisible();
  await page.getByRole("button", { name: en("feedback.unsubscribe.button") }).click();
  await expect(page.getByText(en("feedback.unsubscribe.invalid"))).toBeVisible();
});

test("the privacy page: reachable from the footer, lists the real cookies, fits a phone", async ({ page }) => {
  const problems = watchForProblems(page);
  await page.goto("/walks");
  await page.getByRole("link", { name: en("navigation.privacy") }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("heading", { level: 1, name: en("privacy.title") })).toBeVisible();
  for (const name of ["ha-locale", "ha_ticket_<walk>", "ha_ref"]) await expect(page.getByText(name, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);
});
