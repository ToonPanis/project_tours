import { beforeEach, describe, expect, test } from "vitest";
import { NextRequest } from "next/server";
import { GET as clickRoute } from "@/app/api/r/route";
import { POST as commissionsRoute } from "@/app/api/admin/commissions/route";
import { POST as createPartnerRoute } from "@/app/api/admin/partners/route";
import { GET as partnerQrRoute } from "@/app/api/partner/qr/route";
import { PARTNER_ATTRIBUTION_MS, PARTNER_CLICK_REPEAT_MS, RATE_LIMITS } from "@/features/commerce/config";
import {
  formatReferralCookie,
  ledgerTotals,
  normalizeCampaign,
  normalizePartnerCode,
  orderCommissionCents,
  parseCommissionRule,
  parseReferralCookie,
  partnerLinkRedirect,
  referralIsValid,
  safeReturnPath,
} from "@/features/commerce/logic/partners";
import { startCheckout } from "@/features/commerce/server/checkout-service";
import { approveOldCommissions, changeCommissionStatus } from "@/features/commerce/server/commission-service";
import { handlePaymentEvent } from "@/features/commerce/server/fulfilment-service";
import { PARTNER_COOKIE, REFERRAL_COOKIE } from "@/features/commerce/server/http";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { getPartnerFromSession, requestPartnerLoginLink, verifyPartnerLoginLink } from "@/features/commerce/server/partner-auth-service";
import { buildPartnerDashboard, NO_CAMPAIGN } from "@/features/commerce/server/partner-report-service";
import { createPartner, deactivatePartnerUser, invitePartnerUser, updatePartner } from "@/features/commerce/server/partner-service";
import { recordPartnerClick, resolveReferral } from "@/features/commerce/server/referral-service";
import { buildDashboard } from "@/features/commerce/server/report-service";
import { getAdminFromSession } from "@/features/commerce/server/auth-service";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { createTranslator } from "@/i18n/translate";
import type { Order, Partner } from "@/types/commerce";
import { proxy } from "@/proxy";
import { BASE_URL, testCommerceContext } from "./fixtures/commerce-context";
import { ADMIN, nextEventId, openSales, paidEvent, SOLD } from "./fixtures/commerce-sales";

/**
 * Partner codes and commissions (P7, brief 3.6): attribution, several partners
 * in one journey, double commissions, refunds, changed rates, one partner
 * reading another's data, and rounding in the reports.
 */

type Setup = ReturnType<typeof testCommerceContext>;
const DAY = 24 * 60 * 60 * 1000;

function baseOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "o1",
    status: "paid",
    lines: [{ productId: "classics-of-antwerp", productName: "Classics", walkSlug: "classics-of-antwerp", quantity: 2, unitPriceCents: 1000, totalCents: 2000 }],
    subtotalCents: 2000,
    discount: null,
    totalCents: 2000,
    currency: "EUR",
    locale: "nl",
    buyerTokenHash: "h",
    email: "a@example.com",
    customer: null,
    taxBasis: { settingsVersion: 1, regime: "vat-registered", homeCountry: "BE", categoryId: "x", homeRateBasisPoints: 2100, ossEnabled: false, ossRates: [], exemptionNote: null },
    tax: { rateBasisPoints: 2100, country: "BE", oss: false, netCents: 1653, vatCents: 347, note: null },
    stripe: { checkoutSessionId: "cs", paymentIntentId: "pi" },
    refundedCents: 0,
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
    paidAt: "2026-10-01T10:00:00.000Z",
    ...overrides,
  };
}

async function salesSetup(): Promise<Setup> {
  const setup = testCommerceContext({ salesEnabled: true });
  await openSales(setup.ctx);
  return setup;
}

async function addPartner(setup: Setup, code: string, commission: Record<string, unknown> = { kind: "percent-net", value: "15" }): Promise<Partner> {
  const result = await createPartner(setup.ctx, ADMIN, { code, name: `Partner ${code}`, type: "HOTEL_PARTNER", commission });
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

/** A visitor opens the partner link: returns the cookie value. */
async function click(setup: Setup, code: string, existingCookie?: string, campaign?: string, clientKey = "client-a"): Promise<string> {
  const result = await recordPartnerClick(setup.ctx, { ref: code, campaign, existingCookie, clientKey });
  if (!result.cookieValue) throw new Error("no cookie");
  return result.cookieValue;
}

/** Buys `quantity` persons with the referral cookie and lets Stripe's webhook confirm the payment. */
async function buyAndPay(setup: Setup, cookie: string | undefined, quantity = 2): Promise<Order> {
  const started = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity, locale: "nl" }, BASE_URL, cookie);
  if (!started.ok) throw new Error(started.error);
  const order = (await setup.store.getOrder(started.data.orderId))!;
  await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId: order.stripe.checkoutSessionId! }), BASE_URL);
  return (await setup.store.getOrder(order.id))!;
}

