import type { FinaleProgress, LocationProgress, LocationStatus, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

/**
 * Where a walk session is saved. Today: the browser's localStorage.
 * Later a database-backed store can implement the same interface.
 */
export interface WalkSessionStore {
  load(walk: Walk): WalkSession | null;
  save(session: WalkSession): void;
  clear(walkSlug: string): void;
}

/** Bump this when the WalkSession shape changes; older saves are then ignored. */
export const STORAGE_VERSION = 2;

interface SavedSession {
  version: number;
  savedAt: string;
  session: WalkSession;
}

export function storageKey(walkSlug: string): string {
  return `hidden-antwerp:playtest:${walkSlug}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const LOCATION_STATUSES: readonly LocationStatus[] = [
  "locked",
  "travelling",
  "arrived",
  "voting",
  "drink-selected",
  "story",
  "challenge",
  "solved",
];
const BONUS_STATUSES: readonly LocationProgress["bonusStatus"][] = ["unanswered", "solved", "skipped"];
const FINALE_STATUSES: readonly FinaleProgress["status"][] = ["locked", "active", "solved"];

const isCount = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 0;
const isStringArray = (value: unknown) => Array.isArray(value) && value.every((item) => typeof item === "string");

/** Every field the game screens read from one stop's progress (a damaged value could crash them). */
function isLocationProgress(value: unknown): boolean {
  return (
    isObject(value) &&
    LOCATION_STATUSES.includes(value.status as LocationStatus) &&
    Array.isArray(value.votes) &&
    value.votes.every(
      (vote) => isObject(vote) && typeof vote.playerId === "string" && typeof vote.drinkOptionId === "string",
    ) &&
    (value.selectedDrinkOptionId === undefined || typeof value.selectedDrinkOptionId === "string") &&
    typeof value.drinkRoundSkipped === "boolean" &&
    typeof value.wasTie === "boolean" &&
    isCount(value.wrongAttempts) &&
    isCount(value.hintsRevealed) &&
    BONUS_STATUSES.includes(value.bonusStatus as LocationProgress["bonusStatus"]) &&
    isCount(value.bonusWrongAttempts)
  );
}

function isFinaleProgress(value: unknown): boolean {
  return (
    isObject(value) &&
    FINALE_STATUSES.includes(value.status as FinaleProgress["status"]) &&
    isStringArray(value.solvedQuestionIds) &&
    isObject(value.wrongAttemptsByQuestion) &&
    Object.values(value.wrongAttemptsByQuestion).every(isCount)
  );
}

function isPlayer(value: unknown): boolean {
  return isObject(value) && typeof value.id === "string" && typeof value.name === "string";
}

/**
 * Checks that saved data still fits the current walk. A save from an older
 * version, one that refers to stops that no longer exist, or one with damaged
 * values is rejected, so changing the walk data (or a corrupted save) can never
 * crash a saved game: the player simply starts fresh.
 */
export function parseSavedSession(walk: Walk, raw: unknown): WalkSession | null {
  if (!isObject(raw) || raw.version !== STORAGE_VERSION || !isObject(raw.session)) return null;

  const session = raw.session as Partial<WalkSession>;
  const walkLocationIds = walk.locations.map((location) => location.id);

  const isValid =
    session.walkSlug === walk.slug &&
    typeof session.startedAt === "string" &&
    typeof session.currentLocationId === "string" &&
    walkLocationIds.includes(session.currentLocationId) &&
    typeof session.id === "string" &&
    (session.completedAt === undefined || typeof session.completedAt === "string") &&
    isObject(session.locations) &&
    walkLocationIds.every((id) => isLocationProgress(session.locations?.[id])) &&
    isStringArray(session.collectedClueIds) &&
    // A walk with a final puzzle needs its progress; a walk without one has none.
    (walk.finale ? isFinaleProgress(session.finale) : session.finale === null) &&
    isObject(session.team) &&
    typeof session.team.name === "string" &&
    Array.isArray(session.team.players) &&
    session.team.players.length > 0 &&
    session.team.players.every(isPlayer);

  return isValid ? (session as WalkSession) : null;
}

/**
 * localStorage implementation. Every call is wrapped in try/catch because
 * storage can be unavailable (e.g. some private browsing modes) or full.
 */
export const localWalkSessionStore: WalkSessionStore = {
  load(walk) {
    try {
      const json = window.localStorage.getItem(storageKey(walk.slug));
      if (!json) return null;
      return parseSavedSession(walk, JSON.parse(json));
    } catch {
      return null;
    }
  },

  save(session) {
    const saved: SavedSession = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      session,
    };
    try {
      window.localStorage.setItem(storageKey(session.walkSlug), JSON.stringify(saved));
    } catch {
      // Saving failed (e.g. storage full). The game keeps working in memory.
    }
  },

  clear(walkSlug) {
    try {
      window.localStorage.removeItem(storageKey(walkSlug));
    } catch {
      // Nothing to clear.
    }
  },
};
