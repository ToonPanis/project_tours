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

  /** Show "GPS signal is weak" when accuracy is worse than this. */
  LOW_ACCURACY_METERS: 35,

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

/**
 * Where the browser loads MapLibre's web worker from. The file is copied into
 * /public by scripts/copy-maplibre-worker.mjs (before dev/build). Without it
 * the map stays empty: see that script for the full explanation.
 */
export const MAP_WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

/** Where the map looks before there is a route or GPS position: Antwerp's Grote Markt. */
export const ANTWERP_CENTER = { latitude: 51.2211, longitude: 4.3997 } as const;

/**
 * Farther than this from the destination, the map stays north-up instead of
 * turning with the walker (a far-away overview reads more easily unrotated).
 */
export const OVERVIEW_DISTANCE_METERS = 1000;
