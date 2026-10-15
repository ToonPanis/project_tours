import type { CatalogEntry, Product } from "@/types/commerce";
import { currentPrice, parsePriceInput, parseProductUpdate } from "../logic/catalog";
import { STARTER_PRODUCTS } from "../logic/starter-catalog";
import type { CommerceContext } from "./context";
import { fail, ok, type ServiceResult } from "./result";
import { recordAudit, type Actor } from "./support";

/**
 * The product catalogue: what can be sold and at what price, managed in
 * /admin/products without code changes. Every change is written to the audit log.
 */

/**
 * Adds the starter products that don't exist yet (inactive, see starter-catalog.ts).
 * Safe to call any number of times: an existing product is never changed.
 */
export async function ensureStarterCatalog(ctx: CommerceContext): Promise<void> {
  const now = ctx.now().toISOString();
  const added: string[] = [];
  for (const [index, starter] of STARTER_PRODUCTS.entries()) {
    const product: Product = {
      id: starter.id,
      walkSlug: starter.walkSlug,
      name: starter.name,
      unit: "person",
      active: false,
      vatRateBasisPoints: null,
      sortOrder: index,
      createdAt: now,
      updatedAt: now,
    };
    if (await ctx.store.insertProductIfMissing(product)) {
      await ctx.store.addPrice({
        id: ctx.newId(),
        productId: product.id,
        amountCents: starter.priceCents,
        currency: "EUR",
        validFrom: now,
        createdBy: "system",
      });
      added.push(product.id);
    }
  }
  if (added.length > 0) await recordAudit(ctx, null, "catalog-seeded", "catalog", { products: added.join(",") });
}

/** Every product with its price today, in catalogue order. */
export async function listCatalog(ctx: CommerceContext): Promise<CatalogEntry[]> {
  await ensureStarterCatalog(ctx);
  const products = (await ctx.store.listProducts()).sort((a, b) => a.sortOrder - b.sortOrder);
  const now = ctx.now();
  return Promise.all(
    products.map(async (product) => ({ product, currentPrice: currentPrice(await ctx.store.listPrices(product.id), now) })),
  );
}

/** Changes a product's name, VAT rate or active state. */
export async function updateProduct(ctx: CommerceContext, admin: Actor, productId: string, body: unknown): Promise<ServiceResult<Product>> {
  const parsed = parseProductUpdate(body);
  if (!parsed.ok) return fail(400, parsed.error);
  const product = await ctx.store.getProduct(productId);
  if (!product) return fail(404, "unknown-product");

  const updated: Product = { ...product, ...parsed.value, updatedAt: ctx.now().toISOString() };
  // A product can only be sold with a known VAT rate and a price (decision B8: the accountant sets the rate).
  if (updated.active && updated.vatRateBasisPoints === null) return fail(409, "vat-rate-required");
  if (updated.active && !currentPrice(await ctx.store.listPrices(productId), ctx.now())) return fail(409, "price-required");

  await ctx.store.saveProduct(updated);
  // Only what changed, as "old → new", so the log reads like a history.
  const changes: Record<string, string> = {};
  for (const field of ["name", "active", "vatRateBasisPoints"] as const) {
    if (product[field] !== updated[field]) changes[field] = `${String(product[field])} → ${String(updated[field])}`;
  }
  if (Object.keys(changes).length > 0) await recordAudit(ctx, admin, "product-updated", `product:${productId}`, changes);
  return ok(updated);
}

/** Sets a new price from now on. The old price stays in the history. */
export async function setPrice(ctx: CommerceContext, admin: Actor, productId: string, body: unknown): Promise<ServiceResult<CatalogEntry>> {
  const parsed = parsePriceInput(body);
  if (!parsed.ok) return fail(400, parsed.error);
  const product = await ctx.store.getProduct(productId);
  if (!product) return fail(404, "unknown-product");

  const before = currentPrice(await ctx.store.listPrices(productId), ctx.now());
  const price = {
    id: ctx.newId(),
    productId,
    amountCents: parsed.value,
    currency: "EUR" as const,
    validFrom: ctx.now().toISOString(),
    createdBy: admin.email,
  };
  await ctx.store.addPrice(price);
  await recordAudit(ctx, admin, "price-set", `product:${productId}`, { fromCents: before?.amountCents ?? null, toCents: price.amountCents });
  return ok({ product, currentPrice: price });
}

/** One page of the audit log, newest first. */
export async function listAuditPage(ctx: CommerceContext, page: number, pageSize: number) {
  const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
  const { entries, total } = await ctx.store.listAudit({ skip: (safePage - 1) * pageSize, limit: pageSize });
  return { entries, total, page: safePage, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}
