import { describe, expect, test, vi } from "vitest";
import { createTranslator } from "@/i18n/translate";
import { CHECKOUT_LIFETIME_MS } from "@/features/commerce/config";
import { buyerOrderView, saleOfferForWalk, startCheckout } from "@/features/commerce/server/checkout-service";
import { createDiscount } from "@/features/commerce/server/discount-service";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { handlePaymentEvent } from "@/features/commerce/server/fulfilment-service";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { refundOrder } from "@/features/commerce/server/order-admin-service";
import { updateTaxSettings } from "@/features/commerce/server/tax-service";
import { BASE_URL, sha256, testCommerceContext, ticketTokenFrom } from "./fixtures/commerce-context";
import { ADMIN, nextEventId, openSales, paidEvent, SOLD, TEST_TAX } from "./fixtures/commerce-sales";

/**
 * The whole payment flow without Stripe: the checkout service talks to a fake
 * gateway, and the webhook events are the ones Stripe would send. Covers the
 * brief's list: success, failure, cancel, duplicate and concurrent webhooks,
 * amount manipulation, discount codes, refunds, invoices and Stripe outages.
 */

type Setup = ReturnType<typeof testCommerceContext>;

async function buy(setup: Setup, body: Record<string, unknown> = {}) {
  const result = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 3, locale: "nl", ...body }, BASE_URL);
  if (!result.ok) throw new Error(result.error);
  const order = await setup.store.getOrder(result.data.orderId);
  if (!order?.stripe.checkoutSessionId) throw new Error("no session");
  return { ...result.data, order, sessionId: order.stripe.checkoutSessionId };
}

async function salesSetup() {
  const setup = testCommerceContext({ salesEnabled: true });
  await openSales(setup.ctx);
  return setup;
}

describe("what can be bought", () => {
  test("nothing while sales are closed (COMMERCE_SALES_ENABLED off), even with everything else ready", async () => {
    const setup = testCommerceContext({ salesEnabled: false });
    await openSales(setup.ctx);
    expect(await saleOfferForWalk(setup.ctx, SOLD.walkSlug)).toBeNull();
    expect(await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1 }, BASE_URL)).toEqual({ ok: false, status: 403, error: "sales-closed" });
    expect(setup.payments.checkouts).toHaveLength(0);
  });

  test("nothing until the accountant confirmed the tax settings (decision B8)", async () => {
    const setup = testCommerceContext({ salesEnabled: true });
    await openSales(setup.ctx, { ...TEST_TAX, confirmedByAccountant: false });
    expect(await saleOfferForWalk(setup.ctx, SOLD.walkSlug)).toBeNull();
    expect((await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1 }, BASE_URL)).ok).toBe(false);
  });

  test("a walk whose product is off sale can't be bought", async () => {
    const setup = await salesSetup();
    expect(await saleOfferForWalk(setup.ctx, "hidden-pubs")).toBeNull();
    expect(await startCheckout(setup.ctx, { walkSlug: "hidden-pubs", quantity: 1 }, BASE_URL)).toEqual({ ok: false, status: 403, error: "unknown-product" });
  });

  test("with everything in place: the product and its price per person", async () => {
    const setup = await salesSetup();
    expect(await saleOfferForWalk(setup.ctx, SOLD.walkSlug)).toMatchObject({ product: { id: SOLD.id }, price: { amountCents: SOLD.priceCents } });
  });
});

