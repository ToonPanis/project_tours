import { MAX_PRICE_CENTS } from "../config";

/**
 * Money is a whole number of euro cents everywhere (never 7.95, always 795):
 * decimals in JavaScript can't hold every cent exactly (0.1 + 0.2 !== 0.3).
 */

/** True for a sellable price: a whole number of cents, at least 1 cent, at most MAX_PRICE_CENTS. */
export function isValidPriceCents(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= MAX_PRICE_CENTS;
}

/**
 * Reads an amount in euros as an admin types it ("7,95", "7.95", "€ 12", "14")
 * and returns cents, or null when it isn't a valid price. At most two decimals;
 * no thousands separators (a price above €999 is never typed with one here).
 */
export function parseEuroAmount(input: unknown): number | null {
  if (typeof input !== "string") return null;
  const cleaned = input.trim().replace(/^€\s*/, "").replace(/\s*€$/, "");
  const match = /^(\d{1,5})(?:[.,](\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;
  const euros = Number(match[1]);
  const cents = Number((match[2] ?? "0").padEnd(2, "0"));
  const total = euros * 100 + cents;
  return isValidPriceCents(total) ? total : null;
}

/**
 * Splits a price that includes VAT into the part without VAT and the VAT.
 * The net part is rounded to the nearest cent and the VAT is the rest, so
 * net + vat is always exactly the price paid.
 *
 * Example: €14.95 at 21 % → net 1236 + VAT 259 = 1495.
 */
export function splitGrossAmount(grossCents: number, vatRateBasisPoints: number): { netCents: number; vatCents: number } {
  const netCents = Math.round((grossCents * 10_000) / (10_000 + vatRateBasisPoints));
  return { netCents, vatCents: grossCents - netCents };
}
