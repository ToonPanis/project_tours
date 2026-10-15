import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { GET as outboxCron } from "@/app/api/cron/email-outbox/route";
import { POST as checkoutRoute } from "@/app/api/checkout/route";
import { POST as activateRoute } from "@/app/api/tickets/activate/route";
import { POST as webhookRoute } from "@/app/api/webhooks/stripe/route";
import { POST as taxRoute } from "@/app/api/admin/tax/route";
import { getCommerceContext } from "@/features/commerce/server/context";
import { BUYER_COOKIE } from "@/features/commerce/server/http";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { StripeGateway, toPaymentEvent, WebhookSignatureError } from "@/features/commerce/server/payment-gateway";
import { ticketCookieName } from "@/features/commerce/server/ticket-service";
import { FakePaymentGateway, ticketTokenFrom } from "./fixtures/commerce-context";
import { openSales, SOLD } from "./fixtures/commerce-sales";

/**
 * The payment Route Handlers called directly, like Next.js does. The webhook
 * uses the REAL StripeGateway signature check (Stripe's SDK, no network): the
 * events are signed with the SDK's own test helper and a test secret.
 */

const afterResponse = vi.hoisted(() => ({ tasks: [] as (() => unknown)[] }));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => unknown) => {
    afterResponse.tasks.push(task);
  },
}));

const ORIGIN = "http://localhost:3000";
const WEBHOOK_SECRET = "whsec_test_secret_for_unit_tests";
const globals = globalThis as { commerceStore?: unknown; commerceMailer?: unknown; commercePayments?: unknown };
let fake: FakePaymentGateway;
let client = 0;

beforeEach(() => {
  globals.commerceStore = undefined;
  globals.commerceMailer = undefined;
  fake = new FakePaymentGateway();
  globals.commercePayments = fake;
  afterResponse.tasks.length = 0;
  client += 1;
  vi.stubEnv("COMMERCE_SALES_ENABLED", "true");
});

function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(`${ORIGIN}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, "x-forwarded-for": `192.0.2.${client}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function runAfterResponse() {
  for (const task of afterResponse.tasks.splice(0)) await task();
}

/** A Stripe "checkout.session.completed" event for an order, as Stripe's API would send it. */
function stripeCompletedEvent(order: { id: string; totalCents: number; sessionId: string }, eventId = `evt_${Math.random().toString(36).slice(2)}`) {
  return {
    id: eventId,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: order.sessionId,
        object: "checkout.session",
        client_reference_id: order.id,
        metadata: { orderId: order.id },
        payment_status: "paid",
        amount_total: order.totalCents,
        currency: "eur",
        payment_intent: `pi_${order.id}`,
        customer_details: {
          email: "buyer@example.com",
          name: "Buyer",
          individual_name: null,
          business_name: null,
          address: { country: "BE" },
          tax_ids: [],
        },
      },
    },
  };
}

function signed(payload: string, secret = WEBHOOK_SECRET) {
  return Stripe.webhooks.generateTestHeaderString({ payload, secret });
}

async function startedOrder(quantity = 2) {
  await openSales(getCommerceContext());
  const response = await checkoutRoute(post("/api/checkout", { walkSlug: SOLD.walkSlug, quantity, locale: "en" }));
  expect(response.status).toBe(200);
  const [request] = fake.checkouts;
  const order = (await getCommerceContext().store.getOrder(request.orderId))!;
  return { response, order: { id: order.id, totalCents: order.totalCents, sessionId: order.stripe.checkoutSessionId! } };
}

