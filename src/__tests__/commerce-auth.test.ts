import { describe, expect, test, vi } from "vitest";
import { ADMIN_SESSION_LIFETIME_MS, LOGIN_LINK_LIFETIME_MS, RATE_LIMITS } from "@/features/commerce/config";
import { getAdminFromSession, requestLoginLink, signOut, verifyLoginLink } from "@/features/commerce/server/auth-service";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { ADMIN_EMAIL, BASE_URL, linkSecretFrom, sha256, testCommerceContext } from "./fixtures/commerce-context";

const CLIENT = sha256("203.0.113.7");

/** Asks for a link, sends the email and returns the secret from it. */
async function emailedSecret(setup: ReturnType<typeof testCommerceContext>, email = ADMIN_EMAIL, client = CLIENT) {
  const result = await requestLoginLink(setup.ctx, { email }, BASE_URL, client);
  expect(result.ok).toBe(true);
  await deliverDueEmails(setup.ctx);
  return linkSecretFrom(setup.mailer as MemoryMailer);
}

async function signedIn(setup: ReturnType<typeof testCommerceContext>) {
  const result = await verifyLoginLink(setup.ctx, { token: await emailedSecret(setup) }, CLIENT);
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

describe("asking for a sign-in link", () => {
  test("an admin address gets one email with a link to this site's verify page", async () => {
    const setup = testCommerceContext();
    await requestLoginLink(setup.ctx, { email: " Owner@Example.com " }, BASE_URL, CLIENT);
    await deliverDueEmails(setup.ctx);
    const mailer = setup.mailer as MemoryMailer;
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0].to).toBe(ADMIN_EMAIL);
    expect(mailer.sent[0].text).toContain(`${BASE_URL}/admin/login/verify#`);
  });

  test("another address gets the very same answer, and no email (nobody can find out who the admins are)", async () => {
    const setup = testCommerceContext();
    const forAdmin = await requestLoginLink(setup.ctx, { email: ADMIN_EMAIL }, BASE_URL, CLIENT);
    const forStranger = await requestLoginLink(setup.ctx, { email: "stranger@example.com" }, BASE_URL, CLIENT);
    expect(forStranger).toEqual(forAdmin);
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent.map((email) => email.to)).toEqual([ADMIN_EMAIL]);
    expect(await setup.store.findUserByEmail("stranger@example.com")).toBeNull();
  });

  test.each([{}, { email: "" }, { email: "nope" }, { email: { $ne: "" } }, null])("refuses %j", async (body) => {
    const setup = testCommerceContext();
    expect(await requestLoginLink(setup.ctx, body, BASE_URL, CLIENT)).toEqual({ ok: false, status: 400, error: "invalid-email" });
  });

  test("only the hash of the link's secret is stored", async () => {
    const setup = testCommerceContext();
    const save = vi.spyOn(setup.store, "saveLoginToken");
    const secret = await emailedSecret(setup);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].tokenHash).toBe(sha256(secret));
    expect(save.mock.calls[0][0].tokenHash).not.toContain(secret);
  });

  test(`at most ${RATE_LIMITS.loginPerEmail.limit} links per address per window, then again after the window`, async () => {
    const setup = testCommerceContext();
    for (let i = 0; i < RATE_LIMITS.loginPerEmail.limit; i++) {
      expect((await requestLoginLink(setup.ctx, { email: ADMIN_EMAIL }, BASE_URL, sha256(`client-${i}`))).ok).toBe(true);
    }
    expect(await requestLoginLink(setup.ctx, { email: ADMIN_EMAIL }, BASE_URL, sha256("another"))).toEqual({
      ok: false,
      status: 429,
      error: "too-many-requests",
    });
    setup.advance(RATE_LIMITS.loginPerEmail.windowMs);
    expect((await requestLoginLink(setup.ctx, { email: ADMIN_EMAIL }, BASE_URL, CLIENT)).ok).toBe(true);
  });

  test(`at most ${RATE_LIMITS.loginPerClient.limit} links per network address, whatever the email`, async () => {
    const setup = testCommerceContext();
    for (let i = 0; i < RATE_LIMITS.loginPerClient.limit; i++) {
      await requestLoginLink(setup.ctx, { email: `person${i}@example.com` }, BASE_URL, CLIENT);
    }
    const refused = await requestLoginLink(setup.ctx, { email: "one-more@example.com" }, BASE_URL, CLIENT);
    expect(refused.ok).toBe(false);
  });
});

