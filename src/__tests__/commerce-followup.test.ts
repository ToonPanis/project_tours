import { describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as unsubscribeRoute } from "@/app/api/unsubscribe/route";
import { POST as completeRoute } from "@/app/api/tickets/complete/route";
import { REVIEW_REWARD } from "@/features/commerce/config";
import { startCheckout } from "@/features/commerce/server/checkout-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { createDiscountBatch } from "@/features/commerce/server/discount-service";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { escapeHtml, renderEmail } from "@/features/commerce/server/email-templates";
import {
  completeWalkOnDevice,
  emailHashFromUnsubscribeToken,
  recordGameFinished,
  unsubscribe,
  unsubscribeToken,
} from "@/features/commerce/server/follow-up-service";
import { handlePaymentEvent } from "@/features/commerce/server/fulfilment-service";
import { BrevoMailer, MailerError, MemoryMailer, type EmailMessage, type Mailer } from "@/features/commerce/server/mailer";
import { invoiceReadyEmail } from "@/features/commerce/server/order-emails";
import { changeQuoteStatus } from "@/features/commerce/server/quote-service";
import { checkReviewLink, moderateReview, reviewSummary, submitReview } from "@/features/commerce/server/review-service";
import { activateTicket, ticketCookieName } from "@/features/commerce/server/ticket-service";
import { signTicketToken, signValue } from "@/features/commerce/server/ticket-token";
import { createTranslator } from "@/i18n/translate";
import type { Order, QuoteRequest } from "@/types/commerce";
import { BASE_URL, sha256, testCommerceContext, TICKET_KEY } from "./fixtures/commerce-context";
import { ADMIN, nextEventId, openSales, paidEvent, SOLD } from "./fixtures/commerce-sales";

/**
 * P8 (brief 7.6): emails after a purchase and after a walk, reviews and
 * discount codes. Sending, double events, invalid addresses, provider outages
 * and retries, unsubscribing, expired codes, codes and refunds, languages.
 */

type Setup = ReturnType<typeof testCommerceContext>;
const DAY = 24 * 60 * 60 * 1000;

async function salesSetup(options: { mailer?: Mailer } = {}): Promise<Setup> {
  const setup = testCommerceContext({ salesEnabled: true, ...options });
  await openSales(setup.ctx);
  return setup;
}

/** Buys, pays (webhook) and opens the ticket on one phone; returns the order and that phone's cookie value. */
async function buyPayOpen(setup: Setup, options: { consent?: boolean; locale?: string; quantity?: number; discountCode?: string } = {}) {
  const started = await startCheckout(
    setup.ctx,
    { walkSlug: SOLD.walkSlug, quantity: options.quantity ?? 2, locale: options.locale ?? "nl", followUpConsent: options.consent ?? true, discountCode: options.discountCode },
    BASE_URL,
  );
  if (!started.ok) throw new Error(started.error);
  const pending = (await setup.store.getOrder(started.data.orderId))!;
  await handlePaymentEvent(setup.ctx, paidEvent({ id: pending.id, totalCents: pending.totalCents, sessionId: pending.stripe.checkoutSessionId! }), BASE_URL);
  const order = (await setup.store.getOrder(pending.id))!;
  const grant = (await setup.store.getGrantByOrder(order.id))!;
  const opened = await activateTicket(setup.ctx, { token: signTicketToken(grant.id, TICKET_KEY) }, () => undefined);
  if (!opened.ok || !opened.data.deviceSecret) throw new Error("ticket not opened");
  return { order, grant, device: opened.data.deviceSecret };
}

const sent = (setup: Setup) => (setup.mailer as MemoryMailer).sent;
const followUps = (setup: Setup, locale = "nl") =>
  sent(setup).filter((email) => email.subject === createTranslator(locale as "nl")("feedback.followUp.subject", { product: SOLD.name }));

async function refundFully(setup: Setup, order: Order) {
  await handlePaymentEvent(setup.ctx, { id: nextEventId(), type: "charge.refunded", paymentIntentId: order.stripe.paymentIntentId, amountRefunded: order.totalCents, currency: "eur" }, BASE_URL);
}