describe("starting a payment", () => {
  test("the order is saved as pending with OUR price, and only that amount goes to Stripe", async () => {
    const setup = await salesSetup();
    const { order, url, buyerSecret } = await buy(setup, { quantity: 3 });
    expect(order).toMatchObject({ status: "pending", totalCents: SOLD.priceCents * 3, subtotalCents: SOLD.priceCents * 3, locale: "nl", email: null, tax: null });
    expect(order.lines[0]).toMatchObject({ productId: SOLD.id, quantity: 3, unitPriceCents: SOLD.priceCents });
    expect(order.buyerTokenHash).toBe(sha256(buyerSecret));
    expect(order.taxBasis).toMatchObject({ settingsVersion: 1, categoryId: "experience" });
    const [request] = setup.payments.checkouts;
    expect(request).toMatchObject({ orderId: order.id, amountCents: SOLD.priceCents * 3, locale: "nl" });
    expect(request.description).toContain(createTranslator("nl").plural("commerce.persons", 3));
    expect(request.successUrl).toBe(`${BASE_URL}/checkout/success?order=${order.id}`);
    expect(request.expiresAt.getTime() - setup.ctx.now().getTime()).toBe(CHECKOUT_LIFETIME_MS);
    expect(url).toContain(order.stripe.checkoutSessionId);
  });

  test("a price, total or product id sent by the browser is ignored (manipulation)", async () => {
    const setup = await salesSetup();
    const { order } = await buy(setup, { quantity: 2, amountCents: 1, totalCents: 1, unitPriceCents: 1, productId: "hidden-pubs" });
    expect(order.totalCents).toBe(SOLD.priceCents * 2);
    expect(setup.payments.checkouts[0].amountCents).toBe(SOLD.priceCents * 2);
  });

  test.each([0, 31, 2.5, "3", undefined])("refuses %j persons", async (quantity) => {
    const setup = await salesSetup();
    expect(await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity }, BASE_URL)).toEqual({ ok: false, status: 400, error: "invalid-quantity" });
  });

  test("an unknown language falls back to English", async () => {
    const setup = await salesSetup();
    const { order } = await buy(setup, { locale: "xx" });
    expect(order.locale).toBe("en");
  });

  test("Stripe unreachable: nothing charged, the order is marked failed and the code's use given back", async () => {
    const setup = await salesSetup();
    await createDiscount(setup.ctx, ADMIN, { code: "ONCE", kind: "percent", value: 10, maxRedemptions: 1 });
    vi.spyOn(console, "error").mockImplementation(() => {});
    setup.payments.failNext = "StripeConnectionError";
    expect(await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1, discountCode: "ONCE" }, BASE_URL)).toEqual({
      ok: false,
      status: 503,
      error: "payments-unavailable",
    });
    const { orders } = await setup.store.listOrders({ skip: 0, limit: 10 });
    expect(orders[0].status).toBe("failed");
    expect((await setup.store.getDiscountByCode("ONCE"))?.redemptions).toBe(0);
  });
});

describe("discount codes at checkout", () => {
  test("a valid code lowers the total sent to Stripe and is reserved", async () => {
    const setup = await salesSetup();
    await createDiscount(setup.ctx, ADMIN, { code: "WELCOME", kind: "percent", value: 10 });
    const { order } = await buy(setup, { quantity: 2, discountCode: " welcome " });
    const subtotal = SOLD.priceCents * 2;
    const off = Math.round(subtotal / 10);
    expect(order).toMatchObject({ subtotalCents: subtotal, totalCents: subtotal - off, discount: { code: "WELCOME", amountCents: off } });
    expect(setup.payments.checkouts[0].amountCents).toBe(subtotal - off);
    expect((await setup.store.getDiscountByCode("WELCOME"))?.redemptions).toBe(1);
  });

  test("a limited code can't be used by more buyers than allowed, also at the same moment", async () => {
    const setup = await salesSetup();
    await createDiscount(setup.ctx, ADMIN, { code: "ONLYONE", kind: "fixed", value: "1", maxRedemptions: 1 });
    const results = await Promise.all([
      startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1, discountCode: "ONLYONE" }, BASE_URL),
      startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1, discountCode: "ONLYONE" }, BASE_URL),
    ]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.find((result) => !result.ok)).toMatchObject({ error: "discount-used-up" });
  });

  test("unknown, expired or switched-off codes are refused before Stripe is asked", async () => {
    const setup = await salesSetup();
    await createDiscount(setup.ctx, ADMIN, { code: "OLD", kind: "percent", value: 10, validUntil: "2026-10-01" });
    expect(await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1, discountCode: "NOPE" }, BASE_URL)).toMatchObject({ error: "unknown-discount" });
    expect(await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1, discountCode: "OLD" }, BASE_URL)).toMatchObject({ error: "discount-expired" });
    expect(await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1, discountCode: "!" }, BASE_URL)).toMatchObject({ error: "unknown-discount" });
    expect(setup.payments.checkouts).toHaveLength(0);
  });
});

