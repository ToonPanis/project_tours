import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as pricingRoute } from "@/app/api/admin/corporate-pricing/route";
import { POST as quoteStatusRoute } from "@/app/api/admin/quotes/[id]/route";
import { POST as quotesRoute } from "@/app/api/quotes/route";
import { QUOTE_DUPLICATE_WINDOW_MS, QUOTE_MIN_FILL_MS, RATE_LIMITS } from "@/features/commerce/config";
import { canMoveTo, defaultCorporatePricing, nextStatuses, parseCorporatePricing, parseQuoteInput, QUOTE_STATUSES } from "@/features/commerce/logic/quotes";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { changeQuoteStatus, getCorporatePricing, listQuotesPage, submitQuote, updateCorporatePricing } from "@/features/commerce/server/quote-service";
import { createTranslator } from "@/i18n/translate";
import { ADMIN_EMAIL, BASE_URL, sha256, testCommerceContext } from "./fixtures/commerce-context";
import { ADMIN } from "./fixtures/commerce-sales";

vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: () => {},
}));

const TODAY = new Date("2026-10-16T09:00:00.000Z");
const CLIENT = sha256("198.51.100.20");

/** A request as the form sends it (filled in by a person: hidden field empty, enough time taken). */
function request(overrides: Record<string, unknown> = {}) {
  return {
    company: "Brewery NV",
    contactName: "An Peeters",
    email: "An@Brewery.example",
    phone: "+32 3 123 45 67",
    preferredDate: "2026-12-05",
    participants: 24,
    activity: "team-building",
    language: "nl",
    formula: "self-guided",
    wishes: "Vegetarian lunch\nafterwards",
    website: "",
    elapsedMs: QUOTE_MIN_FILL_MS + 2000,
    ...overrides,
  };
}

describe("the quote form, checked on the server", () => {
  test("a filled-in form: cleaned values (email lower case, spaces collapsed, line breaks kept)", () => {
    expect(parseQuoteInput(request({ company: "  Brewery   NV " }), TODAY)).toEqual({
      ok: true,
      isSpam: false,
      value: {
        company: "Brewery NV",
        contactName: "An Peeters",
        email: "an@brewery.example",
        phone: "+32 3 123 45 67",
        preferredDate: "2026-12-05",
        participants: 24,
        activity: "team-building",
        language: "nl",
        formula: "self-guided",
        wishes: "Vegetarian lunch\nafterwards",
      },
    });
  });

  test("optional fields may be empty: no phone, a flexible date, no wishes", () => {
    const parsed = parseQuoteInput(request({ phone: "", preferredDate: "", wishes: "   " }), TODAY);
    expect(parsed.ok && parsed.value).toMatchObject({ phone: null, preferredDate: null, wishes: null });
  });

  test.each([
    [{ company: "" }, "invalid-company"],
    [{ company: "x".repeat(121) }, "invalid-company"],
    [{ contactName: { $ne: "" } }, "invalid-name"],
    [{ email: "not-an-email" }, "invalid-email"],
    [{ phone: "call me" }, "invalid-phone"],
    [{ preferredDate: "05/12/2026" }, "invalid-date"],
    [{ preferredDate: "2026-10-15" }, "invalid-date"],
    [{ preferredDate: "2030-01-01" }, "invalid-date"],
    [{ participants: 1 }, "invalid-participants"],
    [{ participants: 1001 }, "invalid-participants"],
    [{ participants: 12.5 }, "invalid-participants"],
    [{ activity: "bungee" }, "invalid-activity"],
    [{ language: "pt" }, "invalid-language"],
    [{ formula: "helicopter" }, "invalid-formula"],
    [{ wishes: "x".repeat(2001) }, "invalid-wishes"],
  ])("refuses %j (%s)", (overrides, error) => {
    expect(parseQuoteInput(request(overrides), TODAY)).toEqual({ ok: false, error });
  });

  test("bots: a filled-in hidden field, or a form sent too fast (or without timing)", () => {
    expect(parseQuoteInput(request({ website: "https://spam.example" }), TODAY)).toMatchObject({ ok: true, isSpam: true });
    expect(parseQuoteInput(request({ elapsedMs: 300 }), TODAY)).toMatchObject({ ok: true, isSpam: true });
    expect(parseQuoteInput(request({ elapsedMs: undefined }), TODAY)).toMatchObject({ ok: true, isSpam: true });
  });

  test("the status steps: forward only, closed requests stay closed", () => {
    expect(nextStatuses("NEW")).toEqual(["CONTACTED", "QUOTED", "DECLINED", "CANCELLED"]);
    expect(canMoveTo("QUOTED", "ACCEPTED")).toBe(true);
    expect(canMoveTo("ACCEPTED", "COMPLETED")).toBe(true);
    expect(canMoveTo("COMPLETED", "NEW")).toBe(false);
    expect(canMoveTo("QUOTED", "CONTACTED")).toBe(false);
    for (const closed of ["DECLINED", "COMPLETED", "CANCELLED"] as const) expect(nextStatuses(closed)).toEqual([]);
    expect(QUOTE_STATUSES).toHaveLength(7);
  });
});

