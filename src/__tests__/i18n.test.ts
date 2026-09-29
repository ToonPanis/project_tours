import { describe, expect, test, vi } from "vitest";
import { locales, matchLocale, toSupportedLocale } from "@/i18n/config";
import { availableLocales, mergeTranslation, pickContent, type LocalizedContent } from "@/i18n/content";
import { createTranslator, type MessageKey } from "@/i18n/translate";
import { formatDate } from "@/features/walks/utils/format-walk";

describe("matchLocale (first visit: the browser's language)", () => {
  test.each([
    ["nl-BE,nl;q=0.9,en;q=0.8", "nl"],
    ["fr-BE", "fr"],
    ["de-DE,de;q=0.9", "de"],
    ["uk-UA,uk;q=0.9,ru;q=0.8", "uk"],
    ["pt-BR,pt;q=0.9", "en"],
    ["pt-BR,es;q=0.5", "es"],
    ["en;q=0.2,it;q=0.9", "it"],
    ["", "en"],
  ])("%s → %s", (header, expected) => {
    expect(matchLocale(header)).toBe(expected);
  });

  test("also takes navigator.languages", () => {
    expect(matchLocale(["ja-JP", "ru-RU", "en-US"])).toBe("ru");
    expect(toSupportedLocale("es_ES")).toBe("es");
  });
});

describe("the translator", () => {
  test("fills in {placeholders} without string concatenation", () => {
    expect(createTranslator("en")("common.units.meters", { value: 350 })).toContain("350");
  });

  test("formats numbers in placeholders for the language", () => {
    const meters = (locale: "en" | "de") => createTranslator(locale)("common.units.meters", { value: 1200 });
    expect(meters("en")).toContain("1,200");
    expect(meters("de")).toContain("1.200");
  });

  test("uses the right plural form, including Russian and Ukrainian", () => {
    const ru = createTranslator("ru");
    const forms = [1, 2, 5, 21].map((count) => ru.plural("walks.card.stops", count));
    // 1 and 21 share a form ("one"), 2 ("few") and 5 ("many") each have their own.
    expect(forms[0].replace("1", "")).toBe(forms[3].replace("21", ""));
    expect(new Set(forms.map((form) => form.replace(/\d+/g, ""))).size).toBe(3);
  });

  test("falls back to English for a missing key and warns once in development", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = createTranslator("fr");
    // A key that doesn't exist anywhere: never "undefined", at worst the key itself.
    const missing = "common.doesNotExist" as MessageKey;
    expect(t(missing)).toBe("common.doesNotExist");
    t(missing);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  test("every language has its own text for the main interface", () => {
    const englishCta = createTranslator("en")("home.exploreWalks");
    for (const locale of locales.filter((locale) => locale !== "en")) {
      expect(createTranslator(locale)("home.exploreWalks"), locale).not.toBe(englishCta);
    }
  });
});

describe("dates follow the language", () => {
  test.each([
    ["en", "September 28, 2026"],
    ["nl", "28 september 2026"],
    ["fr", "28 septembre 2026"],
    ["de", "28. September 2026"],
  ] as const)("%s", (locale, expected) => {
    expect(formatDate("2026-09-28", locale)).toBe(expected);
  });
});

describe("walk content per language", () => {
  type Text = { title: string; stops: Record<string, { name: string; lines: string[] }> };
  const content: LocalizedContent<Text> = {
    en: { title: "Walk", stops: { a: { name: "Stop A", lines: ["one", "two"] }, b: { name: "Stop B", lines: ["x"] } } },
    nl: { title: "Wandeling", stops: { a: { name: "Stop A (nl)", lines: ["een", "twee"] } } },
  };

  test("a partial translation is completed with English", () => {
    const nl = pickContent(content, "nl");
    expect(nl.title).toBe("Wandeling");
    expect(nl.stops.a.lines).toEqual(["een", "twee"]);
    expect(nl.stops.b.name).toBe("Stop B");
  });

  test("lists are replaced as a whole, never mixed", () => {
    expect(mergeTranslation(["a", "b", "c"], ["x"])).toEqual(["x"]);
  });

  test("a language without content falls back to English and isn't listed", () => {
    expect(pickContent(content, "ru").title).toBe("Walk");
    expect(availableLocales(content)).toEqual(["en", "nl"]);
  });
});
