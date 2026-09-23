import type { GameCopy, Walk } from "@/types/walk";

/** Neutral texts for walks that don't define their own flavour. */
export const defaultGameCopy: GameCopy = {
  voteResultTitle: "The votes are in",
  tieTitle: "It's a tie!",
  tieSubtitle: "Chance will decide…",
  afterVoteMessage: "Take your time and look around.",
  wrongAnswer: "Not quite. Try again.",
  correctAnswer: "Correct!",
  nextLocationTitle: "Next stop unlocked",
  completionTitle: "Walk complete",
  completionMessage: "You've finished the walk.",
  clueCollectedTitle: "Clue collected",
  locationsTitle: "The route",
  locationsDiscoveredLabel: "stops discovered",
};

/** The walk's own texts, with defaults for anything it doesn't override. */
export function getGameCopy(walk: Walk): GameCopy {
  return { ...defaultGameCopy, ...walk.copy };
}