async function refund(setup: Setup, order: Order, amountRefunded: number) {
  return handlePaymentEvent(setup.ctx, { id: nextEventId(), type: "charge.refunded", paymentIntentId: order.stripe.paymentIntentId, amountRefunded, currency: "eur" }, BASE_URL);
}

describe("partner codes, links and the referral cookie", () => {
  test("codes: 3–30 letters, digits or dashes, upper case; campaigns: short lower-case slugs", () => {
    expect(normalizePartnerCode(" hotelJulien ")).toBe("HOTELJULIEN");
    expect(normalizePartnerCode("CAFE-DE-KAT")).toBe("CAFE-DE-KAT");
    for (const bad of ["AB", "-ABC", "ABC-", "A B C", "A".repeat(31), { $ne: "" }, null]) expect(normalizePartnerCode(bad)).toBeNull();
    expect(normalizeCampaign("Summer-Flyer")).toBe("summer-flyer");
    expect(normalizeCampaign("bad campaign")).toBeNull();
    expect(normalizeCampaign("")).toBeNull();
  });

  test("the return path stays on our site (no open redirect)", () => {
    expect(safeReturnPath("/walks/classics-of-antwerp?x=1")).toBe("/walks/classics-of-antwerp?x=1");
    for (const bad of ["//evil.example", "https://evil.example", "/\\evil.example", "walks", null]) expect(safeReturnPath(bad)).toBe("/");
  });

  test("the proxy sends ?ref= links to /api/r and keeps the rest of the address; other pages pass", () => {
    const target = partnerLinkRedirect(new URL("https://site.example/walks?ref=HOTELJULIEN&c=lobby&lang=x"));
    expect(target?.pathname).toBe("/api/r");
    expect(Object.fromEntries(target!.searchParams)).toEqual({ ref: "HOTELJULIEN", c: "lobby", to: "/walks?lang=x" });
    expect(partnerLinkRedirect(new URL("https://site.example/walks"))).toBeNull();

    const redirected = proxy(new NextRequest("https://site.example/?ref=HOTELJULIEN"));
    expect(redirected.status).toBe(307);
    expect(redirected.headers.get("location")).toBe("https://site.example/api/r?ref=HOTELJULIEN&to=%2F");
    expect(proxy(new NextRequest("https://site.example/walks")).headers.get("location")).toBeNull();
  });

  test("the cookie holds code, campaign and click time only; anything else is refused", () => {
    const clickedAt = new Date("2026-10-16T09:00:00.000Z");
    const value = formatReferralCookie({ code: "HOTELJULIEN", campaign: "lobby", clickedAt });
    expect(value).toBe(`HOTELJULIEN.lobby.${clickedAt.getTime()}`);
    expect(parseReferralCookie(value)).toEqual({ code: "HOTELJULIEN", campaign: "lobby", clickedAt });
    expect(parseReferralCookie(`HOTELJULIEN..${clickedAt.getTime()}`)).toEqual({ code: "HOTELJULIEN", campaign: null, clickedAt });
    for (const bad of ["", "x", "HOTELJULIEN.lobby", "HOTELJULIEN.lobby.abc", "HOTELJULIEN.lobby.1.2", "a b.c.1", undefined]) expect(parseReferralCookie(bad)).toBeNull();
  });

  test("the attribution window: up to the last millisecond of 30 days; never from the future", () => {
    const clickedAt = new Date("2026-10-01T00:00:00.000Z");
    const referral = { code: "X1Y", campaign: null, clickedAt };
    expect(referralIsValid(referral, new Date(clickedAt.getTime() + PARTNER_ATTRIBUTION_MS))).toBe(true);
    expect(referralIsValid(referral, new Date(clickedAt.getTime() + PARTNER_ATTRIBUTION_MS + 1))).toBe(false);
    expect(referralIsValid(referral, new Date(clickedAt.getTime() - DAY))).toBe(false);
  });
});

