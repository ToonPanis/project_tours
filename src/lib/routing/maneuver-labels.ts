import type { Maneuver } from "@/types/navigation";

/** Short, glanceable instruction text per maneuver (our own wording, not the provider's). */
const labels: Record<Maneuver, string> = {
  depart: "Start walking",
  straight: "Continue straight",
  "slight-left": "Bear left",
  left: "Turn left",
  "sharp-left": "Sharp left",
  "slight-right": "Bear right",
  right: "Turn right",
  "sharp-right": "Sharp right",
  "keep-left": "Keep left",
  "keep-right": "Keep right",
  "u-turn": "Turn around",
  roundabout: "Take the roundabout",
  arrive: "Destination ahead",
};

export function getManeuverLabel(maneuver: Maneuver): string {
  return labels[maneuver];
}