describe("the webhook: a successful payment", () => {
  test("makes the order paid, applies the VAT for the buyer's country, makes the ticket, receipt and email (in the buyer's language)", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup, { quantity: 3 });
    expect(await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }), BASE_URL)).toBe("fulfilled");

    const paid = await setup.store.getOrder(order.id);
    expect(paid).toMatchObject({ status: "paid", email: "buyer@example.com", customer: { type: "consumer", country: "BE" } });
    expect((paid?.tax?.netCents ?? 0) + (paid?.tax?.vatCents ?? 0)).toBe(order.totalCents);
    expect(paid?.tax?.rateBasisPoints).toBe((TEST_TAX.categories as { rateBasisPoints: number }[])[0].rateBasisPoints);

    const grant = await setup.store.getGrantByOrder(order.id);
    expect(grant).toMatchObject({ seats: 3, devicesUsed: 0, status: "active", walkSlug: SOLD.walkSlug });
    const [receipt] = await setup.store.listDocumentsForOrder(order.id);
    expect(receipt).toMatchObject({ kind: "receipt", provider: "internal", status: "issued", number: "R2026-000001", amountCents: order.totalCents });

    await deliverDueEmails(setup.ctx);
    const [email] = (setup.mailer as MemoryMailer).sent;
    const t = createTranslator("nl");
    expect(email.to).toBe("buyer@example.com");
    expect(email.subject).toBe(t("commerce.email.confirmation.subject", { product: SOLD.name }));
    expect(email.text).toContain("R2026-000001");
    expect(email.text).toContain(`${BASE_URL}/tickets/open#`);
    expect(ticketTokenFrom(email.text).startsWith(grant!.id)).toBe(true);
  });

  test("the same event twice: handled once (no second ticket, receipt or email)", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    const event = paidEvent({ id: order.id, totalCents: order.totalCents, sessionId });
    await handlePaymentEvent(setup.ctx, event, BASE_URL);
    expect(await handlePaymentEvent(setup.ctx, event, BASE_URL)).toBe("already-processed");
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(1);
    expect(await setup.store.listDocumentsForOrder(order.id)).toHaveLength(1);
  });

  test("the same event delivered twice AT THE SAME MOMENT: still one ticket, one receipt, one email", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    const event = paidEvent({ id: order.id, totalCents: order.totalCents, sessionId });
    await Promise.all([handlePaymentEvent(setup.ctx, event, BASE_URL), handlePaymentEvent(setup.ctx, event, BASE_URL)]);
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(1);
    expect(await setup.store.listDocumentsForOrder(order.id)).toHaveLength(1);
    expect((await setup.store.getGrantByOrder(order.id))?.seats).toBe(3);
  });

  test("two different events for the same payment (completed + async succeeded): one fulfilment", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }), BASE_URL);
    await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }, {}, { type: "checkout.async-succeeded" }), BASE_URL);
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(1);
  });

  test("a payment that doesn't match our order (amount, session, currency) gives nothing", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    vi.spyOn(console, "error").mockImplementation(() => {});
    const base = { id: order.id, totalCents: order.totalCents, sessionId };
    expect(await handlePaymentEvent(setup.ctx, paidEvent(base, {}, { amountTotal: 1 }), BASE_URL)).toBe("amount-mismatch");
    expect(await handlePaymentEvent(setup.ctx, paidEvent(base, {}, { sessionId: "cs_other" }), BASE_URL)).toBe("amount-mismatch");
    expect(await handlePaymentEvent(setup.ctx, paidEvent(base, {}, { currency: "usd" }), BASE_URL)).toBe("amount-mismatch");
    expect((await setup.store.getOrder(order.id))?.status).toBe("pending");
    expect(await setup.store.getGrantByOrder(order.id)).toBeNull();
  });

  test("a payment page that finished without payment yet waits for the later event", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    expect(await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }, {}, { paymentStatus: "unpaid" }), BASE_URL)).toBe(
      "waiting-for-payment",
    );
    expect((await setup.store.getOrder(order.id))?.status).toBe("pending");
  });

  test("an event for an order we don't know is acknowledged, not retried forever", async () => {
    const setup = await salesSetup();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await handlePaymentEvent(setup.ctx, paidEvent({ id: "unknown", totalCents: 100, sessionId: "cs_x" }), BASE_URL)).toBe("unknown-order");
    expect(await handlePaymentEvent(setup.ctx, { id: nextEventId(), type: "ignored", stripeType: "customer.created" }, BASE_URL)).toBe("ignored");
  });

  test("a business buyer (VAT number) gets an invoice request waiting for Billit, not a receipt", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }, { businessName: "Brewery NV", vatNumber: "BE0123456789" }), BASE_URL);
    const [invoice] = await setup.store.listDocumentsForOrder(order.id);
    expect(invoice).toMatchObject({ kind: "invoice", provider: "billit", status: "awaiting-provider", number: null });
    expect((await setup.store.getOrder(order.id))?.customer).toMatchObject({ type: "business", businessName: "Brewery NV", vatNumber: "BE0123456789" });
    const view = await buyerOrderView(setup.ctx, order.id, undefined, () => "");
    expect(view).toBeNull();
  });

  test("OSS: a buyer in another EU country with a set rate gets that rate (and it's kept with the order)", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }, { country: "NL" }), BASE_URL);
    expect((await setup.store.getOrder(order.id))?.tax).toMatchObject({ oss: true, country: "NL", rateBasisPoints: (TEST_TAX.ossRates as { rateBasisPoints: number }[])[0].rateBasisPoints });
  });

  test("an exempt business: no VAT, the accountant's mention in the email", async () => {
    const setup = testCommerceContext({ salesEnabled: true });
    await openSales(setup.ctx, { ...TEST_TAX, regime: "exempt", exemptionNote: "Exempt according to the accountant's text" });
    const { order, sessionId } = await buy(setup);
    await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }), BASE_URL);
    expect((await setup.store.getOrder(order.id))?.tax).toMatchObject({ vatCents: 0, note: "Exempt according to the accountant's text" });
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent[0].text).toContain("Exempt according to the accountant's text");
  });

  test("tax settings changed after the order was made: the order keeps what applied when it was made", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    await updateTaxSettings(setup.ctx, ADMIN, { ...TEST_TAX, categories: [{ id: "experience", label: "Experiences", rateBasisPoints: 100 }], ossRates: [] });
    await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }), BASE_URL);
    const paid = await setup.store.getOrder(order.id);
    expect(paid?.taxBasis.settingsVersion).toBe(1);
    expect(paid?.tax?.rateBasisPoints).toBe((TEST_TAX.categories as { rateBasisPoints: number }[])[0].rateBasisPoints);
  });
});

