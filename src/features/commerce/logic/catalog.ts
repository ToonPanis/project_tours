import type { ProductPrice } from "@/types/commerce";
import { MAX_PRODUCT_NAME_LENGTH } from "../config";
import { parseEuroAmount } from "./money";

/** The price that applies at `now`: the newest one whose `validFrom` has passed. */
export function currentPrice(prices: ProductPrice[], now: Date): ProductPrice | null {
  let current: ProductPrice | null = null;
  for (const price of prices) {
    if (Date.parse(price.validFrom) > now.getTime()) continue;
    if (!current || Date.parse(price.validFrom) >= Date.parse(current.validFrom)) current = price;
  }
  return current;
}

/** What an admin may change about a product. Every field is optional. */
export interface ProductUpdate {
  name?: string;
  active?: boolean;
  /** A category id from the tax settings (the service checks it exists), or null. */
  taxCategoryId?: string | null;
}

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * Checks a product update from the admin page field by field. Anything else in
 * the body is ignored, so a request can never set e.g. the id or the walk.
 */
export function parseProductUpdate(body: unknown): Parsed<ProductUpdate> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "invalid-body" };
  const input = body as Record<string, unknown>;
  const update: ProductUpdate = {};

  if ("name" in input) {
    const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
    if (name.length < 1 || name.length > MAX_PRODUCT_NAME_LENGTH) return { ok: false, error: "invalid-name" };
    update.name = name;
  }
  if ("active" in input) {
    if (typeof input.active !== "boolean") return { ok: false, error: "invalid-active" };
    update.active = input.active;
  }
  if ("taxCategoryId" in input) {
    const category = input.taxCategoryId;
    if (category !== null && !(typeof category === "string" && /^[a-z0-9][a-z0-9-]{0,29}$/.test(category))) {
      return { ok: false, error: "invalid-tax-category" };
    }
    update.taxCategoryId = category;
  }
  if (Object.keys(update).length === 0) return { ok: false, error: "nothing-to-update" };
  return { ok: true, value: update };
}

/** A new price from the admin page: { amount: "14,95" } → 1495 cents. */
export function parsePriceInput(body: unknown): Parsed<number> {
  const amount = typeof body === "object" && body !== null && "amount" in body ? body.amount : null;
  const cents = parseEuroAmount(amount);
  return cents === null ? { ok: false, error: "invalid-amount" } : { ok: true, value: cents };
}
