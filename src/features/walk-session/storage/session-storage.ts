import type { FinaleProgress, LocationProgress, LocationStatus, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { reconcileSessionWithWalk } from "../logic/reconcile-session";

/**
 * Where a walk session is saved. Today: the browser's localStorage.
 * Later a database-backed store can implement the same interface.
 */
export interface WalkSessionStore {
  load(walk: Walk): WalkSession | null;
  save(session: WalkSession): void;
  clear(walkSlug: string): void;
}

/**
 * Bump this when the WalkSession shape changes, and add a step to `migrateToCurrent`
 * so saves from the previous version keep working (a group mid-walk keeps its game).
 * Versions without a migration step are ignored (fresh start).
 *
 * 3: LocationProgress.answerRevealed (show the answer after a few wrong attempts).
 */
export const STORAGE_VERSION = 3;

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
    typeof value.answerRevealed === "boolean" &&
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
 * Brings a saved session from an older storage version up to the current shape.
 * Returns null for versions that can't be migrated.
 */
function migrateToCurrent(version: unknown, session: Record<string, unknown>): Record<string, unknown> | null {
  if (version === STORAGE_VERSION) return session;
  if (version === 2) {
    // 2 → 3: every stop gets `answerRevealed: false` (nobody could reveal answers before).
    if (!isObject(session.locations)) return null;
    const locations = Object.fromEntries(
      Object.entries(session.locations).map(([id, progress]) => [
        id,
        isObject(progress) ? { answerRevealed: false, ...progress } : progress,
      ]),
    );
    return { ...session, locations };
  }
  return null;
}

/**
 * Reads a saved game for this walk: migrates older versions, rejects damaged
 * data, then adapts it to the walk's current stops (game rule, see
 * logic/reconcile-session.ts). A corrupted save can never crash the game:
 * the player simply starts fresh.
 */
export function parseSavedSession(walk: Walk, raw: unknown): WalkSession | null {
  if (!isObject(raw) || !isObject(raw.session)) return null;
  const session = migrateToCurrent(raw.version, raw.session);
  return session && isWellFormedSession(walk, session) ? reconcileSessionWithWalk(walk, session) : null;
}

/**
 * True when saved data has the shape the game screens rely on (a damaged value
 * could crash them). Stops that the save doesn't know yet are allowed to be
 * missing: reconcileSessionWithWalk adds them.
 */
function isWellFormedSession(walk: Walk, candidate: Record<string, unknown>): candidate is Record<string, unknown> & WalkSession {
  const session = candidate as Partial<WalkSession>;
  const walkLocationIds = walk.locations.map((location) => location.id);

  return (
    session.walkSlug === walk.slug &&
    typeof session.startedAt === "string" &&
    typeof session.id === "string" &&
    (session.completedAt === undefined || typeof session.completedAt === "string") &&
    typeof session.currentLocationId === "string" &&
    walkLocationIds.includes(session.currentLocationId) &&
    isObject(session.locations) &&
    // The stop the team is at must have real progress; other stops may be missing (new stops).
    isLocationProgress(session.locations[session.currentLocationId]) &&
    walkLocationIds.every((id) => session.locations?.[id] === undefined || isLocationProgress(session.locations[id])) &&
    isStringArray(session.collectedClueIds) &&
    (session.finale === null || session.finale === undefined || isFinaleProgress(session.finale)) &&
    isObject(session.team) &&
    typeof session.team.name === "string" &&
    Array.isArray(session.team.players) &&
    session.team.players.length > 0 &&
    session.team.players.every(isPlayer)
  );
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
