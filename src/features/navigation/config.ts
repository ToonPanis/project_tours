/**
 * All navigation thresholds in one place. Tune these after playtesting.
 */
export const NAVIGATION_CONFIG = {
  /** Within this distance of a location (and with good accuracy) the team has arrived. */
  ARRIVAL_RADIUS_METERS: 40,
  /** GPS readings less accurate than this never trigger arrival. */
  MAX_ACCURACY_FOR_ARRIVAL_METERS: 40,
  /** How many good readings in a row are needed to confirm arrival. */
  ARRIVAL_CONFIRMATIONS: 2,

  /**
   * "I'm here" is always available (a pin can be unreachable, GPS can be wrong).
   * With a good GPS fix farther than this from the stop, it asks for confirmation
   * first, so an accidental tap doesn't skip ahead.
   */
  MANUAL_ARRIVAL_CONFIRM_METERS: 150,

  /** Show "GPS signal is weak" when accuracy is worse than this. */
  LOW_ACCURACY_METERS: 35,
  /**
   * Readings less accurate than this (e.g. a cell-tower position indoors) are not
   * used for the dot, the camera or the directions; they only show "GPS weak".
   */
  UNUSABLE_ACCURACY_METERS: 150,
  /**
   * Faster than this between two readings is a GPS jump, not walking. Such a reading
   * is held back until the next reading confirms it (a real move stays put).
   */
  MAX_PLAUSIBLE_SPEED_METERS_PER_SECOND: 10,
  /** Extra room (on top of both readings' accuracy) before a move counts as a jump. */
  JUMP_TOLERANCE_METERS: 20,
  /** Readings in a row that must be far from the route before we stop following it. */
  FAR_FROM_ROUTE_CONFIRMATIONS: 2,
  /** Below this speed the phone's reported heading is unreliable (standing still). */
  MIN_SPEED_FOR_HEADING_METERS_PER_SECOND: 0.8,

  /** Closer than this to a maneuver, the instruction becomes "… now". */
  MANEUVER_NOW_METERS: 15,

  /** Farther than this from the route line counts as off route (or the GPS accuracy, if larger). */
  OFF_ROUTE_METERS: 30,
  /** Readings in a row that must be off route before we say so (ignores GPS jumps). */
  OFF_ROUTE_CONFIRMATIONS: 3,
  /** Farther than this from the route, guide straight to the destination instead. */
  FAR_FROM_ROUTE_METERS: 150,

  /** Average walking speed used for time estimates without a route. */
  WALKING_SPEED_METERS_PER_SECOND: 1.3,
} as const;

/** The map style (tiles). OpenFreeMap: free, no key. Override via env if needed. */
export const MAP_STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL || "https://tiles.openfreemap.org/styles/liberty";

/** The folder MapLibre's web worker is served from (one subfolder per MapLibre version). */
export const MAP_WORKER_FOLDER = "/maplibre";

/**
 * Where the browser loads MapLibre's web worker from. The file is copied into
 * public/maplibre/<version>/ by scripts/copy-maplibre-worker.mjs (before dev/build).
 * Without it the map stays empty: see that script for the full explanation.
 *
 * The version is part of the path, so the file can be cached for a year
 * (next.config.ts): after a MapLibre upgrade the URL changes, and a phone can
 * never pair a cached old worker with the new library.
 */
export function mapWorkerUrl(maplibreVersion: string): string {
  return `${MAP_WORKER_FOLDER}/${maplibreVersion}/maplibre-gl-worker.mjs`;
}

/** Where the map looks before there is a route or GPS position: Antwerp's Grote Markt. */
export const ANTWERP_CENTER = { latitude: 51.2211, longitude: 4.3997 } as const;

/**
 * Farther than this from the destination, the map stays north-up instead of
 * turning with the walker (a far-away overview reads more easily unrotated).
 */
export const OVERVIEW_DISTANCE_METERS = 1000;
