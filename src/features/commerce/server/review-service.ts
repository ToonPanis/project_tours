import { randomInt } from "node:crypto";
import { isLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { Discount, Review, TicketGrant } from "@/types/commerce";
import { MAX_REVIEW_NAME_LENGTH, MAX_REVIEW_TEXT_LENGTH, REVIEW_RATE_LIMIT, REVIEW_REWARD } from "../config";
import type { CommerceContext } from "./context";
import { queueEmail } from "./email-service";
import { renderEmail } from "./email-templates";
import { fail, ok, type ServiceResult } from "./result";
import { allowRequest, recordAudit, type Actor } from "./support";
import { verifySignedValue } from "./ticket-token";

/**
 * Verified reviews (P8, brief 7.2). The link in the follow-up email is signed
 * for one ticket, so only real customers can review, once per ticket. Nothing
 * is shown anywhere until an admin approves it (and the customer allowed
 * publication). A reward (decision B11, proposed) is given for ANY review,
 * whatever the rating, and the review is marked "incentivised" (EU rules on
 * rewarded reviews).
 */

const GRANT_ID_SHAPE = /^[A-Za-z0-9-]{8,100}$/;
const DAY = 24 * 60 * 60 * 1000;
/** Codes people type: no 0/O or 1/I/L. */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function randomCode(prefix: string, length = 8): string {
  return `${prefix}-${Array.from({ length }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("")}`;
}

/** The ticket behind a review link, if the link is genuine and the order still counts (paid, not refunded in full). */
async function grantOfToken(ctx: CommerceContext, token: unknown): Promise<{ grant: TicketGrant; productName: string } | null> {
  const grantId = verifySignedValue("review", token, ctx.ticketSigningKey, GRANT_ID_SHAPE);
  const grant = grantId ? await ctx.store.getGrant(grantId) : null;
  const order = grant ? await ctx.store.getOrder(grant.orderId) : null;
  if (!grant || !order || order.status !== "paid") return null;
  return { grant, productName: order.lines[0].productName };
}

/** What the review page shows before the form: open, already reviewed, or an invalid link. */
export async function checkReviewLink(
  ctx: CommerceContext,
  body: unknown,
): Promise<ServiceResult<{ status: "open" | "done"; productName: string; rewardPercent: number | null }>> {
  const token = typeof body === "object" && body !== null && "token" in body ? body.token : null;
  const target = await grantOfToken(ctx, token);
  if (!target) return fail(404, "invalid-review-link");
  const existing = await ctx.store.getReviewByGrant(target.grant.id);
  return ok({ status: existing ? "done" : "open", productName: target.productName, rewardPercent: REVIEW_REWARD.enabled ? REVIEW_REWARD.percent : null });
}

export interface SubmittedReview {
  reward: { code: string; percent: number; validUntil: string } | null;
}

export async function submitReview(ctx: CommerceContext, body: unknown, clientKey: string): Promise<ServiceResult<SubmittedReview>> {
  if (!(await allowRequest(ctx, "review-client", clientKey, REVIEW_RATE_LIMIT))) return fail(429, "too-many-requests");
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const target = await grantOfToken(ctx, input.token);
  if (!target) return fail(404, "invalid-review-link");

  const rating = input.rating;
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) return fail(400, "invalid-rating");
  const text = typeof input.text === "string" ? input.text.trim() : "";
  if (text.length > MAX_REVIEW_TEXT_LENGTH) return fail(400, "invalid-review-text");
  const displayName = typeof input.displayName === "string" ? input.displayName.trim().replace(/\s+/g, " ") : "";
  if (displayName.length > MAX_REVIEW_NAME_LENGTH) return fail(400, "invalid-name");
  const locale = isLocale(input.locale) ? input.locale : "en";

  const { grant } = target;
  const now = ctx.now();
  const review: Review = {
    id: ctx.newId(),
    grantId: grant.id,
    orderId: grant.orderId,
    walkSlug: grant.walkSlug,
    productId: grant.productId,
    rating,
    text: text || null,
    displayName: displayName || null,
    mayPublish: input.mayPublish === true,
    locale,
    status: "pending",
    incentivised: REVIEW_REWARD.enabled,
    rewardDiscountId: null,
    createdAt: now.toISOString(),
    moderatedAt: null,
    moderatedBy: null,
  };
  // One per ticket, also when the form is sent twice at the same moment.
  if ((await ctx.store.insertReview(review)) === "duplicate") return fail(409, "already-reviewed");
  if (!REVIEW_REWARD.enabled) return ok({ reward: null });

  const reward = await createRewardCode(ctx, grant, now);
  await ctx.store.updateReview(review.id, { rewardDiscountId: reward.id });
  const order = await ctx.store.getOrder(grant.orderId);
  if (order?.email) {
    const t = createTranslator(locale);
    const percent = new Intl.NumberFormat(`${locale}-BE`, { style: "percent" }).format(REVIEW_REWARD.percent / 100);
    const until = new Intl.DateTimeFormat(`${locale}-BE`, { dateStyle: "long", timeZone: "Europe/Brussels" }).format(new Date(reward.validUntil as string));
    // A thank-you for something the customer just did: part of the review, not marketing.
    await queueEmail(ctx, `review-reward:${grant.id}`, {
      to: order.email,
      ...renderEmail({
        subject: t("feedback.rewardEmail.subject"),
        greeting: t("feedback.rewardEmail.greeting"),
        paragraphs: [t("feedback.rewardEmail.thanks"), t("feedback.rewardEmail.code", { code: reward.code }), t("feedback.rewardEmail.terms", { percent, date: until })],
        signoff: [t("feedback.rewardEmail.signoff"), "Hidden Antwerp"],
      }),
    });
  }
  return ok({ reward: { code: reward.code, percent: REVIEW_REWARD.percent, validUntil: reward.validUntil as string } });
}

