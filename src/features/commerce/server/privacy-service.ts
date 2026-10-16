import type { CommerceUser, OutboxEmail, Order, QuoteRequest, Review } from "@/types/commerce";
import { RETENTION } from "../config";
import { normalizeEmail } from "../logic/email";
import { hashSecret, type CommerceContext } from "./context";
import { fail, ok, type ServiceResult } from "./result";
import { recordAudit, type Actor } from "./support";

/**
 * Requests about personal data (P9, GDPR articles 15, 17 and 20) and the
 * retention periods, for /admin/privacy. Customers have no accounts: their data
 * is found by email address.
 *
 * What erasure does (and why some things stay):
 * - orders: the email and the buyer's name are removed (`erasedAt`); amounts,
 *   VAT, country and business details stay, because the accounts must keep them
 *   (⚖️ Belgian accounting: 10 years, to confirm with the accountant);
 * - quote requests, reviews and outbox records of the address: deleted;
 * - a partner user: switched off, address replaced, removed from the audit log;
 * - the address's HASH is added to the unsubscribe list, so no follow-up email
 *   is ever sent to it again (that's the one thing that must be remembered);
 * - admins can't be erased here (take them out of ADMIN_EMAILS first).
 * The audit log records each request by the address's hash, never the address.
 */

const DAY = 24 * 60 * 60 * 1000;

/** A copy without some fields (internal hashes, email bodies). */
function without<T extends object, K extends keyof T>(record: T, fields: K[]): Omit<T, K> {
  const copy = { ...record };
  for (const field of fields) delete copy[field];
  return copy;
}

export interface PersonalData {
  email: string;
  orders: Order[];
  quotes: QuoteRequest[];
  reviews: Review[];
  emails: OutboxEmail[];
  user: CommerceUser | null;
  unsubscribed: boolean;
}

/** Everything stored about one address. */
export async function findPersonalData(ctx: CommerceContext, rawEmail: unknown): Promise<PersonalData | null> {
  const email = normalizeEmail(rawEmail);
  if (!email) return null;
  const [orders, quotes, emails, user, unsubscribed] = await Promise.all([
    ctx.store.findOrdersByEmail(email),
    ctx.store.findQuotesByEmail(email),
    ctx.store.listEmailsTo(email),
    ctx.store.findUserByEmail(email),
    ctx.store.isSuppressed(hashSecret(email)),
  ]);
  const reviews: Review[] = [];
  for (const order of orders) {
    const grant = await ctx.store.getGrantByOrder(order.id);
    const review = grant ? await ctx.store.getReviewByGrant(grant.id) : null;
    if (review) reviews.push(review);
  }
  return { email, orders, quotes, reviews, emails, user, unsubscribed };
}

/**
 * The export (access / portability): one JSON document with everything about
 * the address, without internal secrets (token hashes are left out).
 */
export async function exportPersonalData(ctx: CommerceContext, admin: Actor, rawEmail: unknown): Promise<ServiceResult<{ fileName: string; json: string }>> {
  const data = await findPersonalData(ctx, rawEmail);
  if (!data) return fail(400, "invalid-email");
  const document = {
    exportedAt: ctx.now().toISOString(),
    email: data.email,
    orders: data.orders.map((order) => without(order, ["buyerTokenHash"])),
    quoteRequests: data.quotes,
    reviews: data.reviews,
    emailsSent: data.emails.map((email) => without(email, ["text", "html"])),
    account: data.user ? { email: data.user.email, roles: data.user.roles, active: data.user.active, createdAt: data.user.createdAt, lastLoginAt: data.user.lastLoginAt } : null,
    unsubscribedFromFollowUps: data.unsubscribed,
  };
  await recordAudit(ctx, admin, "personal-data-exported", `email:${hashSecret(data.email).slice(0, 16)}`, {
    orders: data.orders.length,
    quotes: data.quotes.length,
    reviews: data.reviews.length,
  });
  return ok({ fileName: `personal-data-${ctx.now().toISOString().slice(0, 10)}.json`, json: JSON.stringify(document, null, 2) });
}

