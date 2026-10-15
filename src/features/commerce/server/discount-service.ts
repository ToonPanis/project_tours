import type { Discount } from "@/types/commerce";
import { parseDiscountInput } from "../logic/discounts";
import type { CommerceContext } from "./context";
import { fail, ok, type ServiceResult } from "./result";
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
