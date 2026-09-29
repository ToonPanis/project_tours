import { distanceInMeters } from "@/lib/geo";
import type { GeoCoordinates } from "@/types/common";
import type { GpsFix, Maneuver, WalkingRoute } from "@/types/navigation";
import type { DirectionInstruction } from "../components/DirectionPanel";
import { NAVIGATION_CONFIG } from "../config";
import { isOffRoute } from "./arrival";
import { getRouteProgress } from "./route-progress";
import type { NavigationTracking } from "./tracking";

/** Everything the navigation screen shows for one GPS position. */
export interface NavigationView {
  instruction: DirectionInstruction;
  thenManeuver?: Maneuver;
  thenAfterMeters?: number;
  remainingMeters: number | null;
  travelBearing: number | null;
}

/** Decides what to show for the current position (pure, no side effects). */
export function getNavigationView(
  fix: GpsFix | null,
  route: WalkingRoute | null,
  destinationName: string,
  destination: GeoCoordinates | null,
  tracking: NavigationTracking,
): NavigationView {
  if (!fix || !destination) {
    return {
      instruction: { kind: "waiting-for-gps" },
      remainingMeters: route?.distanceMeters ?? null,
      travelBearing: null,
    };
  }

  const directDistance = distanceInMeters(fix.coordinates, destination);

  // No route (e.g. the first stop): head straight for the destination.
  if (!route) {
    return {
      instruction: { kind: "head-to-destination", destinationName, distanceMeters: directDistance },
      remainingMeters: directDistance,
      travelBearing: null,
    };
  }

  const progress = getRouteProgress(route, fix.coordinates);

  // Far away from the route: the route no longer helps, point at the café.
  if (progress.distanceFromRouteMeters > NAVIGATION_CONFIG.FAR_FROM_ROUTE_METERS) {
    return {
      instruction: { kind: "head-to-destination", destinationName, distanceMeters: directDistance },
      remainingMeters: directDistance,
      travelBearing: null,
    };
  }

  // Clearly off route (confirmed over several readings): guide back to it.
  if (isOffRoute(tracking.offRouteCount)) {
    return {
      instruction: { kind: "back-to-route", distanceMeters: progress.distanceFromRouteMeters },
      remainingMeters: progress.remainingMeters + progress.distanceFromRouteMeters,
      travelBearing: null,
    };
  }

  const nextStep = progress.nextStep;
  return {
    instruction: nextStep
      ? {
          kind: "maneuver",
          maneuver: nextStep.maneuver,
          distanceMeters: progress.distanceToNextStepMeters,
          streetName: nextStep.streetName,
        }
      : { kind: "head-to-destination", destinationName, distanceMeters: directDistance },
    thenManeuver: progress.stepAfterNext?.maneuver,
    thenAfterMeters: progress.stepAfterNext ? nextStep?.distanceMeters : undefined,
    remainingMeters: progress.remainingMeters,
    travelBearing: progress.routeBearingDegrees,
  };
}
