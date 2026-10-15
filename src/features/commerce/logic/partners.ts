import type { CommissionEntry, CommissionRule, CommissionStatus, Order, PartnerType } from "@/types/commerce";
import { MAX_FIXED_COMMISSION_CENTS, MAX_PARTNER_NAME_LENGTH, PARTNER_ATTRIBUTION_MS } from "../config";
import { parseEuroAmount } from "./money";
import { amountsOf } from "./reports";
import { percentToBasisPoints } from "./tax";

/**
 * Partners and commissions (P7), as pure functions: partner codes, the
 * referral cookie, the commission of an order and the ledger totals. No
 * database, no clock: the services pass everything in, and the tests call
 * these directly.
 */

export const PARTNER_TYPES: PartnerType[] = ["HOTEL_PARTNER", "HORECA_PARTNER", "TOURISM_PARTNER", "CORPORATE_PARTNER"];

// ─── Codes and links ────────────────────────────────────────────────────────

const CODE_SHAPE = /^[A-Z0-9](?:[A-Z0-9-]{1,28})[A-Z0-9]$/;
const CAMPAIGN_SHAPE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

/** "hotelJulien " → "HOTELJULIEN"; null unless 3–30 letters, digits or dashes (not at the ends). */
export function normalizePartnerCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return CODE_SHAPE.test(code) ? code : null;
}

/** The `c=` of a partner link: "Summer-Flyer" → "summer-flyer"; null when absent or not a short slug. */
export function normalizeCampaign(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const campaign = value.trim().toLowerCase();
  return CAMPAIGN_SHAPE.test(campaign) ? campaign : null;
}

/**
 * Where to send the visitor after a partner link: only a path on our own site.
 * "//evil.example" or "https://…" would leave the site (an open redirect), so
 * anything that isn't a plain "/path" becomes "/".
 */
export function safeReturnPath(value: unknown): string {
  if (typeof value !== "string" || value.length > 500) return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  return value;
}

/** The partner's personal link (the QR code contains the same). */
export function partnerLink(baseUrl: string, code: string): string {
  return `${baseUrl}/?ref=${encodeURIComponent(code)}`;
}

// ─── The referral cookie ────────────────────────────────────────────────────

export interface Referral {
  code: string;
  campaign: string | null;
  clickedAt: Date;
}

/** "HOTELJULIEN.summer-flyer.1760000000000": code, campaign (may be empty), click time. No personal data. */
export function formatReferralCookie(referral: Referral): string {
  return `${referral.code}.${referral.campaign ?? ""}.${referral.clickedAt.getTime()}`;
}

/** The cookie back, or null when it isn't one of ours (a visitor can change their own cookies). */
export function parseReferralCookie(value: string | undefined | null): Referral | null {
  if (!value || value.length > 120) return null;
  const [rawCode, rawCampaign, rawTime, extra] = value.split(".");
  if (extra !== undefined) return null;
  const code = normalizePartnerCode(rawCode);
  const campaign = rawCampaign === "" ? null : normalizeCampaign(rawCampaign);
  const time = Number(rawTime);
  if (!code || (rawCampaign !== "" && !campaign) || !Number.isSafeInteger(time) || time <= 0) return null;
  return { code, campaign, clickedAt: new Date(time) };
}

/**
 * Whether a click still counts for an order started at `now`: within the
 * attribution window, and not in the future (a hand-made cookie).
 */
export function referralIsValid(referral: Referral, now: Date): boolean {
  const age = now.getTime() - referral.clickedAt.getTime();
  return age >= -60_000 && age <= PARTNER_ATTRIBUTION_MS;
}

// ─── Commission rules ───────────────────────────────────────────────────────

/**
 * The rule an admin typed: { kind, value }. Percent as "15" or "12,5" (of the
 * net amount excl. VAT, at most 100 %), fixed amounts in euros ("2,50").
 */
export function parseCommissionRule(input: unknown): CommissionRule | null {
  if (typeof input !== "object" || input === null) return null;
  const { kind, value } = input as Record<string, unknown>;
  if (kind === "none") return { kind: "none" };
  if (typeof value !== "string") return null;
  if (kind === "percent-net") {
    const basisPoints = percentToBasisPoints(value);
    return basisPoints !== null && basisPoints >= 1 ? { kind, basisPoints } : null;
  }
  if (kind === "fixed-per-ticket" || kind === "fixed-per-booking") {
    const cents = parseEuroAmount(value);
    return cents !== null && cents <= MAX_FIXED_COMMISSION_CENTS ? { kind, cents } : null;
  }
  return null;
}

/** For the admin pages and the audit log (English, like the admin area). */
export function describeRule(rule: CommissionRule): string {
  switch (rule.kind) {
    case "percent-net":
      return `${(rule.basisPoints / 100).toLocaleString("en", { maximumFractionDigits: 2 })} % of net excl. VAT`;
    case "fixed-per-ticket":
      return `€${(rule.cents / 100).toFixed(2)} per ticket`;
    case "fixed-per-booking":
      return `€${(rule.cents / 100).toFixed(2)} per booking`;
    case "none":
      return "No commission (statistics only)";
  }
}

