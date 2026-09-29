import { describe, expect, test } from "vitest";
import { hasArrived, isArrivalReading, isOffRoute, nextArrivalCount, nextOffRouteCount } from "@/features/navigation/logic/arrival";
import {
  formatWalkingDistance,
  formatWalkingTime,
  getImmediateLabel,
  getManeuverArrow,
} from "@/features/navigation/logic/maneuver-display";
import { getNavigationView } from "@/features/navigation/logic/navigation-view";
import {
  getRouteLength,
  getRouteProgress,
  pointAlongRoute,
  projectOntoRoute,
} from "@/features/navigation/logic/route-progress";
import { initialTracking, trackFix } from "@/features/navigation/logic/tracking";
import { distanceInMeters } from "@/lib/geo";
import { normalizeOsrmRoute, toManeuver } from "@/lib/routing/osrm";
import type { GeoCoordinates } from "@/types/common";
import type { GpsFix, WalkingRoute } from "@/types/navigation";

/**
 * A simple L-shaped test route near the Grote Markt:
 * ~100 m north, then a right turn and ~70 m east.
 */
const start: GeoCoordinates = { latitude: 51.22, longitude: 4.4 };
const corner: GeoCoordinates = { latitude: 51.2209, longitude: 4.4 };
const end: GeoCoordinates = { latitude: 51.2209, longitude: 4.401 };

const route: WalkingRoute = normalizeOsrmRoute({
  distance: 170,
  duration: 130,
  geometry: [
    [start.longitude, start.latitude],
    [corner.longitude, corner.latitude],
    [end.longitude, end.latitude],
  ],
  steps: [
    { distance: 100, name: "Test Street", type: "depart", modifier: null, location: [start.longitude, start.latitude] },
    { distance: 70, name: "Corner Street", type: "turn", modifier: "right", location: [corner.longitude, corner.latitude] },
    { distance: 0, name: "Corner Street", type: "arrive", modifier: null, location: [end.longitude, end.latitude] },
  ],
});

function fixAt(coordinates: GeoCoordinates, accuracyMeters = 5): GpsFix {
  return { coordinates, accuracyMeters, headingDegrees: null, speedMetersPerSecond: null, timestamp: 0 };
}

describe("OSRM adapter", () => {
  test.each([
    ["depart", null, "depart"],
    ["arrive", "left", "arrive"],
    ["turn", "right", "right"],
    ["turn", "slight left", "slight-left"],
    ["end of road", "left", "left"],
    ["continue", "straight", "straight"],
    ["fork", "slight left", "keep-left"],
    ["roundabout", "right", "roundabout"],
    ["turn", "uturn", "u-turn"],
    ["new name", null, "straight"],
  ])("%s + %s → %s", (type, modifier, expected) => {
    expect(toManeuver(type, modifier)).toBe(expected);
  });

  test("adds each maneuver's distance from the start", () => {
    expect(route.steps.map((step) => step.distanceFromStartMeters)).toEqual([0, 100, 170]);
    expect(route.steps[1]).toMatchObject({ maneuver: "right", instruction: "Turn right", streetName: "Corner Street" });
  });
});

describe("route progress", () => {
  test("the route is about 170 m long", () => {
    expect(getRouteLength(route.geometry)).toBeGreaterThan(160);
    expect(getRouteLength(route.geometry)).toBeLessThan(180);
  });

  test("a point on the route is 0 m from it, with the right distance along", () => {
    const halfway = pointAlongRoute(route.geometry, 50);
    const projection = projectOntoRoute(halfway, route.geometry);
    expect(projection.distanceFromRouteMeters).toBeLessThan(0.5);
    expect(projection.distanceAlongRouteMeters).toBeCloseTo(50, 0);
    expect(projection.routeBearingDegrees).toBeCloseTo(0, 0); // heading north
  });

  test("a point beside the route measures its sideways distance", () => {
    const beside = { latitude: 51.2203, longitude: 4.40043 }; // ~30 m east of the first leg
    expect(projectOntoRoute(beside, route.geometry).distanceFromRouteMeters).toBeCloseTo(30, -1);
  });

  test("before the corner, the next maneuver is the right turn with the right distance", () => {
    const progress = getRouteProgress(route, pointAlongRoute(route.geometry, 60));
    expect(progress.nextStep?.maneuver).toBe("right");
    expect(progress.distanceToNextStepMeters).toBeCloseTo(40, -1);
    expect(progress.stepAfterNext?.maneuver).toBe("arrive");
    expect(progress.remainingMeters).toBeCloseTo(110, -1);
  });

  test("after the corner, the next maneuver is the destination", () => {
    const progress = getRouteProgress(route, pointAlongRoute(route.geometry, 130));
    expect(progress.nextStep?.maneuver).toBe("arrive");
    expect(progress.routeBearingDegrees).toBeCloseTo(90, 0); // heading east
  });

  test("pointAlongRoute clamps to the start and the end", () => {
    expect(pointAlongRoute(route.geometry, -10)).toEqual(start);
    expect(pointAlongRoute(route.geometry, 10_000)).toEqual(end);
  });
});

