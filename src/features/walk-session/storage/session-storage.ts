import type { WalkSession } from "@/types/session";
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
export const STORAGE_VERSION = 1;

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

/**
 * Checks that saved data still fits the current walk. A save from an older
 * version, or one that refers to stops that no longer exist, is rejected, so
 * changing the walk data can never crash a saved game.
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
    isObject(session.locations) &&
    walkLocationIds.every((id) => isObject(session.locations?.[id])) &&
    Array.isArray(session.collectedClueIds) &&
    isObject(session.team) &&
    Array.isArray(session.team.players) &&
    session.team.players.length > 0;

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
