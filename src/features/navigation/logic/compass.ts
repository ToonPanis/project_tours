import type { GpsFix } from "@/types/navigation";
import { NAVIGATION_CONFIG } from "../config";

export type CompassPoint = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const COMPASS_POINTS: readonly CompassPoint[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

/** The nearest of the 8 compass points for a bearing (0 = north, 90 = east). */
export function toCompassPoint(bearingDegrees: number): CompassPoint {
  const normalized = ((bearingDegrees % 360) + 360) % 360;
  return COMPASS_POINTS[Math.round(normalized / 45) % 8];
}

/** How far past a sector edge the bearing must go before the shown direction changes. */
const COMPASS_HYSTERESIS_DEGREES = 10;

/**
 * Like toCompassPoint, but keeps the direction already shown until the bearing is
 * clearly in another sector, so GPS noise near a boundary (e.g. 22°/23°) doesn't
 * make the text flip back and forth (screen readers would announce every flip).
 */
export function toStableCompassPoint(bearingDegrees: number, shown: CompassPoint | null): CompassPoint {
  if (shown !== null) {
    const center = COMPASS_POINTS.indexOf(shown) * 45;
    const difference = Math.abs(((bearingDegrees - center + 540) % 360) - 180);
    if (difference <= 22.5 + COMPASS_HYSTERESIS_DEGREES) return shown;
  }
  return toCompassPoint(bearingDegrees);
}

/**
 * The walker's direction of travel, but only when the phone reports it while
 * actually moving (standing still, the reported heading is meaningless).
 */
export function getTravelHeading(fix: GpsFix): number | null {
  const isMoving =
    fix.speedMetersPerSecond !== null && fix.speedMetersPerSecond >= NAVIGATION_CONFIG.MIN_SPEED_FOR_HEADING_METERS_PER_SECOND;
  return isMoving && fix.headingDegrees !== null ? fix.headingDegrees : null;
}

/**
 * How far to turn the direction arrow. With a travel heading: relative to where
 * the walker is going (0 = straight ahead). Without one: the compass bearing,
 * which matches the map, because the map is north-up in this mode.
 */
export function getArrowRotation(bearingToDestination: number, travelHeading: number | null): number {
  const rotation = travelHeading === null ? bearingToDestination : bearingToDestination - travelHeading;
  return ((rotation % 360) + 360) % 360;
}
