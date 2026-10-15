import { describe, expect, test } from "vitest";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { getRouteLegTo } from "@/features/navigation/logic/route-legs";
import { getRouteLength, pointAlongRoute } from "@/features/navigation/logic/route-progress";
import { initialTracking, trackFix } from "@/features/navigation/logic/tracking";
import { distanceToZone, isInsideZone, routeToZone, zoneHidesPlace } from "@/features/quests/logic/search-zone";
import { distanceInMeters } from "@/lib/geo";
import { getOrderedLocations } from "@/lib/walk-locations";
import type { GeoCoordinates } from "@/types/common";
import type { GpsFix } from "@/types/navigation";
import type { SearchZone } from "@/types/quest";

// A real quest from the data, so the test follows the data when it is corrected.
const questStop = getOrderedLocations(classicsOfAntwerpWalk).find((location) => location.quest?.type === "location")!;
if (questStop.quest?.type !== "location") throw new Error("Classics of Antwerp should have a find-the-place quest");
const quest = questStop.quest;
const place = questStop.coordinates!;
const legToQuest = getRouteLegTo(classicsOfAntwerpWalk, questStop.id)!.route;

/** A point `meters` north of `from` (about 111,320 m per degree of latitude). */
const north = (from: GeoCoordinates, meters: number): GeoCoordinates => ({
  latitude: from.latitude + meters / 111_320,
  longitude: from.longitude,
});

const fixAt = (coordinates: GeoCoordinates, timestamp: number, accuracyMeters = 8): GpsFix => ({
  coordinates,
  accuracyMeters,
  headingDegrees: null,
  speedMetersPerSecond: null,
  timestamp,
});

describe("search zone", () => {
  const zone: SearchZone = { center: { latitude: 51.2178, longitude: 4.409 }, radiusMeters: 100 };

  test("inside / distance to the edge", () => {
    expect(isInsideZone(zone.center, zone)).toBe(true);
    expect(isInsideZone(north(zone.center, 99), zone)).toBe(true);
    expect(isInsideZone(north(zone.center, 101), zone)).toBe(false);
    expect(distanceToZone(north(zone.center, 50), zone)).toBe(0);
    expect(distanceToZone(north(zone.center, 160), zone)).toBeCloseTo(60, 0);
  });

  test("a zone hides the place only when the place is inside, with room, but not in the middle", () => {
    expect(zoneHidesPlace(zone, north(zone.center, 45), 40, 20)).toBe(true);
    expect(zoneHidesPlace(zone, north(zone.center, 5), 40, 20)).toBe(false); // the middle is the answer
    expect(zoneHidesPlace(zone, north(zone.center, 80), 40, 20)).toBe(false); // part of the arrival area is outside
  });
});

describe("the route to a quest stops at the edge of its zone", () => {
  const clipped = routeToZone(legToQuest, quest.searchZone)!;

  test("the line ends on the edge, never at the place", () => {
    const end = clipped.geometry.at(-1)!;
    expect(distanceInMeters(end, quest.searchZone.center)).toBeCloseTo(quest.searchZone.radiusMeters, -1);
    // Every point before the end is outside the zone.
    for (const point of clipped.geometry.slice(0, -1)) expect(isInsideZone(point, quest.searchZone)).toBe(false);
    expect(distanceInMeters(end, place)).toBeGreaterThan(quest.arrivalRadiusMeters);
  });

  test("it is shorter than the full route, and has no steps inside the zone", () => {
    expect(clipped.distanceMeters).toBeLessThan(legToQuest.distanceMeters);
    expect(getRouteLength(clipped.geometry)).toBeLessThan(getRouteLength(legToQuest.geometry));
    for (const step of clipped.steps) expect(isInsideZone(step.location, quest.searchZone)).toBe(false);
  });

  test("a route that starts inside the zone leaves nothing to walk", () => {
    const start = pointAlongRoute(legToQuest.geometry, getRouteLength(legToQuest.geometry));
    expect(routeToZone({ ...legToQuest, geometry: [start, place] }, quest.searchZone)).toBeNull();
  });
});

describe("arrival with a quest's own radius", () => {
  test("found within the quest's radius, measured from the real place (two readings in a row)", () => {
    const near = north(place, quest.arrivalRadiusMeters - 5);
    const first = trackFix(initialTracking, fixAt(near, 1000), null, place, quest.arrivalRadiusMeters);
    expect(first.arrived).toBe(false);
    expect(trackFix(first, fixAt(near, 2000), null, place, quest.arrivalRadiusMeters).arrived).toBe(true);
  });

  test("standing in the middle of the search zone is not enough", () => {
    const middle = quest.searchZone.center;
    const first = trackFix(initialTracking, fixAt(middle, 1000), null, place, quest.arrivalRadiusMeters);
    expect(trackFix(first, fixAt(middle, 2000), null, place, quest.arrivalRadiusMeters).arrived).toBe(false);
  });

  test("other stops keep the usual radius", () => {
    const at45 = north(place, 45);
    const first = trackFix(initialTracking, fixAt(at45, 1000), null, place);
    expect(trackFix(first, fixAt(at45, 2000), null, place).arrived).toBe(false);
    const wide = trackFix(trackFix(initialTracking, fixAt(at45, 1000), null, place, 50), fixAt(at45, 2000), null, place, 50);
    expect(wide.arrived).toBe(true);
  });
});
