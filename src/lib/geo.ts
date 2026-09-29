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

/** Compass direction from one point to another: 0 = north, 90 = east (0–360). */
export function bearingInDegrees(from: GeoCoordinates, to: GeoCoordinates): number {
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const y = Math.sin(longitudeDelta) * Math.cos(toLatitude);
  const x =
    Math.cos(fromLatitude) * Math.sin(toLatitude) -
    Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(longitudeDelta);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Points on a circle around `center` (a closed ring: the first point is repeated
 * at the end). Used to draw the GPS accuracy circle on the map.
 */
export function circleAround(center: GeoCoordinates, radiusMeters: number, steps = 48): GeoCoordinates[] {
  const metersPerDegreeLatitude = (EARTH_RADIUS_IN_METERS * Math.PI) / 180;
  const metersPerDegreeLongitude = metersPerDegreeLatitude * Math.cos(toRadians(center.latitude));
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = (2 * Math.PI * index) / steps;
    return {
      latitude: center.latitude + (radiusMeters * Math.cos(angle)) / metersPerDegreeLatitude,
      longitude: center.longitude + (radiusMeters * Math.sin(angle)) / metersPerDegreeLongitude,
    };
  });
}
