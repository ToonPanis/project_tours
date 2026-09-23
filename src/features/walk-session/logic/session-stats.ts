import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getOrderedLocations } from "./route";

export interface SessionStats {
  /** 1-based number of the current stop. */
  currentStopNumber: number;
  totalStops: number;
  solvedStops: number;
  collectedClues: number;
  totalClues: number;
  challengesCompleted: number;
}

export function getSessionStats(walk: Walk, session: WalkSession): SessionStats {
  const orderedLocations = getOrderedLocations(walk);
  const solvedLocations = orderedLocations.filter(
    (location) => session.locations[location.id]?.status === "solved",
  );

  return {
    currentStopNumber:
      orderedLocations.findIndex((location) => location.id === session.currentLocationId) + 1,
    totalStops: orderedLocations.length,
    solvedStops: solvedLocations.length,
    collectedClues: session.collectedClueIds.length,
    totalClues: walk.clues?.length ?? 0,
    challengesCompleted: solvedLocations.filter((location) => location.challenge).length,
  };
}

/** 10_020_000 ms → "2h 47m", 300_000 ms → "5m" */
export function formatElapsedTime(milliseconds: number): string {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function getElapsedTime(session: WalkSession, now: Date): string {
  const end = session.completedAt ? new Date(session.completedAt) : now;
  return formatElapsedTime(end.getTime() - new Date(session.startedAt).getTime());
}
