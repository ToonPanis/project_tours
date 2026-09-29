import { englishTranslator, type Translator } from "@/i18n/translate";
import { getManeuverLabel } from "@/lib/routing/maneuver-labels";
import type { Maneuver } from "@/types/navigation";

/** Large, glanceable arrow per maneuver. */
const arrows: Record<Maneuver, string> = {
  depart: "↑",
  straight: "↑",
  "slight-left": "↖",
  left: "←",
  "sharp-left": "↙",
  "slight-right": "↗",
  right: "→",
  "sharp-right": "↘",
  "keep-left": "↖",
  "keep-right": "↗",
  "u-turn": "↶",
  roundabout: "↻",
  arrive: "★",
};

export function getManeuverArrow(maneuver: Maneuver): string {
  return arrows[maneuver];
}

/** "Turn right" → "Turn right now" when the walker is at the maneuver. */
export function getImmediateLabel(maneuver: Maneuver): string {
  if (maneuver === "arrive") return "You're almost there";
  if (maneuver === "straight" || maneuver === "depart") return "Continue straight";
  return `${getManeuverLabel(maneuver)} now`;
}

/** 734 → "730 m", 1234 → "1.2 km" ("1,2 km" in Dutch), 8 → "10 m" (rounded; GPS isn't more precise). */
export function formatWalkingDistance(meters: number, t: Translator = englishTranslator): string {
  if (meters >= 1000) {
    const kilometers = new Intl.NumberFormat(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(meters / 1000);
    return t("common.units.kilometers", { value: kilometers });
  }
  const rounded = meters < 100 ? Math.max(10, Math.round(meters / 5) * 5) : Math.round(meters / 10) * 10;
  return t("common.units.meters", { value: rounded });
}

/** 510 seconds → "9 min walk" (at least 1 minute). */
export function formatWalkingTime(seconds: number, t: Translator = englishTranslator): string {
  return t("gps.minWalk", { minutes: Math.max(1, Math.round(seconds / 60)) });
}
