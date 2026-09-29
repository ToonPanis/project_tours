import { describe, expect, test } from "vitest";
import { walks } from "@/data/walks";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { the17GatesWalk } from "./fixtures/the-17-gates";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
import { getOrderedLocations } from "@/lib/walk-locations";
import { distanceInMeters } from "@/lib/geo";

/**
 * A walking route must end close enough to its stop that GPS arrival (measured against
 * the stop's pin) can fire. 30 m leaves a 10 m margin for GPS noise inside the 40 m radius.
 */
const MAX_ROUTE_END_TO_PIN_METERS = 30;

/**
 * Known exceptions (AUDIT.md M-01): the pin is a building centroid and the nearest walkable
 * path is farther away. They wait for an on-site check (FIELD_TEST_CHECKLIST.md A1–A5).
 * Each entry is a ceiling: the route end may not drift farther than today's measured distance.
 * Remove an entry once its pin has been moved on site and the routes regenerated.
 */
const KNOWN_FAR_ROUTE_ENDS_METERS: Record<string, number> = {
  // Outside the 40 m arrival radius: GPS arrival may never fire here ("I'm here" is the fallback).
  "poortjes-sint-jacob": 49,
  "poortjes-kathedraal": 42,
  "classics-cathedral": 42,
  "poortjes-rosier": 42,
  // Inside the radius but with little margin for GPS noise.
  "poortjes-zwartzusters": 35,
  "classics-stadsfeestzaal": 34,
  "poortjes-universiteit": 33,
  "classics-boerentoren": 32,
  "poortjes-lange-gasthuisstraat": 31,
};

describe("Route ends vs. arrival radius (all walks)", () => {
  test("the margin leaves room for GPS noise inside the arrival radius", () => {
    expect(MAX_ROUTE_END_TO_PIN_METERS).toBeLessThan(NAVIGATION_CONFIG.ARRIVAL_RADIUS_METERS);
  });

  test("every route starts and ends near its stops' pins (or is a known, capped exception)", () => {
    const violations: string[] = [];
    for (const walk of walks) {
      const byId = new Map(walk.locations.map((location) => [location.id, location]));
      for (const leg of walk.routeLegs ?? []) {
        const ends = [
          { id: leg.fromLocationId, point: leg.route.geometry[0] },
          { id: leg.toLocationId, point: leg.route.geometry.at(-1)! },
        ];
        for (const { id, point } of ends) {
          const pin = byId.get(id)?.coordinates;
          if (!pin) continue;
          const meters = Math.round(distanceInMeters(point, pin));
          const limit = KNOWN_FAR_ROUTE_ENDS_METERS[id] ?? MAX_ROUTE_END_TO_PIN_METERS;
          if (meters > limit) violations.push(`${id}: ${meters} m (limit ${limit} m)`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  test("every known exception is still needed (remove fixed ones from the list)", () => {
    const stillFar = new Set<string>();
    for (const walk of walks) {
      const byId = new Map(walk.locations.map((location) => [location.id, location]));
      for (const leg of walk.routeLegs ?? []) {
        for (const [id, point] of [
          [leg.fromLocationId, leg.route.geometry[0]],
          [leg.toLocationId, leg.route.geometry.at(-1)!],
        ] as const) {
          const pin = byId.get(id)?.coordinates;
          if (pin && distanceInMeters(point, pin) > MAX_ROUTE_END_TO_PIN_METERS) stillFar.add(id);
        }
      }
    }
    expect(Object.keys(KNOWN_FAR_ROUTE_ENDS_METERS).filter((id) => !stillFar.has(id))).toEqual([]);
  });
});

describe("Hidden Pubs navigation data", () => {
  const locations = getOrderedLocations(hiddenPubsWalk);

  test("every café has (draft) coordinates, marked for verification until checked", () => {
    for (const location of locations) {
      expect(location.coordinates).not.toBeNull();
      expect(location.coordinatesStatus).toBeDefined();
    }
  });

  test("every café is in Antwerp's old town (catches a wrong geocoding match)", () => {
    for (const location of locations) {
      expect(location.coordinates!.latitude).toBeGreaterThan(51.2);
      expect(location.coordinates!.latitude).toBeLessThan(51.23);
      expect(location.coordinates!.longitude).toBeGreaterThan(4.39);
      expect(location.coordinates!.longitude).toBeLessThan(4.42);
    }
  });

  test("there is a walking route for every leg (café 1→2 … 7→8)", () => {
    const legs = hiddenPubsWalk.routeLegs ?? [];
    expect(legs).toHaveLength(locations.length - 1);
    locations.slice(1).forEach((location, index) => {
      const leg = legs.find((candidate) => candidate.toLocationId === location.id);
      expect(leg?.fromLocationId).toBe(locations[index].id);
    });
  });

  test("each route starts near its start café and ends near its destination", () => {
    for (const leg of hiddenPubsWalk.routeLegs ?? []) {
      const from = locations.find((location) => location.id === leg.fromLocationId)!.coordinates!;
      const to = locations.find((location) => location.id === leg.toLocationId)!.coordinates!;
      expect(distanceInMeters(leg.route.geometry[0], from)).toBeLessThan(60);
      expect(distanceInMeters(leg.route.geometry.at(-1)!, to)).toBeLessThan(60);
      expect(leg.route.steps.at(-1)?.maneuver).toBe("arrive");
    }
  });
});

describe("The 17 Gates placeholder (no longer a listed walk; kept as a test fixture)", () => {
  test("has no invented coordinates", () => {
    for (const location of the17GatesWalk.locations) {
      expect(location.coordinates).toBeNull();
    }
  });
});