describe("the webhook: no payment", () => {
  test("an expired payment page cancels the order and gives the code's use back (once, even if sent twice)", async () => {
    const setup = await salesSetup();
    await createDiscount(setup.ctx, ADMIN, { code: "BACK", kind: "percent", value: 10 });
    const { order, sessionId } = await buy(setup, { discountCode: "BACK" });
    const expired = { id: nextEventId(), type: "checkout.expired" as const, sessionId, orderId: order.id };
    await handlePaymentEvent(setup.ctx, expired, BASE_URL);
    await handlePaymentEvent(setup.ctx, { ...expired, id: nextEventId() }, BASE_URL);
    expect((await setup.store.getOrder(order.id))?.status).toBe("canceled");
    expect((await setup.store.getDiscountByCode("BACK"))?.redemptions).toBe(0);
  });

  test("a failed delayed payment marks the order failed; a later 'paid' for it gives nothing", async () => {
    const setup = await salesSetup();
    const { order, sessionId } = await buy(setup);
    await handlePaymentEvent(setup.ctx, { id: nextEventId(), type: "checkout.async-failed", sessionId, orderId: order.id }, BASE_URL);
    expect((await setup.store.getOrder(order.id))?.status).toBe("failed");
    expect(await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }), BASE_URL)).toBe("already-processed");
    expect(await setup.store.getGrantByOrder(order.id)).toBeNull();
  });
});

