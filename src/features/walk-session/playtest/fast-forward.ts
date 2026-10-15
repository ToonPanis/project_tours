/**
 * PLAYTEST TOOLING: not part of the walk. Delete this folder to remove it.
 *
 * These helpers only produce NORMAL walk actions. The reducer ignores any that
 * don't apply, so no special "cheat" actions are needed and the rules stay untouched.
 */
import type { SessionAction, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getOrderedLocations } from "@/lib/walk-locations";

/** Takes the current stop from any status to "solved". */
function getSolveCurrentStopActions(): SessionAction[] {
  return [{ type: "ARRIVE" }, { type: "COMPLETE_VISIT" }];
}

/** Solves the current stop and moves on to the next one (or completes the walk). */
export function getUnlockNextActions(at: string): SessionAction[] {
  return [...getSolveCurrentStopActions(), { type: "CONTINUE_TO_NEXT_LOCATION", at }];
}

/** The single action that moves the walk one screen forward. */
export function getNextStageActions(session: WalkSession, at: string): SessionAction[] {
  const status = session.locations[session.currentLocationId]?.status;
  switch (status) {
    case "locked":
    case "travelling":
      return [{ type: "ARRIVE" }];
    case "arrived":
    case "story":
      return [{ type: "COMPLETE_VISIT" }];
    case "solved":
    case undefined:
      return [{ type: "CONTINUE_TO_NEXT_LOCATION", at }];
  }
}

/**
 * Actions that fast-forward a FRESH session (standing at stop 1) to the
 * start of stop `stopNumber` (1-based).
 */
export function getJumpToStopActions(walk: Walk, stopNumber: number, at: string): SessionAction[] {
  return getOrderedLocations(walk)
    .slice(0, stopNumber - 1)
    .flatMap(() => getUnlockNextActions(at));
}
