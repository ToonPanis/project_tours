import { isLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { CommerceUser, Partner } from "@/types/commerce";
import { LOGIN_LINK_LIFETIME_MS, PARTNER_SESSION_LIFETIME_MS, RATE_LIMITS } from "../config";
import { normalizeEmail } from "../logic/email";
import { hashSecret, type CommerceContext } from "./context";
import { queueEmail } from "./email-service";
import { fail, ok, type ServiceResult } from "./result";
import { allowRequest, recordAudit } from "./support";

/**
 * Partner sign-in (P7): the same one-time email link as the admin's
 * (auth-service.ts, decision B5), with its own pages (/partner/login), its own
 * cookie (ha_partner) and its own check. Partner users are created by an admin
 * (/admin/partners); nobody can sign up.
 *
 * Isolation (security risk R5 in SECURITY_AND_GDPR.md): the partner whose
 * figures are shown ALWAYS comes from the session (user → partnerId), never
 * from the URL or a form, so one partner can never ask for another's data.
 */

export interface PartnerActor {
  userId: string;
  email: string;
  partner: Partner;
}

/** An active PARTNER user of an active partner, or null. */
async function partnerOf(ctx: CommerceContext, user: CommerceUser | null): Promise<Partner | null> {
  if (!user || !user.active || !user.roles.includes("PARTNER") || !user.partnerId) return null;
  const partner = await ctx.store.getPartner(user.partnerId);
  return partner && partner.active ? partner : null;
}

/** Step 1: email a sign-in link. The same answer whether or not the address is a partner user. */
export async function requestPartnerLoginLink(
  ctx: CommerceContext,
  body: unknown,
  baseUrl: string,
  clientKey: string,
): Promise<ServiceResult<{ sent: true }>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const email = normalizeEmail(input.email);
  if (!email) return fail(400, "invalid-email");
  const locale = isLocale(input.locale) ? input.locale : "en";

  if (!(await allowRequest(ctx, "partner-login-email", hashSecret(email), RATE_LIMITS.loginPerEmail))) return fail(429, "too-many-requests");
  if (!(await allowRequest(ctx, "partner-login-client", clientKey, RATE_LIMITS.loginPerClient))) return fail(429, "too-many-requests");

  const user = await ctx.store.findUserByEmail(email);
  const partner = await partnerOf(ctx, user);
  if (!user || !partner) return ok({ sent: true });

  const secret = ctx.newSecret();
  const tokenHash = hashSecret(secret);
  await ctx.store.saveLoginToken({ tokenHash, userId: user.id, expiresAt: new Date(ctx.now().getTime() + LOGIN_LINK_LIFETIME_MS) });

  const t = createTranslator(locale);
  await queueEmail(ctx, `partner-login:${tokenHash}`, {
    to: user.email,
    subject: t("partner.email.loginSubject"),
    text: [
      t("partner.email.greeting"),
      "",
      t("partner.email.loginBody"),
      `${baseUrl}/partner/login/verify#${secret}`,
      "",
      t("partner.email.loginValid", { minutes: LOGIN_LINK_LIFETIME_MS / 60_000 }),
      t("partner.email.loginIgnore"),
    ].join("\n"),
  }, { sendBefore: new Date(ctx.now().getTime() + LOGIN_LINK_LIFETIME_MS) });
  return ok({ sent: true });
}

/** Step 2: use the link once and start a partner session. */
export async function verifyPartnerLoginLink(
  ctx: CommerceContext,
  body: unknown,
  clientKey: string,
): Promise<ServiceResult<{ sessionSecret: string; expiresAt: Date }>> {
  if (!(await allowRequest(ctx, "partner-login-verify", clientKey, RATE_LIMITS.verifyPerClient))) return fail(429, "too-many-requests");
  const secret = typeof body === "object" && body !== null && "token" in body ? body.token : null;
  if (typeof secret !== "string" || secret.length < 20 || secret.length > 100) return fail(400, "invalid-link");

  const now = ctx.now();
  const used = await ctx.store.consumeLoginToken(hashSecret(secret), now);
  if (!used) return fail(400, "invalid-link");
  const user = await ctx.store.findUserById(used.userId);
  const partner = await partnerOf(ctx, user);
  if (!user || !partner) return fail(403, "not-allowed");

  const sessionSecret = ctx.newSecret();
  const expiresAt = new Date(now.getTime() + PARTNER_SESSION_LIFETIME_MS);
  await ctx.store.saveSession({ tokenHash: hashSecret(sessionSecret), userId: user.id, createdAt: now, expiresAt });
  await ctx.store.saveUser({ ...user, lastLoginAt: now.toISOString() });
  await recordAudit(ctx, { id: user.id, email: user.email }, "login", `partner:${partner.id}`);
  return ok({ sessionSecret, expiresAt });
}

/**
 * The partner user behind a portal cookie, or null. Checked on every portal
 * page and request: a deactivated user or partner is refused at once. An
 * admin's session is not a partner session (the user has no PARTNER role).
 */
export async function getPartnerFromSession(ctx: CommerceContext, sessionSecret: string | null | undefined): Promise<PartnerActor | null> {
  if (!sessionSecret || sessionSecret.length > 100) return null;
  const session = await ctx.store.findSession(hashSecret(sessionSecret), ctx.now());
  if (!session) return null;
  const user = await ctx.store.findUserById(session.userId);
  const partner = await partnerOf(ctx, user);
  return user && partner ? { userId: user.id, email: user.email, partner } : null;
}

export async function signOutPartner(ctx: CommerceContext, sessionSecret: string | null | undefined): Promise<void> {
  if (!sessionSecret || sessionSecret.length > 100) return;
  await ctx.store.deleteSession(hashSecret(sessionSecret));
}