describe("commission rules and amounts", () => {
  test("rules as an admin types them", () => {
    expect(parseCommissionRule({ kind: "percent-net", value: "15" })).toEqual({ kind: "percent-net", basisPoints: 1500 });
    expect(parseCommissionRule({ kind: "percent-net", value: "12,5" })).toEqual({ kind: "percent-net", basisPoints: 1250 });
    expect(parseCommissionRule({ kind: "fixed-per-ticket", value: "2,50" })).toEqual({ kind: "fixed-per-ticket", cents: 250 });
    expect(parseCommissionRule({ kind: "fixed-per-booking", value: "5" })).toEqual({ kind: "fixed-per-booking", cents: 500 });
    expect(parseCommissionRule({ kind: "none" })).toEqual({ kind: "none" });
    for (const bad of [{ kind: "percent-net", value: "0" }, { kind: "percent-net", value: "101" }, { kind: "fixed-per-ticket", value: "5000" }, { kind: "gift" }, null]) {
      expect(parseCommissionRule(bad)).toBeNull();
    }
  });

  test("percent of the net price EXCLUDING VAT (brief: a hotel gets 15 % of the net ticket price excl. VAT)", () => {
    // €20.00 paid, of which €3.47 VAT: 15 % of €16.53 = 247.95 → 248 cents.
    expect(orderCommissionCents(baseOrder(), { kind: "percent-net", basisPoints: 1500 })).toEqual({ amountCents: 248, basisCents: 1653 });
  });

  test("fixed per ticket counts persons, per booking counts once; never more than the basis", () => {
    expect(orderCommissionCents(baseOrder(), { kind: "fixed-per-ticket", cents: 150 }).amountCents).toBe(300);
    expect(orderCommissionCents(baseOrder(), { kind: "fixed-per-booking", cents: 500 }).amountCents).toBe(500);
    expect(orderCommissionCents(baseOrder(), { kind: "fixed-per-booking", cents: 99_999 }).amountCents).toBe(1653);
    expect(orderCommissionCents(baseOrder(), { kind: "none" }).amountCents).toBe(0);
  });

  test("refunds: on what was kept (partial in proportion), nothing after a full refund", () => {
    const half = baseOrder({ refundedCents: 1000 });
    // Kept €10.00; VAT left 174 (rounded) → basis 826; 15 % = 123.9 → 124.
    expect(orderCommissionCents(half, { kind: "percent-net", basisPoints: 1500 })).toEqual({ amountCents: 124, basisCents: 826 });
    expect(orderCommissionCents(half, { kind: "fixed-per-ticket", cents: 150 }).amountCents).toBe(150);
    expect(orderCommissionCents(baseOrder({ refundedCents: 2000, status: "refunded" }), { kind: "percent-net", basisPoints: 1500 }).amountCents).toBe(0);
  });

  test("rounding: per order, once; a report's total is exactly the sum of its lines", () => {
    const lines = [1, 2, 3, 7, 11, 13].map((cents, index) => {
      const order = baseOrder({ id: `o${index}`, totalCents: 995 + cents, tax: { rateBasisPoints: 2100, country: "BE", oss: false, netCents: 823 + cents, vatCents: 172, note: null } });
      return { status: "pending" as const, amountCents: orderCommissionCents(order, { kind: "percent-net", basisPoints: 1250 }).amountCents };
    });
    expect(lines.every((line) => Number.isInteger(line.amountCents))).toBe(true);
    expect(ledgerTotals(lines).earnedCents).toBe(lines.reduce((sum, line) => sum + line.amountCents, 0));
  });

  test("ledger totals: earned = everything not reversed; outstanding = not paid yet", () => {
    const totals = ledgerTotals([
      { status: "pending", amountCents: 100 },
      { status: "approved", amountCents: 200 },
      { status: "payable", amountCents: 300 },
      { status: "paid", amountCents: 400 },
      { status: "paid", amountCents: -50 },
      { status: "reversed", amountCents: 1000 },
    ]);
    expect(totals).toEqual({ pendingCents: 100, approvedCents: 200, payableCents: 300, paidCents: 350, earnedCents: 950, outstandingCents: 600, entries: 5 });
  });
});

