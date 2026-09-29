import { expect, test } from "@playwright/test";
import { getClassicsWalk } from "../src/data/walks/classics-of-antwerp";
import { localeNames } from "../src/i18n/config";
import { getOrderedLocations } from "../src/lib/walk-locations";
import { tr } from "./helpers";

/**
 * The language in a real browser: detected from the phone on the first visit,
 * switched in the middle of a walk (the walk goes on where it was), and kept
 * when cookies are cleared (restored from localStorage).
 */

const nl = tr("nl");
const uk = tr("uk");

test.use({ locale: "nl-BE", permissions: ["geolocation"] });

test("nl-BE phone → Dutch; switch to Ukrainian mid-walk; the choice survives cleared cookies", async ({ page, context }) => {
  const dutchWalk = getClassicsWalk("nl");
  const ukrainianWalk = getClassicsWalk("uk");
  const firstStop = getOrderedLocations(ukrainianWalk)[0];

  // First visit: the browser says nl-BE, so everything is Dutch without choosing.
  await page.goto(`/walks/${dutchWalk.slug}/play`);
  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
  await page.getByRole("button", { name: nl("guide.startWalk") }).click();
  await expect(page.getByRole("heading", { level: 1, name: new RegExp(getOrderedLocations(dutchWalk)[0].name) })).toBeVisible();

  // Switch to Ukrainian in the middle of the walk: same screen, now in Ukrainian.
  await page.getByRole("button", { name: nl("common.labelValue", { label: nl("navigation.language"), value: localeNames.nl.nativeName }) }).click();
  await page.getByRole("button", { name: localeNames.uk.nativeName }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "uk");
  await expect(page.getByText(uk("gps.imHere"))).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: new RegExp(firstStop.name) })).toBeVisible();

  // Cookies cleared (e.g. by the browser): the saved choice brings Ukrainian back.
  await context.clearCookies();
  await page.goto("/walks");
  await expect(page.locator("html")).toHaveAttribute("lang", "uk", { timeout: 15_000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(uk("walks.explore.title"));
});
