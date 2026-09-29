/**
 * Translates OSRM route data (as saved by scripts/generate-walking-routes.mjs)
 * into our own WalkingRoute format. This is the only file that knows OSRM's
 * vocabulary; to use another routing provider, write another adapter.
 */
import type { GeoCoordinates } from "@/types/common";
import type { Maneuver, NavigationStep, WalkingRoute } from "@/types/navigation";
import { getManeuverLabel } from "./maneuver-labels";

/** The subset of an OSRM route that the generator script saves. */
export interface SavedOsrmRoute {
  distance: number;
  duration: number;
  /** [longitude, latitude] pairs, GeoJSON order. */
  geometry: [number, number][];
  steps: {
    distance: number;
    name: string;
    type: string;
    modifier: string | null;
    location: [number, number];
  }[];
}

function toCoordinates([longitude, latitude]: [number, number]): GeoCoordinates {
  return { latitude, longitude };
}

const modifierToManeuver: Record<string, Maneuver> = {
  straight: "straight",
  "slight left": "slight-left",
  left: "left",
  "sharp left": "sharp-left",
  "slight right": "slight-right",
  right: "right",
  "sharp right": "sharp-right",
  uturn: "u-turn",
};

/** OSRM step type + modifier → our Maneuver. */
export function toManeuver(type: string, modifier: string | null): Maneuver {
  if (type === "depart") return "depart";
  if (type === "arrive") return "arrive";
  if (type === "roundabout" || type === "rotary" || type === "exit roundabout") return "roundabout";
  // "fork" and "merge" are about keeping to a side, not a full turn.
  if ((type === "fork" || type === "merge") && modifier?.includes("left")) return "keep-left";
  if ((type === "fork" || type === "merge") && modifier?.includes("right")) return "keep-right";
  return (modifier && modifierToManeuver[modifier]) || "straight";
}

export function normalizeOsrmRoute(saved: SavedOsrmRoute): WalkingRoute {
  let distanceFromStart = 0;

  const steps: NavigationStep[] = saved.steps.map((step) => {
    const maneuver = toManeuver(step.type, step.modifier);
    const navigationStep: NavigationStep = {
      maneuver,
      instruction: getManeuverLabel(maneuver),
      streetName: step.name || undefined,
      location: toCoordinates(step.location),
      distanceFromStartMeters: distanceFromStart,
      distanceMeters: step.distance,
    };
    distanceFromStart += step.distance;
    return navigationStep;
  });

  return {
    distanceMeters: saved.distance,
    durationSeconds: saved.duration,
    geometry: saved.geometry.map(toCoordinates),
    steps,
  };
}
