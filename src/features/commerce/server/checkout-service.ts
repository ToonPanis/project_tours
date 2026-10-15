import { isLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { Discount, Order, Product, ProductPrice } from "@/types/commerce";
import { CHECKOUT_LIFETIME_MS } from "../config";
import { currentPrice } from "../logic/catalog";
import { discountProblem, normalizeDiscountCode, priceOrder } from "../logic/pricing";
import { taxAllowsSales, taxBasisFor } from "../logic/tax";
import { hashSecret, type CommerceContext } from "./context";
import { PaymentProviderError } from "./payment-gateway";
import { fail, ok, type ServiceResult } from "./result";
import { getTaxSettings } from "./tax-service";

/**
 * Starting a payment. The browser only says WHAT it wants (product, persons,
 * optional code, language); everything that costs money is decided here:
 * the price from the catalogue, the discount, the tax basis. The order is
 * saved as "pending" before Stripe is asked for a payment page, and only the
 * webhook can make it "paid".
 */

export interface SaleOffer {
  product: Product;
  price: ProductPrice;
}

/**
 * The product on sale for a walk, or null when nothing can be bought:
 * sales closed (flag off or tax not confirmed), product inactive, no price
 * or no tax category. The detail page shows the buy box only with an offer.
 */
export async function saleOfferForWalk(ctx: CommerceContext, walkSlug: string): Promise<SaleOffer | null> {
  if (!ctx.salesEnabled) return null;
  const settings = await getTaxSettings(ctx);
  if (!taxAllowsSales(settings)) return null;
  const product = (await ctx.store.listProducts()).find((candidate) => candidate.walkSlug === walkSlug && candidate.active);
  if (!product || !settings.categories.some((category) => category.id === product.taxCategoryId)) return null;
  const price = currentPrice(await ctx.store.listPrices(product.id), ctx.now());
  return price ? { product, price } : null;
}

/** What the success page may show the buyer (only with the buyer's own cookie). */
export interface BuyerOrderView {
  status: Order["status"];
  email: string | null;
  quantity: number;
  ticketUrl: string | null;
  receiptNumber: string | null;
  businessName: string | null;
}

/**
 * The order behind the success page. Stripe sends the buyer back with
 * ?order=<id>, but the id alone proves nothing: the browser must also have the
 * buyer cookie set when the payment started (compared by hash). The page shows
 * the status from OUR database, which only the webhook makes "paid".
 */
export async function buyerOrderView(
  ctx: CommerceContext,
  orderId: string,
  buyerSecret: string | undefined,
  makeTicketUrl: (grantId: string) => string,
): Promise<BuyerOrderView | null> {
  if (!buyerSecret || buyerSecret.length > 100 || orderId.length > 100) return null;
  const order = await ctx.store.getOrder(orderId);
  if (!order || order.buyerTokenHash !== hashSecret(buyerSecret)) return null;
  const grant = order.status === "paid" ? await ctx.store.getGrantByOrder(order.id) : null;
  const documents = order.status === "paid" ? await ctx.store.listDocumentsForOrder(order.id) : [];
  const receipt = documents.find((document) => document.kind === "receipt");
  return {
    status: order.status,
    email: order.email,
    quantity: order.lines[0].quantity,
    ticketUrl: grant && grant.status === "active" ? makeTicketUrl(grant.id) : null,
    receiptNumber: receipt?.number ?? null,
    businessName: order.customer?.type === "business" ? (order.customer.businessName ?? order.customer.name) : null,
  };
}

export interface StartedCheckout {
  orderId: string;
  /** Stripe's payment page. */
  url: string;
  /** For the buyer's cookie (the success page uses it); only its hash is in the order. */
  buyerSecret: string;
}

export async function startCheckout(ctx: CommerceContext, body: unknown, baseUrl: string): Promise<ServiceResult<StartedCheckout>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  if (typeof input.walkSlug !== "string" || input.walkSlug.length > 100) return fail(400, "unknown-product");

  const offer = await saleOfferForWalk(ctx, input.walkSlug);
  if (!offer) return fail(403, ctx.salesEnabled ? "unknown-product" : "sales-closed");
  const { product, price } = offer;
  const now = ctx.now();

  let discount: Discount | null = null;
  if (input.discountCode !== undefined && input.discountCode !== null && input.discountCode !== "") {
    const code = normalizeDiscountCode(input.discountCode);
    discount = code ? await ctx.store.getDiscountByCode(code) : null;
    const problem = discountProblem(discount, product.id, now);
    if (problem) return fail(400, problem);
  }

  const priced = priceOrder(product, price, input.quantity, discount);
  if (!priced.ok) return fail(400, priced.error);

  // Reserve a use of the code now (atomic), so a limited code can't be used by more buyers at once.
  if (discount && !(await ctx.store.reserveDiscount(discount.id))) return fail(409, "discount-used-up");

  const settings = await getTaxSettings(ctx);
  const locale = isLocale(input.locale) ? input.locale : "en";
  const buyerSecret = ctx.newSecret();
  const order: Order = {
    id: ctx.newId(),
    status: "pending",
    lines: [priced.value.line],
    subtotalCents: priced.value.subtotalCents,
    discount: discount ? { discountId: discount.id, code: discount.code, amountCents: priced.value.discountCents } : null,
    totalCents: priced.value.totalCents,
    currency: "EUR",
    locale,
    buyerTokenHash: hashSecret(buyerSecret),
    email: null,
    customer: null,
    // What the tax settings say today, copied into the order (decision B8).
    taxBasis: taxBasisFor(settings, product.taxCategoryId),
    tax: null,
    stripe: { checkoutSessionId: null, paymentIntentId: null },
    refundedCents: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    paidAt: null,
  };
  await ctx.store.insertOrder(order);

  const t = createTranslator(locale);
  try {
    const session = await ctx.payments.createCheckout({
      orderId: order.id,
      description: `${product.name} · ${t.plural("commerce.persons", priced.value.line.quantity)}`,
      amountCents: order.totalCents,
      locale,
      successUrl: `${baseUrl}/checkout/success?order=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/canceled?walk=${encodeURIComponent(product.walkSlug)}`,
      expiresAt: new Date(now.getTime() + CHECKOUT_LIFETIME_MS),
    });
    await ctx.store.updateOrder(order.id, { stripe: { checkoutSessionId: session.sessionId, paymentIntentId: null } });
    return ok({ orderId: order.id, url: session.url, buyerSecret });
  } catch (error) {
    // Stripe unreachable or not configured: nothing was charged; undo the order and the code's use.
    if (!(error instanceof PaymentProviderError)) throw error;
    console.error(`[Hidden Antwerp] checkout failed: ${error.code}`);
    await ctx.store.transitionOrder(order.id, ["pending"], { status: "failed", updatedAt: ctx.now().toISOString() });
    if (discount) await ctx.store.releaseDiscount(discount.id);
    return fail(503, "payments-unavailable");
  }
}
