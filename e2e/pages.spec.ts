import { expect, test } from "@playwright/test";
import { getWalks } from "../src/data/walks";
import { en, watchForProblems } from "./helpers";

/** Every public page loads in a real browser without errors, as visitors get it (production build). */

const walks = getWalks("en");
const pages = ["/", "/walks", ...walks.map((walk) => `/walks/${walk.slug}`), ...walks.map((walk) => `/walks/${walk.slug}/play`)];

for (const path of pages) {
  test(`${path} loads without errors`, async ({ page }) => {
    const problems = watchForProblems(page);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    // Give client components a moment to hydrate and report errors.
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });
}

test("an unknown walk is a real 404 page", async ({ page }) => {
  const response = await page.goto("/walks/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the playtest tools are not in the production build", async ({ page }) => {
  await page.goto("/walks/hidden-pubs/play");
  await page.getByRole("button", { name: en("game.start.newAdventure") }).waitFor();
  await expect(page.getByText("Playtest tools")).toHaveCount(0);
});

test("security headers are sent", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response!.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
  expect(headers["content-security-policy-report-only"]).toContain("default-src 'self'");
});
