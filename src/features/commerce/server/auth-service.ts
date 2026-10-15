import type { CommerceUser } from "@/types/commerce";
import { ADMIN_SESSION_LIFETIME_MS, LOGIN_LINK_LIFETIME_MS, RATE_LIMITS } from "../config";
import { normalizeEmail } from "../logic/email";
import { hashSecret, type CommerceContext } from "./context";
import { queueEmail } from "./email-service";
import { fail, ok, type ServiceResult } from "./result";
import { allowRequest, recordAudit, type Actor } from "./support";

/**
 * Admin sign-in with a one-time email link (decision B5). No passwords:
 *
 * 1. The admin types their email address → requestLoginLink. If the address is
 *    an admin, a link with a long random secret is emailed. The answer is the
 *    same whether or not it is an admin, so nobody can find out who the admins are.
 * 2. The link opens /admin/login/verify#<secret>. The secret is after the "#",
 *    so the browser never sends it to a server or writes it in a log; the page
 *    sends it with a button press (POST). Email scanners that "click" every link
 *    to check it therefore can't use it up.
 * 3. verifyLoginLink uses the link up (once, within 15 minutes) and starts a
 *    session: another random secret, in an httpOnly cookie.
 *
 * Only SHA-256 hashes of both secrets are stored: someone who reads the database
 * still can't sign in.
 */

export interface AdminSession {
  admin: Actor;
  /** The cookie value. Only returned once, when the session starts. */
  sessionSecret: string;
  expiresAt: Date;
}

/** Who may be an admin: an active user with the ADMIN role whose address is (still) in ADMIN_EMAILS. */
function isAdmin(ctx: CommerceContext, user: CommerceUser | null): user is CommerceUser {
  return user !== null && user.active && user.roles.includes("ADMIN") && ctx.adminEmails.includes(user.email);
}

/** The user for an email address in ADMIN_EMAILS, created the first time it signs in. */
async function findOrCreateAdmin(ctx: CommerceContext, email: string): Promise<CommerceUser | null> {
  if (!ctx.adminEmails.includes(email)) return null;
  const existing = await ctx.store.findUserByEmail(email);
  if (existing) return existing;
  const user: CommerceUser = {
    id: ctx.newId(),
    email,
    roles: ["ADMIN"],
    active: true,
    createdAt: ctx.now().toISOString(),
    lastLoginAt: null,
  };
  await ctx.store.saveUser(user);
  return user;
}

/**
 * Step 1. `baseUrl` is the site's own address for the link (APP_BASE_URL in
 * production, never taken from the request there: a forged Host header could
 * otherwise put someone else's site in the email). `clientKey` = hashed network
 * address, for the rate limit.
 */
export async function requestLoginLink(
  ctx: CommerceContext,
  body: unknown,
  baseUrl: string,
  clientKey: string,
): Promise<ServiceResult<{ sent: true }>> {
  const email = normalizeEmail(typeof body === "object" && body !== null && "email" in body ? body.email : null);
  if (!email) return fail(400, "invalid-email");

  // Limits per address (no inbox can be flooded) and per network (no one can try many addresses).
  if (!(await allowRequest(ctx, "login-email", hashSecret(email), RATE_LIMITS.loginPerEmail))) return fail(429, "too-many-requests");
  if (!(await allowRequest(ctx, "login-client", clientKey, RATE_LIMITS.loginPerClient))) return fail(429, "too-many-requests");

  const user = await findOrCreateAdmin(ctx, email);
  // Not an admin: the same answer as for an admin, and no email.
  if (!isAdmin(ctx, user)) return ok({ sent: true });

  const secret = ctx.newSecret();
  const tokenHash = hashSecret(secret);
  await ctx.store.saveLoginToken({ tokenHash, userId: user.id, expiresAt: new Date(ctx.now().getTime() + LOGIN_LINK_LIFETIME_MS) });

  const minutes = LOGIN_LINK_LIFETIME_MS / 60_000;
  await queueEmail(ctx, `login:${tokenHash}`, {
    to: user.email,
    subject: "Your Hidden Antwerp sign-in link",
    text: [
      "Hello,",
      "",
      "Use this link to sign in to the Hidden Antwerp admin area:",
      `${baseUrl}/admin/login/verify#${secret}`,
      "",
      `The link works once, for ${minutes} minutes.`,
      "Didn't ask for it? Then you can ignore this email: nobody can sign in without the link.",
    ].join("\n"),
  });
  return ok({ sent: true });
}

/** Step 3: uses the link up and starts a session. */
export async function verifyLoginLink(ctx: CommerceContext, body: unknown, clientKey: string): Promise<ServiceResult<AdminSession>> {
  if (!(await allowRequest(ctx, "login-verify", clientKey, RATE_LIMITS.verifyPerClient))) return fail(429, "too-many-requests");

  const secret = typeof body === "object" && body !== null && "token" in body ? body.token : null;
  // Our secrets are 43 characters (32 bytes, base64url); anything far off is not ours.
  if (typeof secret !== "string" || secret.length < 20 || secret.length > 100) return fail(400, "invalid-link");

  const now = ctx.now();
  const used = await ctx.store.consumeLoginToken(hashSecret(secret), now);
  if (!used) return fail(400, "invalid-link");

  const user = await ctx.store.findUserById(used.userId);
  if (!isAdmin(ctx, user)) return fail(403, "not-allowed");

  const sessionSecret = ctx.newSecret();
  const expiresAt = new Date(now.getTime() + ADMIN_SESSION_LIFETIME_MS);
  await ctx.store.saveSession({ tokenHash: hashSecret(sessionSecret), userId: user.id, createdAt: now, expiresAt });
  await ctx.store.saveUser({ ...user, lastLoginAt: now.toISOString() });

  const admin = { id: user.id, email: user.email };
  await recordAudit(ctx, admin, "login", `user:${user.id}`);
  return ok({ admin, sessionSecret, expiresAt });
}

/**
 * The admin behind a session cookie, or null. Checked on every admin page and
 * request: an expired session, a deactivated user or an address removed from
 * ADMIN_EMAILS is refused at once.
 */
export async function getAdminFromSession(ctx: CommerceContext, sessionSecret: string | null | undefined): Promise<Actor | null> {
  // No cookie: answered without touching the database.
  if (!sessionSecret || sessionSecret.length > 100) return null;
  const session = await ctx.store.findSession(hashSecret(sessionSecret), ctx.now());
  if (!session) return null;
  const user = await ctx.store.findUserById(session.userId);
  return isAdmin(ctx, user) ? { id: user.id, email: user.email } : null;
}

/** Ends the session (the cookie is removed by the route). */
export async function signOut(ctx: CommerceContext, sessionSecret: string | null | undefined): Promise<void> {
  if (!sessionSecret || sessionSecret.length > 100) return;
  const admin = await getAdminFromSession(ctx, sessionSecret);
  await ctx.store.deleteSession(hashSecret(sessionSecret));
  if (admin) await recordAudit(ctx, admin, "logout", `user:${admin.id}`);
}
