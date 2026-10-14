import type { LocationProgress, SessionAction, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getOrderedLocations } from "@/lib/walk-locations";

/**
 * All walk rules in one pure function: (walk, state, action) → new state.
 *
 * - It never mutates `session`; it returns a new object (like React state).
 * - Actions that don't fit the current status are ignored (the same state
 *   is returned), so double taps or stale actions can't break the walk.
 * - It never reads the clock; times come in via actions.
 */
export function applySessionAction(
  walk: Walk,
  session: WalkSession,
  action: SessionAction,
): WalkSession {
  if (session.completedAt) return session;

  const location = walk.locations.find((candidate) => candidate.id === session.currentLocationId);
  const progress = session.locations[session.currentLocationId];
  if (!location || !progress) return session;

  /** Returns a new session with the current stop's status changed. */
  function setStatus(status: LocationProgress["status"]): WalkSession {
    return {
      ...session,
      locations: { ...session.locations, [session.currentLocationId]: { ...progress, status } },
    };
  }

  switch (action.type) {
    case "ARRIVE": {
      if (progress.status !== "travelling") return session;
      return setStatus("arrived");
    }

    case "SHOW_STORY": {
      // E.g. a "find it yourself" task was done on site: the stop's page opens.
      if (progress.status !== "arrived") return session;
      return setStatus("story");
    }

    case "COMPLETE_VISIT": {
      // A stop is done once it has been visited.
      if (progress.status !== "arrived" && progress.status !== "story") return session;
      return setStatus("solved");
    }

    case "CONTINUE_TO_NEXT_LOCATION": {
      if (progress.status !== "solved") return session;

      const orderedLocations = getOrderedLocations(walk);
      const currentIndex = orderedLocations.findIndex((candidate) => candidate.id === location.id);
      // Skipped bonus stops stay "locked": they were never visited.
      const nextLocation = orderedLocations
        .slice(currentIndex + 1)
        .find((candidate) => !(action.skipBonus && candidate.isBonus));

      // No next stop: the walk is complete.
      if (!nextLocation) return { ...session, completedAt: action.at };

      return {
        ...session,
        currentLocationId: nextLocation.id,
        locations: {
          ...session.locations,
          [nextLocation.id]: { ...session.locations[nextLocation.id], status: "travelling" },
        },
      };
    }
  }
}
