import { describe, expect, test } from "vitest";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { the17GatesWalk } from "@/data/walks/the-17-gates";
import { defaultGameCopy, getGameCopy } from "@/features/walk-session/logic/game-copy";
import { distanceInMeters } from "@/features/walk-session/logic/geo";
import {
  getOrderedLocations,
  isLocationRevealed,
  isRevealedBeforeStart,
} from "@/features/walk-session/logic/route";

describe("route visibility", () => {
  test("progressive routes hide locked stops", () => {
    expect(isLocationRevealed("progressive", "locked")).toBe(false);
    expect(isLocationRevealed("progressive", "travelling")).toBe(true);
    expect(isLocationRevealed("all", "locked")).toBe(true);
  });

  test("before the start, Hidden Pubs only reveals its first café", () => {
    const revealed = getOrderedLocations(hiddenPubsWalk)
      .filter((location) => isRevealedBeforeStart(hiddenPubsWalk, location))
      .map((location) => location.name);
    expect(revealed).toEqual(["Rococo Antwerp"]);
  });

  test("The 17 Gates reveals every stop", () => {
    const revealed = the17GatesWalk.locations.filter((location) =>
      isRevealedBeforeStart(the17GatesWalk, location),
    );
    expect(revealed).toHaveLength(the17GatesWalk.locations.length);
  });
});

describe("game copy", () => {
  test("walk texts override the defaults", () => {
    expect(getGameCopy(hiddenPubsWalk).voteResultTitle).toBe("The tavern has spoken");
  });

  test("walks without their own texts use the defaults", () => {
    expect(getGameCopy(the17GatesWalk)).toEqual(defaultGameCopy);
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
