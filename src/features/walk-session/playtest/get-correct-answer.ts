/**
 * PLAYTEST TOOLING: not part of the game. Delete this folder to remove it.
 *
 * These helpers only produce NORMAL game actions (with the correct answers
 * taken from the walk data). The reducer ignores any that don't apply, so no
 * special "cheat" actions are needed and the game rules stay untouched.
 */
import type { Challenge } from "@/types/challenge";
import type { WalkLocation } from "@/types/location";
import type { ChallengeAnswer, SessionAction, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getOrderedLocations } from "../logic/route";

/** The answer that solves a challenge, taken from the walk data. */
export function getCorrectAnswer(challenge: Challenge): ChallengeAnswer {
  switch (challenge.type) {
    case "multiple-choice":
      return String(challenge.correctOptionIndex);
    case "text-answer":
    case "code":
      return challenge.acceptedAnswers[0] ?? "";
    case "number-answer":
      return String(challenge.correctNumber);
    case "observation":
      return "";
    case "sequence":
      return challenge.correctOrder;
  }
}

/** Takes a location from any status to "solved". */
export function getSolveCurrentStopActions(challenge: Challenge | undefined): SessionAction[] {
  return [
    { type: "ARRIVE" },
    { type: "SKIP_DRINK_ROUND" },
    { type: "SHOW_STORY" },
    { type: "START_CHALLENGE" },
    ...(challenge ? [{ type: "SUBMIT_ANSWER" as const, answer: getCorrectAnswer(challenge) }] : []),
  ];
}

/** Solves a location and moves on to the next one (or opens the finale). */
export function getUnlockNextActions(location: WalkLocation, at: string): SessionAction[] {
  return [
    ...getSolveCurrentStopActions(location.challenge),
    { type: "SKIP_BONUS" },
    { type: "CONTINUE_TO_NEXT_LOCATION", at },
  ];
}

/** The single action that moves the game one screen forward. */
export function getNextStageActions(walk: Walk, session: WalkSession, at: string): SessionAction[] {
  if (walk.finale && session.finale?.status === "active") {
    const question = walk.finale.questions.find(
      (candidate) => !session.finale?.solvedQuestionIds.includes(candidate.id),
    );
    return question
      ? [{ type: "SUBMIT_FINALE_ANSWER", questionId: question.id, answer: getCorrectAnswer(question), at }]
      : [];
  }

  const location = walk.locations.find((candidate) => candidate.id === session.currentLocationId);
  const status = session.locations[session.currentLocationId]?.status;
  if (!location) return [];

  switch (status) {
    case "locked":
    case "travelling":
      return [{ type: "ARRIVE" }];
    case "arrived":
      return [location.drinkRound ? { type: "START_VOTING" } : { type: "SHOW_STORY" }];
    case "voting":
      return [{ type: "SKIP_DRINK_ROUND" }];
    case "drink-selected":
      return [{ type: "SHOW_STORY" }];
    case "story":
      return [{ type: "START_CHALLENGE" }];
    case "challenge":
      return location.challenge
        ? [{ type: "SUBMIT_ANSWER", answer: getCorrectAnswer(location.challenge) }]
        : [];
    case "solved":
    case undefined:
      return [{ type: "SKIP_BONUS" }, { type: "CONTINUE_TO_NEXT_LOCATION", at }];
  }
}

/**
 * Actions that fast-forward a FRESH session (standing at stop 1) to the
 * start of stop `stopNumber` (1-based).
 */
export function getJumpToStopActions(walk: Walk, stopNumber: number, at: string): SessionAction[] {
  return getOrderedLocations(walk)
    .slice(0, stopNumber - 1)
    .flatMap((location) => getUnlockNextActions(location, at));
}
