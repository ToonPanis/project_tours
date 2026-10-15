import type { Discount } from "@/types/commerce";
import type { Parsed } from "./catalog";
import { parseEuroAmount } from "./money";
import { normalizeDiscountCode } from "./pricing";

export type DiscountInput = Pick<Discount, "code" | "kind" | "value" | "productIds" | "validFrom" | "validUntil" | "maxRedemptions">;

/** "2026-11-01" (from a date field) → midnight UTC of that day; "" or null → no date; anything else → undefined (invalid). */
function parseDay(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * The admin's "new discount code" form, checked field by field.
 * Percent: a whole number 1–100. Fixed: euros as typed ("5" or "2,50").
 * Dates are whole days (UTC); "until" means up to the start of that day.
 */
export function parseDiscountInput(body: unknown, knownProductIds: string[]): Parsed<DiscountInput> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "invalid-body" };
  const input = body as Record<string, unknown>;

  const code = normalizeDiscountCode(input.code);
  if (!code) return { ok: false, error: "invalid-code" };

  let kind: Discount["kind"];
  let value: number;
  if (input.kind === "percent") {
    const percent = typeof input.value === "string" ? Number(input.value) : input.value;
    if (typeof percent !== "number" || !Number.isInteger(percent) || percent < 1 || percent > 100) return { ok: false, error: "invalid-value" };
    kind = "percent";
    value = percent;
  } else if (input.kind === "fixed") {
    const cents = parseEuroAmount(typeof input.value === "number" ? String(input.value) : input.value);
    if (cents === null) return { ok: false, error: "invalid-value" };
    kind = "fixed";
    value = cents;
  } else {
    return { ok: false, error: "invalid-kind" };
  }

  const productIds = Array.isArray(input.productIds) ? input.productIds : [];
  if (!productIds.every((id): id is string => typeof id === "string" && knownProductIds.includes(id))) return { ok: false, error: "unknown-product" };

  const validFrom = parseDay(input.validFrom);
  const validUntil = parseDay(input.validUntil);
  if (validFrom === undefined || validUntil === undefined) return { ok: false, error: "invalid-dates" };
  if (validFrom && validUntil && validUntil <= validFrom) return { ok: false, error: "invalid-dates" };

  let maxRedemptions: number | null = null;
  if (input.maxRedemptions !== null && input.maxRedemptions !== undefined && input.maxRedemptions !== "") {
    const max = typeof input.maxRedemptions === "string" ? Number(input.maxRedemptions) : input.maxRedemptions;
    if (typeof max !== "number" || !Number.isInteger(max) || max < 1 || max > 1_000_000) return { ok: false, error: "invalid-max" };
    maxRedemptions = max;
  }

  return { ok: true, value: { code, kind, value, productIds: [...new Set(productIds)], validFrom, validUntil, maxRedemptions } };
}
