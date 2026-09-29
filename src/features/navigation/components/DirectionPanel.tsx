import { englishTranslator, type Translator } from "@/i18n/translate";
import type { Maneuver } from "@/types/navigation";
import { formatWalkingDistance, getManeuverArrow } from "../logic/maneuver-display";
import { NAVIGATION_CONFIG } from "../config";

/** What the direction panel shows; decided by NavigationScreen. */
export type DirectionInstruction =
  | { kind: "maneuver"; maneuver: Maneuver; distanceMeters: number; streetName?: string }
  | { kind: "back-to-route"; distanceMeters: number }
  | { kind: "head-to-destination"; destinationName: string; distanceMeters: number }
  | { kind: "waiting-for-gps" };

interface DirectionPanelProps {
  instruction: DirectionInstruction;
  /** The maneuver after this one, for the "THEN" preview. */
  thenManeuver?: Maneuver;
  /** How far after the current maneuver the "THEN" maneuver comes. */
  thenAfterMeters?: number;
  /** Interface texts in the walk's language (English by default). */
  t?: Translator;
}

/** "Turn right" → "Turn right now" when the walker is at the maneuver. */
function getImmediateText(maneuver: Maneuver, t: Translator): string {
  if (maneuver === "arrive") return t("gps.almostThere");
  if (maneuver === "straight" || maneuver === "depart") return t("gps.continueStraight");
  return t("gps.now", { label: t(`gps.maneuvers.${maneuver}`) });
}

/**
 * The large, high-contrast arrow + short instruction. Designed to be read at
 * a glance while walking: deliberately plain, not decorative.
 */
export function DirectionPanel({ instruction, thenManeuver, thenAfterMeters, t = englishTranslator }: DirectionPanelProps) {
  let arrow = "↑";
  let label = "";
  let distance: string | null = null;
  let detail: string | undefined;

  switch (instruction.kind) {
    case "maneuver": {
      const isNow = instruction.distanceMeters <= NAVIGATION_CONFIG.MANEUVER_NOW_METERS;
      arrow = getManeuverArrow(instruction.maneuver);
      label = isNow ? getImmediateText(instruction.maneuver, t) : t(`gps.maneuvers.${instruction.maneuver}`);
      distance = isNow ? null : formatWalkingDistance(instruction.distanceMeters, t);
      detail = instruction.streetName;
      break;
    }
    case "back-to-route":
      arrow = "↩";
      label = t("gps.backToRoute");
      distance = formatWalkingDistance(instruction.distanceMeters, t);
      break;
    case "head-to-destination":
      arrow = "★";
      label = t("gps.headTo", { name: instruction.destinationName });
      distance = formatWalkingDistance(instruction.distanceMeters, t);
      break;
    case "waiting-for-gps":
      arrow = "…";
      label = t("gps.findingPosition");
      break;
  }

  return (
    <div className="flex items-center gap-4 bg-black px-4 py-3 text-white" aria-live="polite">
      <span aria-hidden="true" className="w-20 shrink-0 text-center text-7xl font-bold leading-none">
        {arrow}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold uppercase leading-tight tracking-wide">{label}</p>
        {distance && <p className="text-3xl font-bold tabular-nums text-yellow-300">{distance}</p>}
        {detail && <p className="truncate text-base text-white/80">{detail}</p>}
        {thenManeuver && instruction.kind === "maneuver" && thenManeuver !== "arrive" && (
          <p className="mt-1 text-sm uppercase tracking-wider text-white/70">
            {t("gps.then")} <span aria-hidden="true">{getManeuverArrow(thenManeuver)}</span>{" "}
            {t(`gps.maneuvers.${thenManeuver}`)}
            {thenAfterMeters !== undefined && ` ${t("gps.after", { distance: formatWalkingDistance(thenAfterMeters, t) })}`}
          </p>
        )}
      </div>
    </div>
  );
}
