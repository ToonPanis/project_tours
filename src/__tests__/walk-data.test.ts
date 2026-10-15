import { describe, expect, test } from "vitest";
import { getWalks } from "@/data/walks";
import { locales } from "@/i18n/config";
import { validateWalk } from "@/lib/validate-walk";

/**
 * Integrity checks that run against EVERY walk in `src/data/walks`, in every
 * language. A new walk is checked automatically as soon as it's added to the list.
 */
const walksInEveryLanguage = locales.flatMap((locale) =>
  getWalks(locale).map((walk) => [`${walk.slug} (${locale})`, walk, locale] as const),
);

describe.each(walksInEveryLanguage)("walk data: %s", (_name, walk) => {
  const locationIds = walk.locations.map((location) => location.id);

  test("passes the structural checks every walk must pass (validateWalk)", () => {
    expect(validateWalk(walk)).toEqual([]);
  });

  test("has unique location ids and stop numbers", () => {
    expect(new Set(locationIds).size).toBe(locationIds.length);

    const orders = walk.locations.map((location) => location.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  test("coordinates are either unknown (null) or plausible", () => {
    for (const location of walk.locations) {
      if (location.coordinates) {
        expect(Math.abs(location.coordinates.latitude)).toBeLessThanOrEqual(90);
        expect(Math.abs(location.coordinates.longitude)).toBeLessThanOrEqual(180);
      }
    }
  });

  test("a 'verified' stop always names its sources", () => {
    for (const location of walk.locations) {
      if (location.guide?.verification === "verified") expect(location.guide.sources.length).toBeGreaterThan(0);
    }
  });

  test("a walk with unverified history is marked as placeholder", () => {
    if (walk.locations.some((location) => location.guide && location.guide.verification !== "verified")) {
      expect(walk.contentStatus).toBe("placeholder");
    }
  });
});
