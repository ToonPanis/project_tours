import { distanceInMeters } from "@/lib/geo";
import type { GeoCoordinates } from "@/types/common";
import type { GpsFix, WalkingRoute } from "@/types/navigation";
import { NAVIGATION_CONFIG } from "../config";
import { hasArrived, nextArrivalCount, nextOffRouteCount } from "./arrival";
import { projectOntoRoute } from "./route-progress";

/**
 * What navigation remembers between GPS readings, in memory only. At most two
 * readings are kept (the position in use and one unconfirmed jump): no location
 * history is ever built up, and nothing here is ever stored.
 */
export interface NavigationTracking {
  /** The reading in use for the dot, the camera and the directions. */
  fix: GpsFix | null;
  /** Accuracy of the most recent reading, even if it wasn't usable ("GPS weak"). */
  latestAccuracyMeters: number | null;
  /** A reading that jumped implausibly far; used once the next reading confirms it. */
  pendingJump: GpsFix | null;
  arrivalCount: number;
  offRouteCount: number;
  farFromRouteCount: number;
  arrived: boolean;
}

export const initialTracking: NavigationTracking = {
  fix: null,
  latestAccuracyMeters: null,
  pendingJump: null,
  arrivalCount: 0,
  offRouteCount: 0,
  farFromRouteCount: 0,
  arrived: false,
};

/** The very same reading again (e.g. the browser re-sending a cached position). */
function isSameReading(a: GpsFix | null, b: GpsFix): boolean {
  return (
    a !== null &&
    a.timestamp === b.timestamp &&
    a.accuracyMeters === b.accuracyMeters &&
    a.coordinates.latitude === b.coordinates.latitude &&
    a.coordinates.longitude === b.coordinates.longitude
  );
}

/**
 * True when `reading` is too far from `previous` to have been walked in the time
 * between them (a GPS jump, e.g. a reflection off buildings or a cell-tower fix).
 */
export function isImplausibleJump(previous: GpsFix, reading: GpsFix): boolean {
  const meters = distanceInMeters(previous.coordinates, reading.coordinates);
  const tolerance = previous.accuracyMeters + reading.accuracyMeters + NAVIGATION_CONFIG.JUMP_TOLERANCE_METERS;
  if (meters <= tolerance) return false;
  // Some devices repeat or even step back timestamps: then assume the usual ~1 s between readings.
  const elapsedMs = reading.timestamp - previous.timestamp;
  const seconds = elapsedMs > 0 ? elapsedMs / 1000 : 1;
  return (meters - tolerance) / seconds > NAVIGATION_CONFIG.MAX_PLAUSIBLE_SPEED_METERS_PER_SECOND;
}

/**
 * A precise reading replacing an imprecise position in use (e.g. a network fix
 * indoors, then real GPS at the door). The precise one wins straight away, even if
 * it looks like a jump: otherwise alternating network/GPS readings could keep the
 * dot on the imprecise position.
 */
function isMuchMoreAccurate(current: GpsFix, reading: GpsFix): boolean {
  return (
    reading.accuracyMeters <= NAVIGATION_CONFIG.LOW_ACCURACY_METERS &&
    current.accuracyMeters > NAVIGATION_CONFIG.LOW_ACCURACY_METERS
  );
}

/** Two readings that agree on where the walker is (within both accuracies). */
function agree(a: GpsFix, b: GpsFix): boolean {
  return (
    distanceInMeters(a.coordinates, b.coordinates) <=
    a.accuracyMeters + b.accuracyMeters + NAVIGATION_CONFIG.JUMP_TOLERANCE_METERS
  );
}

/**
 * Pure: the tracking state after one more GPS reading.
 *
 * Real GPS is noisy, so a reading is only used when it is new, accurate enough
 * and plausible (see NAVIGATION_CONFIG). Arrival and off-route still need
 * several readings in a row, so one bad reading can't move the game on.
 */
export function trackFix(
  state: NavigationTracking,
  reading: GpsFix,
  route: WalkingRoute | null,
  destination: GeoCoordinates | null,
): NavigationTracking {
  // The very same (cached) reading again adds no information and must not count
  // twice, towards arrival or to confirm a jump. (Only exact repeats are dropped:
  // some devices repeat or step back timestamps for genuinely new positions.)
  if (isSameReading(state.fix, reading) || isSameReading(state.pendingJump, reading)) return state;

  const withLatest = { ...state, latestAccuracyMeters: reading.accuracyMeters };

  // Far too inaccurate to show or steer by (still reported as "GPS weak").
  // A bad reading also breaks a run of arrival readings.
  if (reading.accuracyMeters > NAVIGATION_CONFIG.UNUSABLE_ACCURACY_METERS) {
    return { ...withLatest, arrivalCount: 0 };
  }

  // A sudden jump is held back until a second, different reading confirms it,
  // unless it is a precise reading replacing an imprecise position.
  if (state.fix && isImplausibleJump(state.fix, reading) && !isMuchMoreAccurate(state.fix, reading)) {
    const isConfirmed = state.pendingJump !== null && agree(state.pendingJump, reading);
    if (!isConfirmed) return { ...withLatest, pendingJump: reading, arrivalCount: 0 };
  }

  if (state.arrived) return { ...withLatest, fix: reading, pendingJump: null };

  // Arrival needs readings at different moments: one with the same (or an earlier)
  // time as the previous one updates the position but isn't a new confirmation.
  const isNewMoment = !state.fix || reading.timestamp > state.fix.timestamp;
  const arrivalCount = !destination
    ? 0
    : isNewMoment
      ? nextArrivalCount(state.arrivalCount, reading, destination)
      : Math.min(state.arrivalCount, nextArrivalCount(state.arrivalCount, reading, destination));
  const distanceFromRouteMeters = route
    ? projectOntoRoute(reading.coordinates, route.geometry).distanceFromRouteMeters
    : null;
  const offRouteCount =
    distanceFromRouteMeters !== null
      ? nextOffRouteCount(state.offRouteCount, distanceFromRouteMeters, reading.accuracyMeters)
      : 0;
  const farFromRouteCount =
    distanceFromRouteMeters !== null && distanceFromRouteMeters > NAVIGATION_CONFIG.FAR_FROM_ROUTE_METERS
      ? state.farFromRouteCount + 1
      : 0;

  return {
    fix: reading,
    latestAccuracyMeters: reading.accuracyMeters,
    pendingJump: null,
    arrivalCount,
    offRouteCount,
    farFromRouteCount,
    arrived: hasArrived(arrivalCount),
  };
}

export function isLowAccuracy(fix: GpsFix | null): boolean {
  return fix !== null && fix.accuracyMeters > NAVIGATION_CONFIG.LOW_ACCURACY_METERS;
}

/** "GPS weak": judged on the most recent reading, also when it wasn't usable. */
export function hasWeakSignal(tracking: NavigationTracking): boolean {
  return (
    tracking.latestAccuracyMeters !== null &&
    tracking.latestAccuracyMeters > NAVIGATION_CONFIG.LOW_ACCURACY_METERS
  );
}
