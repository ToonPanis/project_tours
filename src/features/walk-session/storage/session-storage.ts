import type { LocationStatus, WalkSession } from "@/types/session";
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
 * so saves from the previous version keep working (a walker mid-walk keeps their progress).
 * Versions without a migration step are ignored (fresh start).
 *
 * 3: LocationProgress.answerRevealed (show the answer after a few wrong attempts).
 * 4: the one-phone game was removed: no team, clues, finale, votes or answers any more;
 *    a stop's progress is only its status.
 */
export const STORAGE_VERSION = 4;

interface SavedSession {
  version: number;
  savedAt: string;
  session: WalkSession;
}

/**
 * The localStorage key of a saved walk. "playtest" in it is historical (the app
 * started as a playtest). Never rename it without a migration step: every saved
 * walk in the field is stored under it.
 */
export function storageKey(walkSlug: string): string {
  return `hidden-antwerp:playtest:${walkSlug}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const LOCATION_STATUSES: readonly LocationStatus[] = ["locked", "travelling", "arrived", "story", "solved"];

/** One stop's progress, exactly as the screens read it (a damaged value could crash them). */
function isLocationProgress(value: unknown): boolean {
  return isObject(value) && LOCATION_STATUSES.includes(value.status as LocationStatus);
}

/**
 * Version 2/3 saves → version 4: keeps where the walker is, drops the game fields.
 * Guide walks only ever used the statuses that still exist; the game-only ones
 * ("voting", "drink-selected", "challenge") become "arrived" (at the stop, not done yet).
 */
function migrateGameSession(session: Record<string, unknown>): Record<string, unknown> | null {
  if (!isObject(session.locations)) return null;
  const locations = Object.fromEntries(
    Object.entries(session.locations).map(([id, progress]) => {
      if (!isObject(progress)) return [id, progress];
      const status = LOCATION_STATUSES.includes(progress.status as LocationStatus) ? progress.status : "arrived";
      return [id, { status }];
    }),
  );
  // Leave out team, collectedClueIds and finale.
  const { id, walkSlug, startedAt, completedAt, currentLocationId } = session;
  return { id, walkSlug, startedAt, ...(completedAt === undefined ? {} : { completedAt }), currentLocationId, locations };
}

/**
 * Brings a saved session from an older storage version up to the current shape.
 * Returns null for versions that can't be migrated.
 */
function migrateToCurrent(version: unknown, session: Record<string, unknown>): Record<string, unknown> | null {
  if (version === STORAGE_VERSION) return session;
  // 2 and 3 only differed in a game field (answerRevealed) that version 4 drops anyway.
  if (version === 2 || version === 3) return migrateGameSession(session);
  return null;
}

/**
 * Reads a saved walk: migrates older versions, rejects damaged
 * data, then adapts it to the walk's current stops (see
 * logic/reconcile-session.ts). A corrupted save can never crash the walk:
 * the walker simply starts fresh.
 */
export function parseSavedSession(walk: Walk, raw: unknown): WalkSession | null {
  if (!isObject(raw) || !isObject(raw.session)) return null;
  const session = migrateToCurrent(raw.version, raw.session);
  return session && isWellFormedSession(walk, session) ? reconcileSessionWithWalk(walk, session) : null;
}

/**
 * True when saved data has the shape the screens rely on (a damaged value
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
    walkLocationIds.every((id) => session.locations?.[id] === undefined || isLocationProgress(session.locations[id]))
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
      // Saving failed (e.g. storage full). The walk keeps working in memory.
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