describe("POST /api/checkout", () => {
  test("answers Stripe's page and sets the buyer cookie (httpOnly, SameSite=Lax)", async () => {
    const { response } = await startedOrder();
    expect(await response.json()).toEqual({ url: expect.stringContaining("checkout.stripe.test") });
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${BUYER_COOKIE}=`);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Lax/i);
  });

  test("sales closed: 403, Stripe never asked", async () => {
    vi.stubEnv("COMMERCE_SALES_ENABLED", "");
    await openSales(getCommerceContext());
    const response = await checkoutRoute(post("/api/checkout", { walkSlug: SOLD.walkSlug, quantity: 1 }));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "sales-closed" });
    expect(fake.checkouts).toHaveLength(0);
  });

  test("other sites, non-JSON and floods are refused", async () => {
    await openSales(getCommerceContext());
    expect((await checkoutRoute(post("/api/checkout", {}, { origin: "https://evil.example" }))).status).toBe(403);
    expect((await checkoutRoute(post("/api/checkout", "x", { "content-type": "text/plain" }))).status).toBe(415);
    const statuses = [];
    for (let i = 0; i < 21; i++) statuses.push((await checkoutRoute(post("/api/checkout", { walkSlug: SOLD.walkSlug, quantity: 1 }))).status);
    expect(statuses.at(-1)).toBe(429);
  });
});

describe("POST /api/webhooks/stripe (real signature check)", () => {
  beforeEach(() => {
    globals.commercePayments = new StripeGateway("sk_test_unit_tests_only", WEBHOOK_SECRET);
  });

  test("a correctly signed payment event fulfils the order (ticket, email after the answer)", async () => {
    globals.commercePayments = fake;
    const { order } = await startedOrder(3);
    globals.commercePayments = new StripeGateway("sk_test_unit_tests_only", WEBHOOK_SECRET);
    const payload = JSON.stringify(stripeCompletedEvent(order));
    const response = await webhookRoute(post("/api/webhooks/stripe", payload, { "stripe-signature": signed(payload), origin: "" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, handledAs: "fulfilled" });
    expect((await getCommerceContext().store.getOrder(order.id))?.status).toBe("paid");
    await runAfterResponse();
    expect((getCommerceContext().mailer as MemoryMailer).sent).toHaveLength(1);
  });

  test("a wrong secret, a missing signature or a changed body: 400 and nothing happens", async () => {
    globals.commercePayments = fake;
    const { order } = await startedOrder();
    globals.commercePayments = new StripeGateway("sk_test_unit_tests_only", WEBHOOK_SECRET);
    const payload = JSON.stringify(stripeCompletedEvent(order));
    const attempts = [
      post("/api/webhooks/stripe", payload, { "stripe-signature": signed(payload, "whsec_someone_else") }),
      post("/api/webhooks/stripe", payload),
      post("/api/webhooks/stripe", payload.replace(String(order.totalCents), "1"), { "stripe-signature": signed(payload) }),
    ];
    for (const request of attempts) {
      const response = await webhookRoute(request);
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "invalid-signature" });
    }
    expect((await getCommerceContext().store.getOrder(order.id))?.status).toBe("pending");
  });

  test("the same event delivered twice: the second is recognised", async () => {
    globals.commercePayments = fake;
    const { order } = await startedOrder();
    globals.commercePayments = new StripeGateway("sk_test_unit_tests_only", WEBHOOK_SECRET);
    const payload = JSON.stringify(stripeCompletedEvent(order, "evt_same"));
    await webhookRoute(post("/api/webhooks/stripe", payload, { "stripe-signature": signed(payload) }));
    const again = await webhookRoute(post("/api/webhooks/stripe", payload, { "stripe-signature": signed(payload) }));
    expect(await again.json()).toEqual({ received: true, handledAs: "already-processed" });
  });

  test("Stripe not configured: 503 (Stripe retries later); a huge body: 413", async () => {
    globals.commercePayments = undefined;
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const response = await webhookRoute(post("/api/webhooks/stripe", "{}", { "stripe-signature": "t=1,v1=x" }));
    expect(response.status).toBe(503);
    expect((await webhookRoute(post("/api/webhooks/stripe", "x".repeat(1_000_001)))).status).toBe(413);
  });
});

describe("Stripe gateway safety", () => {
  test("a LIVE key is refused while sales are closed", () => {
    globals.commercePayments = undefined;
    vi.stubEnv("COMMERCE_SALES_ENABLED", "");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_not_a_real_key");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", WEBHOOK_SECRET);
    expect(() => getCommerceContext().payments).toThrow(/live-key-while-sales-closed/);
  });

  test("the key mode is read from the key", () => {
    expect(new StripeGateway("sk_test_x", WEBHOOK_SECRET).mode).toBe("test");
    expect(new StripeGateway("sk_live_x", WEBHOOK_SECRET).mode).toBe("live");
  });

  test("Stripe's events become our small event shapes; others are 'ignored'", () => {
    const gateway = new StripeGateway("sk_test_x", WEBHOOK_SECRET);
    const parse = (event: object) => {
      const payload = JSON.stringify(event);
      return gateway.parseWebhook(payload, signed(payload));
    };
    const completed = parse(stripeCompletedEvent({ id: "o1", totalCents: 1590, sessionId: "cs_1" }, "evt_1"));
    expect(completed).toMatchObject({ id: "evt_1", type: "checkout.completed", orderId: "o1", amountTotal: 1590, currency: "eur", paymentIntentId: "pi_o1", customer: { country: "BE", vatNumber: null } });
    expect(parse({ id: "evt_2", object: "event", type: "checkout.session.expired", data: { object: { id: "cs_1", metadata: {}, client_reference_id: "o1" } } })).toEqual({
      id: "evt_2",
      type: "checkout.expired",
      sessionId: "cs_1",
      orderId: "o1",
    });
    expect(parse({ id: "evt_3", object: "event", type: "charge.refunded", data: { object: { payment_intent: "pi_1", amount_refunded: 500, currency: "eur" } } })).toEqual({
      id: "evt_3",
      type: "charge.refunded",
      paymentIntentId: "pi_1",
      amountRefunded: 500,
      currency: "eur",
    });
    expect(parse({ id: "evt_4", object: "event", type: "customer.created", data: { object: {} } })).toEqual({ id: "evt_4", type: "ignored", stripeType: "customer.created" });
    expect(() => gateway.parseWebhook("{}", "t=1,v1=bad")).toThrow(WebhookSignatureError);
    expect(toPaymentEvent({ id: "evt_5", type: "checkout.session.async_payment_failed", data: { object: { id: "cs_2", metadata: { orderId: "o2" } } } } as unknown as Stripe.Event)).toMatchObject({
      type: "checkout.async-failed",
      orderId: "o2",
    });
  });
});

describe("POST /api/tickets/activate", () => {
  test("gives this phone its ticket cookie; the same phone again gets no new cookie", async () => {
    const { order } = await startedOrder(2);
    const ctx = getCommerceContext();
    const { handlePaymentEvent } = await import("@/features/commerce/server/fulfilment-service");
    const { paidEvent } = await import("./fixtures/commerce-sales");
    await handlePaymentEvent(ctx, paidEvent(order), ORIGIN);
    const { deliverDueEmails } = await import("@/features/commerce/server/email-service");
    await deliverDueEmails(ctx);
    const token = ticketTokenFrom((ctx.mailer as MemoryMailer).sent.at(-1)!.text);

    const first = await activateRoute(post("/api/tickets/activate", { token }));
    expect(await first.json()).toEqual({ walkSlug: SOLD.walkSlug });
    const cookie = first.cookies.get(ticketCookieName(SOLD.walkSlug));
    expect(cookie?.httpOnly).toBe(true);
    const again = await activateRoute(post("/api/tickets/activate", { token }, { cookie: `${cookie!.name}=${cookie!.value}` }));
    expect(again.status).toBe(200);
    expect(again.cookies.get(ticketCookieName(SOLD.walkSlug))).toBeUndefined();
    expect((await activateRoute(post("/api/tickets/activate", { token: "made.up" }))).status).toBe(400);
  });
});

describe("admin and cron routes", () => {
  test("the tax route needs an admin session", async () => {
    const response = await taxRoute(post("/api/admin/tax", { regime: "exempt" }));
    expect(response.status).toBe(401);
  });

  test("the outbox cron needs CRON_SECRET (constant-time check)", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await outboxCron(new NextRequest(`${ORIGIN}/api/cron/email-outbox`))).status).toBe(503);
    vi.stubEnv("CRON_SECRET", "cron-secret");
    expect((await outboxCron(new NextRequest(`${ORIGIN}/api/cron/email-outbox`, { headers: { authorization: "Bearer wrong" } }))).status).toBe(401);
    const ok = await outboxCron(new NextRequest(`${ORIGIN}/api/cron/email-outbox`, { headers: { authorization: "Bearer cron-secret" } }));
    expect(await ok.json()).toEqual({ sent: 0, retrying: 0, failed: 0 });
  });
});
