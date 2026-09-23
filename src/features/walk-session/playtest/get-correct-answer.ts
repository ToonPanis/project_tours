/**
 * PLAYTEST TOOLING: not part of the game. Delete this folder to remove it.
 */
import type { Challenge } from "@/types/challenge";
import type { ChallengeAnswer, SessionAction } from "@/types/session";

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

/**
 * The normal game actions that take the current stop from any status to
 * "solved". The reducer ignores the ones that don't apply, so no special
 * "cheat" action is needed and the game rules stay untouched.
 */
export function getSolveCurrentStopActions(challenge: Challenge | undefined): SessionAction[] {
  return [
    { type: "ARRIVE" },
    { type: "SKIP_DRINK_ROUND" },
    { type: "SHOW_STORY" },
    { type: "START_CHALLENGE" },
    ...(challenge ? [{ type: "SUBMIT_ANSWER" as const, answer: getCorrectAnswer(challenge) }] : []),
  ];
}