describe("the price guide", () => {
  test("starts with the brief's table (5.2): per group, 'from' for 50 guided, excluding VAT until changed", () => {
    expect(defaultCorporatePricing().tiers.map((tier) => [tier.persons, tier.selfGuidedCents, tier.guidedCents, tier.guidedFrom])).toEqual([
      [10, 14_900, 29_900, false],
      [20, 27_900, 49_900, false],
      [30, 39_900, 69_900, false],
      [50, 64_900, 99_900, true],
    ]);
  });

  test("the admin's table: euros as typed, empty = on request, rising numbers of persons", () => {
    expect(parseCorporatePricing({ tiers: [{ persons: "15", selfGuided: "199", guided: "", guidedFrom: true }], pricesIncludeVat: true })).toEqual({
      ok: true,
      value: { tiers: [{ persons: 15, selfGuidedCents: 19_900, guidedCents: null, guidedFrom: true }], pricesIncludeVat: true },
    });
    expect(parseCorporatePricing({ tiers: [{ persons: 10, selfGuided: "", guided: "" }], pricesIncludeVat: false })).toEqual({ ok: false, error: "invalid-tiers" });
    expect(parseCorporatePricing({ tiers: [{ persons: 20, selfGuided: "1" }, { persons: 10, selfGuided: "1" }], pricesIncludeVat: false })).toEqual({ ok: false, error: "tiers-not-rising" });
    expect(parseCorporatePricing({ tiers: [], pricesIncludeVat: false })).toEqual({ ok: false, error: "invalid-tiers" });
    expect(parseCorporatePricing({ tiers: [{ persons: 10, selfGuided: "1" }] })).toEqual({ ok: false, error: "invalid-vat-flag" });
  });

  test("saved by an admin (audit log); the page reads the saved table", async () => {
    const setup = testCommerceContext();
    expect(await getCorporatePricing(setup.ctx)).toEqual(defaultCorporatePricing());
    const saved = await updateCorporatePricing(setup.ctx, ADMIN, { tiers: [{ persons: 12, selfGuided: "180", guided: "350" }], pricesIncludeVat: true });
    expect(saved.ok).toBe(true);
    expect(await getCorporatePricing(setup.ctx)).toMatchObject({ pricesIncludeVat: true, updatedBy: ADMIN.email, tiers: [{ persons: 12, selfGuidedCents: 18_000, guidedCents: 35_000 }] });
    const [entry] = (await setup.store.listAudit({ skip: 0, limit: 1 })).entries;
    expect(entry.action).toBe("corporate-pricing-updated");
    expect(await updateCorporatePricing(setup.ctx, ADMIN, { tiers: "x" })).toEqual({ ok: false, status: 400, error: "invalid-tiers" });
  });
});

