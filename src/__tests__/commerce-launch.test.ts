import { afterEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as payRoute } from "@/app/api/playtest/pay/route";
import { POST as seedRoute } from "@/app/api/playtest/seed/route";
import { LOGIN_LINK_LIFETIME_MS } from "@/features/commerce/config";
import { readinessChecks, readinessSummary, type ReadinessInput } from "@/features/commerce/logic/readiness";
import { requestLoginLink } from "@/features/commerce/server/auth-service";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { FakeCheckoutGateway, fakePaymentsAllowed } from "@/features/commerce/server/fake-payment-gateway";
import { payTestOrder, seedTestShop } from "@/features/commerce/server/fake-payments";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { startCheckout } from "@/features/commerce/server/checkout-service";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ADMIN_EMAIL, BASE_URL, testCommerceContext } from "./fixtures/commerce-context";
import { TEST_TAX } from "./fixtures/commerce-sales";

/** P10: the launch readiness check, expired sign-in emails, and the browser tests' fake payments. */

afterEach(() => {
  vi.unstubAllEnvs();
});

const READY_ENV: Record<string, string> = {
  APP_BASE_URL: "https://www.hiddenantwerp.com",
  MONGODB_URI: "mongodb+srv://SECRETUSER:SECRETPASS@cluster/db",
  ADMIN_EMAILS: "owner@example.com",
  BREVO_API_KEY: "xkeysib-FAKEBREVOVALUE",
  EMAIL_FROM: "no-reply@hiddenantwerp.com",
  TICKET_SIGNING_SECRET: "FAKETICKETSECRET".repeat(3),
  CRON_SECRET: "FAKECRONSECRETVALUE",
  BLOB_READ_WRITE_TOKEN: "FAKEBLOBTOKENVALUE",
  STRIPE_SECRET_KEY: "sk_test_FAKESTRIPEVALUE",
  STRIPE_WEBHOOK_SECRET: "whsec_FAKEWEBHOOKVALUE",
};
const input = (changes: Partial<ReadinessInput> = {}, env: Record<string, string | undefined> = {}): ReadinessInput => ({
  env: { ...READY_ENV, ...env },
  taxConfirmed: false,
  sellableProducts: 0,
  region: "fra1",
  ...changes,
});
const status = (checks: ReturnType<typeof readinessChecks>, id: string) => checks.find((check) => check.id === id)?.status;

describe("launch readiness", () => {
  test("everything for testing set: ready for test mode, not for live sales", () => {
    const checks = readinessChecks(input());
    expect(checks.filter((check) => check.stage === "test").every((check) => check.status === "ok")).toBe(true);
    expect(readinessSummary(checks)).toEqual({ test: true, live: false });
  });

  test("missing or wrong settings are named", () => {
    const checks = readinessChecks(input({}, { APP_BASE_URL: "https://www.hiddenantwerp.com/", BREVO_API_KEY: "", TICKET_SIGNING_SECRET: "short", CRON_SECRET: undefined }));
    expect(status(checks, "base-url")).toBe("missing");
    expect(status(checks, "email")).toBe("missing");
    expect(status(checks, "ticket-key")).toBe("missing");
    expect(status(checks, "cron")).toBe("missing");
    expect(readinessSummary(checks).test).toBe(false);
  });

  test("live keys while sales are closed, playtest tools, test flags and a US region are warnings", () => {
    const checks = readinessChecks(
      input({ region: "iad1" }, { STRIPE_SECRET_KEY: "sk_live_abc", NEXT_PUBLIC_PLAYTEST_TOOLS: "true", COMMERCE_FAKE_PAYMENTS: "true" }),
    );
    expect(status(checks, "stripe")).toBe("warning");
    expect(status(checks, "playtest")).toBe("warning");
    expect(status(checks, "test-flags")).toBe("warning");
    expect(status(checks, "region")).toBe("warning");
  });

  test("the checks never show a secret's value", () => {
    const shown = JSON.stringify(readinessChecks(input()));
    for (const name of ["BREVO_API_KEY", "TICKET_SIGNING_SECRET", "CRON_SECRET", "BLOB_READ_WRITE_TOKEN", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "MONGODB_URI"]) {
      expect(shown).not.toContain(READY_ENV[name]);
    }
  });

  test("live stage: VAT, products, Stripe live and open sales; backups, CSP, legal and indexing stay manual", () => {
    const checks = readinessChecks(input({ taxConfirmed: true, sellableProducts: 3 }, { STRIPE_SECRET_KEY: "sk_live_x", COMMERCE_SALES_ENABLED: "true" }));
    expect(status(checks, "tax")).toBe("ok");
    expect(status(checks, "products")).toBe("ok");
    expect(status(checks, "stripe-live")).toBe("ok");
    expect(status(checks, "sales")).toBe("ok");
    for (const id of ["backups", "csp", "legal", "noindex"]) expect(status(checks, id)).toBe("manual");
    expect(readinessSummary(checks).live).toBe(false);
  });
});