describe("clicks on partner links", () => {
  test("an active partner's link counts one click and sets the cookie; unknown or inactive codes do nothing", async () => {
    const setup = testCommerceContext();
    const partner = await addPartner(setup, "HOTELJULIEN");
    const result = await recordPartnerClick(setup.ctx, { ref: "hoteljulien", campaign: "Lobby", existingCookie: undefined, clientKey: "c1" });
    expect(result.counted).toBe(true);
    expect(parseReferralCookie(result.cookieValue)).toMatchObject({ code: "HOTELJULIEN", campaign: "lobby" });
    expect(await setup.store.listPartnerClicks({ partnerId: partner.id, fromDay: "2026-10-16", toDay: "2026-10-16" })).toEqual([
      { partnerId: partner.id, day: "2026-10-16", campaign: "lobby", clicks: 1 },
    ]);

    expect(await recordPartnerClick(setup.ctx, { ref: "NOSUCHCODE", campaign: null, existingCookie: undefined, clientKey: "c1" })).toEqual({ cookieValue: null, counted: false });
    await updatePartner(setup.ctx, ADMIN, partner.id, { name: partner.name, type: partner.type, commission: { kind: "none" }, active: false });
    expect((await recordPartnerClick(setup.ctx, { ref: "HOTELJULIEN", campaign: null, existingCookie: undefined, clientKey: "c1" })).cookieValue).toBeNull();
  });

  test("the same visitor and link again within 30 minutes is one click; later it counts again", async () => {
    const setup = testCommerceContext();
    const partner = await addPartner(setup, "HOTELJULIEN");
    const cookie = await click(setup, "HOTELJULIEN");
    const again = await recordPartnerClick(setup.ctx, { ref: "HOTELJULIEN", campaign: null, existingCookie: cookie, clientKey: "client-a" });
    expect(again.counted).toBe(false);
    setup.advance(PARTNER_CLICK_REPEAT_MS);
    expect((await recordPartnerClick(setup.ctx, { ref: "HOTELJULIEN", campaign: null, existingCookie: cookie, clientKey: "client-a" })).counted).toBe(true);
    const [row] = await setup.store.listPartnerClicks({ partnerId: partner.id, fromDay: "2026-10-16", toDay: "2026-10-16" });
    expect(row.clicks).toBe(2);
  });

  test("one network address can't inflate the counter (rate limit), but still gets the cookie", async () => {
    const setup = testCommerceContext();
    const partner = await addPartner(setup, "HOTELJULIEN");
    const limit = RATE_LIMITS.partnerClicksPerClient.limit;
    for (let i = 0; i < limit + 5; i++) {
      const result = await recordPartnerClick(setup.ctx, { ref: "HOTELJULIEN", campaign: `c${i}`, existingCookie: undefined, clientKey: "same-ip" });
      expect(result.cookieValue).not.toBeNull();
    }
    const rows = await setup.store.listPartnerClicks({ partnerId: partner.id, fromDay: "2026-10-16", toDay: "2026-10-16" });
    expect(rows.reduce((sum, row) => sum + row.clicks, 0)).toBe(limit);
  });

  test("GET /api/r: cookie + back to the page; unknown codes and foreign addresses never break the visit", async () => {
    const setup = testCommerceContext();
    await addPartner(setup, "HOTELJULIEN");
    globalThis.commerceStore = setup.store;
    try {
      const response = await clickRoute(new NextRequest("https://site.example/api/r?ref=HOTELJULIEN&c=lobby&to=%2Fwalks%3Fx%3D1"));
      expect(response.status).toBe(303);
      expect(response.headers.get("location")).toBe("https://site.example/walks?x=1");
      const cookie = response.cookies.get(REFERRAL_COOKIE);
      expect(cookie?.httpOnly).toBe(true);
      expect(cookie?.sameSite).toBe("lax");
      expect(parseReferralCookie(cookie?.value)).toMatchObject({ code: "HOTELJULIEN", campaign: "lobby" });

      const unknown = await clickRoute(new NextRequest("https://site.example/api/r?ref=NOPE1&to=//evil.example"));
      expect(unknown.headers.get("location")).toBe("https://site.example/");
      expect(unknown.cookies.get(REFERRAL_COOKIE)).toBeUndefined();
    } finally {
      delete globalThis.commerceStore;
    }
  });
});

declare global {
  var commerceStore: import("@/features/commerce/server/commerce-store").CommerceStore | undefined;
}