describe("sending a quote request", () => {
  test("saved as NEW; the company gets a confirmation in the form's language, every admin a notice with the admin link", async () => {
    const setup = testCommerceContext({ adminEmails: [ADMIN_EMAIL, "second@example.com"] });
    expect(await submitQuote(setup.ctx, request(), CLIENT, BASE_URL)).toEqual({ ok: true, data: { received: true } });
    const { quotes } = await listQuotesPage(setup.ctx, 1, 10, undefined);
    expect(quotes).toHaveLength(1);
    expect(quotes[0]).toMatchObject({ status: "NEW", company: "Brewery NV", email: "an@brewery.example", history: [{ status: "NEW", by: null }] });

    await deliverDueEmails(setup.ctx);
    const sent = (setup.mailer as MemoryMailer).sent;
    const nl = createTranslator("nl");
    const confirmation = sent.find((email) => email.to === "an@brewery.example");
    expect(confirmation?.subject).toBe(nl("corporate.email.subject"));
    expect(confirmation?.text).toContain(nl("corporate.email.body", { company: "Brewery NV" }));
    expect(confirmation?.text).toContain(nl("corporate.activities.team-building"));
    const notices = sent.filter((email) => email.to !== "an@brewery.example");
    expect(notices.map((email) => email.to).sort()).toEqual([ADMIN_EMAIL, "second@example.com"].sort());
    expect(notices[0].text).toContain(`${BASE_URL}/admin/quotes/${quotes[0].id}`);
  });

  test("a bot gets the same answer, but nothing is saved or sent", async () => {
    const setup = testCommerceContext();
    expect(await submitQuote(setup.ctx, request({ website: "spam" }), CLIENT, BASE_URL)).toEqual({ ok: true, data: { received: true } });
    expect(await submitQuote(setup.ctx, request({ elapsedMs: 100 }), CLIENT, BASE_URL)).toEqual({ ok: true, data: { received: true } });
    expect((await listQuotesPage(setup.ctx, 1, 10, undefined)).total).toBe(0);
    await deliverDueEmails(setup.ctx);
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(0);
  });

  test("the same request twice within a day is kept once (no second email); after a day it's new", async () => {
    const setup = testCommerceContext();
    await submitQuote(setup.ctx, request(), CLIENT, BASE_URL);
    await submitQuote(setup.ctx, request({ email: "an@brewery.EXAMPLE", company: "brewery nv" }), CLIENT, BASE_URL);
    expect((await listQuotesPage(setup.ctx, 1, 10, undefined)).total).toBe(1);
    setup.advance(QUOTE_DUPLICATE_WINDOW_MS + 1000);
    await submitQuote(setup.ctx, request(), CLIENT, BASE_URL);
    expect((await listQuotesPage(setup.ctx, 1, 10, undefined)).total).toBe(2);
    // A different date is a different request.
    await submitQuote(setup.ctx, request({ preferredDate: "2026-12-12" }), CLIENT, BASE_URL);
    expect((await listQuotesPage(setup.ctx, 1, 10, undefined)).total).toBe(3);
  });

  test(`at most ${RATE_LIMITS.quotePerClient.limit} requests per network address per hour`, async () => {
    const setup = testCommerceContext();
    for (let i = 0; i < RATE_LIMITS.quotePerClient.limit; i++) {
      expect((await submitQuote(setup.ctx, request({ company: `Company ${i}` }), CLIENT, BASE_URL)).ok).toBe(true);
    }
    expect(await submitQuote(setup.ctx, request({ company: "One more" }), CLIENT, BASE_URL)).toEqual({ ok: false, status: 429, error: "too-many-requests" });
  });

  test("an invalid form is refused with its field's code", async () => {
    const setup = testCommerceContext();
    expect(await submitQuote(setup.ctx, request({ email: "x" }), CLIENT, BASE_URL)).toEqual({ ok: false, status: 400, error: "invalid-email" });
  });
});

