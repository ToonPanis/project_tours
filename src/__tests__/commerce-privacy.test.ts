import { describe, expect, test } from "vitest";
import { NextRequest } from "next/server";
import { POST as eraseRoute } from "@/app/api/admin/privacy/erase/route";
import { POST as exportRoute } from "@/app/api/admin/privacy/export/route";
import { POST as lookupRoute } from "@/app/api/admin/privacy/lookup/route";
import { RETENTION } from "@/features/commerce/config";
import { requestLoginLink, verifyLoginLink } from "@/features/commerce/server/auth-service";
import { startCheckout } from "@/features/commerce/server/checkout-service";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { completeWalkOnDevice } from "@/features/commerce/server/follow-up-service";
import { handlePaymentEvent } from "@/features/commerce/server/fulfilment-service";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { createPartner, invitePartnerUser } from "@/features/commerce/server/partner-service";
import { applyRetention, erasePersonalData, exportPersonalData, findPersonalData } from "@/features/commerce/server/privacy-service";
import { submitReview } from "@/features/commerce/server/review-service";
import { activateTicket } from "@/features/commerce/server/ticket-service";
import { signTicketToken, signValue } from "@/features/commerce/server/ticket-token";
import type { QuoteRequest } from "@/types/commerce";
import { ADMIN_EMAIL, BASE_URL, linkSecretFrom, sha256, testCommerceContext, TICKET_KEY } from "./fixtures/commerce-context";
import { ADMIN, openSales, paidEvent, SOLD } from "./fixtures/commerce-sales";

/** P9: personal data requests (access, portability, erasure), retention periods, the admin sign-in alert. */

type Setup = ReturnType<typeof testCommerceContext>;
const DAY = 24 * 60 * 60 * 1000;
const BUYER = "buyer@example.com";

async function salesSetup(): Promise<Setup> {
  const setup = testCommerceContext({ salesEnabled: true });
  await openSales(setup.ctx);
  return setup;
}

async function buy(setup: Setup, customer: Record<string, unknown> = {}) {
  const started = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 2, locale: "nl", followUpConsent: true }, BASE_URL);
  if (!started.ok) throw new Error(started.error);
  const pending = (await setup.store.getOrder(started.data.orderId))!;
  await handlePaymentEvent(setup.ctx, paidEvent({ id: pending.id, totalCents: pending.totalCents, sessionId: pending.stripe.checkoutSessionId! }, customer), BASE_URL);
  const order = (await setup.store.getOrder(pending.id))!;
  const grant = (await setup.store.getGrantByOrder(order.id))!;
  return { order, grant };
}

function quote(setup: Setup, email: string): QuoteRequest {
  return {
    id: `q-${Math.random().toString(36).slice(2, 8)}`,
    status: "NEW",
    company: "Acme",
    contactName: "Jan",
    email,
    phone: null,
    preferredDate: null,
    participants: 20,
    activity: "team-building",
    language: "nl",
    formula: "unsure",
    wishes: "Private details",
    history: [],
    createdAt: setup.ctx.now().toISOString(),
    updatedAt: setup.ctx.now().toISOString(),
  };
}