/**
 * What a partner earns on an order, in whole cents, as things stand now
 * (refunds included). One rule, used for the accrual and for every refund:
 * - the basis is the net amount EXCLUDING VAT that was kept after refunds
 *   (the same figure as the dashboard's "net excl. VAT");
 * - percent: basis × rate, rounded to the nearest cent (half up);
 * - fixed amounts: per ticket × persons, or per booking; after a partial
 *   refund in the same proportion as the money kept, rounded;
 * - never more than the basis itself, never below zero; a fully refunded order earns 0.
 * Rounding happens once per order, so a report's total is exactly the sum of its lines.
 */
export function orderCommissionCents(order: Order, rule: CommissionRule): { amountCents: number; basisCents: number } {
  const amounts = amountsOf(order);
  const basisCents = Math.max(0, amounts.exVatCents);
  if (rule.kind === "none" || amounts.netCents <= 0 || order.totalCents <= 0) return { amountCents: 0, basisCents };
  const kept = amounts.netCents / order.totalCents;
  const persons = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  let amount: number;
  switch (rule.kind) {
    case "percent-net":
      amount = Math.round((basisCents * rule.basisPoints) / 10_000);
      break;
    case "fixed-per-ticket":
      amount = Math.round(rule.cents * persons * kept);
      break;
    case "fixed-per-booking":
      amount = Math.round(rule.cents * kept);
      break;
  }
  return { amountCents: Math.min(Math.max(0, amount), basisCents), basisCents };
}

// ─── The ledger ─────────────────────────────────────────────────────────────

/** The steps an admin can take; "reversed" is only set by a refund. */
export const COMMISSION_NEXT: Partial<Record<CommissionStatus, CommissionStatus>> = {
  pending: "approved",
  approved: "payable",
  payable: "paid",
};

export interface LedgerTotals {
  /** Still in the checking period (the order can be refunded). */
  pendingCents: number;
  approvedCents: number;
  payableCents: number;
  paidCents: number;
  /** Everything not reversed: pending + approved + payable + paid. */
  earnedCents: number;
  /** Earned but not paid yet: pending + approved + payable. */
  outstandingCents: number;
  entries: number;
}

/** Totals of ledger lines. Whole cents added up, so a total always equals the sum of its lines. */
export function ledgerTotals(entries: Pick<CommissionEntry, "status" | "amountCents">[]): LedgerTotals {
  const totals: LedgerTotals = { pendingCents: 0, approvedCents: 0, payableCents: 0, paidCents: 0, earnedCents: 0, outstandingCents: 0, entries: 0 };
  for (const entry of entries) {
    if (entry.status === "reversed") continue;
    totals.entries += 1;
    totals.earnedCents += entry.amountCents;
    if (entry.status === "pending") totals.pendingCents += entry.amountCents;
    if (entry.status === "approved") totals.approvedCents += entry.amountCents;
    if (entry.status === "payable") totals.payableCents += entry.amountCents;
    if (entry.status === "paid") totals.paidCents += entry.amountCents;
  }
  totals.outstandingCents = totals.pendingCents + totals.approvedCents + totals.payableCents;
  return totals;
}

// ─── Admin input ────────────────────────────────────────────────────────────

export interface PartnerInput {
  name: string;
  type: PartnerType;
  commission: CommissionRule;
  active: boolean;
}

/** The partner form (create and edit). The code is checked separately: it can't change. */
export function parsePartnerInput(body: unknown): { ok: true; value: PartnerInput } | { ok: false; error: string } {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > MAX_PARTNER_NAME_LENGTH) return { ok: false, error: "invalid-name" };
  if (!PARTNER_TYPES.includes(input.type as PartnerType)) return { ok: false, error: "invalid-type" };
  const commission = parseCommissionRule(input.commission);
  if (!commission) return { ok: false, error: "invalid-commission" };
  return { ok: true, value: { name, type: input.type as PartnerType, commission, active: input.active !== false } };
}

/**
 * For src/proxy.ts: a page opened with `?ref=` goes to /api/r first, which
 * counts the click and sets the cookie, then returns to the same page without
 * `ref` and `c`. Null when the URL has no `ref` (nothing to do).
 */
export function partnerLinkRedirect(url: URL): URL | null {
  const ref = url.searchParams.get("ref");
  if (ref === null) return null;
  const back = new URL(url.toString());
  back.searchParams.delete("ref");
  back.searchParams.delete("c");
  const target = new URL("/api/r", url.origin);
  target.searchParams.set("ref", ref.slice(0, 40));
  const campaign = url.searchParams.get("c");
  if (campaign) target.searchParams.set("c", campaign.slice(0, 60));
  target.searchParams.set("to", `${back.pathname}${back.search}`);
  return target;
}
