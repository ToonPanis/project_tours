import { isLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { CommerceUser, Partner } from "@/types/commerce";
import { normalizeEmail } from "../logic/email";
import { describeRule, ledgerTotals, normalizePartnerCode, parsePartnerInput, type LedgerTotals } from "../logic/partners";
import type { CommerceContext } from "./context";
import { queueEmail } from "./email-service";
import { fail, ok, type ServiceResult } from "./result";
import { recordAudit, type Actor } from "./support";

/**
 * Partner management for admins (P7): create and edit partners, give people
 * access to a partner's portal. Every change is in the audit log. A partner is
 * never deleted (its ledger lines refer to it): it is switched off instead.
 */

/** Ledger lines read for the totals on the admin pages (a commission per order: plenty for years). */
const MAX_LEDGER_LINES = 50_000;

export interface PartnerRow {
  partner: Partner;
  totals: LedgerTotals;
}

/** /admin/partners: every partner with its ledger totals. */
export async function listPartnersWithTotals(ctx: CommerceContext): Promise<PartnerRow[]> {
  const [partners, { entries }] = await Promise.all([
    ctx.store.listPartners(),
    ctx.store.listCommissions({ skip: 0, limit: MAX_LEDGER_LINES }),
  ]);
  return partners.map((partner) => ({ partner, totals: ledgerTotals(entries.filter((entry) => entry.partnerId === partner.id)) }));
}

export async function createPartner(ctx: CommerceContext, admin: Actor, body: unknown): Promise<ServiceResult<Partner>> {
  const code = normalizePartnerCode(typeof body === "object" && body !== null && "code" in body ? body.code : null);
  if (!code) return fail(400, "invalid-code");
  const parsed = parsePartnerInput(body);
  if (!parsed.ok) return fail(400, parsed.error);

  const now = ctx.now().toISOString();
  const partner: Partner = { id: ctx.newId(), code, ...parsed.value, createdAt: now, updatedAt: now };
  if (!(await ctx.store.insertPartner(partner))) return fail(409, "code-exists");
  await recordAudit(ctx, admin, "partner-created", `partner:${partner.id}`, {
    code,
    name: partner.name,
    type: partner.type,
    commission: describeRule(partner.commission),
  });
  return ok(partner);
}

/**
 * Edits a partner. A new commission rule only applies to orders started from
 * now on: every order already keeps a copy of the rule it was made with.
 */
export async function updatePartner(ctx: CommerceContext, admin: Actor, partnerId: string, body: unknown): Promise<ServiceResult<Partner>> {
  const partner = partnerId.length <= 100 ? await ctx.store.getPartner(partnerId) : null;
  if (!partner) return fail(404, "unknown-partner");
  const parsed = parsePartnerInput(body);
  if (!parsed.ok) return fail(400, parsed.error);

  const updated: Partner = { ...partner, ...parsed.value, updatedAt: ctx.now().toISOString() };
  await ctx.store.updatePartner(partner.id, {
    name: updated.name,
    type: updated.type,
    active: updated.active,
    commission: updated.commission,
    updatedAt: updated.updatedAt,
  });
  const details: Record<string, string | boolean> = {};
  if (partner.name !== updated.name) details.name = `${partner.name} → ${updated.name}`;
  if (partner.type !== updated.type) details.type = `${partner.type} → ${updated.type}`;
  if (partner.active !== updated.active) details.active = updated.active;
  if (describeRule(partner.commission) !== describeRule(updated.commission)) {
    details.commission = `${describeRule(partner.commission)} → ${describeRule(updated.commission)}`;
  }
  await recordAudit(ctx, admin, "partner-updated", `partner:${partner.id}`, details);
  return ok(updated);
}

/**
 * Gives someone access to a partner's portal and emails them how to sign in.
 * An admin address can't also be a partner user (one account, one role), and an
 * address can belong to one partner only.
 */
export async function invitePartnerUser(
  ctx: CommerceContext,
  admin: Actor,
  partnerId: string,
  body: unknown,
  baseUrl: string,
): Promise<ServiceResult<CommerceUser>> {
  const partner = partnerId.length <= 100 ? await ctx.store.getPartner(partnerId) : null;
  if (!partner) return fail(404, "unknown-partner");
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const email = normalizeEmail(input.email);
  if (!email) return fail(400, "invalid-email");
  if (ctx.adminEmails.includes(email)) return fail(409, "admin-address");
  const locale = isLocale(input.locale) ? input.locale : "en";

  const existing = await ctx.store.findUserByEmail(email);
  if (existing && (existing.partnerId !== partner.id || !existing.roles.includes("PARTNER"))) return fail(409, "email-in-use");
  const user: CommerceUser = existing
    ? { ...existing, active: true }
    : { id: ctx.newId(), email, roles: ["PARTNER"], partnerId: partner.id, active: true, createdAt: ctx.now().toISOString(), lastLoginAt: null };
  await ctx.store.saveUser(user);

  const t = createTranslator(locale);
  await queueEmail(ctx, `partner-invite:${user.id}:${ctx.now().getTime()}`, {
    to: email,
    subject: t("partner.email.inviteSubject"),
    text: [
      t("partner.email.greeting"),
      "",
      t("partner.email.inviteBody", { name: partner.name }),
      `${baseUrl}/partner/login`,
      "",
      t("partner.email.inviteHow"),
    ].join("\n"),
  });
  await recordAudit(ctx, admin, "partner-user-invited", `partner:${partner.id}`, { userId: user.id });
  return ok(user);
}

/** Takes portal access away (the user's sessions stop working at once: every request checks `active`). */
export async function deactivatePartnerUser(
  ctx: CommerceContext,
  admin: Actor,
  partnerId: string,
  body: unknown,
): Promise<ServiceResult<{ deactivated: true }>> {
  const userId = typeof body === "object" && body !== null && "userId" in body ? body.userId : null;
  if (typeof userId !== "string" || userId.length > 100) return fail(400, "unknown-user");
  const user = await ctx.store.findUserById(userId);
  // Only a user of THIS partner (the partner id in the URL must match the user's).
  if (!user || user.partnerId !== partnerId || !user.roles.includes("PARTNER")) return fail(404, "unknown-user");
  await ctx.store.saveUser({ ...user, active: false });
  await recordAudit(ctx, admin, "partner-user-deactivated", `partner:${partnerId}`, { userId });
  return ok({ deactivated: true });
}

export interface PartnerAdminDetail {
  partner: Partner;
  users: CommerceUser[];
  totals: LedgerTotals;
}

export async function getPartnerAdminDetail(ctx: CommerceContext, partnerId: string): Promise<PartnerAdminDetail | null> {
  const partner = partnerId.length <= 100 ? await ctx.store.getPartner(partnerId) : null;
  if (!partner) return null;
  const [users, { entries }] = await Promise.all([
    ctx.store.listPartnerUsers(partner.id),
    ctx.store.listCommissions({ partnerId: partner.id, skip: 0, limit: MAX_LEDGER_LINES }),
  ]);
  return { partner, users, totals: ledgerTotals(entries) };
}
