import type { DirectionInstruction } from "../components/DirectionPanel";
import { NAVIGATION_CONFIG } from "../config";
import type { CompassPoint } from "./compass";

/**
 * When a screen reader should read the direction again. The panel changes
 * about once a second (every GPS reading); reading it that often drowns out
 * everything else. So it's only read when the step changes (a new turn, back
 * to the route, a new compass direction) or when the walker comes within
 * 100, 50 or 20 m of the next turn, and when the turn is "now".
 * Pure logic, so it can be tested without a browser.
 */
export type DistanceBand = "far" | "100" | "50" | "20" | "now";

export interface SpokenDirection {
  /** The instruction without its distance, e.g. "maneuver:left:Wolstraat". */
  step: string;
  band: DistanceBand;
}

/** Closest first: a band later in this list is further away. */
const BANDS_BY_DISTANCE: readonly DistanceBand[] = ["now", "20", "50", "100", "far"];

function getDistanceBand(distanceMeters: number): DistanceBand {
  if (distanceMeters <= NAVIGATION_CONFIG.MANEUVER_NOW_METERS) return "now";
  if (distanceMeters <= 20) return "20";
  if (distanceMeters <= 50) return "50";
  if (distanceMeters <= 100) return "100";
  return "far";
}

function getStep(instruction: DirectionInstruction, compassPoint: CompassPoint | null): string {
  switch (instruction.kind) {
    case "maneuver":
      return `maneuver:${instruction.maneuver}:${instruction.streetName ?? ""}`;
    case "back-to-route":
      return "back-to-route";
    case "head-to-destination":
      return `head-to:${instruction.destinationName}:${compassPoint ?? ""}`;
    case "waiting-for-gps":
      return "waiting-for-gps";
  }
}

/**
 * What should be spoken now. Returns `previous` itself when nothing new needs
 * to be read, so the caller can compare with `!==`.
 * A band never moves further away within the same step: GPS noise around 50 m
 * must not make the reader say "in 60 m" and "in 50 m" in turns.
 */
export function getSpokenDirection(
  instruction: DirectionInstruction,
  compassPoint: CompassPoint | null,
  previous: SpokenDirection | null,
): SpokenDirection {
  const step = getStep(instruction, compassPoint);
  let band: DistanceBand = instruction.kind === "maneuver" ? getDistanceBand(instruction.distanceMeters) : "far";

  if (previous?.step === step) {
    const isFurther = BANDS_BY_DISTANCE.indexOf(band) > BANDS_BY_DISTANCE.indexOf(previous.band);
    if (isFurther) band = previous.band;
    if (band === previous.band) return previous;
  }
  return { step, band };
}