export interface ErasureReport {
  ordersPseudonymised: number;
  quotesDeleted: number;
  reviewsDeleted: number;
  emailsDeleted: number;
  partnerUserErased: boolean;
}

/** The erasure. Body: { email, confirm } where `confirm` must repeat the address (no erasure by a slip). */
export async function erasePersonalData(ctx: CommerceContext, admin: Actor, body: unknown): Promise<ServiceResult<ErasureReport>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const email = normalizeEmail(input.email);
  if (!email) return fail(400, "invalid-email");
  if (normalizeEmail(input.confirm) !== email) return fail(400, "confirmation-mismatch");
  const data = await findPersonalData(ctx, email);
  if (!data) return fail(400, "invalid-email");
  if (ctx.adminEmails.includes(email) || data.user?.roles.includes("ADMIN")) return fail(409, "admin-address");

  const at = ctx.now().toISOString();
  for (const order of data.orders) await pseudonymiseOrder(ctx, order, at);
  for (const quote of data.quotes) await ctx.store.deleteQuote(quote.id);
  for (const review of data.reviews) await ctx.store.deleteReview(review.id);
  const emailsDeleted = await ctx.store.deleteEmailsTo(email);

  let partnerUserErased = false;
  if (data.user) {
    await ctx.store.saveUser({ ...data.user, active: false, email: `erased-${data.user.id}@erased.invalid` });
    await ctx.store.anonymiseAuditActor(data.user.id);
    partnerUserErased = true;
  }
  // Remembered as a hash only: so a follow-up can never be sent to this address again.
  await ctx.store.addSuppression(hashSecret(email), "unsubscribed", at);

  const report: ErasureReport = {
    ordersPseudonymised: data.orders.length,
    quotesDeleted: data.quotes.length,
    reviewsDeleted: data.reviews.length,
    emailsDeleted,
    partnerUserErased,
  };
  await recordAudit(ctx, admin, "personal-data-erased", `email:${hashSecret(email).slice(0, 16)}`, { ...report });
  return ok(report);
}

/** An order without the buyer's email and name; what the accounts need stays. */
async function pseudonymiseOrder(ctx: CommerceContext, order: Order, at: string): Promise<void> {
  await ctx.store.updateOrder(order.id, {
    email: null,
    customer: order.customer ? { ...order.customer, name: null } : null,
    erasedAt: at,
    updatedAt: at,
  });
}

export interface RetentionReport {
  auditEntriesDeleted: number;
  rejectedReviewsDeleted: number;
  unpaidOrdersDeleted: number;
  ordersPseudonymised: number;
}

/**
 * The retention periods (also in docs/commercial/SECURITY_AUDIT.md), applied by
 * the daily maintenance cron. Records with their own TTL index (sign-in links,
 * sessions, rate limits, sent emails, quote requests, click counters, games)
 * are deleted by MongoDB itself.
 */
export async function applyRetention(ctx: CommerceContext): Promise<RetentionReport> {
  const now = ctx.now().getTime();
  const report: RetentionReport = {
    auditEntriesDeleted: await ctx.store.deleteAuditBefore(new Date(now - RETENTION.auditLogDays * DAY)),
    rejectedReviewsDeleted: await ctx.store.deleteReviewsBefore("rejected", new Date(now - RETENTION.rejectedReviewDays * DAY)),
    unpaidOrdersDeleted: await ctx.store.deleteUnpaidOrdersBefore(new Date(now - RETENTION.unpaidOrderDays * DAY)),
    ordersPseudonymised: 0,
  };
  const old = await ctx.store.listOrdersWithPersonalDataBefore(new Date(now - RETENTION.orderPersonalDataDays * DAY), 500);
  const at = ctx.now().toISOString();
  for (const order of old) await pseudonymiseOrder(ctx, order, at);
  report.ordersPseudonymised = old.length;
  if (Object.values(report).some((count) => count > 0)) {
    await recordAudit(ctx, null, "retention-applied", "retention", { ...report });
  }
  return report;
}
