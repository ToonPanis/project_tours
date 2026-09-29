import type { GeoCoordinates } from "@/types/common";
import type { GpsFix, WalkingRoute } from "@/types/navigation";
import { NAVIGATION_CONFIG } from "../config";
import { hasArrived, nextArrivalCount, nextOffRouteCount } from "./arrival";
import { projectOntoRoute } from "./route-progress";

/**
 * What navigation remembers between GPS readings. Only the latest reading
 * is kept (in memory): no location history is ever built up.
 */
export interface NavigationTracking {
  fix: GpsFix | null;
  arrivalCount: number;
  offRouteCount: number;
  arrived: boolean;
}

export const initialTracking: NavigationTracking = {
  fix: null,
  arrivalCount: 0,
  offRouteCount: 0,
  arrived: false,
};

/** Pure: the tracking state after one more GPS reading. */
export function trackFix(
  state: NavigationTracking,
  fix: GpsFix,
  route: WalkingRoute | null,
  destination: GeoCoordinates | null,
): NavigationTracking {
  if (state.arrived) return { ...state, fix };

  const arrivalCount = destination ? nextArrivalCount(state.arrivalCount, fix, destination) : 0;
  const offRouteCount = route
    ? nextOffRouteCount(
        state.offRouteCount,
        projectOntoRoute(fix.coordinates, route.geometry).distanceFromRouteMeters,
        fix.accuracyMeters,
      )
    : 0;

  return { fix, arrivalCount, offRouteCount, arrived: hasArrived(arrivalCount) };
}

export function isLowAccuracy(fix: GpsFix | null): boolean {
  return fix !== null && fix.accuracyMeters > NAVIGATION_CONFIG.LOW_ACCURACY_METERS;
}
