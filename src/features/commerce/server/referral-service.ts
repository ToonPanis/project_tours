import type { OrderPartner } from "@/types/commerce";
import { PARTNER_CLICK_REPEAT_MS, RATE_LIMITS } from "../config";
import {
  formatReferralCookie,
  normalizeCampaign,
  normalizePartnerCode,
  parseReferralCookie,
  referralIsValid,
} from "../logic/partners";
import { dayKey, localDayOf } from "../logic/report-dates";
import type { CommerceContext } from "./context";
import { allowRequest } from "./support";

/**
 * Partner links (P7). Attribution rules (also in docs/commercial/PHASE_7_REPORT.md):
 *
 * 1. A partner link is any page with `?ref=<CODE>` (optionally `&c=<campaign>`).
 *    src/proxy.ts sends it to /api/r, which calls `recordPartnerClick` and then
 *    shows the same page without the parameters.
 * 2. An active partner's link sets the first-party cookie `ha_ref` (code,
 *    campaign, click time) for PARTNER_ATTRIBUTION_DAYS. A later link of another
 *    partner replaces it: the LAST click wins. Unknown or inactive codes change nothing.
 * 3. A click is counted per partner, Brussels day and campaign, without any IP
 *    address or visitor id. The same visitor opening the same link again within
 *    30 minutes is one click, and one network address counts at most 20 clicks
 *    an hour (the rate-limit counter only holds a hash and expires).
 * 4. When a payment starts, `resolveReferral` checks the cookie: still within the
 *    window and the partner still active → the order gets the partner and the
 *    partner's commission rule of that moment. Only a PAID order earns commission.
 */

export interface RecordedClick {
  /** The new cookie value, or null when the code isn't an active partner (the cookie is left as it is). */
  cookieValue: string | null;
  counted: boolean;
}

export async function recordPartnerClick(
  ctx: CommerceContext,
  input: { ref: unknown; campaign: unknown; existingCookie: string | undefined; clientKey: string },
): Promise<RecordedClick> {
  const code = normalizePartnerCode(input.ref);
  if (!code) return { cookieValue: null, counted: false };
  const partner = await ctx.store.getPartnerByCode(code);
  if (!partner || !partner.active) return { cookieValue: null, counted: false };

  const now = ctx.now();
  const campaign = normalizeCampaign(input.campaign);
  const previous = parseReferralCookie(input.existingCookie);
  const repeat =
    previous !== null &&
    previous.code === code &&
    previous.campaign === campaign &&
    now.getTime() - previous.clickedAt.getTime() < PARTNER_CLICK_REPEAT_MS;

  let counted = false;
  if (!repeat && (await allowRequest(ctx, "partner-click", input.clientKey, RATE_LIMITS.partnerClicksPerClient))) {
    await ctx.store.incrementPartnerClicks(partner.id, dayKey(localDayOf(now)), campaign ?? "");
    counted = true;
  }
  return { cookieValue: formatReferralCookie({ code, campaign, clickedAt: now }), counted };
}

/** The partner of a new order, from the visitor's referral cookie, or null. */
export async function resolveReferral(ctx: CommerceContext, cookieValue: string | undefined): Promise<OrderPartner | null> {
  const referral = parseReferralCookie(cookieValue);
  if (!referral || !referralIsValid(referral, ctx.now())) return null;
  const partner = await ctx.store.getPartnerByCode(referral.code);
  if (!partner || !partner.active) return null;
  return {
    partnerId: partner.id,
    code: partner.code,
    campaign: referral.campaign,
    clickedAt: referral.clickedAt.toISOString(),
    rule: partner.commission,
  };
}
