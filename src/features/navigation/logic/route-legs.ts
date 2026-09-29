import { getOrderedLocations } from "@/lib/walk-locations";
import type { WalkLocation } from "@/types/location";
import type { RouteLeg } from "@/types/navigation";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

/** The pre-calculated route that leads to a location, if the walk has one. */
export function getRouteLegTo(walk: Walk, toLocationId: string): RouteLeg | undefined {
  return walk.routeLegs?.find((leg) => leg.toLocationId === toLocationId);
}

/** The pre-calculated route between two specific locations, if there is one. */
export function getRouteLeg(walk: Walk, fromLocationId: string, toLocationId: string): RouteLeg | undefined {
  return walk.routeLegs?.find((leg) => leg.fromLocationId === fromLocationId && leg.toLocationId === toLocationId);
}

/**
 * The last stop the walker actually visited before the current one.
 * Skipped bonus stops are passed over, so after "continue the route"
 * navigation starts from where the walker really is.
 */
export function getPreviousVisitedLocation(walk: Walk, session: WalkSession): WalkLocation | undefined {
  const orderedLocations = getOrderedLocations(walk);
  const currentIndex = orderedLocations.findIndex((location) => location.id === session.currentLocationId);
  return orderedLocations
    .slice(0, Math.max(0, currentIndex))
    .reverse()
    .find((location) => session.locations[location.id]?.status === "solved");
}

/**
 * The route to the current stop: from the last visited stop when that route
 * exists (e.g. a bypass of a skipped detour), otherwise the normal leg.
 */
export function getRouteLegToCurrent(walk: Walk, session: WalkSession): RouteLeg | undefined {
  const previous = getPreviousVisitedLocation(walk, session);
  return (
    (previous ? getRouteLeg(walk, previous.id, session.currentLocationId) : undefined) ??
    getRouteLegTo(walk, session.currentLocationId)
  );
}

export interface DetourCost {
  extraMeters: number;
  extraSeconds: number;
}

/**
 * How much longer the walk gets by visiting an optional stop:
 * (A → bonus → C) minus the direct bypass (A → C). For a bonus stop at the
 * very end there is no C, so the cost is simply A → bonus.
 */
export function getDetourCost(walk: Walk, fromLocationId: string, bonusLocationId: string): DetourCost | null {
  const toBonus = getRouteLeg(walk, fromLocationId, bonusLocationId);
  if (!toBonus) return null;

  const orderedLocations = getOrderedLocations(walk);
  const bonusIndex = orderedLocations.findIndex((location) => location.id === bonusLocationId);
  const afterBonus = orderedLocations.slice(bonusIndex + 1).find((location) => !location.isBonus);
  if (!afterBonus) {
    return { extraMeters: toBonus.route.distanceMeters, extraSeconds: toBonus.route.durationSeconds };
  }

  const fromBonus = getRouteLeg(walk, bonusLocationId, afterBonus.id);
  const bypass = getRouteLeg(walk, fromLocationId, afterBonus.id);
  if (!fromBonus || !bypass) return null;

  return {
    extraMeters: Math.max(0, toBonus.route.distanceMeters + fromBonus.route.distanceMeters - bypass.route.distanceMeters),
    extraSeconds: Math.max(0, toBonus.route.durationSeconds + fromBonus.route.durationSeconds - bypass.route.durationSeconds),
  };
}
