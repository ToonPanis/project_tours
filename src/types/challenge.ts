/**
 * A challenge is a discriminated union on `type`: TypeScript knows which
 * fields exist once you check `challenge.type`. Add new challenge types
 * (e.g. "photo", "count-the-objects") as new members of the union.
 */

interface BaseChallenge {
  id: string;
  question: string;
  /** Shown after the challenge is completed. */
  explanation?: string;
  /** Optional hint the player can reveal. */
  hint?: string;
}

export interface MultipleChoiceChallenge extends BaseChallenge {
  type: "multiple-choice";
  options: string[];
  /** Index into `options`. Will move to server-side validation later. */
  correctOptionIndex: number;
}

export interface TextAnswerChallenge extends BaseChallenge {
  type: "text-answer";
  /** All accepted answers, compared case-insensitively. */
  acceptedAnswers: string[];
}

export type Challenge = MultipleChoiceChallenge | TextAnswerChallenge;

export type ChallengeType = Challenge["type"];
