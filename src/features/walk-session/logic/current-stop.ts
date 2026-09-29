import { getRouteLeg, getRouteLegToCurrent } from "@/features/navigation/logic/route-legs";
import { getOrderedLocations } from "@/lib/walk-locations";
import type { WalkLocation } from "@/types/location";
import type { WalkingRoute } from "@/types/navigation";
import type { LocationProgress, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

/** Everything both players need to know about the stop the walker is at. */
export interface CurrentStop {
  /** Position in route order (0 = first stop). */
  index: number;
  location: WalkLocation;
  /** The stop after this one in route order (may be an optional stop), if any. */
  nextLocation: WalkLocation | undefined;
  progress: LocationProgress;
  /** The route to this stop, from where the walker really is (a bypass after a skipped detour). */
  routeToCurrent: WalkingRoute | null;
  /** The route from this stop to the next one in route order. */
  routeToNext: WalkingRoute | null;
}

/**
 * Pure: the current stop of a (valid) session. Called by the game player and the
 * guide player after their loading/start screens, when a session exists.
 */
export function getCurrentStop(walk: Walk, session: WalkSession): CurrentStop {
  const orderedLocations = getOrderedLocations(walk);
  const index = orderedLocations.findIndex((location) => location.id === session.currentLocationId);
  const location = orderedLocations[index];
  const nextLocation = orderedLocations[index + 1];
  return {
    index,
    location,
    nextLocation,
    progress: session.locations[session.currentLocationId],
    routeToCurrent: getRouteLegToCurrent(walk, session)?.route ?? null,
    // Every consecutive pair has a leg (checked for every walk by validateWalk).
    routeToNext: nextLocation ? (getRouteLeg(walk, location.id, nextLocation.id)?.route ?? null) : null,
  };
}
