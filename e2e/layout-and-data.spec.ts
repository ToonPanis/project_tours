import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { getWalks } from "../src/data/walks";
import type { Locale } from "../src/i18n/config";
import { getOrderedLocations } from "../src/lib/walk-locations";
import { tr } from "./helpers";

/**
 * 1. Long German words and Cyrillic at 390 px: no screen may be wider than the
 *    phone (sideways scrolling). Screenshots are saved for a visual check.
 * 2. Data use: what the start of a walk downloads (app, images, map, fonts).
 */

const SCREENS_DIR = "test-results/screens";

async function expectNoSidewaysScroll(page: Page, name: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, `${name} is ${overflow}px wider than the screen`).toBeLessThanOrEqual(0);
}

async function snap(page: Page, locale: Locale, name: string) {
  mkdirSync(SCREENS_DIR, { recursive: true });
  await page.screenshot({ path: `${SCREENS_DIR}/${locale}-${name}.png`, fullPage: false });
  await expectNoSidewaysScroll(page, `${locale} ${name}`);
}

for (const locale of ["de", "ru", "es"] as const) {
  test.describe(`${locale} at 390 px`, () => {
    test.use({ locale, permissions: ["geolocation"] });

    test("detail pages, a guide walk and the pub game fit the screen", async ({ page, context }) => {
      const t = tr(locale);
      await context.addCookies([{ name: "ha-locale", value: locale, url: "http://localhost:3300" }]);
      const walks = getWalks(locale);
      const poortjes = walks.find((walk) => walk.slug === "poortjes-van-antwerpen")!;
      const pubs = walks.find((walk) => walk.slug === "hidden-pubs")!;

      await page.goto("/");
      await snap(page, locale, "home");
      await page.goto(`/walks/${poortjes.slug}`);
      await snap(page, locale, "poortjes-detail");

      // Guide walk: start, the chapter card, then the live map with the direction panel.
      const firstStop = getOrderedLocations(poortjes)[0];
      await context.setGeolocation({ ...firstStop.coordinates!, accuracy: 8 });
      await page.goto(`/walks/${poortjes.slug}/play`);
      await snap(page, locale, "poortjes-start");
      await page.getByRole("button", { name: t("guide.startWalk") }).click();
      await snap(page, locale, "poortjes-after-start");
      await page.getByRole("button", { name: t("common.continue") }).click({ timeout: 5_000 }).catch(() => {});
      await expect(page.locator(".maplibregl-canvas")).toBeVisible();
      await page.waitForTimeout(1_500);
      await snap(page, locale, "poortjes-navigation");

      // Hidden Pubs: "create a game" (the play page sends organisers there) and the lobby.
      await page.goto(`/walks/${pubs.slug}/play`);
      await page.waitForURL(/\/games\/new/);
      await page.getByLabel(t("pubgame.create.yourName")).fill("Anna-Katharina");
      await snap(page, locale, "pubs-create");
      await page.getByRole("checkbox").check();
      await page.getByRole("button", { name: t("pubgame.create.submit") }).click();
      await page.waitForURL(/\/games\/[A-Z0-9]{6}$/);
      await expect(page.getByRole("button", { name: t("pubgame.lobby.share") })).toBeVisible();
      await snap(page, locale, "pubs-lobby");
    });
  });
}

test("data use: the start of a walk (page, images, map, fonts)", async ({ page, context }) => {
  const walk = getWalks("en").find((candidate) => candidate.slug === "classics-of-antwerp")!;
  const first = getOrderedLocations(walk)[0];
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ ...first.coordinates!, accuracy: 8 });

  const bytes: Record<string, number> = { page: 0, scripts: 0, images: 0, fonts: 0, map: 0, other: 0 };
  page.on("requestfinished", async (request) => {
    const sizes = await request.sizes().catch(() => null);
    if (!sizes) return;
    const size = sizes.responseBodySize + sizes.responseHeadersSize;
    const url = new URL(request.url());
    const kind = url.hostname.includes("openfreemap")
      ? "map"
      : request.resourceType() === "document"
        ? "page"
        : request.resourceType() === "script" || url.pathname.startsWith("/maplibre/")
          ? "scripts"
          : request.resourceType() === "image"
            ? "images"
            : request.resourceType() === "font"
              ? "fonts"
              : "other";
    bytes[kind] += size;
  });

  await page.goto(`/walks/${walk.slug}/play`);
  await page.getByRole("button", { name: tr("en")("guide.startWalk") }).click();
  await expect(page.locator(".maplibregl-canvas")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3_000); // let the map finish its tiles

  const kilobytes = Object.fromEntries(Object.entries(bytes).map(([kind, size]) => [kind, Math.round(size / 1024)]));
  const total = Object.values(kilobytes).reduce((sum, size) => sum + size, 0);
  mkdirSync("test-results", { recursive: true });
  writeFileSync("test-results/data-use.json", JSON.stringify({ ...kilobytes, totalKB: total }, null, 2));
  console.log("Data use (KB):", { ...kilobytes, total });
  // A first visit on mobile data should stay well under 5 MB.
  expect(total).toBeLessThan(5_000);
});
