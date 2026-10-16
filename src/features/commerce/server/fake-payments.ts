import type { TaxSettings } from "@/types/commerce";
import { ensureStarterCatalog, updateProduct } from "./catalog-service";
import type { CommerceContext } from "./context";
import { handlePaymentEvent } from "./fulfilment-service";
import { fakePaymentsAllowed } from "./fake-payment-gateway";
import { fail, ok, type ServiceResult } from "./result";
import { updateTaxSettings } from "./tax-service";

/** Browser tests only: see fake-payment-gateway.ts. */
const TEST_ACTOR = { id: "browser-tests", email: "browser-tests@example.invalid" };

/**
 * Prepares the shop of the test server: the starter catalogue, the tax
 * settings the TEST sends (the code holds no VAT rate, decision B8) and every
 * product on sale.
 */
export async function seedTestShop(ctx: CommerceContext, body: unknown): Promise<ServiceResult<TaxSettings>> {
  if (!fakePaymentsAllowed()) return fail(404, "not-found");
  const tax = typeof body === "object" && body !== null && "tax" in body ? body.tax : null;
  await ensureStarterCatalog(ctx);
  const settings = await updateTaxSettings(ctx, TEST_ACTOR, tax);
  if (!settings.ok) return settings;
  const categoryId = settings.data.categories[0]?.id ?? null;
  for (const product of await ctx.store.listProducts()) {
    await updateProduct(ctx, TEST_ACTOR, product.id, { taxCategoryId: categoryId, active: true });
  }
  return ok(settings.data);
}

/** "Pay" on the test payment page: the event Stripe would send, handled by the real webhook code. */
export async function payTestOrder(ctx: CommerceContext, body: unknown, baseUrl: string): Promise<ServiceResult<{ successUrl: string }>> {
  if (!fakePaymentsAllowed()) return fail(404, "not-found");
  const orderId = typeof body === "object" && body !== null && "order" in body ? body.order : null;
  const order = typeof orderId === "string" && orderId.length <= 100 ? await ctx.store.getOrder(orderId) : null;
  if (!order || !order.stripe.checkoutSessionId) return fail(404, "unknown-order");
  await handlePaymentEvent(
    ctx,
    {
      id: `evt_fake_${order.id}`,
      type: "checkout.completed",
      sessionId: order.stripe.checkoutSessionId,
      orderId: order.id,
      paymentStatus: "paid",
      amountTotal: order.totalCents,
      currency: "eur",
      paymentIntentId: `pi_fake_${order.id}`,
      customer: { email: "buyer@example.com", name: "Test Buyer", businessName: null, country: "BE", vatNumber: null },
    },
    baseUrl,
  );
  return ok({ successUrl: `/checkout/success?order=${encodeURIComponent(order.id)}` });
}
