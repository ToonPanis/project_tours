import type { GeoCoordinates } from "@/types/common";

const EARTH_RADIUS_IN_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Straight-line distance between two points (the "haversine" formula).
 * Used later for GPS arrival checks and "650 m to the next café".
 */
export function distanceInMeters(from: GeoCoordinates, to: GeoCoordinates): number {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_IN_METERS * Math.asin(Math.sqrt(a));
}
