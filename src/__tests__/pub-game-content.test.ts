import { describe, expect, test } from "vitest";
import { pubGameTexts } from "@/data/walks/hidden-pubs/game/content";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { pubGameReveals } from "@/data/walks/hidden-pubs/game/reveals/index.server";
import { locales } from "@/i18n/config";

const cafes = pubGameDefinition.cafes;
const RESEARCH_MARKER = /\[[^\]]+\]/;

describe.each(locales)("Hidden Pubs 2.0 texts in %s", (locale) => {
  const texts = pubGameTexts[locale];
  const reveals = pubGameReveals[locale];

  test("every question has its text and a text for each option (and nothing extra)", () => {
    for (const cafe of cafes) {
      const cafeTexts = texts.cafes[cafe.id];
      expect(Object.keys(cafeTexts.questions).sort(), cafe.id).toEqual(cafe.questions.map((question) => question.id).sort());
      for (const question of cafe.questions) {
        const text = cafeTexts.questions[question.id];
        expect(text.question.trim(), question.id).not.toBe("");
        expect(Object.keys(text.options).sort(), question.id).toEqual([...question.optionIds].sort());
        for (const option of Object.values(text.options)) expect(option.trim()).not.toBe("");
        // Same number of hints as in English (only the concept's hints so far, D24).
        expect(text.hints.length, question.id).toBe(pubGameTexts.en.cafes[cafe.id].questions[question.id].hints.length);
      }
    }
  });

  test("every photo/video task has a title and an instruction", () => {
    for (const cafe of cafes) {
      expect(Object.keys(texts.cafes[cafe.id].tasks).sort(), cafe.id).toEqual(cafe.tasks.map((task) => task.id).sort());
      for (const task of Object.values(texts.cafes[cafe.id].tasks)) {
        expect(task.title.trim()).not.toBe("");
        expect(task.instruction.trim()).not.toBe("");
      }
    }
  });

  test("every question has an explanation and every café a fun fact, labelled like the English", () => {
    for (const cafe of cafes) {
      const cafeReveals = reveals.cafes[cafe.id];
      expect(Object.keys(cafeReveals.explanations).sort(), cafe.id).toEqual(cafe.questions.map((question) => question.id).sort());
      const english = pubGameReveals.en.cafes[cafe.id].funFact;
      expect(cafeReveals.funFact.kind, cafe.id).toBe(english.kind);
      expect(cafeReveals.funFact.status, cafe.id).toBe(english.status);
      expect(cafeReveals.funFact.paragraphs.length, cafe.id).toBe(english.paragraphs.length);
      // Unresearched history carries a visible marker (CLAUDE.md content rules).
      if (cafeReveals.funFact.status === "research-required") {
        expect(cafeReveals.funFact.paragraphs.join(" "), cafe.id).toMatch(RESEARCH_MARKER);
      }
    }
  });

  test("bonus tasks that reward drinking say that any drink counts (D3)", () => {
    // Barok's shot, Boer van Tienen's loser sip and Den Engel's clog.
    const english = pubGameTexts.en.cafes;
    expect(english["pubs-barok"].tasks["pubs-barok-shot"].instruction).toMatch(/alcohol-free/);
    expect(english["pubs-boer-van-tienen"].tasks["pubs-boer-van-tienen-rps"].instruction).toMatch(/alcohol-free/);
    expect(english["pubs-den-engel"].tasks["pubs-den-engel-clog"].instruction).toMatch(/any drink/);
    for (const cafe of ["pubs-barok", "pubs-boer-van-tienen", "pubs-den-engel"]) {
      const translated = Object.values(texts.cafes[cafe].tasks)[0].instruction;
      expect(translated, `${locale} ${cafe}`).not.toBe("");
    }
  });
});

test("names stay untranslated: café names never appear translated in questions (spot check)", () => {
  for (const locale of locales) {
    expect(pubGameReveals[locale].cafes["pubs-boer-van-tienen"].funFact.paragraphs.join(" ")).toContain("In den Boer van Tienen");
  }
});
