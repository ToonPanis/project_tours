import { describe, expect, test } from "vitest";
import { checkAnswer, normalizeAnswer } from "@/features/walk-session/logic/answers";
import type { Challenge } from "@/types/challenge";

const base = { id: "c", title: "Test", question: "?", hints: [] };

describe("normalizeAnswer", () => {
  test.each([
    ["  The Lion ", "the lion"],
    ["THÉ LÏON!", "the lion"],
    ["the   lion.", "the lion"],
    ["Café", "cafe"],
  ])("%j → %j", (input, expected) => {
    expect(normalizeAnswer(input)).toBe(expected);
  });
});

describe("checkAnswer", () => {
  test("text-answer ignores case, accents and punctuation", () => {
    const challenge: Challenge = { ...base, type: "text-answer", acceptedAnswers: ["The Key"] };
    expect(checkAnswer(challenge, "the key")).toBe(true);
    expect(checkAnswer(challenge, "THE KEY!")).toBe(true);
    expect(checkAnswer(challenge, "a key")).toBe(false);
  });

  test("text-answer accepts any listed variant", () => {
    const challenge: Challenge = {
      ...base,
      type: "text-answer",
      acceptedAnswers: ["Antwerpen", "Antwerp"],
    };
    expect(checkAnswer(challenge, "antwerp")).toBe(true);
  });

  test("code works like text-answer", () => {
    const challenge: Challenge = { ...base, type: "code", acceptedAnswers: ["ledger"] };
    expect(checkAnswer(challenge, "Ledger")).toBe(true);
  });

  test("number-answer compares numbers, not text", () => {
    const challenge: Challenge = { ...base, type: "number-answer", correctNumber: 1582 };
    expect(checkAnswer(challenge, " 1582 ")).toBe(true);
    expect(checkAnswer(challenge, "01582")).toBe(true);
    expect(checkAnswer(challenge, "1583")).toBe(false);
    expect(checkAnswer(challenge, "")).toBe(false);
    expect(checkAnswer(challenge, "abc")).toBe(false);
  });

  test("multiple-choice compares the chosen option index", () => {
    const challenge: Challenge = {
      ...base,
      type: "multiple-choice",
      options: ["A", "B", "C"],
      correctOptionIndex: 1,
    };
    expect(checkAnswer(challenge, "1")).toBe(true);
    expect(checkAnswer(challenge, "0")).toBe(false);
  });

  test("observation is always confirmed", () => {
    const challenge: Challenge = {
      ...base,
      type: "observation",
      instruction: "Find it",
      confirmLabel: "Found it",
    };
    expect(checkAnswer(challenge, "")).toBe(true);
  });

  test("sequence requires the exact order", () => {
    const challenge: Challenge = {
      ...base,
      type: "sequence",
      items: ["a", "b", "c"],
      correctOrder: [2, 0, 1],
    };
    expect(checkAnswer(challenge, [2, 0, 1])).toBe(true);
    expect(checkAnswer(challenge, [0, 1, 2])).toBe(false);
    expect(checkAnswer(challenge, "2,0,1")).toBe(false);
  });
});
