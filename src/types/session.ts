/**
 * Where the walker is at one stop. The normal flow is:
 *
 *   locked → travelling → arrived → (story) → solved
 *
 * "story" is used by stops that open their page only after a step on site
 * (e.g. a "find it yourself" task); other stops go straight from "arrived" to
 * "solved" when the walker moves on.
 * "Walk completed" is not a stop status: see `WalkSession.completedAt`.
 */
export type LocationStatus = "locked" | "travelling" | "arrived" | "story" | "solved";

export interface LocationProgress {
  status: LocationStatus;
}

/** One play-through of one walk. Plain data, so it can be saved. */
export interface WalkSession {
  id: string;
  walkSlug: string;
  /** ISO timestamps (not a running timer), so the duration survives reloads. */
  startedAt: string;
  completedAt?: string;
  currentLocationId: string;
  locations: Record<string, LocationProgress>;
}

/**
 * Everything that can happen during a walk. Actions are plain, serializable
 * objects. Anything time-based (timestamps) is decided BEFORE dispatching and
 * included in the action, so applying the same actions always gives the same state.
 */
export type SessionAction =
  | { type: "ARRIVE" }
  | { type: "SHOW_STORY" }
  | { type: "COMPLETE_VISIT" }
  /** `skipBonus`: pass over optional (bonus) stops, e.g. "continue the route" instead of a detour. */
  | { type: "CONTINUE_TO_NEXT_LOCATION"; at: string; skipBonus?: boolean };
