import { expect, test } from "@playwright/test";
import { watchForProblems } from "./helpers";

/**
 * The admin area in the production build (commerce data in memory, like the
 * Hidden Pubs games: COMMERCE_MEMORY_STORES in playwright.config.ts; no admin
 * addresses are configured, so nobody can actually sign in here).
 */

test("the admin area sends visitors without a session to the sign-in page, which is never indexed", async ({ page }) => {
  const problems = watchForProblems(page);
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { level: 1, name: "Admin sign-in" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);
});

test("asking for a link always gives the same answer (no way to find out who the admins are)", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill("someone@example.com");
  await page.getByRole("button", { name: "Email me a sign-in link" }).click();
  await expect(page.getByText("If someone@example.com is an admin address")).toBeVisible();
});

test("a made-up sign-in link is refused and gives no session", async ({ page, context }) => {
  await page.goto("/admin/login/verify#made-up-secret-made-up-secret-made-up-123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText(/not valid anymore/)).toBeVisible();
  expect((await context.cookies()).some((cookie) => cookie.name === "ha_admin")).toBe(false);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
