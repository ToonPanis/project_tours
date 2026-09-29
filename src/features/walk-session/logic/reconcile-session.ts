import type { LocationProgress, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { createFinaleProgress, createLocationProgress } from "./create-session";

/**
 * Adapts a (well-formed) session to the walk's current data. Needed when the
 * walk's stops changed since the game started, e.g. a content update during the day:
 * the group keeps its game instead of starting over.
 *
 * - A new stop is added as not yet visited ("locked"). The walk only moves forward,
 *   so a new stop BEFORE the group's current stop is not visited on this play-through.
 * - A removed stop, and the clues it gave, are dropped.
 * - A walk that gained a final puzzle gets one (locked until the last stop), unless
 *   the game is already completed; a walk that lost it loses the progress.
 *
 * Returns null (start fresh) only when the stop the group is at right now was removed.
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

  // Clues: only ones that still exist.
  const knownClueIds = new Set((walk.clues ?? []).map((clue) => clue.id));
  const collectedClueIds = session.collectedClueIds.filter((id) => knownClueIds.has(id));
  const cluesChanged = collectedClueIds.length !== session.collectedClueIds.length;

  // Final puzzle: present when the walk has one (a completed game keeps what it had).
  const currentFinale = session.finale ?? null;
  const finale = !walk.finale
    ? null
    : (currentFinale ?? (session.completedAt ? null : createFinaleProgress()));
  const finaleChanged = finale !== session.finale;

  if (!stopsChanged && !cluesChanged && !finaleChanged) return session;
  return { ...session, locations, collectedClueIds, finale };
}
