import type { Order, TicketGrant } from "@/types/commerce";
import { TICKET_VALIDITY_MS } from "../config";
import { hashSecret, type CommerceContext } from "./context";
import { fail, ok, type ServiceResult } from "./result";
import { signTicketToken, verifyTicketToken } from "./ticket-token";

/**
 * Tickets (P2). A paid order gets one ticket with as many seats as persons
 * (decision B3). Its link /tickets/open#<signed id> is shared with the group;
 * every phone that opens it takes one seat and gets its own cookie, so a
 * forwarded link can't be used by more phones than were paid for.
 */

/** The cookie that says "this phone has a ticket for this walk". One per walk. */
export function ticketCookieName(walkSlug: string): string {
  return `ha_ticket_${walkSlug}`;
}

/** The shareable link (the signature is after "#", so it never reaches a server log). */
export function ticketUrl(ctx: CommerceContext, grantId: string, baseUrl: string): string {
  return `${baseUrl}/tickets/open#${signTicketToken(grantId, ctx.ticketSigningKey)}`;
}

/** The order's ticket, created the first time (safe to call again: one ticket per order). */
export async function ensureTicket(ctx: CommerceContext, order: Order): Promise<TicketGrant> {
  const line = order.lines[0];
  const now = ctx.now();
  return ctx.store.insertGrantIfMissing({
    id: ctx.newId(),
    orderId: order.id,
    productId: line.productId,
    walkSlug: line.walkSlug,
    seats: line.quantity,
    devicesUsed: 0,
    status: "active",
    createdAt: now.toISOString(),
    validUntil: new Date(now.getTime() + TICKET_VALIDITY_MS).toISOString(),
  });
}

export interface ActivatedTicket {
  walkSlug: string;
  /** A new cookie secret for this phone, or null when this phone already had the ticket. */
  deviceSecret: string | null;
  validUntil: string;
}

/**
 * Opens a ticket on this phone. `currentDeviceSecret`: this phone's cookie
 * for that walk, if any: opening the link again on the same phone takes no
 * second seat.
 */
export async function activateTicket(
  ctx: CommerceContext,
  body: unknown,
  readCookie: (walkSlug: string) => string | undefined,
): Promise<ServiceResult<ActivatedTicket>> {
  const token = typeof body === "object" && body !== null && "token" in body ? body.token : null;
  const grantId = verifyTicketToken(token, ctx.ticketSigningKey);
  if (!grantId) return fail(400, "invalid-ticket");
  const grant = await ctx.store.getGrant(grantId);
  if (!grant) return fail(400, "invalid-ticket");
  if (grant.status !== "active") return fail(410, "ticket-revoked");
  const now = ctx.now();
  if (Date.parse(grant.validUntil) <= now.getTime()) return fail(410, "ticket-expired");

  const current = readCookie(grant.walkSlug);
  if (current && current.length <= 100) {
    const device = await ctx.store.findTicketDevice(hashSecret(current), now);
    if (device?.grantId === grant.id) return ok({ walkSlug: grant.walkSlug, deviceSecret: null, validUntil: grant.validUntil });
  }

  if (!(await ctx.store.claimTicketSeat(grant.id))) return fail(409, "ticket-full");
  const deviceSecret = ctx.newSecret();
  await ctx.store.saveTicketDevice({
    tokenHash: hashSecret(deviceSecret),
    grantId: grant.id,
    walkSlug: grant.walkSlug,
    createdAt: now,
    expiresAt: new Date(grant.validUntil),
  });
  return ok({ walkSlug: grant.walkSlug, deviceSecret, validUntil: grant.validUntil });
}

/**
 * May this phone play this walk?
 * - "open": sales are closed (COMMERCE_SALES_ENABLED off) or the walk isn't on sale: everything as before;
 * - "granted": a valid ticket for this walk;
 * - "ticket-required": the walk is on sale and this phone has no valid ticket.
 */
export async function playAccess(
  ctx: CommerceContext,
  walkSlug: string,
  deviceSecret: string | undefined,
): Promise<"open" | "granted" | "ticket-required"> {
  if (!ctx.salesEnabled) return "open";
  const onSale = (await ctx.store.listProducts()).some((product) => product.walkSlug === walkSlug && product.active);
  if (!onSale) return "open";
  if (!deviceSecret || deviceSecret.length > 100) return "ticket-required";
  const now = ctx.now();
  const device = await ctx.store.findTicketDevice(hashSecret(deviceSecret), now);
  if (!device || device.walkSlug !== walkSlug) return "ticket-required";
  const grant = await ctx.store.getGrant(device.grantId);
  return grant && grant.status === "active" && Date.parse(grant.validUntil) > now.getTime() ? "granted" : "ticket-required";
}
