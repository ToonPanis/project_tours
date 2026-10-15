import type { TaxSettings } from "@/types/commerce";
import { defaultTaxSettings, parseTaxSettingsInput } from "../logic/tax";
import type { CommerceContext } from "./context";
import { fail, ok, type ServiceResult } from "./result";
import { recordAudit, type Actor } from "./support";

/** The current tax settings (the defaults, "not configured", until an admin saved some). */
export async function getTaxSettings(ctx: CommerceContext): Promise<TaxSettings> {
  return (await ctx.store.getTaxSettings()) ?? defaultTaxSettings();
}

/**
 * Saves the admin's tax form as a new version. Changing anything withdraws
 * the accountant's confirmation, unless this very save confirms it again: a
 * changed rate can never stay "confirmed" by accident.
 */
export async function updateTaxSettings(ctx: CommerceContext, admin: Actor, body: unknown): Promise<ServiceResult<TaxSettings>> {
  const parsed = parseTaxSettingsInput(body);
  if (!parsed.ok) return fail(400, parsed.error);

  const current = await getTaxSettings(ctx);
  const next: TaxSettings = {
    ...parsed.value,
    version: current.version + 1,
    updatedAt: ctx.now().toISOString(),
    updatedBy: admin.email,
  };
  // Categories still used by products can't disappear.
  const removed = current.categories.filter((category) => !next.categories.some((kept) => kept.id === category.id));
  if (removed.length > 0) {
    const products = await ctx.store.listProducts();
    if (products.some((product) => removed.some((category) => category.id === product.taxCategoryId))) {
      return fail(409, "category-in-use");
    }
  }

  if (!(await ctx.store.insertTaxSettings(next))) return fail(409, "saved-at-the-same-time");
  await recordAudit(ctx, admin, "tax-settings-updated", "tax-settings", {
    version: next.version,
    regime: next.regime,
    categories: next.categories.map((category) => `${category.id}=${category.rateBasisPoints / 100}%`).join(", ") || null,
    ossEnabled: next.ossEnabled,
    ossRates: next.ossRates.length,
    confirmedByAccountant: next.confirmedByAccountant,
  });
  return ok(next);
}
