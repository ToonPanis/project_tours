import type { Discount, OrderLine, Product, ProductPrice } from "@/types/commerce";
import { MAX_PERSONS_PER_ORDER, MAX_PRICE_CENTS, MIN_ORDER_CENTS } from "../config";
import type { Parsed } from "./catalog";

/**
 * The amount of an order, worked out on the server only. The browser sends
 * what it wants (product, number of persons, a code); the price always comes
 * from the catalogue, so a changed request can't change what is paid.
 */

export interface PricedOrder {
  line: OrderLine;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
}

/** Why a discount code can't be used: an error code for the buyer's screen. */
export function discountProblem(discount: Discount | null, productId: string, now: Date): string | null {
  if (!discount || !discount.active) return "unknown-discount";
  if (discount.validFrom && Date.parse(discount.validFrom) > now.getTime()) return "discount-not-valid-yet";
  if (discount.validUntil && Date.parse(discount.validUntil) <= now.getTime()) return "discount-expired";
  if (discount.productIds.length > 0 && !discount.productIds.includes(productId)) return "discount-not-for-product";
  if (discount.maxRedemptions !== null && discount.redemptions >= discount.maxRedemptions) return "discount-used-up";
  return null;
}

/** How many cents a discount takes off a subtotal (never more than the subtotal). */
export function discountAmount(discount: Discount, subtotalCents: number): number {
  const amount = discount.kind === "percent" ? Math.round((subtotalCents * discount.value) / 100) : discount.value;
  return Math.min(amount, subtotalCents);
}

export function priceOrder(
  product: Product,
  price: ProductPrice,
  quantity: unknown,
  discount: Discount | null,
): Parsed<PricedOrder> {
  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PERSONS_PER_ORDER) {
    return { ok: false, error: "invalid-quantity" };
  }
  const subtotalCents = price.amountCents * quantity;
  if (subtotalCents > MAX_PRICE_CENTS * 10) return { ok: false, error: "invalid-quantity" };
  const discountCents = discount ? discountAmount(discount, subtotalCents) : 0;
  const totalCents = subtotalCents - discountCents;
  // A free order can't go through Stripe; free tickets are given out by an admin instead (later phase).
  if (totalCents < MIN_ORDER_CENTS) return { ok: false, error: "total-too-low" };
  return {
    ok: true,
    value: {
      line: {
        productId: product.id,
        productName: product.name,
        walkSlug: product.walkSlug,
        quantity,
        unitPriceCents: price.amountCents,
        totalCents: subtotalCents,
      },
      subtotalCents,
      discountCents,
      totalCents,
    },
  };
}

/** A discount code as typed: trimmed, upper case, 3–30 letters, digits or dashes; null otherwise. */
export function normalizeDiscountCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z0-9-]{3,30}$/.test(code) ? code : null;
}
