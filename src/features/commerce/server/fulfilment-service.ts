import type { Order, OrderCustomer } from "@/types/commerce";
import { applyTax } from "../logic/tax";
import type { CommerceContext } from "./context";
import { ensureCreditNote, ensureOrderDocument } from "./document-service";
import { queueOrderConfirmation, queueRefundEmail } from "./order-emails";
import type { CheckoutPaidEvent, PaymentEvent } from "./payment-gateway";
import { ensureTicket, ticketUrl } from "./ticket-service";

/**
 * What happens when Stripe tells us something (the webhook). The ONLY place
 * where an order becomes "paid", and it's built to survive anything Stripe
 * may do: send an event twice, send two events at once, or retry for days
 * after an error on our side.
 *
 * - Each step is idempotent: "paid" is set once (atomic status change), the
 *   ticket is one per order, documents and emails have fixed ids.
 * - So a retried event simply finishes what's missing; nothing is doubled.
 * - Before anything is granted, the payment is checked against OUR order:
 *   the same Stripe session, the same amount, euros.
 */

export type HandledAs =
  | "fulfilled"
  | "already-processed"
  | "waiting-for-payment"
  | "amount-mismatch"
  | "unknown-order"
  | "canceled"
  | "refund-recorded"
  | "ignored";

const MINUTE = 60 * 1000;
/** Stripe retries failed deliveries for up to 3 days; the record of an event is kept a bit longer. */
const EVENT_RECORD_LIFETIME_MS = 5 * 24 * 60 * MINUTE;

export async function handlePaymentEvent(ctx: CommerceContext, event: PaymentEvent, baseUrl: string): Promise<HandledAs> {
  const now = ctx.now();
  const seen = await ctx.store.recordStripeEvent({ id: event.id, type: event.type, receivedAt: now, expiresAt: new Date(now.getTime() + EVENT_RECORD_LIFETIME_MS) });
  // A second delivery of an event that was handled completely: nothing to do.
  if (seen === "duplicate" && (await ctx.store.isStripeEventDone(event.id))) return "already-processed";

  const result = await handle(ctx, event, baseUrl);
  await ctx.store.markStripeEventDone(event.id, ctx.now());
  return result;
}

async function handle(ctx: CommerceContext, event: PaymentEvent, baseUrl: string): Promise<HandledAs> {
  switch (event.type) {
    case "checkout.completed":
    case "checkout.async-succeeded":
      // Some payment methods confirm later: "completed" then says "unpaid", and "async-succeeded" follows.
      if (event.paymentStatus !== "paid") return "waiting-for-payment";
      return fulfil(ctx, event, baseUrl);
    case "checkout.expired":
    case "checkout.async-failed":
      return closeUnpaid(ctx, event.orderId, event.type === "checkout.expired" ? "canceled" : "failed");
    case "charge.refunded":
      return recordRefund(ctx, event.paymentIntentId, event.amountRefunded);
    default:
      return "ignored";
  }
}

async function fulfil(ctx: CommerceContext, event: CheckoutPaidEvent, baseUrl: string): Promise<HandledAs> {
  const order = event.orderId ? await ctx.store.getOrder(event.orderId) : null;
  if (!order) {
    // Not ours (e.g. another app on the same Stripe account) or unknown: logged, not retried forever.
    console.warn("[Hidden Antwerp] payment for an unknown order");
    return "unknown-order";
  }
  // The payment must be exactly the order we created: same session, same amount, euros.
  if (event.sessionId !== order.stripe.checkoutSessionId || event.amountTotal !== order.totalCents || event.currency !== "eur") {
    console.error(`[Hidden Antwerp] payment does not match order ${order.id}: not fulfilled, check it in Stripe`);
    return "amount-mismatch";
  }

  const customer: OrderCustomer = {
    type: event.customer.vatNumber || event.customer.businessName ? "business" : "consumer",
    name: event.customer.name,
    businessName: event.customer.businessName,
    vatNumber: event.customer.vatNumber,
    country: event.customer.country,
  };
  const paidAt = ctx.now().toISOString();
  // pending → paid, once. A later delivery finds "paid" and only completes the steps below.
  await ctx.store.transitionOrder(order.id, ["pending"], {
    status: "paid",
    paidAt,
    updatedAt: paidAt,
    email: event.customer.email,
    customer,
    tax: applyTax(order.taxBasis, customer.country, order.totalCents),
    stripe: { checkoutSessionId: order.stripe.checkoutSessionId, paymentIntentId: event.paymentIntentId },
  });
  const paid = await ctx.store.getOrder(order.id);
  if (!paid || paid.status !== "paid") return "already-processed";

  const grant = await ensureTicket(ctx, paid);
  const document = await ensureOrderDocument(ctx, paid);
  await queueOrderConfirmation(ctx, paid, grant, document, ticketUrl(ctx, grant.id, baseUrl));
  return "fulfilled";
}

async function closeUnpaid(ctx: CommerceContext, orderId: string | null, status: "canceled" | "failed"): Promise<HandledAs> {
  const order = orderId ? await ctx.store.getOrder(orderId) : null;
  if (!order) return "unknown-order";
  const closed = await ctx.store.transitionOrder(order.id, ["pending"], { status, updatedAt: ctx.now().toISOString() });
  // The discount's use goes back only once (only the call that closed the order gets here).
  if (closed && order.discount) await ctx.store.releaseDiscount(order.discount.discountId);
  return "canceled";
}

async function recordRefund(ctx: CommerceContext, paymentIntentId: string | null, refundedTotalCents: number): Promise<HandledAs> {
  const order: Order | null = paymentIntentId ? await ctx.store.findOrderByPaymentIntent(paymentIntentId) : null;
  if (!order) return "unknown-order";
  // Stripe sends the total refunded so far: only what's new counts.
  if (refundedTotalCents <= order.refundedCents) return "already-processed";

  const newlyRefunded = refundedTotalCents - order.refundedCents;
  const fully = refundedTotalCents >= order.totalCents;
  await ctx.store.updateOrder(order.id, {
    refundedCents: refundedTotalCents,
    status: fully ? "refunded" : order.status,
    updatedAt: ctx.now().toISOString(),
  });

  let ticketRevoked = false;
  const grant = await ctx.store.getGrantByOrder(order.id);
  if (fully && grant && grant.status === "active") {
    await ctx.store.updateGrant(grant.id, { status: "revoked" });
    ticketRevoked = true;
  }
  await ensureCreditNote(ctx, order, newlyRefunded, refundedTotalCents);
  await queueRefundEmail(ctx, order, newlyRefunded, refundedTotalCents, ticketRevoked || grant?.status === "revoked");
  return "refund-recorded";
}
