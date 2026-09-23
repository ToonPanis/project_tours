import type { WalkLocation } from "@/types/location";
import type { LocationStatus } from "@/types/session";
import type { RouteReveal, Walk } from "@/types/walk";

/** The walk's locations in route order. */
export function getOrderedLocations(walk: Walk): WalkLocation[] {
  return [...walk.locations].sort((a, b) => a.order - b.order);
}

/** Whether a stop's name and address may be shown. */
export function isLocationRevealed(routeReveal: RouteReveal, status: LocationStatus): boolean {
  return routeReveal === "all" || status !== "locked";
}

/**
 * Before a walk starts (e.g. on the detail page) only the first stop is
 * unlocked, so with a progressive route only its name is shown.
 */
export function isRevealedBeforeStart(walk: Walk, location: WalkLocation): boolean {
  const firstLocation = getOrderedLocations(walk)[0];
  const status: LocationStatus = location.id === firstLocation?.id ? "travelling" : "locked";
  return isLocationRevealed(walk.routeReveal, status);
}
