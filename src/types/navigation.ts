import type { GeoCoordinates } from "./common";

/** The kind of move a walker makes at a navigation step. Provider-independent. */
export type Maneuver =
  | "depart"
  | "straight"
  | "slight-left"
  | "left"
  | "sharp-left"
  | "slight-right"
  | "right"
  | "sharp-right"
  | "keep-left"
  | "keep-right"
  | "u-turn"
  | "roundabout"
  | "arrive";

export interface NavigationStep {
  maneuver: Maneuver;
  /** Short instruction, e.g. "Turn right". */
  instruction: string;
  /** Street you walk on after this step, if known. */
  streetName?: string;
  /** Where the maneuver happens. */
  location: GeoCoordinates;
  /** Route distance from the start to this maneuver. */
  distanceFromStartMeters: number;
  /** Length of the stretch after this maneuver, up to the next one. */
  distanceMeters: number;
}

/** A walking route in our own format, whatever routing provider made it. */
export interface WalkingRoute {
  distanceMeters: number;
  durationSeconds: number;
  /** The route line, from start to destination. */
  geometry: GeoCoordinates[];
  steps: NavigationStep[];
}

/** A pre-calculated route between two consecutive locations of a walk. */
export interface RouteLeg {
  fromLocationId: string;
  toLocationId: string;
  route: WalkingRoute;
}

/** One reading from the phone's GPS. Kept in memory only, never stored. */
export interface GpsFix {
  coordinates: GeoCoordinates;
  /** Accuracy radius in meters (smaller is better). */
  accuracyMeters: number;
  /** Direction of travel in degrees from north, if the device reports it. */
  headingDegrees: number | null;
  /** Speed in meters per second, if the device reports it. */
  speedMetersPerSecond: number | null;
  timestamp: number;
}

export type GpsStatus =
  | "idle"
  | "requesting-permission"
  | "active"
  | "low-accuracy"
  | "permission-denied"
  /** No position yet within the browser's time limit (e.g. indoors); the watch keeps trying. */
  | "searching"
  | "unavailable";
