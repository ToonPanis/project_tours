import type { GeoCoordinates } from "@/types/common";
import type { GpsFix } from "@/types/navigation";
import { distanceInMeters } from "@/lib/geo";
import { NAVIGATION_CONFIG } from "../config";

/** Is this single reading good enough, and close enough, to count as "at the location"? */
export function isArrivalReading(fix: GpsFix, destination: GeoCoordinates): boolean {
  if (fix.accuracyMeters > NAVIGATION_CONFIG.MAX_ACCURACY_FOR_ARRIVAL_METERS) return false;
  return distanceInMeters(fix.coordinates, destination) <= NAVIGATION_CONFIG.ARRIVAL_RADIUS_METERS;
}

/**
 * Counts good arrival readings in a row. One reading outside (or one
 * inaccurate reading) resets the count, so a single GPS jump never
 * triggers arrival.
 */
export function nextArrivalCount(previousCount: number, fix: GpsFix, destination: GeoCoordinates): number {
  return isArrivalReading(fix, destination) ? previousCount + 1 : 0;
}

export function hasArrived(arrivalCount: number): boolean {
  return arrivalCount >= NAVIGATION_CONFIG.ARRIVAL_CONFIRMATIONS;
}

/**
 * Off route when the walker is farther from the route line than
 * OFF_ROUTE_METERS, or than the GPS accuracy if that is worse (we can't
 * claim someone is off route when the GPS itself isn't sure).
 */
export function isOffRouteReading(distanceFromRouteMeters: number, accuracyMeters: number): boolean {
  return distanceFromRouteMeters > Math.max(NAVIGATION_CONFIG.OFF_ROUTE_METERS, accuracyMeters);
}

export function nextOffRouteCount(previousCount: number, distanceFromRouteMeters: number, accuracyMeters: number): number {
  return isOffRouteReading(distanceFromRouteMeters, accuracyMeters) ? previousCount + 1 : 0;
}

export function isOffRoute(offRouteCount: number): boolean {
  return offRouteCount >= NAVIGATION_CONFIG.OFF_ROUTE_CONFIRMATIONS;
}
