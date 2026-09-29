import type { Translator } from "@/i18n/translate";
import type { LanguageCode } from "@/types/common";
import type { Difficulty, DurationRange, Price } from "@/types/walk";

/**
 * Formatting for walk facts. Every function takes the translator of the
 * current language (English when omitted), so numbers, units and words follow
 * the visitor's language: "4.5 km" / "4,5 km", "2 h 30 min" / "2 Std. 30 Min.".
 */

/** 1295 cents → "€12.95" (English), "€ 12,95" (Dutch), "12,95 €" (French). */
export function formatPrice(price: Price, locale = "en-BE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: price.currency,
    // "€" in every language (some, like Ukrainian, would otherwise write "EUR").
    currencyDisplay: "narrowSymbol",
  }).format(price.amountInCents / 100);
}

/** 150 → "2 h 30 min", 45 → "45 min", 120 → "2 h" */
export function formatDuration(totalMinutes: number, t: Translator): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return t("common.units.minutes", { value: minutes });
  if (minutes === 0) return t("common.units.hours", { value: hours });
  return t("common.units.hoursMinutes", { hours, minutes });
}

/** {120, 180} → "2–3 h", {30, 45} → "30–45 min", {90, 120} → "1 h 30 min – 2 h" */
export function formatDurationRange({ minMinutes, maxMinutes }: DurationRange, t: Translator): string {
  if (minMinutes === maxMinutes) return formatDuration(minMinutes, t);

  const range = (from: number, to: number) => t("common.units.range", { from, to });
  const bothWholeHours = minMinutes % 60 === 0 && maxMinutes % 60 === 0;
  if (bothWholeHours) return t("common.units.hours", { value: range(minMinutes / 60, maxMinutes / 60) });
  if (maxMinutes < 60) return t("common.units.minutes", { value: range(minMinutes, maxMinutes) });

  return `${formatDuration(minMinutes, t)} – ${formatDuration(maxMinutes, t)}`;
}

/** 4500 → "4.5 km", 800 → "800 m", null → "To be confirmed" */
export function formatDistance(meters: number | null, t: Translator): string {
  if (meters === null) return t("walks.stats.toBeConfirmed");
  if (meters < 1000) return t("common.units.meters", { value: meters });
  // Show at most one decimal, and drop ".0" (4000 → "4 km").
  return t("common.units.kilometers", { value: Number((meters / 1000).toFixed(1)) });
}

export function formatDifficulty(difficulty: Difficulty, t: Translator): string {
  return t(`walks.difficulty.${difficulty}`);
}

/** ["en", "nl"] → "English and Dutch" (in English), "Engels en Nederlands" (in Dutch). */
export function formatLanguages(languages: LanguageCode[], t: Translator): string {
  const names = new Intl.DisplayNames([t.locale], { type: "language" });
  const list = new Intl.ListFormat(t.locale, { style: "long", type: "conjunction" });
  const text = list.format(languages.map((language) => names.of(language) ?? language));
  // Many languages write language names in lower case ("anglais et néerlandais"); only the start gets a capital.
  return text.charAt(0).toLocaleUpperCase(t.locale) + text.slice(1);
}

/** "2026-09-26" → "September 26, 2026" / "26 september 2026" / "26 septembre 2026". */
export function formatDate(isoDate: string, locale: string): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
}
