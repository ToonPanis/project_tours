/**
 * A challenge is a discriminated union on `type`: TypeScript knows which
 * fields exist once you check `challenge.type`. Add new challenge types
 * as new members of the union.
 *
 * Note: answers are stored with the content for now. Once the walk player
 * exists, answer checking should move to the server.
 */

interface BaseChallenge {
  id: string;
  question: string;
  /** Shown after the challenge is completed. */
  explanation?: string;
  /** Optional hint the player can reveal. */
  hint?: string;
  /**
   * Clues the player must have collected before this challenge makes sense.
   * A challenge with required clues acts as a "combine the clues" / final puzzle.
   */
  requiredClueIds?: string[];
}

export interface MultipleChoiceChallenge extends BaseChallenge {
  type: "multiple-choice";
  options: string[];
  /** Index into `options`. */
  correctOptionIndex: number;
}

export interface TextAnswerChallenge extends BaseChallenge {
  type: "text-answer";
  /** All accepted answers, compared case-insensitively. */
  acceptedAnswers: string[];
}

export interface NumberAnswerChallenge extends BaseChallenge {
  type: "number-answer";
  correctNumber: number;
}

/**
 * The player looks for something on site and confirms they found it.
 * There is no verifiable answer. Use multiple-choice if it must be checked.
 */
export interface ObservationChallenge extends BaseChallenge {
  type: "observation";
  instruction: string;
  /** Button text, e.g. "I found it". */
  confirmLabel: string;
}

export interface SequenceChallenge extends BaseChallenge {
  type: "sequence";
  /** Items shown to the player (in this order). */
  items: string[];
  /** Indexes into `items`, in the correct order. */
  correctOrder: number[];
}

/** A code built from earlier discoveries, usually combined with `requiredClueIds`. */
export interface CodeChallenge extends BaseChallenge {
  type: "code";
  /** Accepted codes, compared case-insensitively. */
  acceptedAnswers: string[];
}

export type Challenge =
  | MultipleChoiceChallenge
  | TextAnswerChallenge
  | NumberAnswerChallenge
  | ObservationChallenge
  | SequenceChallenge
  | CodeChallenge;

export type ChallengeType = Challenge["type"];