describe("attribution and the commission ledger", () => {
  test("a purchase through a partner link: the order keeps the partner and rule; payment books ONE pending commission", async () => {
    const setup = await salesSetup();
    const partner = await addPartner(setup, "HOTELJULIEN");
    const cookie = await click(setup, "HOTELJULIEN", undefined, "lobby");
    const order = await buyAndPay(setup, cookie, 2);
    expect(order.partner).toMatchObject({ partnerId: partner.id, code: "HOTELJULIEN", campaign: "lobby", rule: { kind: "percent-net", basisPoints: 1500 } });

    const [line] = await setup.store.listCommissionsForOrder(order.id);
    const expected = orderCommissionCents(order, { kind: "percent-net", basisPoints: 1500 });
    expect(line).toMatchObject({ id: `accrual:${order.id}`, kind: "accrual", status: "pending", amountCents: expected.amountCents, basisCents: order.tax!.netCents, campaign: "lobby" });
    expect(expected.amountCents).toBeGreaterThan(0);
  });

  test("no commission before payment, and none for an unpaid (expired) checkout", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    const cookie = await click(setup, "HOTELJULIEN");
    const started = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 2, locale: "nl" }, BASE_URL, cookie);
    if (!started.ok) throw new Error(started.error);
    expect(await setup.store.listCommissionsForOrder(started.data.orderId)).toEqual([]);
    await handlePaymentEvent(setup.ctx, { id: nextEventId(), type: "checkout.expired", orderId: started.data.orderId, sessionId: "x" } as never, BASE_URL);
    expect(await setup.store.listCommissionsForOrder(started.data.orderId)).toEqual([]);
  });

  test("double commissions: the same webhook twice, or twice at the same moment, books one line", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    const cookie = await click(setup, "HOTELJULIEN");
    const started = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 2, locale: "nl" }, BASE_URL, cookie);
    if (!started.ok) throw new Error(started.error);
    const order = (await setup.store.getOrder(started.data.orderId))!;
    const event = paidEvent({ id: order.id, totalCents: order.totalCents, sessionId: order.stripe.checkoutSessionId! });
    await Promise.all([handlePaymentEvent(setup.ctx, event, BASE_URL), handlePaymentEvent(setup.ctx, event, BASE_URL)]);
    await handlePaymentEvent(setup.ctx, { ...event, id: nextEventId() }, BASE_URL);
    await handlePaymentEvent(setup.ctx, { ...event, id: nextEventId(), type: "checkout.async-succeeded" }, BASE_URL);
    expect(await setup.store.listCommissionsForOrder(order.id)).toHaveLength(1);
  });

  test("several partners in one journey: the LAST click within the window wins", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    const cafe = await addPartner(setup, "CAFEDEKAT", { kind: "fixed-per-ticket", value: "1" });
    let cookie = await click(setup, "HOTELJULIEN");
    setup.advance(2 * DAY);
    cookie = await click(setup, "CAFEDEKAT", cookie);
    const order = await buyAndPay(setup, cookie, 3);
    expect(order.partner?.partnerId).toBe(cafe.id);
    const [line] = await setup.store.listCommissionsForOrder(order.id);
    expect(line).toMatchObject({ partnerId: cafe.id, amountCents: 300 });
  });

  test("outside the 30-day window, or a partner switched off meanwhile: no partner, no commission", async () => {
    const setup = await salesSetup();
    const partner = await addPartner(setup, "HOTELJULIEN");
    const cookie = await click(setup, "HOTELJULIEN");
    setup.advance(PARTNER_ATTRIBUTION_MS + 1000);
    const late = await buyAndPay(setup, cookie);
    expect(late.partner ?? null).toBeNull();

    const fresh = await click(setup, "HOTELJULIEN");
    await updatePartner(setup.ctx, ADMIN, partner.id, { name: partner.name, type: partner.type, commission: { kind: "percent-net", value: "15" }, active: false });
    expect(await resolveReferral(setup.ctx, fresh)).toBeNull();
    expect(await setup.store.listCommissions({ skip: 0, limit: 10 })).toMatchObject({ total: 0 });
  });

  test("a tampered cookie (unknown code, future time) gives nothing", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    expect(await resolveReferral(setup.ctx, "NOSUCH..1760000000000")).toBeNull();
    expect(await resolveReferral(setup.ctx, `HOTELJULIEN..${Date.parse("2027-01-01")}`)).toBeNull();
    expect(await resolveReferral(setup.ctx, "garbage")).toBeNull();
  });

  test("a changed commission rate only applies to new orders (old orders keep their copy)", async () => {
    const setup = await salesSetup();
    const partner = await addPartner(setup, "HOTELJULIEN", { kind: "percent-net", value: "10" });
    const cookie = await click(setup, "HOTELJULIEN");
    const started = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 2, locale: "nl" }, BASE_URL, cookie);
    if (!started.ok) throw new Error(started.error);
    // The rate changes while the buyer is on the payment page.
    await updatePartner(setup.ctx, ADMIN, partner.id, { name: partner.name, type: partner.type, commission: { kind: "percent-net", value: "20" } });
    const pending = (await setup.store.getOrder(started.data.orderId))!;
    await handlePaymentEvent(setup.ctx, paidEvent({ id: pending.id, totalCents: pending.totalCents, sessionId: pending.stripe.checkoutSessionId! }), BASE_URL);
    const first = (await setup.store.getOrder(pending.id))!;
    const [oldLine] = await setup.store.listCommissionsForOrder(first.id);
    expect(oldLine.rule).toEqual({ kind: "percent-net", basisPoints: 1000 });
    expect(oldLine.amountCents).toBe(Math.round((first.tax!.netCents * 1000) / 10_000));

    const second = await buyAndPay(setup, cookie);
    const [newLine] = await setup.store.listCommissionsForOrder(second.id);
    expect(newLine.rule).toEqual({ kind: "percent-net", basisPoints: 2000 });
  });

  test("refunds: partial → a negative adjustment; full before payout → reversed; the same event again changes nothing", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    const cookie = await click(setup, "HOTELJULIEN");
    const order = await buyAndPay(setup, cookie, 2);
    const [accrual] = await setup.store.listCommissionsForOrder(order.id);

    await refund(setup, order, 500);
    const afterPartial = (await setup.store.getOrder(order.id))!;
    const target = orderCommissionCents(afterPartial, afterPartial.partner!.rule).amountCents;
    let lines = await setup.store.listCommissionsForOrder(order.id);
    const adjustment = lines.find((line) => line.kind === "adjustment")!;
    expect(adjustment).toMatchObject({ id: `adjustment:${order.id}:500`, status: "pending", amountCents: target - accrual.amountCents });
    expect(ledgerTotals(lines).earnedCents).toBe(target);

    // Stripe sends the same total again (a retry): nothing new.
    expect(await refund(setup, order, 500)).toBe("already-processed");
    expect(await setup.store.listCommissionsForOrder(order.id)).toHaveLength(2);

    await refund(setup, order, order.totalCents);
    lines = await setup.store.listCommissionsForOrder(order.id);
    expect(lines.map((line) => line.status)).toEqual(["reversed", "reversed"]);
    expect(ledgerTotals(lines).earnedCents).toBe(0);
  });

  test("a full refund AFTER the commission was paid out: a negative adjustment to settle with the next payout", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    const order = await buyAndPay(setup, await click(setup, "HOTELJULIEN"));
    const [accrual] = await setup.store.listCommissionsForOrder(order.id);
    for (const to of ["approved", "payable", "paid"] as const) {
      const result = await changeCommissionStatus(setup.ctx, ADMIN, { to, ids: [accrual.id], payoutReference: "BANK-001" });
      expect(result).toEqual({ ok: true, data: { changed: 1, skipped: 0 } });
    }
    await refund(setup, order, order.totalCents);
    const lines = await setup.store.listCommissionsForOrder(order.id);
    expect(lines.find((line) => line.kind === "accrual")?.status).toBe("paid");
    expect(lines.find((line) => line.kind === "adjustment")).toMatchObject({ amountCents: -accrual.amountCents, status: "pending" });
    expect(ledgerTotals(lines)).toMatchObject({ earnedCents: 0, paidCents: accrual.amountCents, outstandingCents: -accrual.amountCents });
  });

  test("a partner with 'no commission' gets statistics but no ledger lines", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "TOURISM1", { kind: "none" });
    const order = await buyAndPay(setup, await click(setup, "TOURISM1"));
    expect(order.partner?.code).toBe("TOURISM1");
    expect(await setup.store.listCommissionsForOrder(order.id)).toEqual([]);
  });
});

