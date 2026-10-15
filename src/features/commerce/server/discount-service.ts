import type { Discount } from "@/types/commerce";
import { MAX_BATCH_CODES } from "../config";
import { parseDiscountInput } from "../logic/discounts";
import type { CommerceContext } from "./context";
import { fail, ok, type ServiceResult } from "./result";
import { randomCode } from "./review-service";
import { recordAudit, type Actor } from "./support";

/**
 * Discount codes, created in /admin/discounts. Checked on the server at
 * checkout only (never trusted from the browser); a use is reserved when the
 * payment page opens and given back when it expires or fails.
 */

export async function createDiscount(ctx: CommerceContext, admin: Actor, body: unknown): Promise<ServiceResult<Discount>> {
  const products = await ctx.store.listProducts();
  const parsed = parseDiscountInput(body, products.map((product) => product.id));
  if (!parsed.ok) return fail(400, parsed.error);

  const discount: Discount = {
    id: ctx.newId(),
    ...parsed.value,
    redemptions: 0,
    active: true,
    createdAt: ctx.now().toISOString(),
    createdBy: admin.email,
  };
  if (!(await ctx.store.insertDiscount(discount))) return fail(409, "code-exists");
  await recordAudit(ctx, admin, "discount-created", `discount:${discount.code}`, {
    kind: discount.kind,
    value: discount.value,
    products: discount.productIds.join(",") || "all",
    validFrom: discount.validFrom,
    validUntil: discount.validUntil,
    maxRedemptions: discount.maxRedemptions,
  });
  return ok(discount);
}

/** Switches a code on or off (codes are never deleted: orders refer to them). */
export async function setDiscountActive(ctx: CommerceContext, admin: Actor, discountId: string, body: unknown): Promise<ServiceResult<Discount>> {
  const active = typeof body === "object" && body !== null && "active" in body ? body.active : null;
  if (typeof active !== "boolean") return fail(400, "invalid-active");
  const discount = await ctx.store.getDiscount(discountId);
  if (!discount) return fail(404, "unknown-discount");
  if (discount.active !== active) {
    await ctx.store.updateDiscount(discountId, { active });
    await recordAudit(ctx, admin, "discount-updated", `discount:${discount.code}`, { active: `${discount.active} → ${active}` });
  }
  return ok({ ...discount, active });
}

export function listDiscounts(ctx: CommerceContext): Promise<Discount[]> {
  return ctx.store.listDiscounts();
}

/**
 * P8 (brief 7.3, "unique codes per customer"): `count` codes that each work
 * ONCE, e.g. to hand out at an event or to send one per customer. They share
 * the rules of the form; the code field is the prefix ("SPRING" → SPRING-7K2M9QXA).
 * The codes are returned once, to copy; the admin list shows the batch as one line.
 */
export async function createDiscountBatch(ctx: CommerceContext, admin: Actor, body: unknown): Promise<ServiceResult<{ batchId: string; codes: string[] }>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const count = typeof input.count === "string" ? Number(input.count) : input.count;
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1 || count > MAX_BATCH_CODES) return fail(400, "invalid-count");
  const products = await ctx.store.listProducts();
  // The prefix is checked like a code (letters, digits, dashes); every code then gets its own random part.
  const parsed = parseDiscountInput({ ...input, maxRedemptions: "1" }, products.map((product) => product.id));
  if (!parsed.ok) return fail(400, parsed.error);
  if (parsed.value.code.length > 20) return fail(400, "invalid-code");

  const batchId = ctx.newId();
  const codes: string[] = [];
  while (codes.length < count) {
    const discount: Discount = {
      id: ctx.newId(),
      ...parsed.value,
      code: randomCode(parsed.value.code),
      maxRedemptions: 1,
      redemptions: 0,
      active: true,
      createdAt: ctx.now().toISOString(),
      createdBy: admin.email,
      source: "batch",
      batchId,
      forOrderId: null,
    };
    if (await ctx.store.insertDiscount(discount)) codes.push(discount.code);
  }
  await recordAudit(ctx, admin, "discount-batch-created", `discount-batch:${batchId}`, {
    prefix: parsed.value.code,
    count,
    kind: parsed.value.kind,
    value: parsed.value.value,
    products: parsed.value.productIds.join(",") || "all",
    validUntil: parsed.value.validUntil,
  });
  return ok({ batchId, codes });
}

/**
 * P8, a full refund: the order's code use is given back (the customer didn't
 * get what they used it for), and review-reward codes earned with that order
 * are switched off if they weren't used yet. Called once per order (by the
 * refund that made it "refunded").
 */
export async function applyRefundToDiscounts(ctx: CommerceContext, orderId: string, usedDiscountId: string | null): Promise<void> {
  if (usedDiscountId) await ctx.store.releaseDiscount(usedDiscountId);
  for (const reward of (await ctx.store.listDiscounts()).filter((discount) => discount.forOrderId === orderId && discount.active && discount.redemptions === 0)) {
    await ctx.store.updateDiscount(reward.id, { active: false });
  }
}
