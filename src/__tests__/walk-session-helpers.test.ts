import { englishTranslator as t } from "@/i18n/translate";
import { describe, expect, test } from "vitest";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { getDefaultWalkCopy, getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { distanceInMeters } from "@/lib/geo";
import {
  getOrderedLocations,
  isLocationRevealed,
  isRevealedBeforeStart,
} from "@/lib/walk-locations";

describe("route visibility", () => {
  test("progressive routes hide locked stops", () => {
    expect(isLocationRevealed("progressive", "locked")).toBe(false);
    expect(isLocationRevealed("progressive", "travelling")).toBe(true);
    expect(isLocationRevealed("all", "locked")).toBe(true);
  });

  test("before the start, Hidden Pubs only reveals its first café", () => {
    const stops = getOrderedLocations(hiddenPubsWalk);
    const revealed = stops.filter((location) => isRevealedBeforeStart(hiddenPubsWalk, location));
    expect(revealed).toEqual([stops[0]]);
  });

  test("a guide walk reveals every stop", () => {
    const revealed = classicsOfAntwerpWalk.locations.filter((location) =>
      isRevealedBeforeStart(classicsOfAntwerpWalk, location),
    );
    expect(revealed).toHaveLength(classicsOfAntwerpWalk.locations.length);
  });
});

describe("walk copy", () => {
  test("walk texts override the defaults", () => {
    expect(getWalkCopy(hiddenPubsWalk, t).startLabel).toBe(hiddenPubsWalk.copy?.startLabel);
    expect(getWalkCopy(hiddenPubsWalk, t).startLabel).not.toBe(getDefaultWalkCopy(t).startLabel);
  });

  test("walks without their own texts use the defaults", () => {
    expect(getWalkCopy({ ...hiddenPubsWalk, copy: undefined }, t)).toEqual(getDefaultWalkCopy(t));
  });
});

describe("distanceInMeters", () => {
  test("is zero for the same point", () => {
    const point = { latitude: 51.22, longitude: 4.4 };
    expect(distanceInMeters(point, point)).toBe(0);
  });

  test("measures roughly 111 km per degree of latitude", () => {
    const distance = distanceInMeters(
      { latitude: 51, longitude: 4.4 },
      { latitude: 52, longitude: 4.4 },
    );
    expect(distance).toBeGreaterThan(110_000);
    expect(distance).toBeLessThan(112_000);
  });
});
