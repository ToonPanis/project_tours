import type { Challenge } from "@/types/challenge";
import type { ChallengeAnswer } from "@/types/session";

/**
 * Makes typed answers comparable: "  Thé Lion! " → "the lion".
 * Ignores case, accents, punctuation and extra spaces, because phone
 * keyboards (autocorrect, capitals) shouldn't make a right answer wrong.
 */
export function normalizeAnswer(input: string): string {
  return input
    .normalize("NFD") // split "é" into "e" + accent mark…
    .replace(/\p{Diacritic}/gu, "") // …and drop the accent mark
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "") // drop punctuation
    .replace(/\s+/g, " ")
    .trim();
}

/** Parses "1582", " 1582 " or "3,5" into a number, or null if it isn't one. */
function parseNumber(input: string): number | null {
  const cleaned = input.trim().replace(",", ".");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/**
 * Answers are compared without spaces, because punctuation disappears without
 * leaving one: "11:55" becomes "1155", so "11 55" must too. The same goes for
 * apostrophes, e.g. Ukrainian "п'ять" typed as "пять".
 */
function toComparable(input: string): string {
  return normalizeAnswer(input).replace(/ /g, "");
}

function matchesAny(input: string, acceptedAnswers: string[]): boolean {
  const comparableInput = toComparable(input);
  return acceptedAnswers.some((accepted) => toComparable(accepted) === comparableInput);
}

/** Checks a submitted answer against a challenge. Pure: no side effects. */
export function checkAnswer(challenge: Challenge, answer: ChallengeAnswer): boolean {
  switch (challenge.type) {
    case "multiple-choice":
      // An empty answer must not count as option 0 (Number("") is 0).
      return typeof answer === "string" && answer.trim() !== "" && Number(answer) === challenge.correctOptionIndex;

    case "text-answer":
    case "code":
      return typeof answer === "string" && matchesAny(answer, challenge.acceptedAnswers);

    case "number-answer":
      return typeof answer === "string" && parseNumber(answer) === challenge.correctNumber;

    case "observation":
      // Nothing to verify: the team confirms they found it.
      return true;

    case "sequence":
      return (
        Array.isArray(answer) &&
        answer.length === challenge.correctOrder.length &&
        answer.every((itemIndex, position) => itemIndex === challenge.correctOrder[position])
      );
  }
}
