import type { Team, Vote } from "./team";

/**
 * Where a team is at one location. The normal flow is:
 *
 *   locked → travelling → arrived → (voting → drink-selected) → challenge → solved
 *
 * The voting steps only happen at locations with a drink round.
 * "Walk completed" is not a location status: see `WalkSession.completedAt`.
 */
export type LocationStatus =
  | "locked"
  | "travelling"
  | "arrived"
  | "voting"
  | "drink-selected"
  | "challenge"
  | "solved";

export interface LocationProgress {
  status: LocationStatus;
  votes: Vote[];
  /** The winning drink. Undefined when there was no vote or the round was skipped. */
  selectedDrinkOptionId?: string;
  drinkRoundSkipped: boolean;
  /** True when the winner was chosen randomly between tied options. */
  wasTie: boolean;
  wrongAttempts: number;
  hintsRevealed: number;
}

/** One team's play-through of one walk. Plain data, so it can be saved or synced. */
export interface WalkSession {
  id: string;
  walkSlug: string;
  team: Team;
  /** ISO timestamps (not a running timer), so the duration survives reloads. */
  startedAt: string;
  completedAt?: string;
  currentLocationId: string;
  locations: Record<string, LocationProgress>;
  collectedClueIds: string[];
}

/** A submitted answer: text for most challenges, an ordering for sequence challenges. */
export type ChallengeAnswer = string | number[];

/**
 * Everything that can happen during a walk. Actions are plain, serializable
 * objects: today they're applied locally, later they can be sent to a server
 * and broadcast to every team member's phone.
 *
 * Anything random or time-based (tie-break winner, timestamps) is decided
 * BEFORE dispatching and included in the action, so every device that applies
 * the same actions ends up with exactly the same state.
 */
export type SessionAction =
  | { type: "ARRIVE" }
  | { type: "START_VOTING" }
  | { type: "CAST_VOTE"; playerId: string; drinkOptionId: string }
  | { type: "CLOSE_VOTING"; winnerOptionId: string; wasTie: boolean }
  | { type: "SKIP_DRINK_ROUND" }
  | { type: "START_CHALLENGE" }
  | { type: "SUBMIT_ANSWER"; answer: ChallengeAnswer }
  | { type: "REVEAL_HINT" }
  | { type: "CONTINUE_TO_NEXT_LOCATION"; at: string };
