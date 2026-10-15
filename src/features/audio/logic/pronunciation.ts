import type { Locale } from "@/i18n/config";
import { PRONUNCIATION_LEXICON } from "./pronunciation-lexicon";

/**
 * How the voice should SAY a name that it would otherwise mispronounce. Only the
 * audio changes; the page keeps the written name.
 *
 * The Russian and Ukrainian texts keep Antwerp's names in Latin letters (street
 * and house names are never translated), but a Russian or Ukrainian voice reads
 * Latin letters badly ("Antwerpen-Centraal" came out as gibberish). So for those
 * voices the names are written the way they sound, in Cyrillic.
 *
 * The entries are in pronunciation-lexicon.ts. Longer names win, so "Grote Markt"
 * is replaced as a whole before "Markt" alone would be.
 */

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Centuries in Roman numerals ("XIX века") are said as ordinal words in the right case:
 * the voices would read the letters. The case follows the noun after it, or for an
 * elided noun ("из XX века в XIX") the preposition before it.
 */
const ORDINAL_STEMS: Record<"ru" | "uk", Record<string, string>> = {
  ru: {
    X: "десят", XI: "одиннадцат", XII: "двенадцат", XIII: "тринадцат", XIV: "четырнадцат", XV: "пятнадцат",
    XVI: "шестнадцат", XVII: "семнадцат", XVIII: "восемнадцат", XIX: "девятнадцат", XX: "двадцат", XXI: "двадцать перв",
  },
  uk: {
    X: "десят", XI: "одинадцят", XII: "дванадцят", XIII: "тринадцят", XIV: "чотирнадцят", XV: "п'ятнадцят",
    XVI: "шістнадцят", XVII: "сімнадцят", XVIII: "вісімнадцят", XIX: "дев'ятнадцят", XX: "двадцят", XXI: "двадцять перш",
  },
};

type Case = "nominative" | "genitive" | "locative";
const ENDINGS: Record<"ru" | "uk", Record<Case, string>> = {
  ru: { nominative: "ый", genitive: "ого", locative: "ом" },
  uk: { nominative: "ий", genitive: "ого", locative: "ому" },
};

function centuryCase(locale: "ru" | "uk", noun: string | undefined, before: string): Case {
  if (noun) {
    if (/^(веке|столітті)$/.test(noun)) return "locative";
    if (/^(века|століття)$/.test(noun)) return "genitive";
    return "nominative";
  }
  // No noun: "в XIX" (into the 19th) / "до XIX" (until the 19th).
  return /(^|\s)(в|у|во)\s*$/.test(before) && locale === "ru" ? "nominative" : "genitive";
}

function spellCenturies(text: string, locale: "ru" | "uk"): string {
  return text.replace(
    /(?<![\p{L}])(XXI|XX|XIX|XVIII|XVII|XVI|XV|XIV|XIII|XII|XI|X)(?![\p{L}\-])(\s+(век[аеу]?|столітт[яі]))?/gu,
    (match, numeral: string, nounPart: string | undefined, noun: string | undefined, offset: number) => {
      const stem = ORDINAL_STEMS[locale][numeral];
      if (!stem) return match;
      const grammaticalCase = centuryCase(locale, noun, text.slice(Math.max(0, offset - 4), offset));
      // "двадцать перв" + "ого": the last word takes the ending, like every other ordinal.
      return `${stem}${ENDINGS[locale][grammaticalCase]}${nounPart ?? ""}`;
    },
  );
}

/** The text as the voice should say it in `locale`. */
export function toSpoken(text: string, locale: Locale): string {
  const withNames = replaceNames(text, locale);
  return locale === "ru" || locale === "uk" ? spellCenturies(withNames, locale) : withNames;
}

function replaceNames(text: string, locale: Locale): string {
  const entries = Object.entries(PRONUNCIATION_LEXICON[locale] ?? {}).sort(([a], [b]) => b.length - a.length);
  if (entries.length === 0) return text;
  // Whole words only: "Meir" but not inside "Meirbrug" (that one has its own entry).
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${entries.map(([written]) => escape(written)).join("|")})(?![\\p{L}\\p{N}])`, "gu");
  const spoken = Object.fromEntries(entries);
  return text.replace(pattern, (match) => spoken[match] ?? match);
}
