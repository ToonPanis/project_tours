import type { Difficulty, Price } from "@/types/walk";

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

/** 4500 → "4.5 km", 800 → "800 m" */
export function formatDistance(meters: number): string {
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
