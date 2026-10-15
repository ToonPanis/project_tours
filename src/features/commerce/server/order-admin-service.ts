import type { BillingDocument, Order, OrderStatus, TicketGrant } from "@/types/commerce";
import { parseEuroAmount } from "../logic/money";
import type { CommerceContext } from "./context";
import { ensureOrderDocument } from "./document-service";
import { queueOrderConfirmation } from "./order-emails";
import { PaymentProviderError } from "./payment-gateway";
import { fail, ok, type ServiceResult } from "./result";
import { recordAudit, type Actor } from "./support";
import { ticketUrl } from "./ticket-service";

const STATUSES: OrderStatus[] = ["pending", "paid", "failed", "canceled", "refunded"];

/** One page of orders for /admin/orders, newest first, optionally one status. */
export async function listOrdersPage(ctx: CommerceContext, page: number, pageSize: number, status: unknown) {
  const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
  const filter = STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
  const { orders, total } = await ctx.store.listOrders({ skip: (safePage - 1) * pageSize, limit: pageSize, status: filter });
  return { orders, total, page: safePage, pageCount: Math.max(1, Math.ceil(total / pageSize)), status: filter ?? null };
}

export interface OrderDetail {
  order: Order;
  grant: TicketGrant | null;
  documents: BillingDocument[];
}

export async function getOrderDetail(ctx: CommerceContext, orderId: string): Promise<OrderDetail | null> {
  if (orderId.length > 100) return null;
  const order = await ctx.store.getOrder(orderId);
  if (!order) return null;
  const [grant, documents] = await Promise.all([ctx.store.getGrantByOrder(orderId), ctx.store.listDocumentsForOrder(orderId)]);
  return { order, grant, documents };
}

/**
 * Asks Stripe for a refund (all that's left, or the amount typed). The order,
 * credit note and email are updated when Stripe's "charge.refunded" webhook
 * arrives: Stripe is the source of truth for money. The same request twice
 * refunds once (idempotency key).
 */
export async function refundOrder(ctx: CommerceContext, admin: Actor, orderId: string, body: unknown): Promise<ServiceResult<{ refundId: string; amountCents: number }>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const order = await ctx.store.getOrder(orderId);
  if (!order) return fail(404, "unknown-order");
  if (order.status !== "paid" || !order.stripe.paymentIntentId) return fail(409, "not-refundable");

  const remaining = order.totalCents - order.refundedCents;
  const amountCents = input.amount === undefined || input.amount === "" ? remaining : parseEuroAmount(input.amount);
  if (amountCents === null || amountCents < 1 || amountCents > remaining) return fail(400, "invalid-amount");

  try {
    const { refundId } = await ctx.payments.refund({
      paymentIntentId: order.stripe.paymentIntentId,
      amountCents,
      idempotencyKey: `refund:${order.id}:${order.refundedCents}:${amountCents}`,
    });
    await recordAudit(ctx, admin, "refund-requested", `order:${order.id}`, { amountCents, refundId });
    if (input.revokeTicket === true) await revokeTicket(ctx, admin, order.id);
    return ok({ refundId, amountCents });
  } catch (error) {
    if (!(error instanceof PaymentProviderError)) throw error;
    return fail(502, `refund-failed:${error.code}`);
  }
}

/** Withdraws the ticket: its link and every phone that opened it stop working. */
export async function revokeTicket(ctx: CommerceContext, admin: Actor, orderId: string): Promise<ServiceResult<TicketGrant>> {
  const grant = await ctx.store.getGrantByOrder(orderId);
  if (!grant) return fail(404, "no-ticket");
  if (grant.status !== "revoked") {
    await ctx.store.updateGrant(grant.id, { status: "revoked" });
    await recordAudit(ctx, admin, "ticket-revoked", `order:${orderId}`);
  }
  return ok({ ...grant, status: "revoked" });
}

/** Frees every seat (e.g. a phone was lost): the group opens the link again. */
export async function resetTicketDevices(ctx: CommerceContext, admin: Actor, orderId: string): Promise<ServiceResult<TicketGrant>> {
  const grant = await ctx.store.getGrantByOrder(orderId);
  if (!grant) return fail(404, "no-ticket");
  await ctx.store.deleteTicketDevices(grant.id);
  await ctx.store.updateGrant(grant.id, { devicesUsed: 0 });
  await recordAudit(ctx, admin, "ticket-devices-reset", `order:${orderId}`, { freedSeats: grant.devicesUsed });
  return ok({ ...grant, devicesUsed: 0 });
}

/** Sends the confirmation (with the ticket link) again, e.g. when the buyer can't find it. */
export async function resendConfirmation(ctx: CommerceContext, admin: Actor, orderId: string, baseUrl: string): Promise<ServiceResult<{ queued: true }>> {
  const order = await ctx.store.getOrder(orderId);
  const grant = order ? await ctx.store.getGrantByOrder(orderId) : null;
  if (!order || !grant || order.status !== "paid") return fail(409, "nothing-to-resend");
  const document = await ensureOrderDocument(ctx, order);
  await queueOrderConfirmation(ctx, order, grant, document, ticketUrl(ctx, grant.id, baseUrl), `:resend:${ctx.now().getTime()}`);
  await recordAudit(ctx, admin, "order-email-resent", `order:${orderId}`);
  return ok({ queued: true });
}