/** A personal code: one use, every product, valid REVIEW_REWARD.validDays, linked to the order that earned it. */
async function createRewardCode(ctx: CommerceContext, grant: TicketGrant, now: Date): Promise<Discount> {
  for (;;) {
    const discount: Discount = {
      id: ctx.newId(),
      code: randomCode("THANKS"),
      kind: "percent",
      value: REVIEW_REWARD.percent,
      productIds: [],
      validFrom: now.toISOString(),
      validUntil: new Date(now.getTime() + REVIEW_REWARD.validDays * DAY).toISOString(),
      maxRedemptions: 1,
      redemptions: 0,
      active: true,
      createdAt: now.toISOString(),
      createdBy: "system",
      source: "review",
      batchId: null,
      forOrderId: grant.orderId,
    };
    // A random code that happens to exist already: draw another one.
    if (await ctx.store.insertDiscount(discount)) return discount;
  }
}

// ─── Admin: moderation ──────────────────────────────────────────────────────

export async function listReviewsPage(ctx: CommerceContext, page: number, pageSize: number, status: unknown) {
  const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
  const filter = status === "pending" || status === "approved" || status === "rejected" ? status : undefined;
  const { reviews, total } = await ctx.store.listReviews({ skip: (safePage - 1) * pageSize, limit: pageSize, status: filter });
  return { reviews, total, page: safePage, pageCount: Math.max(1, Math.ceil(total / pageSize)), status: filter ?? null };
}

/** Approve or reject (words are never changed), or delete (e.g. on the customer's request: GDPR). */
export async function moderateReview(ctx: CommerceContext, admin: Actor, id: string, body: unknown): Promise<ServiceResult<{ status: Review["status"] | "deleted" }>> {
  const action = typeof body === "object" && body !== null && "action" in body ? body.action : null;
  const review = id.length <= 100 ? await ctx.store.getReview(id) : null;
  if (!review) return fail(404, "unknown-review");
  if (action === "delete") {
    await ctx.store.deleteReview(review.id);
    await recordAudit(ctx, admin, "review-deleted", `review:${review.id}`, { rating: review.rating });
    return ok({ status: "deleted" });
  }
  if (action !== "approve" && action !== "reject") return fail(400, "invalid-action");
  const status = action === "approve" ? "approved" : "rejected";
  await ctx.store.updateReview(review.id, { status, moderatedAt: ctx.now().toISOString(), moderatedBy: admin.email });
  await recordAudit(ctx, admin, "review-moderated", `review:${review.id}`, { status: `${review.status} → ${status}` });
  return ok({ status });
}

/** For the dashboard: average of the approved reviews (all ratings count, also of reviews not allowed to be published). */
export async function reviewSummary(ctx: CommerceContext): Promise<{ approved: number; average: number | null; pending: number }> {
  const [approved, pending] = await Promise.all([
    ctx.store.listReviews({ skip: 0, limit: 50_000, status: "approved" }),
    ctx.store.listReviews({ skip: 0, limit: 1, status: "pending" }),
  ]);
  const sum = approved.reviews.reduce((total, review) => total + review.rating, 0);
  return { approved: approved.total, average: approved.total > 0 ? sum / approved.reviews.length : null, pending: pending.total };
}