describe("using a sign-in link", () => {
  test("starts a session for the admin, recorded in the audit log", async () => {
    const setup = testCommerceContext();
    const session = await signedIn(setup);
    expect(session.admin.email).toBe(ADMIN_EMAIL);
    expect(await getAdminFromSession(setup.ctx, session.sessionSecret)).toEqual(session.admin);
    const { entries } = await setup.store.listAudit({ skip: 0, limit: 10 });
    expect(entries.map((entry) => entry.action)).toEqual(["login"]);
    expect((await setup.store.findUserById(session.admin.id))?.lastLoginAt).not.toBeNull();
  });

  test("works only once", async () => {
    const setup = testCommerceContext();
    const secret = await emailedSecret(setup);
    expect((await verifyLoginLink(setup.ctx, { token: secret }, CLIENT)).ok).toBe(true);
    expect(await verifyLoginLink(setup.ctx, { token: secret }, CLIENT)).toEqual({ ok: false, status: 400, error: "invalid-link" });
  });

  test("two requests with the same link at the same moment: exactly one session", async () => {
    const setup = testCommerceContext();
    const secret = await emailedSecret(setup);
    const results = await Promise.all([verifyLoginLink(setup.ctx, { token: secret }, CLIENT), verifyLoginLink(setup.ctx, { token: secret }, CLIENT)]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
  });

  test(`expires after ${LOGIN_LINK_LIFETIME_MS / 60_000} minutes`, async () => {
    const setup = testCommerceContext();
    const secret = await emailedSecret(setup);
    setup.advance(LOGIN_LINK_LIFETIME_MS);
    expect((await verifyLoginLink(setup.ctx, { token: secret }, CLIENT)).ok).toBe(false);
  });

  test.each([{}, { token: "" }, { token: "short" }, { token: "x".repeat(200) }, { token: { $ne: "" } }, { token: "a".repeat(43) }])(
    "refuses a wrong or made-up link %#",
    async (body) => {
      const setup = testCommerceContext();
      expect(await verifyLoginLink(setup.ctx, body, CLIENT)).toEqual({ ok: false, status: 400, error: "invalid-link" });
    },
  );

  test("an address removed from ADMIN_EMAILS before the link is used can't sign in", async () => {
    const setup = testCommerceContext();
    const secret = await emailedSecret(setup);
    const withoutAdmins = { ...setup.ctx, adminEmails: [] };
    expect(await verifyLoginLink(withoutAdmins, { token: secret }, CLIENT)).toEqual({ ok: false, status: 403, error: "not-allowed" });
  });

  test(`guessing links is rate limited (${RATE_LIMITS.verifyPerClient.limit} tries per window)`, async () => {
    const setup = testCommerceContext();
    for (let i = 0; i < RATE_LIMITS.verifyPerClient.limit; i++) {
      await verifyLoginLink(setup.ctx, { token: `guess-${i}-${"x".repeat(30)}` }, CLIENT);
    }
    expect(await verifyLoginLink(setup.ctx, { token: await emailedSecret(setup) }, CLIENT)).toEqual({
      ok: false,
      status: 429,
      error: "too-many-requests",
    });
  });
});

describe("sessions", () => {
  test("no cookie, an unknown cookie or a far too long one: not signed in", async () => {
    const setup = testCommerceContext();
    const find = vi.spyOn(setup.store, "findSession");
    expect(await getAdminFromSession(setup.ctx, undefined)).toBeNull();
    expect(await getAdminFromSession(setup.ctx, "x".repeat(101))).toBeNull();
    // Without a cookie the database isn't even asked.
    expect(find).not.toHaveBeenCalled();
    expect(await getAdminFromSession(setup.ctx, "not-a-real-session-secret-at-all-0000000")).toBeNull();
  });

  test(`end after ${ADMIN_SESSION_LIFETIME_MS / 3_600_000} hours`, async () => {
    const setup = testCommerceContext();
    const { sessionSecret } = await signedIn(setup);
    setup.advance(ADMIN_SESSION_LIFETIME_MS - 1000);
    expect(await getAdminFromSession(setup.ctx, sessionSecret)).not.toBeNull();
    setup.advance(1000);
    expect(await getAdminFromSession(setup.ctx, sessionSecret)).toBeNull();
  });

  test("removing the address from ADMIN_EMAILS ends the admin rights at once", async () => {
    const setup = testCommerceContext();
    const { sessionSecret } = await signedIn(setup);
    expect(await getAdminFromSession({ ...setup.ctx, adminEmails: [] }, sessionSecret)).toBeNull();
  });

  test("a deactivated user is refused", async () => {
    const setup = testCommerceContext();
    const { sessionSecret, admin } = await signedIn(setup);
    const user = await setup.store.findUserById(admin.id);
    await setup.store.saveUser({ ...user!, active: false });
    expect(await getAdminFromSession(setup.ctx, sessionSecret)).toBeNull();
  });

  test("signing out ends the session and is recorded", async () => {
    const setup = testCommerceContext();
    const { sessionSecret } = await signedIn(setup);
    await signOut(setup.ctx, sessionSecret);
    expect(await getAdminFromSession(setup.ctx, sessionSecret)).toBeNull();
    const { entries } = await setup.store.listAudit({ skip: 0, limit: 10 });
    expect(entries.map((entry) => entry.action).sort()).toEqual(["login", "logout"]);
    // Signing out without (or with an unknown) session does nothing and doesn't fail.
    await signOut(setup.ctx, undefined);
    await signOut(setup.ctx, sessionSecret);
  });

  test("the session secret is stored only as a hash", async () => {
    const setup = testCommerceContext();
    const save = vi.spyOn(setup.store, "saveSession");
    const { sessionSecret } = await signedIn(setup);
    expect(save.mock.calls[0][0].tokenHash).toBe(sha256(sessionSecret));
  });
});
