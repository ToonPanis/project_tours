import type { CommissionEntry, CommissionStatus, Order } from "@/types/commerce";
import { COMMISSION_APPROVAL_AGE_DAYS } from "../config";
import { COMMISSION_NEXT, orderCommissionCents } from "../logic/partners";
import type { CommerceContext } from "./context";
import { fail, ok, type ServiceResult } from "./result";
import { recordAudit, type Actor } from "./support";

/**
 * The commission ledger (P7, brief 3.3 and 3.5). Built like the webhook it is
 * called from: every booking has a fixed id, so a retried or doubled Stripe
 * event never books a commission twice.
 *
 * - Payment confirmed → one "accrual" ("accrual:<orderId>"), status pending.
 * - Refund → the order's commission is computed again from what was kept
 *   (logic/partners.ts). Nothing paid out yet and nothing left to earn → the
 *   lines are "reversed". Otherwise one "adjustment" with the difference
 *   (negative), which goes through the same steps and is settled with the
 *   partner's next payout.
 * - Admins move lines pending → approved → payable → paid. Money is never
 *   sent by the app (brief 3.5): "paid" records a transfer the owner made.
 */

const DAY = 24 * 60 * 60 * 1000;
/** At most this many lines per admin action (a page of the ledger). */
const MAX_IDS_PER_ACTION = 200;
/** "Approve all older than 14 days" handles at most this many lines per press. */
const MAX_BULK_APPROVALS = 2000;

/** Books the commission of a paid order (called by the webhook; safe to call again). */
export async function ensureCommission(ctx: CommerceContext, order: Order): Promise<void> {
  if (!order.partner || order.status !== "paid" || !order.paidAt) return;
  const { amountCents, basisCents } = orderCommissionCents(order, order.partner.rule);
  if (amountCents <= 0) return;
  const now = ctx.now().toISOString();
  await ctx.store.insertCommissionIfMissing({
    id: `accrual:${order.id}`,
    partnerId: order.partner.partnerId,
    orderId: order.id,
    kind: "accrual",
    amountCents,
    basisCents,
    rule: order.partner.rule,
    status: "pending",
    productId: order.lines[0].productId,
    campaign: order.partner.campaign,
    orderPaidAt: order.paidAt,
    createdAt: now,
    updatedAt: now,
    payoutReference: null,
    history: [{ status: "pending", at: now, by: null }],
  });
}

/**
 * Brings the ledger in line with a refunded order (called by the webhook after
 * every refund, and again on a retried event: when nothing changed, nothing happens).
 */
export async function syncCommissionAfterRefund(ctx: CommerceContext, order: Order): Promise<void> {
  if (!order.partner || !order.paidAt) return;
  const entries = await ctx.store.listCommissionsForOrder(order.id);
  const live = entries.filter((entry) => entry.status !== "reversed");
  if (live.length === 0) return;

  const { amountCents: target, basisCents } = orderCommissionCents(order, order.partner.rule);
  const current = live.reduce((sum, entry) => sum + entry.amountCents, 0);
  const difference = target - current;
  if (difference >= 0) return; // a refund only ever lowers a commission

  const now = ctx.now().toISOString();
  if (target === 0 && live.every((entry) => entry.status !== "paid")) {
    // Nothing earned any more and nothing paid out: cancel the lines themselves.
    for (const entry of live) {
      await ctx.store.transitionCommission(entry.id, [entry.status], { status: "reversed", at: now, by: null });
    }
    return;
  }
  await ctx.store.insertCommissionIfMissing({
    id: `adjustment:${order.id}:${order.refundedCents}`,
    partnerId: order.partner.partnerId,
    orderId: order.id,
    kind: "adjustment",
    amountCents: difference,
    basisCents,
    rule: order.partner.rule,
    status: "pending",
    productId: order.lines[0].productId,
    campaign: order.partner.campaign,
    orderPaidAt: order.paidAt,
    createdAt: now,
    updatedAt: now,
    payoutReference: null,
    history: [{ status: "pending", at: now, by: null }],
  });
}