describe("the email layout", () => {
  test("text and HTML from the same content; everything escaped; only http(s) links", () => {
    const email = renderEmail({
      subject: "Hi <there>",
      greeting: "Hello,",
      paragraphs: ["Name: <script>alert(1)</script>", "Line 1\nLine 2"],
      button: { label: "Open", url: "https://site.example/tickets/open#abc" },
      signoff: ["Hidden Antwerp"],
      footer: ["Why you get this"],
      unsubscribe: { label: "Unsubscribe", url: "javascript:alert(1)" },
    });
    expect(email.text).toContain("Name: <script>alert(1)</script>");
    expect(email.text).toContain("https://site.example/tickets/open#abc");
    expect(email.text).toContain("Unsubscribe: javascript:alert(1)");
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain(escapeHtml("<script>alert(1)</script>"));
    expect(email.html).toContain("Line 1<br>Line 2");
    expect(email.html).toContain('href="https://site.example/tickets/open#abc"');
    expect(email.html).not.toContain("javascript:");
    expect(email.unsubscribeUrl).toBe("javascript:alert(1)");
  });

  test("Brevo gets the HTML, the text, and the one-click unsubscribe header for follow-up mail", async () => {
    const fetchFn = vi.fn(async () => new Response("{}", { status: 201 }));
    const mailer = new BrevoMailer("key", { email: "hello@site.example", name: "Hidden Antwerp" }, fetchFn as unknown as typeof fetch);
    await mailer.send({ to: "a@example.com", subject: "S", text: "T", html: "<p>T</p>", unsubscribeUrl: "https://site.example/api/unsubscribe?token=x" });
    const body = JSON.parse(String((fetchFn.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(body).toMatchObject({
      textContent: "T",
      htmlContent: "<p>T</p>",
      headers: { "List-Unsubscribe": "<https://site.example/api/unsubscribe?token=x>", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    });
    await mailer.send({ to: "a@example.com", subject: "S", text: "T" });
    expect(JSON.parse(String((fetchFn.mock.calls[1] as unknown as [string, RequestInit])[1].body))).not.toHaveProperty("headers");
  });

  test("the HTML is kept in the outbox until sent, then removed with the text", async () => {
    const setup = await salesSetup();
    const { order } = await buyPayOpen(setup);
    const [queued] = await setup.store.listDueEmails(setup.ctx.now(), 10);
    expect(queued.html).toContain("Hidden Antwerp");
    await deliverDueEmails(setup.ctx);
    const confirmation = sent(setup)[0];
    expect(confirmation.html).toContain("<table");
    expect(confirmation.text).toContain(`${BASE_URL}/tickets/open#`);
    expect(order.email).toBe(confirmation.to);
    expect(await setup.store.listDueEmails(new Date(setup.ctx.now().getTime() + DAY), 10)).toEqual([]);
  });

  test("an invalid address or a provider outage: retried with pauses, then marked failed; never a double send", async () => {
    const failing: Mailer = { provider: "brevo", send: vi.fn<(message: EmailMessage) => Promise<void>>(async () => Promise.reject(new MailerError("brevo-400"))) };
    const setup = await salesSetup({ mailer: failing });
    await buyPayOpen(setup);
    const report = await deliverDueEmails(setup.ctx);
    expect(report).toEqual({ sent: 0, retrying: 1, failed: 0 });
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 0, retrying: 0, failed: 0 });
    for (let i = 0; i < 10; i++) {
      setup.advance(3 * 60 * 60 * 1000);
      await deliverDueEmails(setup.ctx);
    }
    expect(failing.send).toHaveBeenCalledTimes(5);
  });
});

describe("transactional templates (brief 7.1)", () => {
  test("payment confirmation + access in the buyer's language; groups get how to invite the others", async () => {
    const setup = await salesSetup();
    await buyPayOpen(setup, { locale: "fr", quantity: 4 });
    await deliverDueEmails(setup.ctx);
    const fr = createTranslator("fr");
    const [email] = sent(setup);
    expect(email.subject).toBe(fr("commerce.email.confirmation.subject", { product: SOLD.name }));
    expect(email.text).toContain(fr("commerce.email.confirmation.group"));
    expect(email.html).toContain(escapeHtml(fr("commerce.email.confirmation.button")));

    const single = await salesSetup();
    await buyPayOpen(single, { locale: "fr", quantity: 1 });
    await deliverDueEmails(single.ctx);
    expect(sent(single)[0].text).not.toContain(fr("commerce.email.confirmation.group"));
  });

  test("the invoice notice is ready for the invoicing provider (P6)", async () => {
    const setup = await salesSetup();
    const { order } = await buyPayOpen(setup, { locale: "de" });
    const email = invoiceReadyEmail(order, "INV-2026-001", "https://billit.example/invoice/1");
    expect(email.subject).toBe(createTranslator("de")("commerce.email.invoice.subject"));
    expect(email.text).toContain("INV-2026-001");
    expect(email.html).toContain('href="https://billit.example/invoice/1"');
  });

  test("a corporate booking confirmed (ACCEPTED): one confirmation, in the company's language", async () => {
    const setup = testCommerceContext();
    const quote: QuoteRequest = {
      id: "q1",
      status: "QUOTED",
      company: "Acme <NV>",
      contactName: "Jan",
      email: "jan@acme.example",
      phone: null,
      preferredDate: "2026-12-05",
      participants: 25,
      activity: "team-building",
      language: "nl",
      formula: "guided",
      wishes: null,
      history: [],
      createdAt: setup.ctx.now().toISOString(),
      updatedAt: setup.ctx.now().toISOString(),
    };
    await setup.ctx.store.insertQuote(quote, "k1", new Date(setup.ctx.now().getTime() + DAY));
    expect((await changeQuoteStatus(setup.ctx, ADMIN, "q1", { status: "ACCEPTED" })).ok).toBe(true);
    await deliverDueEmails(setup.ctx);
    const nl = createTranslator("nl");
    expect(sent(setup).map((email) => email.subject)).toEqual([nl("corporate.email.accepted.subject")]);
    expect(sent(setup)[0].html).toContain("Acme &lt;NV&gt;");
  });
});

describe("the follow-up email after a walk (brief 7.2)", () => {
  test("finished with consent: ONE follow-up, with the review link and an unsubscribe header; finishing again sends nothing", async () => {
    const setup = await salesSetup();
    const { grant, device } = await buyPayOpen(setup, { consent: true });
    await completeWalkOnDevice(setup.ctx, SOLD.walkSlug, device, BASE_URL);
    await Promise.all([completeWalkOnDevice(setup.ctx, SOLD.walkSlug, device, BASE_URL), completeWalkOnDevice(setup.ctx, SOLD.walkSlug, device, BASE_URL)]);
    await deliverDueEmails(setup.ctx);
    const emails = followUps(setup);
    expect(emails).toHaveLength(1);
    expect(emails[0].text).toContain(`${BASE_URL}/review#${signValue("review", grant.id, TICKET_KEY)}`);
    expect(emails[0].unsubscribeUrl).toMatch(new RegExp(`^${BASE_URL}/api/unsubscribe\\?token=`));
    expect(emails[0].text).toContain(`${BASE_URL}/unsubscribe#`);
    expect((await setup.store.getGrant(grant.id))?.completedAt).toBe(setup.ctx.now().toISOString());
  });

  test("without consent: the walk is marked finished, but no email", async () => {
    const setup = await salesSetup();
    const { grant, device } = await buyPayOpen(setup, { consent: false });
    await completeWalkOnDevice(setup.ctx, SOLD.walkSlug, device, BASE_URL);
    await deliverDueEmails(setup.ctx);
    expect(followUps(setup)).toEqual([]);
    expect((await setup.store.getGrant(grant.id))?.completedAt).not.toBeNull();
    expect((await setup.store.getOrder(grant.orderId))?.followUp).toMatchObject({ consent: false, textVersion: expect.any(String) });
  });

  test("unsubscribed, refunded, another walk's cookie or no ticket: no email", async () => {
    const setup = await salesSetup();
    const first = await buyPayOpen(setup);
    expect(await unsubscribe(setup.ctx, unsubscribeToken(setup.ctx, first.order.email!.toUpperCase()))).toBe(true);
    await completeWalkOnDevice(setup.ctx, SOLD.walkSlug, first.device, BASE_URL);

    const refunded = await buyPayOpen(setup);
    await refundFully(setup, refunded.order);
    await completeWalkOnDevice(setup.ctx, SOLD.walkSlug, refunded.device, BASE_URL);

    const other = await buyPayOpen(setup);
    await completeWalkOnDevice(setup.ctx, "poortjes-van-antwerpen", other.device, BASE_URL);
    await completeWalkOnDevice(setup.ctx, SOLD.walkSlug, undefined, BASE_URL);
    await deliverDueEmails(setup.ctx);
    expect(followUps(setup)).toEqual([]);
    expect((await setup.store.getGrant(other.grant.id))?.completedAt ?? null).toBeNull();
  });

  test("the follow-up is in the buyer's language", async () => {
    const setup = await salesSetup();
    const { device } = await buyPayOpen(setup, { locale: "uk" });
    await completeWalkOnDevice(setup.ctx, SOLD.walkSlug, device, BASE_URL);
    await deliverDueEmails(setup.ctx);
    expect(followUps(setup, "uk")).toHaveLength(1);
  });

  test("Hidden Pubs: the host ending a game made with a ticket counts as finished", async () => {
    const setup = await salesSetup();
    const { grant } = await buyPayOpen(setup);
    await setup.store.swapGrantGame(grant.id, null, "QWERTY");
    await recordGameFinished(setup.ctx, "QWERTY", BASE_URL);
    await recordGameFinished(setup.ctx, "QWERTY", BASE_URL);
    await recordGameFinished(setup.ctx, "NOSUCH", BASE_URL);
    await deliverDueEmails(setup.ctx);
    expect(followUps(setup)).toHaveLength(1);
  });

  test("POST /api/tickets/complete always answers the same and needs the ticket cookie", async () => {
    const setup = await salesSetup();
    const { device, grant } = await buyPayOpen(setup);
    globalThis.commerceStore = setup.store;
    try {
      const post = (cookie?: string) =>
        completeRoute(
          new NextRequest(`${BASE_URL}/api/tickets/complete`, {
            method: "POST",
            headers: { "content-type": "application/json", origin: BASE_URL, ...(cookie ? { cookie } : {}) },
            body: JSON.stringify({ walkSlug: SOLD.walkSlug }),
          }),
        );
      expect(await (await post()).json()).toEqual({ received: true });
      expect((await setup.store.getGrant(grant.id))?.completedAt ?? null).toBeNull();
      expect(await (await post(`${ticketCookieName(SOLD.walkSlug)}=${device}`)).json()).toEqual({ received: true });
      expect((await setup.store.getGrant(grant.id))?.completedAt).toBeTruthy();
    } finally {
      delete globalThis.commerceStore;
    }
  });
});

declare global {
  var commerceStore: import("@/features/commerce/server/commerce-store").CommerceStore | undefined;
}

describe("unsubscribing (brief 7.5)", () => {
  test("the token holds only the address's hash; a changed token is refused", () => {
    const { ctx } = testCommerceContext();
    const token = unsubscribeToken(ctx, " Buyer@Example.com ");
    expect(emailHashFromUnsubscribeToken(ctx, token)).toBe(sha256("buyer@example.com"));
    expect(token).not.toContain("buyer");
    expect(emailHashFromUnsubscribeToken(ctx, `${token.slice(0, -2)}xx`)).toBeNull();
    // A ticket signature is not an unsubscribe signature (purposes are signed too).
    expect(emailHashFromUnsubscribeToken(ctx, signTicketToken(sha256("x"), TICKET_KEY))).toBeNull();
  });

  test("the page (JSON) and the mail app's one-click POST both work; nonsense is refused", async () => {
    const setup = testCommerceContext();
    globalThis.commerceStore = setup.store;
    try {
      // The route uses the server's own signing key (getCommerceContext), so the token is made with it.
      const token = unsubscribeToken(getCommerceContext(), "a@example.com");
      const oneClick = await unsubscribeRoute(
        new NextRequest(`${BASE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: "List-Unsubscribe=One-Click",
        }),
      );
      expect(oneClick.status).toBe(204);
      expect(await setup.store.isSuppressed(sha256("a@example.com"))).toBe(true);
      const page = await unsubscribeRoute(
        new NextRequest(`${BASE_URL}/api/unsubscribe`, { method: "POST", headers: { "content-type": "application/json", origin: BASE_URL }, body: JSON.stringify({ token: "bad.token" }) }),
      );
      expect(page.status).toBe(400);
    } finally {
      delete globalThis.commerceStore;
    }
  });
});

describe("reviews (brief 7.2)", () => {
  async function reviewable(setup: Setup, locale = "nl") {
    const bought = await buyPayOpen(setup, { locale });
    return { ...bought, token: signValue("review", bought.grant.id, TICKET_KEY) };
  }

  test("only a genuine link of a paid ticket opens the form", async () => {
    const setup = await salesSetup();
    const { token, order } = await reviewable(setup);
    expect(await checkReviewLink(setup.ctx, { token })).toMatchObject({ ok: true, data: { status: "open", rewardPercent: REVIEW_REWARD.percent } });
    expect(await checkReviewLink(setup.ctx, { token: `${token}x` })).toMatchObject({ ok: false, error: "invalid-review-link" });
    expect(await checkReviewLink(setup.ctx, { token: signTicketToken(order.id, TICKET_KEY) })).toMatchObject({ ok: false });
    await refundFully(setup, order);
    expect(await checkReviewLink(setup.ctx, { token })).toMatchObject({ ok: false, error: "invalid-review-link" });
  });

  test("a review: saved for moderation, marked rewarded, a personal single-use code by email; one per ticket, also at the same moment", async () => {
    const setup = await salesSetup();
    const { token, grant } = await reviewable(setup, "es");
    const body = { token, rating: 2, text: "Too long a walk for us.", displayName: "Ana", mayPublish: true, locale: "es" };
    const results = await Promise.all([submitReview(setup.ctx, body, "client"), submitReview(setup.ctx, body, "client")]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.find((result) => !result.ok)).toMatchObject({ error: "already-reviewed" });

    const review = (await setup.store.getReviewByGrant(grant.id))!;
    expect(review).toMatchObject({ rating: 2, status: "pending", incentivised: true, mayPublish: true, displayName: "Ana" });
    const reward = (await setup.store.getDiscount(review.rewardDiscountId!))!;
    // Also for a critical review (the reward never depends on the rating).
    expect(reward).toMatchObject({ kind: "percent", value: REVIEW_REWARD.percent, maxRedemptions: 1, source: "review", forOrderId: grant.orderId });
    expect(await checkReviewLink(setup.ctx, { token })).toMatchObject({ ok: true, data: { status: "done" } });

    await deliverDueEmails(setup.ctx);
    const rewardEmail = sent(setup).find((email) => email.subject === createTranslator("es")("feedback.rewardEmail.subject"));
    expect(rewardEmail?.text).toContain(reward.code);
  });

  test("checked input: rating 1–5, text and name length", async () => {
    const setup = await salesSetup();
    const { token } = await reviewable(setup);
    expect(await submitReview(setup.ctx, { token, rating: 0 }, "c")).toMatchObject({ error: "invalid-rating" });
    expect(await submitReview(setup.ctx, { token, rating: 4.5 }, "c")).toMatchObject({ error: "invalid-rating" });
    expect(await submitReview(setup.ctx, { token, rating: 5, text: "x".repeat(1001) }, "c")).toMatchObject({ error: "invalid-review-text" });
    expect(await submitReview(setup.ctx, { token, rating: 5, displayName: "x".repeat(41) }, "c")).toMatchObject({ error: "invalid-name" });
    expect(await submitReview(setup.ctx, { token: "nope", rating: 5 }, "c")).toMatchObject({ error: "invalid-review-link" });
  });

  test("moderation: approve, reject, delete (audited); the average counts approved reviews", async () => {
    const setup = await salesSetup();
    const first = await reviewable(setup);
    const second = await reviewable(setup);
    await submitReview(setup.ctx, { token: first.token, rating: 5 }, "c");
    await submitReview(setup.ctx, { token: second.token, rating: 2 }, "c");
    const a = (await setup.store.getReviewByGrant(first.grant.id))!;
    const b = (await setup.store.getReviewByGrant(second.grant.id))!;
    await moderateReview(setup.ctx, ADMIN, a.id, { action: "approve" });
    await moderateReview(setup.ctx, ADMIN, b.id, { action: "reject" });
    expect(await reviewSummary(setup.ctx)).toEqual({ approved: 1, average: 5, pending: 0 });
    expect(await moderateReview(setup.ctx, ADMIN, b.id, { action: "edit" })).toMatchObject({ error: "invalid-action" });
    await moderateReview(setup.ctx, ADMIN, b.id, { action: "delete" });
    expect(await setup.store.getReview(b.id)).toBeNull();
    const actions = (await setup.store.listAudit({ skip: 0, limit: 50 })).entries.map((entry) => entry.action);
    expect(actions.filter((action) => action === "review-moderated")).toHaveLength(2);
    expect(actions).toContain("review-deleted");
  });
});

describe("discount codes (brief 7.3)", () => {
  test("a reward code works once; a second buyer can't use it again", async () => {
    const setup = await salesSetup();
    const { token, grant } = { ...(await buyPayOpen(setup)), token: "" };
    const reviewToken = signValue("review", grant.id, TICKET_KEY);
    const submitted = await submitReview(setup.ctx, { token: reviewToken, rating: 4 }, "c");
    if (!submitted.ok || !submitted.data.reward) throw new Error("no reward");
    void token;
    const code = submitted.data.reward.code;
    const used = await buyPayOpen(setup, { discountCode: code });
    expect(used.order.discount?.code).toBe(code);
    const again = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 2, locale: "nl", discountCode: code }, BASE_URL);
    expect(again).toMatchObject({ ok: false, error: "discount-used-up" });
  });

  test("an expired reward code is refused", async () => {
    const setup = await salesSetup();
    const { grant } = await buyPayOpen(setup);
    const submitted = await submitReview(setup.ctx, { token: signValue("review", grant.id, TICKET_KEY), rating: 3 }, "c");
    if (!submitted.ok || !submitted.data.reward) throw new Error("no reward");
    setup.advance((REVIEW_REWARD.validDays + 1) * DAY);
    const late = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 2, locale: "nl", discountCode: submitted.data.reward.code }, BASE_URL);
    expect(late).toMatchObject({ ok: false, error: "discount-expired" });
  });

  test("a full refund gives the code's use back and switches off unused rewards of that order (once)", async () => {
    const setup = await salesSetup();
    const [batch] = [await createDiscountBatch(setup.ctx, ADMIN, { code: "EVENT", kind: "percent", value: "20", count: 1 })];
    if (!batch.ok) throw new Error(batch.error);
    const code = batch.data.codes[0];
    const bought = await buyPayOpen(setup, { discountCode: code });
    const submitted = await submitReview(setup.ctx, { token: signValue("review", bought.grant.id, TICKET_KEY), rating: 5 }, "c");
    if (!submitted.ok || !submitted.data.reward) throw new Error("no reward");

    await refundFully(setup, bought.order);
    await refundFully(setup, { ...bought.order });
    const batchCode = (await setup.store.getDiscountByCode(code))!;
    expect(batchCode.redemptions).toBe(0);
    expect((await setup.store.getDiscountByCode(submitted.data.reward.code))?.active).toBe(false);
    // The single-use code can be used again after the refund.
    expect((await buyPayOpen(setup, { discountCode: code })).order.discount?.code).toBe(code);
  });

  test("a batch: unique single-use codes with the same rules, audited; counts are checked", async () => {
    const setup = await salesSetup();
    const batch = await createDiscountBatch(setup.ctx, ADMIN, { code: "spring", kind: "fixed", value: "2,50", count: "25", validUntil: "2027-01-01" });
    if (!batch.ok) throw new Error(batch.error);
    expect(new Set(batch.data.codes).size).toBe(25);
    expect(batch.data.codes.every((code) => /^SPRING-[A-Z2-9]{8}$/.test(code))).toBe(true);
    const stored = (await setup.store.listDiscounts()).filter((discount) => discount.batchId === batch.data.batchId);
    expect(stored.every((discount) => discount.maxRedemptions === 1 && discount.value === 250 && discount.source === "batch")).toBe(true);
    expect(await createDiscountBatch(setup.ctx, ADMIN, { code: "X1Y", kind: "percent", value: "10", count: 0 })).toMatchObject({ error: "invalid-count" });
    expect(await createDiscountBatch(setup.ctx, ADMIN, { code: "X1Y", kind: "percent", value: "10", count: 501 })).toMatchObject({ error: "invalid-count" });
    expect((await setup.store.listAudit({ skip: 0, limit: 50 })).entries.map((entry) => entry.action)).toContain("discount-batch-created");
  });
});
