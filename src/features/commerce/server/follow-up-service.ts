import { isLocale, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { Order, TicketGrant } from "@/types/commerce";
import { REVIEW_REWARD } from "../config";
import { normalizeEmail } from "../logic/email";
import { hashSecret, type CommerceContext } from "./context";
import { queueEmail } from "./email-service";
import { renderEmail } from "./email-templates";
import { signValue, verifySignedValue } from "./ticket-token";

/**
 * The email after a walk (P8, brief 7.2), and the way out of it.
 *
 * "Daadwerkelijk afgerond" (decision B9, proposed): the walk counts as finished
 * when the completion screen of a guide walk is reached on a phone with a
 * ticket (one call, no location, no progress), or when the host ends the
 * Hidden Pubs game made with a ticket. Only the FIRST time counts.
 *
 * The email is NOT transactional, so it only goes out when everything allows it:
 * - the buyer ticked the (unticked) box on the buy box: consent, recorded with
 *   the time and the sentence's version (order.followUp);
 * - the address didn't unsubscribe (com_suppressions, by hash);
 * - the order is still paid (not refunded in full) and the ticket active;
 * - once per order (outbox id "follow-up:<orderId>"), whatever happens twice.
 */

const EMAIL_HASH_SHAPE = /^[a-f0-9]{64}$/;

const localeOf = (order: Order): Locale => (isLocale(order.locale) ? order.locale : "en");

/** The unsubscribe link for an address: signed, contains only the address's hash. */
export function unsubscribeToken(ctx: CommerceContext, email: string): string {
  return signValue("unsubscribe", hashSecret(normalizeEmail(email) ?? email), ctx.ticketSigningKey);
}

/** The hash of the address behind an unsubscribe token, or null when it isn't one of ours. */
export function emailHashFromUnsubscribeToken(ctx: CommerceContext, token: unknown): string | null {
  return verifySignedValue("unsubscribe", token, ctx.ticketSigningKey, EMAIL_HASH_SHAPE);
}

/** Adds the address to the suppression list (idempotent). The page and the one-click header both end here. */
export async function unsubscribe(ctx: CommerceContext, token: unknown): Promise<boolean> {
  const emailHash = emailHashFromUnsubscribeToken(ctx, token);
  if (!emailHash) return false;
  await ctx.store.addSuppression(emailHash, "unsubscribed", ctx.now().toISOString());
  return true;
}

/** The review page link for one ticket. */
export function reviewUrl(ctx: CommerceContext, grantId: string, baseUrl: string): string {
  return `${baseUrl}/review#${signValue("review", grantId, ctx.ticketSigningKey)}`;
}

export type FollowUpOutcome = "queued" | "already-sent" | "no-consent" | "unsubscribed" | "not-paid" | "no-email";

/** Queues the follow-up email if everything allows it (see the top of this file). */
export async function queueFollowUp(ctx: CommerceContext, order: Order, grant: TicketGrant, baseUrl: string): Promise<FollowUpOutcome> {
  if (order.status !== "paid" || grant.status !== "active") return "not-paid";
  if (!order.email) return "no-email";
  if (order.followUp?.consent !== true) return "no-consent";
  if (await ctx.store.isSuppressed(hashSecret(normalizeEmail(order.email) ?? order.email))) return "unsubscribed";

  const locale = localeOf(order);
  const t = createTranslator(locale);
  const product = order.lines[0].productName;
  const percent = new Intl.NumberFormat(`${locale}-BE`, { style: "percent" }).format(REVIEW_REWARD.percent / 100);
  const consentDay = new Intl.DateTimeFormat(`${locale}-BE`, { dateStyle: "long", timeZone: "Europe/Brussels" }).format(new Date(order.followUp.at));
  const email = renderEmail({
    subject: t("feedback.followUp.subject", { product }),
    greeting: t("feedback.followUp.greeting"),
    paragraphs: [
      t("feedback.followUp.thanks"),
      t("feedback.followUp.question"),
      ...(REVIEW_REWARD.enabled ? [t("feedback.followUp.reward", { percent })] : []),
    ],
    button: { label: t("feedback.followUp.button"), url: reviewUrl(ctx, grant.id, baseUrl) },
    signoff: [t("feedback.followUp.signoff"), "Hidden Antwerp"],
    footer: [t("feedback.followUp.why", { date: consentDay })],
    unsubscribe: { label: t("feedback.followUp.unsubscribe"), url: `${baseUrl}/unsubscribe#${unsubscribeToken(ctx, order.email)}` },
  });
  // The List-Unsubscribe header points to the one-click endpoint (mail apps POST to it).
  const oneClick = `${baseUrl}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken(ctx, order.email))}`;
  const result = await queueEmail(ctx, `follow-up:${order.id}`, { to: order.email, ...email, unsubscribeUrl: oneClick });
  return result === "queued" ? "queued" : "already-sent";
}

/** A ticket's walk was finished: remember it (first time only) and send the follow-up if allowed. */
export async function recordWalkCompleted(ctx: CommerceContext, grant: TicketGrant, baseUrl: string): Promise<FollowUpOutcome | "already-completed"> {
  if (!(await ctx.store.markGrantCompleted(grant.id, ctx.now().toISOString()))) return "already-completed";
  const order = await ctx.store.getOrder(grant.orderId);
  return order ? queueFollowUp(ctx, order, grant, baseUrl) : "not-paid";
}

/**
 * The completion screen of a guide walk, on a phone that opened a ticket for
 * this walk (its ticket cookie). Phones without a ticket: nothing happens.
 */
export async function completeWalkOnDevice(ctx: CommerceContext, walkSlug: unknown, deviceSecret: string | undefined, baseUrl: string): Promise<void> {
  if (typeof walkSlug !== "string" || walkSlug.length > 100 || !deviceSecret || deviceSecret.length > 100) return;
  const device = await ctx.store.findTicketDevice(hashSecret(deviceSecret), ctx.now());
  if (!device || device.walkSlug !== walkSlug) return;
  const grant = await ctx.store.getGrant(device.grantId);
  if (grant) await recordWalkCompleted(ctx, grant, baseUrl);
}

/** The host ended a Hidden Pubs game: if it was made with a ticket, that ticket's walk is finished. */
export async function recordGameFinished(ctx: CommerceContext, gameCode: string, baseUrl: string): Promise<void> {
  if (!/^[A-Z0-9]{3,12}$/.test(gameCode)) return;
  const grant = await ctx.store.getGrantByGameCode(gameCode);
  if (grant) await recordWalkCompleted(ctx, grant, baseUrl);
}