describe("handling requests in the admin area", () => {
  async function newQuote() {
    const setup = testCommerceContext();
    await submitQuote(setup.ctx, request(), CLIENT, BASE_URL);
    const [quote] = (await listQuotesPage(setup.ctx, 1, 10, undefined)).quotes;
    return { setup, quote };
  }

  test("through the workflow NEW → CONTACTED → QUOTED → ACCEPTED → COMPLETED, with notes, history and audit lines", async () => {
    const { setup, quote } = await newQuote();
    for (const [status, note] of [["CONTACTED", "Called An"], ["QUOTED", null], ["ACCEPTED", "Signed"], ["COMPLETED", null]] as const) {
      setup.advance(1000);
      const result = await changeQuoteStatus(setup.ctx, ADMIN, quote.id, { status, note });
      expect(result.ok && result.data.status).toBe(status);
    }
    const final = await setup.store.getQuote(quote.id);
    expect(final?.history.map((entry) => entry.status)).toEqual(["NEW", "CONTACTED", "QUOTED", "ACCEPTED", "COMPLETED"]);
    expect(final?.history[1]).toMatchObject({ by: ADMIN.email, note: "Called An" });
    expect((await setup.store.listAudit({ skip: 0, limit: 10 })).entries.filter((entry) => entry.action === "quote-status-changed")).toHaveLength(4);
    expect(await listQuotesPage(setup.ctx, 1, 10, "COMPLETED")).toMatchObject({ total: 1, status: "COMPLETED" });
  });

  test("steps that aren't allowed, unknown requests and invalid statuses are refused", async () => {
    const { setup, quote } = await newQuote();
    expect(await changeQuoteStatus(setup.ctx, ADMIN, quote.id, { status: "COMPLETED" })).toEqual({ ok: false, status: 409, error: "status-not-allowed" });
    expect(await changeQuoteStatus(setup.ctx, ADMIN, quote.id, { status: "WON" })).toEqual({ ok: false, status: 400, error: "invalid-status" });
    expect(await changeQuoteStatus(setup.ctx, ADMIN, "nope", { status: "CONTACTED" })).toEqual({ ok: false, status: 404, error: "unknown-quote" });
  });

  test("two admins changing the same request at the same moment: one wins, the other is told", async () => {
    const { setup, quote } = await newQuote();
    const results = await Promise.all([
      changeQuoteStatus(setup.ctx, ADMIN, quote.id, { status: "CONTACTED" }),
      changeQuoteStatus(setup.ctx, ADMIN, quote.id, { status: "DECLINED" }),
    ]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.find((result) => !result.ok)).toEqual({ ok: false, status: 409, error: "changed-meanwhile" });
  });
});

describe("routes", () => {
  const ORIGIN = "http://localhost:3000";
  const globals = globalThis as { commerceStore?: unknown; commerceMailer?: unknown };
  beforeEach(() => {
    globals.commerceStore = undefined;
    globals.commerceMailer = undefined;
  });
  const post = (path: string, body: unknown, origin = ORIGIN) =>
    new NextRequest(`${ORIGIN}${path}`, { method: "POST", headers: { "content-type": "application/json", origin, "x-forwarded-for": "203.0.113.50" }, body: JSON.stringify(body) });

  test("POST /api/quotes: the same answer for every accepted request; other sites refused", async () => {
    const response = await quotesRoute(post("/api/quotes", request()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect((await quotesRoute(post("/api/quotes", request(), "https://evil.example"))).status).toBe(403);
    const bad = await quotesRoute(post("/api/quotes", request({ participants: 0 })));
    expect(bad.status).toBe(400);
    expect(await bad.json()).toEqual({ error: "invalid-participants" });
  });

  test("the admin routes need a session", async () => {
    expect((await quoteStatusRoute(post("/api/admin/quotes/x", { status: "CONTACTED" }), { params: Promise.resolve({ id: "x" }) })).status).toBe(401);
    expect((await pricingRoute(post("/api/admin/corporate-pricing", { tiers: [] }))).status).toBe(401);
  });
});
