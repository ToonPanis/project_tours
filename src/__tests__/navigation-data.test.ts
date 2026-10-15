import { describe, expect, test } from "vitest";
import { walks } from "@/data/walks";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
import { distanceInMeters } from "@/lib/geo";

/**
 * A walking route must end close enough to its stop that GPS arrival (measured against
 * the stop's pin) can fire. 30 m leaves a 10 m margin for GPS noise inside the 40 m radius.
 */
const MAX_ROUTE_END_TO_PIN_METERS = 30;

/**
 * Known exceptions (docs/archive/AUDIT.md M-01): the pin is a building centroid and the nearest walkable
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
