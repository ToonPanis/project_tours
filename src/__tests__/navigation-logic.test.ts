import { englishTranslator as t } from "@/i18n/translate";
import { describe, expect, test } from "vitest";
import { hasArrived, isArrivalReading, isOffRoute, nextArrivalCount, nextOffRouteCount } from "@/features/navigation/logic/arrival";
import {
  formatWalkingDistance,
  formatWalkingTime,
  getImmediateText,
  getManeuverArrow,
} from "@/features/navigation/logic/maneuver-display";
import { getNavigationView } from "@/features/navigation/logic/navigation-view";
import {
  getRouteLength,
  getRouteProgress,
  pointAlongRoute,
  projectOntoRoute,
} from "@/features/navigation/logic/route-progress";
import { hasWeakSignal, initialTracking, isImplausibleJump, trackFix } from "@/features/navigation/logic/tracking";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
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

/** A test clock: each reading is one second after the previous one, like a real GPS. */
let clock = 0;
function fixAt(coordinates: GeoCoordinates, accuracyMeters = 5, timestamp = (clock += 1000)): GpsFix {
  return { coordinates, accuracyMeters, headingDegrees: null, speedMetersPerSecond: null, timestamp };
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

  test("only the latest reading (and at most one unconfirmed jump) is kept: no location history", () => {
    let tracking = initialTracking;
    for (const meters of [0, 20, 40, 60]) {
      tracking = trackFix(tracking, fixAt(pointAlongRoute(route.geometry, meters)), route, end);
    }
    expect(Object.keys(tracking).sort()).toEqual([
      "arrivalCount",
      "arrived",
      "farFromRouteCount",
      "fix",
      "latestAccuracyMeters",
      "offRouteCount",
      "pendingJump",
    ]);
  });
});

