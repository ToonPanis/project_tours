import type { Translator } from "@/i18n/translate";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getOrderedLocations } from "@/lib/walk-locations";

export interface SessionStats {
  /** 1-based number of the current stop, counting main stops only. */
  currentStopNumber: number;
  /** Main stops only: optional bonus stops don't count towards progress. */
  totalStops: number;
  solvedStops: number;
  /** True while the walker is at (or on the way to) an optional bonus stop. */
  isAtBonusStop: boolean;
  collectedClues: number;
  totalClues: number;
  challengesCompleted: number;
}

export function getSessionStats(walk: Walk, session: WalkSession): SessionStats {
  const orderedLocations = getOrderedLocations(walk);
  const mainLocations = orderedLocations.filter((location) => !location.isBonus);
  const solvedLocations = orderedLocations.filter(
    (location) => session.locations[location.id]?.status === "solved",
  );
  const currentIndex = orderedLocations.findIndex((location) => location.id === session.currentLocationId);
  const currentLocation = orderedLocations[currentIndex];

  // Main stops up to and including the current one (a bonus stop keeps the previous number).
  const mainStopsSoFar = orderedLocations
    .slice(0, currentIndex + 1)
    .filter((location) => !location.isBonus).length;

  return {
    currentStopNumber: Math.max(1, mainStopsSoFar),
    totalStops: mainLocations.length,
    solvedStops: solvedLocations.filter((location) => !location.isBonus).length,
    isAtBonusStop: currentLocation?.isBonus === true,
    collectedClues: session.collectedClueIds.length,
    totalClues: walk.clues?.length ?? 0,
    challengesCompleted: solvedLocations.filter((location) => location.challenge).length,
  };
}

/** 10_020_000 ms → "2h 47m", 300_000 ms → "5m" (in the translator's language). */
export function formatElapsedTime(milliseconds: number, t: Translator): string {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0
    ? t("common.units.elapsedHoursMinutes", { hours, minutes })
    : t("common.units.elapsedMinutes", { minutes });
}

/** "Tony, Sarah and Jan" / "Tony, Sarah en Jan": the team's names, joined the way the language does it. */
export function formatPlayerNames(players: { name: string }[], t: Translator): string {
  return new Intl.ListFormat(t.locale, { type: "conjunction" }).format(players.map((player) => player.name));
}

export function getElapsedTime(session: WalkSession, now: Date, t: Translator): string {
  const end = session.completedAt ? new Date(session.completedAt) : now;
  return formatElapsedTime(end.getTime() - new Date(session.startedAt).getTime(), t);
}