describe("arrival detection (conservative)", () => {
  test("a close and accurate reading counts", () => {
    expect(isArrivalReading(fixAt(end), end)).toBe(true);
  });

  test("an inaccurate reading never counts, even at the right spot", () => {
    expect(isArrivalReading(fixAt(end, 80), end)).toBe(false);
  });

  test("a reading 60 m away doesn't count", () => {
    expect(isArrivalReading(fixAt(pointAlongRoute(route.geometry, 110)), end)).toBe(false);
  });

  test("two good readings in a row are needed; one bad reading resets the count", () => {
    let count = nextArrivalCount(0, fixAt(end), end);
    expect(hasArrived(count)).toBe(false);
    count = nextArrivalCount(count, fixAt(end, 90), end); // GPS jump
    expect(count).toBe(0);
    count = nextArrivalCount(nextArrivalCount(count, fixAt(end), end), fixAt(end), end);
    expect(hasArrived(count)).toBe(true);
  });
});

describe("off route", () => {
  test("needs three readings in a row, beyond both 30 m and the GPS accuracy", () => {
    expect(nextOffRouteCount(0, 40, 50)).toBe(0); // GPS too inaccurate to tell
    let count = 0;
    for (let reading = 0; reading < 2; reading++) count = nextOffRouteCount(count, 50, 5);
    expect(isOffRoute(count)).toBe(false);
    count = nextOffRouteCount(count, 50, 5);
    expect(isOffRoute(count)).toBe(true);
    expect(nextOffRouteCount(count, 5, 5)).toBe(0); // back on route
  });
});

describe("tracking + navigation view", () => {
  test("shows the upcoming turn with its distance", () => {
    const fix = fixAt(pointAlongRoute(route.geometry, 60));
    const tracking = trackFix(initialTracking, fix, route, end);
    const view = getNavigationView(fix, route, "De Muze", end, tracking);
    expect(view.instruction).toMatchObject({ kind: "maneuver", maneuver: "right" });
    expect(view.thenManeuver).toBe("arrive");
    expect(view.travelBearing).toBeCloseTo(0, 0);
  });

  test("after several off-route readings, guides back to the route", () => {
    const beside = { latitude: 51.2203, longitude: 4.4009 }; // ~64 m east of the first leg
    let tracking = initialTracking;
    for (let reading = 0; reading < 3; reading++) tracking = trackFix(tracking, fixAt(beside), route, end);
    const view = getNavigationView(fixAt(beside), route, "De Muze", end, tracking);
    expect(view.instruction.kind).toBe("back-to-route");
  });

  test("without a route (first stop), heads straight for the destination", () => {
    const fix = fixAt(start);
    const view = getNavigationView(fix, null, "Rococo Antwerp", end, trackFix(initialTracking, fix, null, end));
    expect(view.instruction).toMatchObject({ kind: "head-to-destination", destinationName: "Rococo Antwerp" });
    expect(view.remainingMeters).toBeCloseTo(distanceInMeters(start, end), 0);
  });

  test("arrives after two good readings at the destination", () => {
    let tracking = trackFix(initialTracking, fixAt(end), route, end);
    expect(tracking.arrived).toBe(false);
    tracking = trackFix(tracking, fixAt(end), route, end);
    expect(tracking.arrived).toBe(true);
  });

  test("only the latest reading is kept (no location history)", () => {
    let tracking = initialTracking;
    for (const meters of [0, 20, 40, 60]) {
      tracking = trackFix(tracking, fixAt(pointAlongRoute(route.geometry, meters)), route, end);
    }
    expect(Object.keys(tracking).sort()).toEqual(["arrivalCount", "arrived", "fix", "offRouteCount"]);
  });
});

describe("display helpers", () => {
  test.each([
    [8, "10 m"],
    [37, "35 m"],
    [734, "730 m"],
    [1234, "1.2 km"],
  ])("%i m → %s", (meters, expected) => {
    expect(formatWalkingDistance(meters)).toBe(expected);
  });

  test("walking time is at least one minute", () => {
    expect(formatWalkingTime(20)).toBe("1 min walk");
    expect(formatWalkingTime(510)).toBe("9 min walk");
  });

  test("arrows and 'now' labels", () => {
    expect(getManeuverArrow("right")).toBe("→");
    expect(getManeuverArrow("arrive")).toBe("★");
    expect(getImmediateLabel("right")).toBe("Turn right now");
  });
});
