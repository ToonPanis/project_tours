import type { GeoCoordinates } from "@/types/common";
import type { NavigationStep, WalkingRoute } from "@/types/navigation";

/**
 * Pure route maths. Over the few hundred meters of a walk, the Earth is flat
 * enough to convert coordinates to x/y meters around a reference point.
 */
const METERS_PER_DEGREE = (6_371_000 * Math.PI) / 180;

interface Point {
  x: number;
  y: number;
}

function toLocalMeters(coordinates: GeoCoordinates, reference: GeoCoordinates): Point {
  return {
    x: (coordinates.longitude - reference.longitude) * METERS_PER_DEGREE * Math.cos((reference.latitude * Math.PI) / 180),
    y: (coordinates.latitude - reference.latitude) * METERS_PER_DEGREE,
  };
}

/** Compass bearing (0 = north, 90 = east) of the direction from a to b. */
function bearingBetween(a: Point, b: Point): number {
  const degrees = (Math.atan2(b.x - a.x, b.y - a.y) * 180) / Math.PI;
  return (degrees + 360) % 360;
}

export interface RouteProjection {
  /** Shortest distance from the position to the route line. */
  distanceFromRouteMeters: number;
  /** How far along the route the closest point is. */
  distanceAlongRouteMeters: number;
  /** Direction of the route at that point (for "follow direction" map mode). */
  routeBearingDegrees: number;
}

/** Finds the point on the route line closest to `position`. */
export function projectOntoRoute(position: GeoCoordinates, geometry: GeoCoordinates[]): RouteProjection {
  const reference = geometry[0] ?? position;
  const p = toLocalMeters(position, reference);
  const points = geometry.map((coordinates) => toLocalMeters(coordinates, reference));

  let best: RouteProjection = { distanceFromRouteMeters: Infinity, distanceAlongRouteMeters: 0, routeBearingDegrees: 0 };
  let distanceBeforeSegment = 0;

  for (let index = 0; index < points.length - 1; index++) {
    const a = points[index];
    const b = points[index + 1];
    const segmentX = b.x - a.x;
    const segmentY = b.y - a.y;
    const segmentLength = Math.hypot(segmentX, segmentY);

    // How far along this segment (0 = at a, 1 = at b) the closest point lies.
    const t =
      segmentLength === 0
        ? 0
        : Math.max(0, Math.min(1, ((p.x - a.x) * segmentX + (p.y - a.y) * segmentY) / segmentLength ** 2));
    const closest = { x: a.x + t * segmentX, y: a.y + t * segmentY };
    const distance = Math.hypot(p.x - closest.x, p.y - closest.y);

    if (distance < best.distanceFromRouteMeters) {
      best = {
        distanceFromRouteMeters: distance,
        distanceAlongRouteMeters: distanceBeforeSegment + t * segmentLength,
        routeBearingDegrees: bearingBetween(a, b),
      };
    }
    distanceBeforeSegment += segmentLength;
  }

  if (points.length === 1) {
    best.distanceFromRouteMeters = Math.hypot(p.x - points[0].x, p.y - points[0].y);
  }
  return best;
}

/** Total length of a route line. */
export function getRouteLength(geometry: GeoCoordinates[]): number {
  const reference = geometry[0];
  if (!reference) return 0;
  let length = 0;
  for (let index = 0; index < geometry.length - 1; index++) {
    const a = toLocalMeters(geometry[index], reference);
    const b = toLocalMeters(geometry[index + 1], reference);
    length += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return length;
}

export interface RouteProgress extends RouteProjection {
  remainingMeters: number;
  /** The upcoming maneuver (the first one ahead of the walker). */
  nextStep: NavigationStep | undefined;
  /** The maneuver after that, for the "THEN" preview. */
  stepAfterNext: NavigationStep | undefined;
  distanceToNextStepMeters: number;
}

/** Everything the direction panel needs, for one GPS position. */
export function getRouteProgress(route: WalkingRoute, position: GeoCoordinates): RouteProgress {
  const projection = projectOntoRoute(position, route.geometry);
  const routeLength = getRouteLength(route.geometry);
  const along = projection.distanceAlongRouteMeters;

  // Skip "depart"; a maneuver counts as passed once we're a few meters beyond it.
  const upcomingSteps = route.steps.filter(
    (step) => step.maneuver !== "depart" && step.distanceFromStartMeters > along + 3,
  );
  const nextStep = upcomingSteps[0] ?? route.steps.at(-1);

  return {
    ...projection,
    remainingMeters: Math.max(0, routeLength - along),
    nextStep,
    stepAfterNext: upcomingSteps[1],
    distanceToNextStepMeters: nextStep ? Math.max(0, nextStep.distanceFromStartMeters - along) : 0,
  };
}

/** The coordinate at `meters` along the route (clamped to start/end). Used for simulated walking. */
export function pointAlongRoute(geometry: GeoCoordinates[], meters: number): GeoCoordinates {
  const reference = geometry[0];
  if (!reference) throw new Error("A route needs at least one point.");
  if (meters <= 0 || geometry.length === 1) return reference;

  let walked = 0;
  for (let index = 0; index < geometry.length - 1; index++) {
    const a = toLocalMeters(geometry[index], reference);
    const b = toLocalMeters(geometry[index + 1], reference);
    const segmentLength = Math.hypot(b.x - a.x, b.y - a.y);
    if (walked + segmentLength >= meters) {
      const t = segmentLength === 0 ? 0 : (meters - walked) / segmentLength;
      const start = geometry[index];
      const end = geometry[index + 1];
      return {
        latitude: start.latitude + t * (end.latitude - start.latitude),
        longitude: start.longitude + t * (end.longitude - start.longitude),
      };
    }
    walked += segmentLength;
  }
  return geometry[geometry.length - 1];
}