describe("admin: partners and payouts", () => {
  test("creating partners: codes are unique, input is checked, every change is audited", async () => {
    const setup = testCommerceContext();
    await addPartner(setup, "HOTELJULIEN");
    expect(await createPartner(setup.ctx, ADMIN, { code: "hoteljulien", name: "Again", type: "HOTEL_PARTNER", commission: { kind: "none" } })).toMatchObject({ ok: false, error: "code-exists" });
    expect(await createPartner(setup.ctx, ADMIN, { code: "OK1", name: "X", type: "HOTEL_PARTNER", commission: { kind: "none" } })).toMatchObject({ error: "invalid-name" });
    expect(await createPartner(setup.ctx, ADMIN, { code: "OK1", name: "Name", type: "BREWERY", commission: { kind: "none" } })).toMatchObject({ error: "invalid-type" });
    expect(await createPartner(setup.ctx, ADMIN, { code: "OK1", name: "Name", type: "HOTEL_PARTNER", commission: { kind: "percent-net", value: "abc" } })).toMatchObject({ error: "invalid-commission" });
    const { entries } = await setup.store.listAudit({ skip: 0, limit: 10 });
    expect(entries.map((entry) => entry.action)).toEqual(["partner-created"]);
  });

  test("status steps: one at a time, 'paid' needs the transfer reference, lines in another step are skipped", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    const order = await buyAndPay(setup, await click(setup, "HOTELJULIEN"));
    const [line] = await setup.store.listCommissionsForOrder(order.id);
    expect(await changeCommissionStatus(setup.ctx, ADMIN, { to: "payable", ids: [line.id] })).toEqual({ ok: true, data: { changed: 0, skipped: 1 } });
    await changeCommissionStatus(setup.ctx, ADMIN, { to: "approved", ids: [line.id] });
    await changeCommissionStatus(setup.ctx, ADMIN, { to: "payable", ids: [line.id] });
    expect(await changeCommissionStatus(setup.ctx, ADMIN, { to: "paid", ids: [line.id] })).toMatchObject({ ok: false, error: "payout-reference-required" });
    expect(await changeCommissionStatus(setup.ctx, ADMIN, { to: "reversed", ids: [line.id] })).toMatchObject({ ok: false, error: "invalid-status" });
    expect(await changeCommissionStatus(setup.ctx, ADMIN, { to: "approved", ids: [] })).toMatchObject({ ok: false, error: "invalid-selection" });
    await changeCommissionStatus(setup.ctx, ADMIN, { to: "paid", ids: [line.id], payoutReference: "BANK-2026-10" });
    const [paid] = await setup.store.listCommissionsForOrder(order.id);
    expect(paid).toMatchObject({ status: "paid", payoutReference: "BANK-2026-10" });
    expect(paid.history.map((entry) => entry.by)).toEqual([null, ADMIN.email, ADMIN.email, ADMIN.email]);
  });

  test("'approve all older than 14 days' leaves younger lines pending", async () => {
    const setup = await salesSetup();
    await addPartner(setup, "HOTELJULIEN");
    const old = await buyAndPay(setup, await click(setup, "HOTELJULIEN"));
    setup.advance(10 * DAY);
    const young = await buyAndPay(setup, await click(setup, "HOTELJULIEN", undefined, undefined, "client-b"));
    setup.advance(5 * DAY);
    expect(await approveOldCommissions(setup.ctx, ADMIN, {})).toEqual({ ok: true, data: { changed: 1 } });
    expect((await setup.store.listCommissionsForOrder(old.id))[0].status).toBe("approved");
    expect((await setup.store.listCommissionsForOrder(young.id))[0].status).toBe("pending");
  });

  test("the admin dashboard shows commissions and revenue per partner", async () => {
    const setup = await salesSetup();
    const partner = await addPartner(setup, "HOTELJULIEN");
    const order = await buyAndPay(setup, await click(setup, "HOTELJULIEN"));
    await buyAndPay(setup, undefined);
    const [line] = await setup.store.listCommissionsForOrder(order.id);
    const dashboard = await buildDashboard(setup.ctx, { range: "today" });
    expect(dashboard.commissionsCents).toBe(line.amountCents);
    expect(dashboard.commissionsByPartner).toEqual({ [partner.id]: line.amountCents });
    expect(dashboard.report.byPartner).toEqual([expect.objectContaining({ partnerId: partner.id, code: "HOTELJULIEN", orders: 1, netCents: order.totalCents })]);
  });

  test("admin partner and commission routes refuse requests without an admin session", async () => {
    const post = (url: string) => new NextRequest(url, { method: "POST", headers: { "content-type": "application/json", origin: "https://site.example" }, body: "{}" });
    expect((await createPartnerRoute(post("https://site.example/api/admin/partners"))).status).toBe(401);
    expect((await commissionsRoute(post("https://site.example/api/admin/commissions"))).status).toBe(401);
  });
});

