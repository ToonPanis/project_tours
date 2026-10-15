import type { BillingDocument, Order } from "@/types/commerce";
import type { CommerceContext } from "./context";

/**
 * The paperwork of an order (decision B7):
 * - a consumer gets our own numbered payment receipt ("R2026-000001");
 * - a business gets an invoice from the invoicing provider (Billit, with
 *   Peppol); until it is connected the request waits as "awaiting-provider";
 * - a refund gets a credit note the same way (our own for consumers, the
 *   provider's for businesses).
 * Every document has a fixed id per order (and per refunded total), so a
 * repeated webhook never makes a second one.
 */

function yearOf(iso: string): number {
  return new Date(iso).getUTCFullYear();
}

async function nextOwnNumber(ctx: CommerceContext, prefix: "R" | "C", year: number): Promise<string> {
  const value = await ctx.store.nextNumber(`${prefix === "R" ? "receipt" : "credit"}-${year}`);
  return `${prefix}${year}-${String(value).padStart(6, "0")}`;
}

export async function ensureOrderDocument(ctx: CommerceContext, order: Order): Promise<BillingDocument> {
  const isBusiness = order.customer?.type === "business";
  const id = `${isBusiness ? "invoice" : "receipt"}:${order.id}`;
  // Checked first, so a repeated webhook doesn't use up a number.
  const existing = await ctx.store.getDocument(id);
  if (existing) return existing;

  const createdAt = ctx.now().toISOString();
  if (isBusiness) {
    const result = await ctx.invoices.requestInvoice(order);
    return ctx.store.insertDocumentIfMissing({
      id,
      number: result.status === "issued" ? result.externalId : null,
      kind: "invoice",
      orderId: order.id,
      provider: "billit",
      status: result.status,
      amountCents: order.totalCents,
      createdAt,
    });
  }
  return ctx.store.insertDocumentIfMissing({
    id,
    number: await nextOwnNumber(ctx, "R", yearOf(order.paidAt ?? createdAt)),
    kind: "receipt",
    orderId: order.id,
    provider: "internal",
    status: "issued",
    amountCents: order.totalCents,
    createdAt,
  });
}

/** A credit note for `amountCents` newly refunded; `refundedTotalCents` makes its id unique per refund. */
export async function ensureCreditNote(
  ctx: CommerceContext,
  order: Order,
  amountCents: number,
  refundedTotalCents: number,
): Promise<BillingDocument> {
  const id = `credit:${order.id}:${refundedTotalCents}`;
  const existing = await ctx.store.getDocument(id);
  if (existing) return existing;
  const createdAt = ctx.now().toISOString();

  if (order.customer?.type === "business") {
    const result = await ctx.invoices.requestCreditNote(order, amountCents);
    return ctx.store.insertDocumentIfMissing({
      id,
      number: result.status === "issued" ? result.externalId : null,
      kind: "credit-note",
      orderId: order.id,
      provider: "billit",
      status: result.status,
      amountCents,
      createdAt,
    });
  }
  return ctx.store.insertDocumentIfMissing({
    id,
    number: await nextOwnNumber(ctx, "C", yearOf(createdAt)),
    kind: "credit-note",
    orderId: order.id,
    provider: "internal",
    status: "issued",
    amountCents,
    createdAt,
  });
}
