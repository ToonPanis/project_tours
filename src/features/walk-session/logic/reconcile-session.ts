import type { LocationProgress, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { createLocationProgress } from "./create-session";

/**
 * Adapts a (well-formed) session to the walk's current data. Needed when the
 * walk's stops changed since the walk started, e.g. a content update during the day:
 * the walker keeps their progress instead of starting over.
 *
 * - A new stop is added as not yet visited ("locked"). The walk only moves forward,
 *   so a new stop BEFORE the walker's current stop is not visited on this play-through.
 * - A removed stop is dropped.
 *
 * Returns null (start fresh) only when the stop the walker is at right now was removed.
 * Returns the very same object when nothing had to change (no extra React re-render).
 */
export function reconcileSessionWithWalk(walk: Walk, session: WalkSession): WalkSession | null {
  const walkLocationIds = walk.locations.map((location) => location.id);
  if (session.walkSlug !== walk.slug || !walkLocationIds.includes(session.currentLocationId)) return null;

  // Stops: exactly the walk's current stops.
  const locations: Record<string, LocationProgress> = {};
  for (const id of walkLocationIds) {
    locations[id] = session.locations[id] ?? createLocationProgress("locked");
  }
  const stopsChanged =
    walkLocationIds.some((id) => !session.locations[id]) ||
    Object.keys(session.locations).some((id) => !walkLocationIds.includes(id));

  if (!stopsChanged) return session;
  return { ...session, locations };
}
