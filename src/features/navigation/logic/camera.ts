import { distanceInMeters } from "@/lib/geo";
import type { GeoCoordinates } from "@/types/common";

/**
 * How the camera frames the walker:
 * - "overview": far from the destination, walker + destination in view, north-up;
 * - "north-up" / "follow-direction": the map mode the walker chose.
 */
export type CameraMode = "overview" | "north-up" | "follow-direction";

/** Where the map camera was last pointed while following the walker. */
export interface CameraTarget {
  position: GeoCoordinates;
  bearing: number;
  mode: CameraMode;
}

/** Smaller moves than these don't move the camera (saves battery, stops jitter). */
export const CAMERA_MIN_MOVE_METERS = 4;
export const CAMERA_MIN_TURN_DEGREES = 10;

/** Smallest angle between two bearings, 0–180°. */
function bearingDifference(a: number, b: number): number {
  const difference = Math.abs(a - b) % 360;
  return difference > 180 ? 360 - difference : difference;
}

/**
 * Pure: should the camera move for this new target? GPS readings arrive about
 * once a second; re-animating the map for every centimetre of noise drains the
 * battery on a full-day walk and makes the map jitter. A change of mode (e.g. the
 * walker taps "north up") always moves it, however small the angle.
 */
export function shouldMoveCamera(previous: CameraTarget | null, next: CameraTarget): boolean {
  if (!previous) return true;
  if (previous.mode !== next.mode) return true;
  if (distanceInMeters(previous.position, next.position) >= CAMERA_MIN_MOVE_METERS) return true;
  return bearingDifference(previous.bearing, next.bearing) >= CAMERA_MIN_TURN_DEGREES;
}
