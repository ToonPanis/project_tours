import type { Challenge } from "@/types/challenge";
import type { LocationProgress } from "@/types/session";
import { optionLetter } from "./option-letter";

/**
 * After this many wrong answers the team may see the answer, so a group can
 * never get stuck on a challenge (wrong placeholder answer, closed café, …).
 */
export const REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS = 3;

/** True when the team may ask for the answer of the challenge it is working on. */
export function canRevealAnswer(challenge: Challenge, progress: LocationProgress): boolean {
  if (progress.status !== "challenge" || progress.answerRevealed) return false;
  // An observation has no answer to reveal: the team just confirms it looked.
  if (challenge.type === "observation") return false;
  return progress.wrongAttempts >= REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS;
}

/**
 * What the "show the answer" box shows, in the walk's language.
 * - `answer`: a short answer line ("B. Stepped", "9"), or null when it can't be
 *   shown in the player's language.
 * - `explanation`: the challenge's explanation (translated walk content), if any.
 *
 * Typed answers (text, code) are checked against one list shared by all languages
 * ("horse", "paard", "лошадь"…), whose first entry is in one language only. For
 * those, the translated explanation is shown instead.
 */
export function getRevealContent(challenge: Challenge): { answer: string | null; explanation: string | null } {
  const explanation = challenge.explanation ?? null;
  const isTyped = challenge.type === "text-answer" || challenge.type === "code";
  if (isTyped && explanation) return { answer: null, explanation };
  return { answer: getAnswerText(challenge), explanation };
}

/** The correct answer as a short text ("B. Stepped", "9", the first accepted answer). */
export function getAnswerText(challenge: Challenge): string {
  switch (challenge.type) {
    case "multiple-choice":
      return `${optionLetter(challenge.correctOptionIndex)}. ${challenge.options[challenge.correctOptionIndex] ?? ""}`;
    case "text-answer":
    case "code":
      // The first accepted answer is the canonical one (see types/challenge.ts).
      return challenge.acceptedAnswers[0] ?? "";
    case "number-answer":
      return String(challenge.correctNumber);
    case "sequence":
      return challenge.correctOrder.map((index) => challenge.items[index]).join(" → ");
    case "observation":
      return "";
  }
}
