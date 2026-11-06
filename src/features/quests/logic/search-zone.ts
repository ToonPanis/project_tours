import { distanceInMeters } from "@/lib/geo";
import { getRouteLength, pointAlongRoute } from "@/features/navigation/logic/route-progress";
import type { GeoCoordinates } from "@/types/common";
import type { WalkingRoute } from "@/types/navigation";
import type { SearchZone } from "@/types/quest";

/**
 * Pure helpers for "find it yourself" quests: the walker is guided to a search
 * zone, never to the exact place. Nothing here needs the browser.
 */

/** True when `position` is inside the zone (on the edge counts as inside). */
export function isInsideZone(position: GeoCoordinates, zone: SearchZone): boolean {
  return distanceInMeters(position, zone.center) <= zone.radiusMeters;
}

/** Straight-line distance to the edge of the zone; 0 inside it. */
export function distanceToZone(position: GeoCoordinates, zone: SearchZone): number {
  return Math.max(0, distanceInMeters(position, zone.center) - zone.radiusMeters);
}

/** Precision (in meters) of the point where a route enters the zone. */
const CLIP_STEP_METERS = 1;

/**
 * The route up to where it enters the zone: the line and the turn-by-turn steps
 * stop at the edge of the circle, so neither the map nor the directions lead to
 * the front door. Returns null when the route starts inside the zone (there is
 * nothing to walk: the search starts straight away).
 */
export function routeToZone(route: WalkingRoute, zone: SearchZone): WalkingRoute | null {
  const length = getRouteLength(route.geometry);
  let entryMeters: number | null = null;
  for (let meters = 0; meters <= length; meters += CLIP_STEP_METERS) {
    if (isInsideZone(pointAlongRoute(route.geometry, meters), zone)) {
      entryMeters = meters;
      break;
    }
  }
  // The route never reaches the zone (a data mistake that validateWalk catches): keep it whole.
  if (entryMeters === null) return route;
  if (entryMeters === 0) return null;

  // Every point of the line before the entry point, then the entry point itself.
  const geometry: GeoCoordinates[] = [route.geometry[0]];
  let travelled = 0;
  for (let index = 1; index < route.geometry.length; index++) {
    travelled += distanceInMeters(route.geometry[index - 1], route.geometry[index]);
    if (travelled >= entryMeters) break;
    geometry.push(route.geometry[index]);
  }
  geometry.push(pointAlongRoute(route.geometry, entryMeters));

  // Steps after the entry point (e.g. "turn left into the courtyard", "arrive") are dropped.
  const steps = route.steps
    .filter((step) => step.distanceFromStartMeters < entryMeters)
    .map((step) => ({
      ...step,
      distanceMeters: Math.min(step.distanceMeters, entryMeters - step.distanceFromStartMeters),
    }));

  const share = length > 0 ? entryMeters / length : 1;
  return {
    distanceMeters: Math.min(route.distanceMeters, route.distanceMeters * share),
    durationSeconds: route.durationSeconds * share,
    geometry,
    steps,
  };
}

/**
 * True when the zone keeps the place hidden: the whole area that counts as
 * "found" lies inside the circle, and the centre is far enough from the place
 * that walking to the middle of the circle isn't the answer.
 */
export function zoneHidesPlace(
  zone: SearchZone,
  place: GeoCoordinates,
  arrivalRadiusMeters: number,
  minimumOffsetMeters: number,
): boolean {
  const offset = distanceInMeters(zone.center, place);
  return offset + arrivalRadiusMeters <= zone.radiusMeters && offset >= minimumOffsetMeters;
}
