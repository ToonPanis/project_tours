import type { WalkLocation } from "@/types/location";
import type { LocationProgress, SessionAction, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { checkAnswer } from "./answers";
import { getOrderedLocations } from "./route";
import { findLeadingOptionIds, tallyVotes } from "./voting";

/**
 * All game rules in one pure function: (walk, state, action) → new state.
 *
 * - It never mutates `session`; it returns a new object (like React state).
 * - Actions that don't fit the current status are ignored (the same state
 *   is returned), so double taps or stale actions can't break the game.
 * - It never reads the clock or random numbers; those come in via actions.
 */
export function applySessionAction(
  walk: Walk,
  session: WalkSession,
  action: SessionAction,
): WalkSession {
  if (session.completedAt) return session;

  // The finale happens after the last location, so it's handled separately.
  if (action.type === "SUBMIT_FINALE_ANSWER") return applyFinaleAnswer(walk, session, action);

  const location = walk.locations.find((candidate) => candidate.id === session.currentLocationId);
  const progress = session.locations[session.currentLocationId];
  if (!location || !progress) return session;

  /** Returns a new session with the current location's progress updated. */
  function updateProgress(changes: Partial<LocationProgress>): WalkSession {
    return {
      ...session,
      locations: {
        ...session.locations,
        [session.currentLocationId]: { ...progress, ...changes },
      },
    };
  }

  switch (action.type) {
    case "ARRIVE": {
      if (progress.status !== "travelling") return session;
      return updateProgress({ status: "arrived" });
    }

    case "START_VOTING": {
      if (progress.status !== "arrived" || !location.drinkRound) return session;
      return updateProgress({ status: "voting" });
    }

    case "CAST_VOTE": {
      if (progress.status !== "voting" || !location.drinkRound) return session;

      const isTeamMember = session.team.players.some((player) => player.id === action.playerId);
      const isValidOption = location.drinkRound.options.some(
        (option) => option.id === action.drinkOptionId,
      );
      if (!isTeamMember || !isValidOption) return session;

      // One vote per player: a new vote replaces the old one.
      const otherVotes = progress.votes.filter((vote) => vote.playerId !== action.playerId);
      return updateProgress({
        votes: [...otherVotes, { playerId: action.playerId, drinkOptionId: action.drinkOptionId }],
      });
    }

    case "CLOSE_VOTING": {
      if (progress.status !== "voting" || !location.drinkRound) return session;
      if (progress.votes.length === 0) return session;

      // The winner was chosen before dispatching; only accept a real leader.
      const leaders = findLeadingOptionIds(tallyVotes(location.drinkRound, progress.votes));
      if (!leaders.includes(action.winnerOptionId)) return session;

      return updateProgress({
        status: "drink-selected",
        selectedDrinkOptionId: action.winnerOptionId,
        wasTie: action.wasTie,
      });
    }

    case "SKIP_DRINK_ROUND": {
      if (progress.status !== "arrived" && progress.status !== "voting") return session;
      if (!location.drinkRound) return session;
      return updateProgress({
        status: "drink-selected",
        selectedDrinkOptionId: undefined,
        drinkRoundSkipped: true,
      });
    }

    case "SHOW_STORY": {
      // After the drink round, or straight after arriving when there is none.
      const canShow =
        progress.status === "drink-selected" ||
        (progress.status === "arrived" && !location.drinkRound);
      if (!canShow) return session;
      return updateProgress({ status: "story" });
    }

    case "START_CHALLENGE": {
      if (progress.status !== "story") return session;

      // A location without a challenge is solved as soon as it's "started".
      if (!location.challenge) return solveLocation(walk, session, location);
      return updateProgress({ status: "challenge" });
    }

    case "SUBMIT_ANSWER": {
      if (progress.status !== "challenge" || !location.challenge) return session;

      if (checkAnswer(location.challenge, action.answer)) {
        return solveLocation(walk, session, location);
      }
      return updateProgress({ wrongAttempts: progress.wrongAttempts + 1 });
    }

    case "REVEAL_HINT": {
      if (progress.status !== "challenge" || !location.challenge) return session;
      // One extra hint per wrong answer, and never more hints than exist.
      const hintsAvailable = Math.min(progress.wrongAttempts, location.challenge.hints.length);
      if (progress.hintsRevealed >= hintsAvailable) return session;
      return updateProgress({ hintsRevealed: progress.hintsRevealed + 1 });
    }

    case "SUBMIT_BONUS_ANSWER": {
      // The bonus is asked after the main challenge and never blocks progress.
      if (progress.status !== "solved" || !location.bonusChallenge) return session;
      if (progress.bonusStatus !== "unanswered") return session;

      if (checkAnswer(location.bonusChallenge, action.answer)) {
        return updateProgress({ bonusStatus: "solved" });
      }
      return updateProgress({ bonusWrongAttempts: progress.bonusWrongAttempts + 1 });
    }

    case "SKIP_BONUS": {
      if (progress.status !== "solved" || !location.bonusChallenge) return session;
      if (progress.bonusStatus !== "unanswered") return session;
      return updateProgress({ bonusStatus: "skipped" });
    }

    case "CONTINUE_TO_NEXT_LOCATION": {
      if (progress.status !== "solved") return session;
      if (session.finale && session.finale.status !== "locked") return session;

      const orderedLocations = getOrderedLocations(walk);
      const currentIndex = orderedLocations.findIndex((candidate) => candidate.id === location.id);
      const nextLocation = orderedLocations[currentIndex + 1];

      // No next stop: open the finale if there is one, otherwise the walk is complete.
      if (!nextLocation) {
        if (session.finale) return { ...session, finale: { ...session.finale, status: "active" } };
        return { ...session, completedAt: action.at };
      }

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

/**
 * Checks one finale question. When every question is solved, the finale is
 * solved and the walk is complete.
 */
function applyFinaleAnswer(
  walk: Walk,
  session: WalkSession,
  action: Extract<SessionAction, { type: "SUBMIT_FINALE_ANSWER" }>,
): WalkSession {
  const finale = session.finale;
  const questions = walk.finale?.questions ?? [];
  const question = questions.find((candidate) => candidate.id === action.questionId);
  if (!finale || finale.status !== "active" || !question) return session;
  if (finale.solvedQuestionIds.includes(question.id)) return session;

  if (!checkAnswer(question, action.answer)) {
    const wrongAttempts = (finale.wrongAttemptsByQuestion[question.id] ?? 0) + 1;
    return {
      ...session,
      finale: {
        ...finale,
        wrongAttemptsByQuestion: { ...finale.wrongAttemptsByQuestion, [question.id]: wrongAttempts },
      },
    };
  }

  const solvedQuestionIds = [...finale.solvedQuestionIds, question.id];
  const allSolved = questions.every((candidate) => solvedQuestionIds.includes(candidate.id));

  return {
    ...session,
    finale: { ...finale, solvedQuestionIds, status: allSolved ? "solved" : "active" },
    completedAt: allSolved ? action.at : undefined,
  };
}

/** Marks a location solved and collects the clues earned there. */
function solveLocation(walk: Walk, session: WalkSession, location: WalkLocation): WalkSession {
  const earnedClueIds = (walk.clues ?? [])
    .filter((clue) => clue.sourceLocationId === location.id)
    .map((clue) => clue.id)
    .filter((clueId) => !session.collectedClueIds.includes(clueId));

  return {
    ...session,
    collectedClueIds: [...session.collectedClueIds, ...earnedClueIds],
    locations: {
      ...session.locations,
      [location.id]: { ...session.locations[location.id], status: "solved" },
    },
  };
}