// M-07 / L-10: real GPS is noisy. One bad reading must never move the walker, the camera
// or the instructions, and a repeated (cached) reading must never count twice.
describe("tracking: noisy GPS", () => {
  const onRoute = (meters: number) => pointAlongRoute(route.geometry, meters);

  test("a repeated (cached) reading doesn't count twice towards arrival", () => {
    const first = fixAt(end);
    let tracking = trackFix(initialTracking, first, route, end);
    tracking = trackFix(tracking, { ...first }, route, end); // same timestamp: the browser's cached reading
    expect(tracking.arrivalCount).toBe(1);
    expect(tracking.arrived).toBe(false);
    tracking = trackFix(tracking, fixAt(end), route, end); // a genuinely new reading
    expect(tracking.arrived).toBe(true);
  });

  test("repeated or stepped-back timestamps don't freeze the position (some devices do this)", () => {
    let tracking = trackFix(initialTracking, fixAt(onRoute(40), 5, 5_000), route, end);
    tracking = trackFix(tracking, fixAt(onRoute(44), 5, 5_000), route, end); // same timestamp, new position
    expect(tracking.fix!.coordinates).toEqual(onRoute(44));
    tracking = trackFix(tracking, fixAt(onRoute(48), 5, 4_000), route, end); // clock stepped back
    expect(tracking.fix!.coordinates).toEqual(onRoute(48));
  });

  test("two readings with the same time count as one arrival confirmation", () => {
    let tracking = trackFix(initialTracking, fixAt(end, 5, 9_000), route, end);
    tracking = trackFix(tracking, fixAt({ latitude: end.latitude + 0.00001, longitude: end.longitude }, 5, 9_000), route, end);
    expect(tracking.arrived).toBe(false);
    tracking = trackFix(tracking, fixAt(end, 5, 10_000), route, end);
    expect(tracking.arrived).toBe(true);
  });

  test("a cached copy of a jump can't confirm itself", () => {
    const start = trackFix(initialTracking, fixAt(onRoute(20)), route, end);
    const jump = fixAt({ latitude: onRoute(20).latitude + 0.0027, longitude: onRoute(20).longitude });
    let tracking = trackFix(start, jump, route, end);
    tracking = trackFix(tracking, { ...jump }, route, end); // the browser re-sends the same reading
    expect(tracking.fix!.coordinates).toEqual(onRoute(20));
    expect(tracking.pendingJump).not.toBeNull();
  });

  test("alternating network and GPS readings: the precise GPS reading wins at once", () => {
    const real = onRoute(20);
    const network = { latitude: real.latitude + 0.0045, longitude: real.longitude }; // ~500 m off
    let tracking = trackFix(initialTracking, fixAt(network, 140), route, end); // first: an imprecise network fix
    let gpsUsed = 0;
    for (let reading = 0; reading < 5; reading++) {
      tracking = trackFix(tracking, fixAt(real, 8), route, end);
      if (tracking.fix!.coordinates === real) gpsUsed++;
      tracking = trackFix(tracking, fixAt(network, 140), route, end);
    }
    expect(gpsUsed).toBe(5);
    expect(tracking.fix!.coordinates).toEqual(real); // the network readings don't pull it back
  });

  test("a very inaccurate reading (e.g. indoors) doesn't move the position, but does show 'GPS weak'", () => {
    let tracking = trackFix(initialTracking, fixAt(onRoute(20)), route, end);
    tracking = trackFix(tracking, fixAt(onRoute(60), NAVIGATION_CONFIG.UNUSABLE_ACCURACY_METERS + 1), route, end);
    expect(tracking.fix!.coordinates).toEqual(onRoute(20));
    expect(hasWeakSignal(tracking)).toBe(true);
  });

  test("a single GPS jump of 300 m is held back; the next normal reading carries on", () => {
    const start = trackFix(initialTracking, fixAt(onRoute(20)), route, end);
    const jumped = { latitude: onRoute(20).latitude + 0.0027, longitude: onRoute(20).longitude }; // ~300 m north
    let tracking = trackFix(start, fixAt(jumped), route, end);
    expect(tracking.fix!.coordinates).toEqual(onRoute(20)); // not used
    expect(tracking.pendingJump).not.toBeNull();

    tracking = trackFix(tracking, fixAt(onRoute(24)), route, end); // back to normal
    expect(tracking.fix!.coordinates).toEqual(onRoute(24));
    expect(tracking.pendingJump).toBeNull();
  });

  test("a real big move is accepted once a second reading confirms it", () => {
    const start = trackFix(initialTracking, fixAt(onRoute(0)), route, end);
    const farAway = { latitude: start.fix!.coordinates.latitude + 0.0027, longitude: start.fix!.coordinates.longitude };
    let tracking = trackFix(start, fixAt(farAway), route, end);
    tracking = trackFix(tracking, fixAt(farAway), route, end);
    expect(tracking.fix!.coordinates).toEqual(farAway);
  });

  test("a slow long move (e.g. after the screen was locked for minutes) is not a jump", () => {
    const start = fixAt(onRoute(0), 5, 0);
    const later = fixAt({ latitude: onRoute(0).latitude + 0.0027, longitude: onRoute(0).longitude }, 5, 5 * 60_000);
    expect(isImplausibleJump(start, later)).toBe(false);
  });

  test("one reading far from the route doesn't switch to 'head to destination'; two in a row do", () => {
    const far = { latitude: onRoute(20).latitude, longitude: onRoute(20).longitude + 0.0035 }; // ~240 m east
    // Start there, so the far readings aren't treated as a jump.
    let tracking = trackFix(initialTracking, fixAt(far), route, end);
    expect(getNavigationView(tracking.fix, route, "De Muze", end, tracking).instruction.kind).not.toBe("head-to-destination");
    tracking = trackFix(tracking, fixAt(far), route, end);
    expect(getNavigationView(tracking.fix, route, "De Muze", end, tracking).instruction.kind).toBe("head-to-destination");
  });
});

describe("display helpers", () => {
  test.each([
    [8, "10 m"],
    [37, "35 m"],
    [734, "730 m"],
    [1234, "1.2 km"],
  ])("%i m → %s", (meters, expected) => {
    expect(formatWalkingDistance(meters, t)).toBe(expected);
  });

  test("walking time is at least one minute", () => {
    expect(formatWalkingTime(20, t)).toBe("1 min walk");
    expect(formatWalkingTime(510, t)).toBe("9 min walk");
  });

  test("arrows and 'now' labels", () => {
    expect(getManeuverArrow("right")).toBe("→");
    expect(getManeuverArrow("arrive")).toBe("★");
    expect(getImmediateText("right", t)).toBe("Turn right now");
  });
});
