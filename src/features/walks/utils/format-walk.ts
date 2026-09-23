import type { LanguageCode } from "@/types/common";
import type { Difficulty, DurationRange, Price } from "@/types/walk";

/** 1295 cents → "€12.95" */
export function formatPrice(price: Price, locale = "en-BE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: price.currency,
  }).format(price.amountInCents / 100);
}

/** 150 → "2 h 30 min", 45 → "45 min", 120 → "2 h" */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

/** {120, 180} → "2–3 h", {30, 45} → "30–45 min", {90, 120} → "1 h 30 min – 2 h" */
export function formatDurationRange({ minMinutes, maxMinutes }: DurationRange): string {
  if (minMinutes === maxMinutes) return formatDuration(minMinutes);

  const bothWholeHours = minMinutes % 60 === 0 && maxMinutes % 60 === 0;
  if (bothWholeHours) return `${minMinutes / 60}–${maxMinutes / 60} h`;
  if (maxMinutes < 60) return `${minMinutes}–${maxMinutes} min`;

  return `${formatDuration(minMinutes)} – ${formatDuration(maxMinutes)}`;
}

/** 4500 → "4.5 km", 800 → "800 m", null → "To be confirmed" */
export function formatDistance(meters: number | null): string {
  if (meters === null) return "To be confirmed";
  if (meters < 1000) return `${meters} m`;
  const kilometers = meters / 1000;
  // Show at most one decimal, and drop ".0" (4000 → "4 km").
  return `${Number(kilometers.toFixed(1))} km`;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
};

export function formatDifficulty(difficulty: Difficulty): string {
  return difficultyLabels[difficulty];
}

const languageLabels: Record<LanguageCode, string> = {
  en: "English",
  nl: "Dutch",
  fr: "French",
  de: "German",
};

/** ["en", "nl"] → "English, Dutch" */
export function formatLanguages(languages: LanguageCode[]): string {
  return languages.map((language) => languageLabels[language]).join(", ");
}