describe("finding and exporting a person's data", () => {
  test("found by email in any case: orders, quotes, reviews, emails, unsubscribe status", async () => {
    const setup = await salesSetup();
    const { grant } = await buy(setup, { email: BUYER });
    await submitReview(setup.ctx, { token: signValue("review", grant.id, TICKET_KEY), rating: 4 }, "c");
    await setup.ctx.store.insertQuote(quote(setup, "Buyer@Example.com"), "k", new Date(setup.ctx.now().getTime() + DAY));
    const data = (await findPersonalData(setup.ctx, " BUYER@example.COM "))!;
    expect(data.email).toBe(BUYER);
    expect(data.orders).toHaveLength(1);
    expect(data.quotes).toHaveLength(1);
    expect(data.reviews).toHaveLength(1);
    expect(data.emails.length).toBeGreaterThan(0);
    expect(data.unsubscribed).toBe(false);
    expect(await findPersonalData(setup.ctx, "not an email")).toBeNull();
  });

  test("the export: one JSON without internal hashes or email bodies; audited by hash, never the address", async () => {
    const setup = await salesSetup();
    await buy(setup, { email: BUYER });
    const result = await exportPersonalData(setup.ctx, ADMIN, BUYER);
    if (!result.ok) throw new Error(result.error);
    const document = JSON.parse(result.data.json);
    expect(document.email).toBe(BUYER);
    expect(document.orders[0]).toMatchObject({ email: BUYER, status: "paid" });
    expect(document.orders[0]).not.toHaveProperty("buyerTokenHash");
    expect(document.emailsSent[0]).not.toHaveProperty("text");
    expect(document.emailsSent[0]).not.toHaveProperty("html");
    const [entry] = (await setup.store.listAudit({ skip: 0, limit: 5 })).entries.filter((candidate) => candidate.action === "personal-data-exported");
    expect(entry.target).toBe(`email:${sha256(BUYER).slice(0, 16)}`);
    expect(JSON.stringify(entry)).not.toContain(BUYER);
  });
});

describe("erasing a person's data", () => {
  test("the address must be typed twice; admins can't be erased here", async () => {
    const setup = await salesSetup();
    expect(await erasePersonalData(setup.ctx, ADMIN, { email: BUYER, confirm: "other@example.com" })).toMatchObject({ ok: false, error: "confirmation-mismatch" });
    expect(await erasePersonalData(setup.ctx, ADMIN, { email: ADMIN_EMAIL, confirm: ADMIN_EMAIL })).toMatchObject({ ok: false, error: "admin-address" });
  });

  test("orders lose email and name but keep what the accounts need; quotes, reviews and emails go; no follow-up ever again", async () => {
    const setup = await salesSetup();
    const business = await buy(setup, { email: BUYER, name: "Anna Peeters", businessName: "Peeters BV", vatNumber: "BE0123456789" });
    const second = await buy(setup, { email: BUYER });
    await submitReview(setup.ctx, { token: signValue("review", second.grant.id, TICKET_KEY), rating: 5, text: "Mooi" }, "c");
    await setup.ctx.store.insertQuote(quote(setup, BUYER), "k", new Date(setup.ctx.now().getTime() + DAY));
    const opened = await activateTicket(setup.ctx, { token: signTicketToken(second.grant.id, TICKET_KEY) }, () => undefined);

    const result = await erasePersonalData(setup.ctx, ADMIN, { email: BUYER, confirm: BUYER.toUpperCase() });
    expect(result).toEqual({ ok: true, data: { ordersPseudonymised: 2, quotesDeleted: 1, reviewsDeleted: 1, emailsDeleted: expect.any(Number), partnerUserErased: false } });

    const kept = (await setup.store.getOrder(business.order.id))!;
    expect(kept).toMatchObject({ email: null, totalCents: business.order.totalCents, erasedAt: setup.ctx.now().toISOString() });
    expect(kept.customer).toMatchObject({ name: null, businessName: "Peeters BV", vatNumber: "BE0123456789", country: "BE" });
    expect(kept.tax).toEqual(business.order.tax);
    const after = (await findPersonalData(setup.ctx, BUYER))!;
    expect({ orders: after.orders.length, quotes: after.quotes.length, reviews: after.reviews.length, emails: after.emails.length }).toEqual({ orders: 0, quotes: 0, reviews: 0, emails: 0 });
    expect(after.unsubscribed).toBe(true);

    // The ticket still works (it was paid for), but no follow-up goes anywhere.
    if (!opened.ok || !opened.data.deviceSecret) throw new Error("no device");
    await completeWalkOnDevice(setup.ctx, SOLD.walkSlug, opened.data.deviceSecret, BASE_URL);
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent.some((email) => email.to === BUYER && email.subject.includes(SOLD.name) && email.text.includes("/review#"))).toBe(false);
    const erasure = (await setup.store.listAudit({ skip: 0, limit: 50 })).entries.find((entry) => entry.action === "personal-data-erased");
    expect(JSON.stringify(erasure)).not.toContain(BUYER);
  });

  test("a partner user: switched off, address replaced, removed from the audit log", async () => {
    const setup = testCommerceContext();
    const partner = await createPartner(setup.ctx, ADMIN, { code: "HOTEL1", name: "Hotel One", type: "HOTEL_PARTNER", commission: { kind: "none" } });
    if (!partner.ok) throw new Error(partner.error);
    const invited = await invitePartnerUser(setup.ctx, ADMIN, partner.data.id, { email: "desk@hotel.example" }, BASE_URL);
    if (!invited.ok) throw new Error(invited.error);
    await setup.store.appendAudit({ id: "a1", actorId: invited.data.id, actorEmail: "desk@hotel.example", action: "login", target: "partner:x", details: {}, at: setup.ctx.now().toISOString() });

    const result = await erasePersonalData(setup.ctx, ADMIN, { email: "desk@hotel.example", confirm: "desk@hotel.example" });
    expect(result).toMatchObject({ ok: true, data: { partnerUserErased: true } });
    const user = (await setup.store.findUserById(invited.data.id))!;
    expect(user).toMatchObject({ active: false, email: `erased-${invited.data.id}@erased.invalid` });
    const audit = (await setup.store.listAudit({ skip: 0, limit: 50 })).entries;
    expect(JSON.stringify(audit)).not.toContain("desk@hotel.example");
  });
});