describe("partner portal: sign-in and isolation", () => {
  beforeEach(() => {
    delete globalThis.commerceStore;
  });

  async function signedInPartner(setup: Setup, code: string, email: string) {
    const partner = await addPartner(setup, code);
    const invited = await invitePartnerUser(setup.ctx, ADMIN, partner.id, { email, locale: "fr" }, BASE_URL);
    if (!invited.ok) throw new Error(invited.error);
    await requestPartnerLoginLink(setup.ctx, { email, locale: "nl" }, BASE_URL, "client");
    await deliverDueEmails(setup.ctx);
    const text = (setup.mailer as MemoryMailer).sent.at(-1)?.text ?? "";
    const token = /\/partner\/login\/verify#([A-Za-z0-9_-]+)/.exec(text)?.[1];
    const session = await verifyPartnerLoginLink(setup.ctx, { token }, "client");
    if (!session.ok) throw new Error(session.error);
    return { partner, user: invited.data, secret: session.data.sessionSecret };
  }

  test("invite → email in the chosen language → one-time link → a partner session (and never an admin one)", async () => {
    const setup = testCommerceContext();
    const { partner, secret } = await signedInPartner(setup, "HOTELJULIEN", "frontdesk@hotel.example");
    const sent = (setup.mailer as MemoryMailer).sent;
    expect(sent[0].subject).toBe(createTranslator("fr")("partner.email.inviteSubject"));
    expect(sent[0].text).toContain(`${BASE_URL}/partner/login`);
    expect(sent[1].subject).toBe(createTranslator("nl")("partner.email.loginSubject"));

    expect((await getPartnerFromSession(setup.ctx, secret))?.partner.id).toBe(partner.id);
    expect(await getAdminFromSession(setup.ctx, secret)).toBeNull();
  });

  test("addresses without portal access get the same answer and no email; admin addresses can't be partner users", async () => {
    const setup = testCommerceContext();
    const partner = await addPartner(setup, "HOTELJULIEN");
    expect(await requestPartnerLoginLink(setup.ctx, { email: "stranger@example.com" }, BASE_URL, "client")).toEqual({ ok: true, data: { sent: true } });
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(0);
    expect(await invitePartnerUser(setup.ctx, ADMIN, partner.id, { email: ADMIN.email }, BASE_URL)).toMatchObject({ ok: false, error: "admin-address" });
    const other = await addPartner(setup, "CAFEDEKAT");
    await invitePartnerUser(setup.ctx, ADMIN, partner.id, { email: "shared@example.com" }, BASE_URL);
    expect(await invitePartnerUser(setup.ctx, ADMIN, other.id, { email: "shared@example.com" }, BASE_URL)).toMatchObject({ ok: false, error: "email-in-use" });
  });

  test("an admin session is not a partner session", async () => {
    const setup = testCommerceContext();
    const admin = { id: "admin-user", email: ADMIN.email, roles: ["ADMIN" as const], active: true, createdAt: "2026-01-01T00:00:00.000Z", lastLoginAt: null };
    await setup.store.saveUser(admin);
    await setup.store.saveSession({ tokenHash: (await import("./fixtures/commerce-context")).sha256("admin-secret"), userId: admin.id, createdAt: setup.ctx.now(), expiresAt: new Date(setup.ctx.now().getTime() + DAY) });
    expect(await getAdminFromSession(setup.ctx, "admin-secret")).not.toBeNull();
    expect(await getPartnerFromSession(setup.ctx, "admin-secret")).toBeNull();
  });

  test("access ends at once when the user is removed or the partner switched off", async () => {
    const setup = testCommerceContext();
    const { partner, user, secret } = await signedInPartner(setup, "HOTELJULIEN", "frontdesk@hotel.example");
    expect(await deactivatePartnerUser(setup.ctx, ADMIN, "other-partner", { userId: user.id })).toMatchObject({ ok: false, error: "unknown-user" });
    await deactivatePartnerUser(setup.ctx, ADMIN, partner.id, { userId: user.id });
    expect(await getPartnerFromSession(setup.ctx, secret)).toBeNull();

    const second = await signedInPartner(setup, "CAFEDEKAT", "bar@cafe.example");
    await updatePartner(setup.ctx, ADMIN, second.partner.id, { name: second.partner.name, type: second.partner.type, commission: { kind: "none" }, active: false });
    expect(await getPartnerFromSession(setup.ctx, second.secret)).toBeNull();
  });

  test("a partner's figures contain only its own clicks and sales, and nothing that identifies a buyer", async () => {
    const setup = await salesSetup();
    const hotel = await addPartner(setup, "HOTELJULIEN");
    await addPartner(setup, "CAFEDEKAT");
    const hotelOrder = await buyAndPay(setup, await click(setup, "HOTELJULIEN", undefined, "lobby"), 2);
    await buyAndPay(setup, await click(setup, "CAFEDEKAT", undefined, undefined, "client-b"), 4);
    await click(setup, "HOTELJULIEN", undefined, undefined, "client-c");

    const dashboard = await buildPartnerDashboard(setup.ctx, hotel.id, { range: "today" });
    expect(dashboard).toMatchObject({ clicks: 2, sales: 1, conversion: 0.5 });
    expect(dashboard.revenueExVatCents).toBe(hotelOrder.tax!.netCents);
    const [line] = await setup.store.listCommissionsForOrder(hotelOrder.id);
    expect(dashboard.commissionCents).toBe(line.amountCents);
    expect(dashboard.ledger.pendingCents).toBe(line.amountCents);
    expect(dashboard.rows).toHaveLength(1);
    expect(dashboard.rows[0]).toMatchObject({ persons: 2, status: "pending" });
    const shown = JSON.stringify(dashboard);
    expect(shown).not.toContain("buyer@example.com");
    expect(shown).not.toContain(hotelOrder.id);
    expect(shown).not.toContain("CAFEDEKAT");

    expect((await buildPartnerDashboard(setup.ctx, hotel.id, { range: "today", campaign: "lobby" })).sales).toBe(1);
    expect((await buildPartnerDashboard(setup.ctx, hotel.id, { range: "today", campaign: NO_CAMPAIGN })).sales).toBe(0);
    expect((await buildPartnerDashboard(setup.ctx, hotel.id, { range: "today", campaign: NO_CAMPAIGN })).clicks).toBe(1);
    expect((await buildPartnerDashboard(setup.ctx, hotel.id, { range: "today", product: "not-a-product" })).filters.product).toBeNull();
  });

  test("the QR route needs a partner session and always uses the session's partner", async () => {
    const setup = testCommerceContext();
    const { secret } = await signedInPartner(setup, "HOTELJULIEN", "frontdesk@hotel.example");
    await addPartner(setup, "CAFEDEKAT");
    globalThis.commerceStore = setup.store;
    try {
      expect((await partnerQrRoute(new NextRequest("https://site.example/api/partner/qr"))).status).toBe(401);
      const response = await partnerQrRoute(
        new NextRequest("https://site.example/api/partner/qr?partner=CAFEDEKAT", { headers: { cookie: `${PARTNER_COOKIE}=${secret}` } }),
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("image/svg+xml");
      expect(response.headers.get("content-disposition")).toContain("hoteljulien");
      expect(await response.text()).toContain("<svg");
    } finally {
      delete globalThis.commerceStore;
    }
  });
});