const TARGETS: CommissionStatus[] = ["approved", "payable", "paid"];
const previousOf = (to: CommissionStatus) =>
  (Object.entries(COMMISSION_NEXT) as [CommissionStatus, CommissionStatus][]).find(([, next]) => next === to)?.[0] ?? null;

/**
 * Moves the chosen ledger lines one step: to "approved", "payable" or "paid"
 * (with the reference of the bank transfer). Lines that are no longer in the
 * step before (someone else was quicker, or a refund reversed them) are skipped.
 */
export async function changeCommissionStatus(
  ctx: CommerceContext,
  admin: Actor,
  body: unknown,
): Promise<ServiceResult<{ changed: number; skipped: number }>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const to = input.to as CommissionStatus;
  if (!TARGETS.includes(to)) return fail(400, "invalid-status");
  const ids = Array.isArray(input.ids) ? input.ids.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 200) : [];
  if (ids.length === 0 || ids.length > MAX_IDS_PER_ACTION) return fail(400, "invalid-selection");

  let payoutReference: string | undefined;
  if (to === "paid") {
    const reference = typeof input.payoutReference === "string" ? input.payoutReference.trim() : "";
    if (reference.length < 2 || reference.length > 100) return fail(400, "payout-reference-required");
    payoutReference = reference;
  }

  const from = previousOf(to) as CommissionStatus;
  const at = ctx.now().toISOString();
  let changed = 0;
  for (const id of new Set(ids)) {
    if (await ctx.store.transitionCommission(id, [from], { status: to, at, by: admin.email, payoutReference })) changed += 1;
  }
  await recordAudit(ctx, admin, "commission-status-changed", `commissions:${to}`, {
    to,
    changed,
    skipped: ids.length - changed,
    ...(payoutReference ? { payoutReference } : {}),
  });
  return ok({ changed, skipped: ids.length - changed });
}

/**
 * "Approve all older than 14 days": pending lines whose order was paid more
 * than COMMISSION_APPROVAL_AGE_DAYS ago (past the withdrawal period), for one
 * partner or all.
 */
export async function approveOldCommissions(
  ctx: CommerceContext,
  admin: Actor,
  body: unknown,
): Promise<ServiceResult<{ changed: number }>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const partnerId = typeof input.partnerId === "string" && input.partnerId.length <= 100 ? input.partnerId : undefined;
  const cutoff = new Date(ctx.now().getTime() - COMMISSION_APPROVAL_AGE_DAYS * DAY);
  const { entries } = await ctx.store.listCommissions({ partnerId, status: "pending", orderPaidTo: cutoff, skip: 0, limit: MAX_BULK_APPROVALS });
  const at = ctx.now().toISOString();
  let changed = 0;
  for (const entry of entries) {
    if (await ctx.store.transitionCommission(entry.id, ["pending"], { status: "approved", at, by: admin.email })) changed += 1;
  }
  await recordAudit(ctx, admin, "commission-status-changed", partnerId ? `partner:${partnerId}` : "commissions:all", {
    to: "approved",
    changed,
    olderThanDays: COMMISSION_APPROVAL_AGE_DAYS,
  });
  return ok({ changed });
}

const STATUSES: CommissionStatus[] = ["pending", "approved", "payable", "paid", "reversed"];

/** One page of the ledger for the admin (all partners or one, optionally one status). */
export async function listLedgerPage(
  ctx: CommerceContext,
  query: { partnerId?: string; status?: unknown; page?: number },
  pageSize: number,
): Promise<{ entries: CommissionEntry[]; total: number; page: number; pageCount: number; status: CommissionStatus | null }> {
  const page = Number.isInteger(query.page) && (query.page as number) >= 1 ? (query.page as number) : 1;
  const status = STATUSES.includes(query.status as CommissionStatus) ? (query.status as CommissionStatus) : undefined;
  const { entries, total } = await ctx.store.listCommissions({ partnerId: query.partnerId, status, skip: (page - 1) * pageSize, limit: pageSize });
  return { entries, total, page, pageCount: Math.max(1, Math.ceil(total / pageSize)), status: status ?? null };
}