describe("sign-in emails expire with their link", () => {
  test("a sign-in email that couldn't be sent within 15 minutes is given up, not sent with a dead link", async () => {
    const failing = { provider: "brevo" as const, sent: [] as unknown[], send: vi.fn(async () => Promise.reject(new Error("down"))) };
    const setup = testCommerceContext({ mailer: failing });
    await requestLoginLink(setup.ctx, { email: ADMIN_EMAIL }, BASE_URL, "client");
    await deliverDueEmails(setup.ctx);
    setup.advance(LOGIN_LINK_LIFETIME_MS + 1);
    const report = await deliverDueEmails(setup.ctx);
    expect(report).toEqual({ sent: 0, retrying: 0, failed: 1 });
    expect(failing.send).toHaveBeenCalledTimes(1);
    const [email] = await setup.store.listDueEmails(new Date(setup.ctx.now().getTime() + 10 ** 9), 10);
    expect(email).toBeUndefined();
  });

  test("within the 15 minutes it is sent normally", async () => {
    const setup = testCommerceContext();
    await requestLoginLink(setup.ctx, { email: ADMIN_EMAIL }, BASE_URL, "client");
    setup.advance(LOGIN_LINK_LIFETIME_MS - 1000);
    expect((await deliverDueEmails(setup.ctx)).sent).toBe(1);
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(1);
  });
});

describe("the browser tests' fake payments", () => {
  test("only with the flag AND memory stores, and never on Vercel", () => {
    vi.stubEnv("COMMERCE_FAKE_PAYMENTS", "true");
    vi.stubEnv("COMMERCE_MEMORY_STORES", "true");
    vi.stubEnv("VERCEL", "");
    expect(fakePaymentsAllowed()).toBe(true);
    vi.stubEnv("VERCEL", "1");
    expect(fakePaymentsAllowed()).toBe(false);
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("COMMERCE_MEMORY_STORES", "");
    expect(fakePaymentsAllowed()).toBe(false);
  });

  test("without the flag the routes answer 404 and the services refuse", async () => {
    vi.stubEnv("COMMERCE_FAKE_PAYMENTS", "");
    const post = (url: string) => new NextRequest(url, { method: "POST", headers: { "content-type": "application/json", origin: BASE_URL }, body: "{}" });
    expect((await seedRoute(post(`${BASE_URL}/api/playtest/seed`))).status).toBe(404);
    expect((await payRoute(post(`${BASE_URL}/api/playtest/pay`))).status).toBe(404);
    const { ctx } = testCommerceContext();
    expect(await seedTestShop(ctx, {})).toMatchObject({ ok: false, status: 404 });
    expect(await payTestOrder(ctx, {}, BASE_URL)).toMatchObject({ ok: false, status: 404 });
  });

  test("with the flag: seed → checkout points to the test page → pay runs the real webhook handler", async () => {
    vi.stubEnv("COMMERCE_FAKE_PAYMENTS", "true");
    vi.stubEnv("COMMERCE_MEMORY_STORES", "true");
    vi.stubEnv("VERCEL", "");
    const setup = testCommerceContext({ salesEnabled: true });
    const gateway = new FakeCheckoutGateway();
    const ctx = { ...setup.ctx, payments: gateway };
    expect((await seedTestShop(ctx, { tax: TEST_TAX })).ok).toBe(true);
    const started = await startCheckout(ctx, { walkSlug: "classics-of-antwerp", quantity: 2, locale: "en" }, BASE_URL);
    if (!started.ok) throw new Error(started.error);
    expect(started.data.url).toBe(`${BASE_URL}/playtest/checkout?order=${started.data.orderId}`);
    const paid = await payTestOrder(ctx, { order: started.data.orderId }, BASE_URL);
    expect(paid).toEqual({ ok: true, data: { successUrl: `/checkout/success?order=${started.data.orderId}` } });
    expect((await setup.store.getOrder(started.data.orderId))?.status).toBe("paid");
    expect(await setup.store.getGrantByOrder(started.data.orderId)).toMatchObject({ seats: 2, status: "active" });
    expect(() => gateway.parseWebhook()).toThrow();
  });

  test("the test-only pages and routes check the gate themselves", () => {
    for (const file of ["src/app/api/playtest/seed/route.ts", "src/app/api/playtest/pay/route.ts", "src/app/playtest/checkout/page.tsx"]) {
      expect(readFileSync(join(process.cwd(), file), "utf-8"), file).toContain("fakePaymentsAllowed()");
    }
  });
});
