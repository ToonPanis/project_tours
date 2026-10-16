import { expect, test } from "@playwright/test";
import { en, watchForProblems } from "./helpers";

/**
 * Frontend redesign: /about, /contact and /reviews in the production build
 * (390 px phone), reached through the header menu and the footer.
 */

const fitsPhone = () => document.documentElement.scrollWidth <= window.innerWidth;

test("the phone menu in the header leads to About, Reviews and Contact", async ({ page }) => {
  await page.goto("/");
  await page.locator("header summary", { hasText: en("navigation.menu") }).click();
  await page.getByRole("link", { name: en("navigation.about") }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: en("pages.about.title") })).toBeVisible();
});

for (const [path, heading] of [
  ["/about", "pages.about.title"],
  ["/contact", "pages.contact.title"],
  ["/reviews", "pages.reviews.title"],
] as const) {
  test(`${path}: loads without errors, fits a phone, has its title and description, is linked from the footer`, async ({ page }) => {
    const problems = watchForProblems(page);
    await page.goto("/walks");
    await page.locator("footer").getByRole("link", { name: en(`navigation.${path.slice(1) as "about" | "contact" | "reviews"}`) }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1, name: en(heading) })).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
    expect(await page.evaluate(fitsPhone)).toBe(true);
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });
}

test("the contact form without a configured address is switched off and sends groups to the quote form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByText(en("pages.contact.form.notConfigured"))).toBeVisible();
  await expect(page.getByRole("button", { name: en("pages.contact.form.submit") })).toBeDisabled();
  await page.getByRole("link", { name: en("pages.contact.more.groupsLink") }).click();
  await expect(page).toHaveURL(/\/corporate#quote$/);
});

test("the reviews page in production: no example reviews and no invented average", async ({ page }) => {
  await page.goto("/reviews");
  await expect(page.getByText(en("pages.reviews.empty"))).toBeVisible();
  await expect(page.getByText(en("pages.reviews.demo.badge"))).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});

test("long words (German, Russian) never make the new pages or the header wider than a phone", async ({ page, context }) => {
  for (const locale of ["de", "ru"]) {
    await context.addCookies([{ name: "ha-locale", value: locale, url: "http://localhost:3300" }]);
    for (const path of ["/", "/about", "/contact", "/reviews"]) {
      await page.goto(path);
      expect(await page.evaluate(fitsPhone), `${locale} ${path}`).toBe(true);
    }
  }
});
