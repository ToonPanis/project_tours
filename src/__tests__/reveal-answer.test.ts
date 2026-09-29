import { describe, expect, test } from "vitest";
import { getWalks, walks } from "@/data/walks";
import { createLocationProgress } from "@/features/walk-session/logic/create-session";
import { checkAnswer } from "@/features/walk-session/logic/answers";
import {
  canRevealAnswer,
  canRevealFinaleAnswer,
  getAnswerText,
  getRevealContent,
  REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS,
} from "@/features/walk-session/logic/reveal-answer";
import { locales } from "@/i18n/config";
import type { Challenge } from "@/types/challenge";
import type { LocationProgress } from "@/types/session";

const base = { id: "c", title: "T", question: "Q?", hints: [] };
const atChallenge = (wrongAttempts: number, changes: Partial<LocationProgress> = {}): LocationProgress => ({
  ...createLocationProgress("challenge"),
  wrongAttempts,
  ...changes,
});

describe("getAnswerText (H-02)", () => {
  test.each<[string, Challenge, string]>([
    ["multiple choice: letter and option", { ...base, type: "multiple-choice", options: ["Round", "Stepped"], correctOptionIndex: 1 }, "B. Stepped"],
    ["text: the canonical (first) answer", { ...base, type: "text-answer", acceptedAnswers: ["Brabo", "brabo"] }, "Brabo"],
    ["code: the canonical code", { ...base, type: "code", acceptedAnswers: ["1577"] }, "1577"],
    ["number", { ...base, type: "number-answer", correctNumber: 12 }, "12"],
    ["sequence: items in the right order", { ...base, type: "sequence", items: ["b", "a", "c"], correctOrder: [1, 0, 2] }, "a → b → c"],
  ])("%s", (_name, challenge, expected) => {
    expect(getAnswerText(challenge)).toBe(expected);
  });

  test("every challenge in every walk has a non-empty answer to show", () => {
    for (const walk of walks) {
      for (const location of walk.locations) {
        const challenge = location.challenge;
        if (!challenge || challenge.type === "observation") continue;
        expect(getAnswerText(challenge).trim(), `${walk.slug} / ${location.id}`).not.toBe("");
      }
    }
  });
});

describe("getRevealContent: the revealed answer is in the player's language", () => {
  test("typed answers show the translated explanation, not the shared answer list", () => {
    const horse: Challenge = {
      ...base,
      type: "text-answer",
      acceptedAnswers: ["horse", "paard", "лошадь"],
      explanation: "Лошадь, и она давно наблюдает за посетителями.",
    };
    expect(getRevealContent(horse)).toEqual({ answer: null, explanation: horse.explanation });
  });

  test("multiple choice and numbers show a short answer line plus the explanation", () => {
    const mc: Challenge = { ...base, type: "multiple-choice", options: ["Rond", "Trapvormig"], correctOptionIndex: 1, explanation: "Trapvormig." };
    expect(getRevealContent(mc)).toEqual({ answer: "B. Trapvormig", explanation: "Trapvormig." });
  });

  test.each(locales)("[%s] every typed challenge in every walk has a translated explanation to show", (locale) => {
    for (const walk of getWalks(locale)) {
      for (const location of walk.locations) {
        const challenge = location.challenge;
        if (challenge?.type !== "text-answer" && challenge?.type !== "code") continue;
        expect(challenge.explanation?.trim(), `${walk.slug} / ${location.id}`).toBeTruthy();
      }
    }
  });
});

describe("final puzzle: the answer comes from the clue it is written on", () => {
  test("a linked clue's value is shown as the answer", () => {
    const question: Challenge = { ...base, type: "text-answer", acceptedAnswers: ["horse"], answerClueId: "clue-horse" };
    const clues = [{ id: "clue-horse", title: "Лошадь", value: "ЛОШАДЬ", icon: "lion" as const, sourceLocationId: "s" }];
    expect(getRevealContent(question, clues)).toEqual({ answer: "ЛОШАДЬ", explanation: null });
  });

  test.each(locales)("[%s] every final question links a clue whose value really is an accepted answer", (locale) => {
    for (const walk of getWalks(locale)) {
      for (const question of walk.finale?.questions ?? []) {
        const clue = (walk.clues ?? []).find((candidate) => candidate.id === question.answerClueId);
        expect(clue, `${walk.slug} / ${question.id}: answerClueId`).toBeDefined();
        // Proves the link: typing what the clue says solves the question.
        expect(checkAnswer(question, clue!.value), `${walk.slug} / ${question.id} = "${clue!.value}"`).toBe(true);
      }
    }
  });

  test("the reveal rule is the same as at the stops", () => {
    expect(canRevealFinaleAnswer(REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS - 1)).toBe(false);
    expect(canRevealFinaleAnswer(REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS)).toBe(true);
  });
});

describe("canRevealAnswer (H-02)", () => {
  const numberChallenge: Challenge = { ...base, type: "number-answer", correctNumber: 9 };

  test(`only from ${REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS} wrong attempts on`, () => {
    expect(REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS).toBe(3);
    expect(canRevealAnswer(numberChallenge, atChallenge(2))).toBe(false);
    expect(canRevealAnswer(numberChallenge, atChallenge(3))).toBe(true);
  });

  test("not outside the challenge step, and not twice", () => {
    expect(canRevealAnswer(numberChallenge, { ...atChallenge(5), status: "solved" })).toBe(false);
    expect(canRevealAnswer(numberChallenge, atChallenge(5, { answerRevealed: true }))).toBe(false);
  });

  test("not for observations (there is no answer; the team just confirms)", () => {
    const observation: Challenge = { ...base, type: "observation", instruction: "Look up.", confirmLabel: "Found it" };
    expect(canRevealAnswer(observation, atChallenge(5))).toBe(false);
  });
});