describe("retention periods (applied nightly)", () => {
  test("old audit entries, old rejected reviews and old unpaid orders go; paid orders lose personal data after the accounting period", async () => {
    const setup = await salesSetup();
    const paid = await buy(setup, { email: BUYER, name: "Anna" });
    await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1, locale: "nl" }, BASE_URL);
    await submitReview(setup.ctx, { token: signValue("review", paid.grant.id, TICKET_KEY), rating: 1 }, "c");
    const review = (await setup.store.getReviewByGrant(paid.grant.id))!;
    await setup.store.updateReview(review.id, { status: "rejected" });

    setup.advance((RETENTION.rejectedReviewDays + 1) * DAY);
    const first = await applyRetention(setup.ctx);
    expect(first).toMatchObject({ rejectedReviewsDeleted: 1, unpaidOrdersDeleted: 1, ordersPseudonymised: 0 });
    expect((await setup.store.getOrder(paid.order.id))?.email).toBe(BUYER);

    setup.advance(RETENTION.orderPersonalDataDays * DAY);
    const second = await applyRetention(setup.ctx);
    expect(second.ordersPseudonymised).toBe(1);
    expect(second.auditEntriesDeleted).toBeGreaterThan(0);
    expect((await setup.store.getOrder(paid.order.id))).toMatchObject({ email: null, customer: { name: null }, totalCents: paid.order.totalCents });
    expect(await applyRetention(setup.ctx)).toEqual({ auditEntriesDeleted: 0, rejectedReviewsDeleted: 0, unpaidOrdersDeleted: 0, ordersPseudonymised: 0 });
  });
});

describe("admin security", () => {
  test("every admin sign-in is announced to that admin by email", async () => {
    const setup = testCommerceContext();
    await requestLoginLink(setup.ctx, { email: ADMIN_EMAIL }, BASE_URL, "client");
    await deliverDueEmails(setup.ctx);
    const verified = await verifyLoginLink(setup.ctx, { token: linkSecretFrom(setup.mailer as MemoryMailer) }, "client");
    expect(verified.ok).toBe(true);
    await deliverDueEmails(setup.ctx);
    const alert = (setup.mailer as MemoryMailer).sent.at(-1)!;
    expect(alert).toMatchObject({ to: ADMIN_EMAIL, subject: "New sign-in to the Hidden Antwerp admin area" });
    expect(alert.text).toContain("ADMIN_EMAILS");
  });

  test("the personal data routes need an admin session", async () => {
    const post = (url: string) =>
      new NextRequest(url, { method: "POST", headers: { "content-type": "application/json", origin: "https://site.example" }, body: JSON.stringify({ email: BUYER }) });
    for (const route of [lookupRoute, exportRoute, eraseRoute]) {
      expect((await route(post("https://site.example/api/admin/privacy/x"))).status).toBe(401);
    }
  });
});
