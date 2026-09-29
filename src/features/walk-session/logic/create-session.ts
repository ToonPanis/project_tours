import type { FinaleProgress, LocationProgress, WalkSession } from "@/types/session";
import type { Team } from "@/types/team";
import type { Walk } from "@/types/walk";
import { getOrderedLocations } from "@/lib/walk-locations";

export function createLocationProgress(status: LocationProgress["status"]): LocationProgress {
  return {
    status,
    votes: [],
    drinkRoundSkipped: false,
    wasTie: false,
    wrongAttempts: 0,
    hintsRevealed: 0,
    answerRevealed: false,
    bonusStatus: "unanswered",
    bonusWrongAttempts: 0,
  };
}

/** Progress for a walk's final puzzle before it starts. */
export function createFinaleProgress(): FinaleProgress {
  return { status: "locked", solvedQuestionIds: [], wrongAttemptsByQuestion: {} };
}

interface CreateWalkSessionInput {
  walk: Walk;
  team: Team;
  sessionId: string;
  /** ISO timestamp, passed in (not read here) so this function stays pure. */
  startedAt: string;
}

/** A fresh session: the team travels to the first stop, every other stop is locked. */
export function createWalkSession({
  walk,
  team,
  sessionId,
  startedAt,
}: CreateWalkSessionInput): WalkSession {
  const orderedLocations = getOrderedLocations(walk);
  if (orderedLocations.length === 0) {
    throw new Error(`Walk "${walk.slug}" has no locations.`);
  }

  const locations: Record<string, LocationProgress> = {};
  orderedLocations.forEach((location, index) => {
    locations[location.id] = createLocationProgress(index === 0 ? "travelling" : "locked");
  });

  return {
    id: sessionId,
    walkSlug: walk.slug,
    team,
    startedAt,
    currentLocationId: orderedLocations[0].id,
    locations,
    collectedClueIds: [],
    finale: walk.finale ? createFinaleProgress() : null,
  };
}