describe("refunds", () => {
  async function paidOrder(setup: Setup) {
    const bought = await buy(setup, { quantity: 2 });
    await handlePaymentEvent(setup.ctx, paidEvent({ id: bought.order.id, totalCents: bought.order.totalCents, sessionId: bought.sessionId }), BASE_URL);
    return (await setup.store.getOrder(bought.order.id))!;
  }

  test("the admin asks Stripe (idempotency key); the order changes only when Stripe's webhook confirms it", async () => {
    const setup = await salesSetup();
    const order = await paidOrder(setup);
    const result = await refundOrder(setup.ctx, ADMIN, order.id, { amount: "5" });
    expect(result).toEqual({ ok: true, data: { refundId: "re_test_1", amountCents: 500 } });
    expect(setup.payments.refunds[0]).toEqual({ paymentIntentId: order.stripe.paymentIntentId, amountCents: 500, idempotencyKey: `refund:${order.id}:0:500` });
    expect((await setup.store.getOrder(order.id))?.refundedCents).toBe(0);
  });

  test("a partial refund: credit note, the order stays paid, the ticket stays valid", async () => {
    const setup = await salesSetup();
    const order = await paidOrder(setup);
    expect(await handlePaymentEvent(setup.ctx, { id: nextEventId(), type: "charge.refunded", paymentIntentId: order.stripe.paymentIntentId, amountRefunded: 500, currency: "eur" }, BASE_URL)).toBe("refund-recorded");
    const after = await setup.store.getOrder(order.id);
    expect(after).toMatchObject({ status: "paid", refundedCents: 500 });
    expect((await setup.store.getGrantByOrder(order.id))?.status).toBe("active");
    const credit = (await setup.store.listDocumentsForOrder(order.id)).find((document) => document.kind === "credit-note");
    expect(credit).toMatchObject({ amountCents: 500, number: "C2026-000001", provider: "internal" });
  });

  test("a full refund: refunded, ticket revoked, a refund email; the same total again changes nothing", async () => {
    const setup = await salesSetup();
    const order = await paidOrder(setup);
    const event = { id: nextEventId(), type: "charge.refunded" as const, paymentIntentId: order.stripe.paymentIntentId, amountRefunded: order.totalCents, currency: "eur" };
    await handlePaymentEvent(setup.ctx, event, BASE_URL);
    expect(await handlePaymentEvent(setup.ctx, { ...event, id: nextEventId() }, BASE_URL)).toBe("already-processed");
    expect((await setup.store.getOrder(order.id))?.status).toBe("refunded");
    expect((await setup.store.getGrantByOrder(order.id))?.status).toBe("revoked");
    expect((await setup.store.listDocumentsForOrder(order.id)).filter((document) => document.kind === "credit-note")).toHaveLength(1);
    await deliverDueEmails(setup.ctx);
    const subjects = (setup.mailer as MemoryMailer).sent.map((email) => email.subject);
    expect(subjects).toContain(createTranslator("nl")("commerce.email.refund.subject"));
  });

  test("refusals: more than paid, unpaid orders, unknown orders, Stripe failing", async () => {
    const setup = await salesSetup();
    const order = await paidOrder(setup);
    expect(await refundOrder(setup.ctx, ADMIN, order.id, { amount: "9999" })).toEqual({ ok: false, status: 400, error: "invalid-amount" });
    expect(await refundOrder(setup.ctx, ADMIN, "nope", {})).toEqual({ ok: false, status: 404, error: "unknown-order" });
    const { order: pending } = await buy(setup);
    expect(await refundOrder(setup.ctx, ADMIN, pending.id, {})).toEqual({ ok: false, status: 409, error: "not-refundable" });
    setup.payments.failNext = "charge_already_refunded";
    expect(await refundOrder(setup.ctx, ADMIN, order.id, {})).toEqual({ ok: false, status: 502, error: "refund-failed:charge_already_refunded" });
  });

  test("a refund event for a payment we don't know is ignored", async () => {
    const setup = await salesSetup();
    expect(await handlePaymentEvent(setup.ctx, { id: nextEventId(), type: "charge.refunded", paymentIntentId: "pi_unknown", amountRefunded: 100, currency: "eur" }, BASE_URL)).toBe("unknown-order");
  });
});

describe("the success page's view", () => {
  test("only the browser that started the payment sees the order; the ticket link only once paid", async () => {
    const setup = await salesSetup();
    const { order, sessionId, buyerSecret } = await buy(setup, { quantity: 4 });
    const link = (grantId: string) => `/tickets/open#${grantId}`;
    expect(await buyerOrderView(setup.ctx, order.id, "someone-else", link)).toBeNull();
    expect(await buyerOrderView(setup.ctx, order.id, buyerSecret, link)).toMatchObject({ status: "pending", ticketUrl: null });
    await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId }), BASE_URL);
    const view = await buyerOrderView(setup.ctx, order.id, buyerSecret, link);
    expect(view).toMatchObject({ status: "paid", quantity: 4, email: "buyer@example.com", receiptNumber: "R2026-000001", businessName: null });
    expect(view?.ticketUrl).toMatch(/^\/tickets\/open#/);
  });
});
