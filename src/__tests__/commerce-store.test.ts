import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { MongoClient } from "mongodb";
import { COLLECTIONS, ensureSchema } from "../../db/mongo-schema.mjs";
import type { CommerceStore } from "@/features/commerce/server/commerce-store";
import { CommerceStoreUnavailableError } from "@/features/commerce/server/commerce-store";
import { MemoryCommerceStore } from "@/features/commerce/server/memory-store";
import { MongoCommerceStore } from "@/features/commerce/server/mongo-store";
import { createMongoClient, databaseOf, MONGO_CLIENT_OPTIONS } from "@/features/pub-game/server/mongo";
import type { CommissionEntry, Discount, Order, OutboxEmail, Partner, Product, Review, TicketGrant } from "@/types/commerce";

/**
 * The same tests for every CommerceStore, so the MongoDB store is proven to
 * behave exactly like the memory store the other tests use.
 *
 * MongoDB only runs when TEST_MONGODB_URI points to a TEST database (its name
 * must contain "test"):   npm run test:db
 * Everything this test writes starts with its own run id, and only that is deleted afterwards.
 */

const testMongoUri = process.env.TEST_MONGODB_URI;
const runId = `T_${Math.random().toString(36).slice(2, 8)}_`;
let counter = 0;
const unique = (what: string) => `${runId}${what}_${++counter}`;

const at = (iso: string) => new Date(iso);
const NOW = at("2026-10-16T10:00:00Z");
const LATER = at("2026-10-16T11:00:00Z");

function product(id: string, sortOrder = 0): Product {
  return {
    id,
    walkSlug: "hidden-pubs",
    name: "Hidden Pubs",
    unit: "person",
    active: false,
    taxCategoryId: null,
    sortOrder,
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
  };
}

function email(id: string, overrides: Partial<OutboxEmail> = {}): OutboxEmail {
  return {
    id,
    to: "someone@example.com",
    subject: "Subject",
    text: "Text",
    status: "pending",
    attempts: 0,
    nextAttemptAt: NOW.toISOString(),
    lastError: null,
    createdAt: NOW.toISOString(),
    sentAt: null,
    ...overrides,
  };
}

/** Tax versions far above any real one, unique per run (so the real settings are never touched). */
const taxVersionBase = 1_000_000_000 + Math.floor(Math.random() * 1_000_000) * 100;
const taxVersionsUsed: number[] = [];

function order(id: string, overrides: Partial<Order> = {}): Order {
  return {
    id,
    status: "pending",
    lines: [{ productId: "classics-of-antwerp", productName: "Classics", walkSlug: "classics-of-antwerp", quantity: 2, unitPriceCents: 795, totalCents: 1590 }],
    subtotalCents: 1590,
    discount: null,
    totalCents: 1590,
    currency: "EUR",
    locale: "nl",
    buyerTokenHash: "hash",
    email: null,
    customer: null,
    taxBasis: { settingsVersion: 1, regime: "exempt", homeCountry: "BE", categoryId: null, homeRateBasisPoints: 0, ossEnabled: false, ossRates: [], exemptionNote: "note" },
    tax: null,
    stripe: { checkoutSessionId: `cs_${id}`, paymentIntentId: null },
    refundedCents: 0,
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
    paidAt: null,
    ...overrides,
  };
}

function partner(id: string, code: string): Partner {
  return { id, code, name: "Hotel Test", type: "HOTEL_PARTNER", active: true, commission: { kind: "percent-net", basisPoints: 1500 }, createdAt: NOW.toISOString(), updatedAt: NOW.toISOString() };
}

function commission(id: string, partnerId: string, orderId: string, overrides: Partial<CommissionEntry> = {}): CommissionEntry {
  return {
    id,
    partnerId,
    orderId,
    kind: "accrual",
    amountCents: 150,
    basisCents: 1000,
    rule: { kind: "percent-net", basisPoints: 1500 },
    status: "pending",
    productId: "classics-of-antwerp",
    campaign: null,
    orderPaidAt: "2099-02-01T10:00:00.000Z",
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
    payoutReference: null,
    history: [{ status: "pending", at: NOW.toISOString(), by: null }],
    ...overrides,
  };
}

function grant(id: string, orderId: string, seats = 2): TicketGrant {
  return { id, orderId, productId: "classics-of-antwerp", walkSlug: "classics-of-antwerp", seats, devicesUsed: 0, status: "active", createdAt: NOW.toISOString(), validUntil: LATER.toISOString(), gameCode: null };
}

type StoreFactory = { name: string; create: () => CommerceStore; cleanup?: () => Promise<void> };
const factories: StoreFactory[] = [{ name: "memory", create: () => new MemoryCommerceStore() }];

const mongoClient = testMongoUri ? createMongoClient(testMongoUri) : null;
if (mongoClient) {
  const db = databaseOf(mongoClient);
  if (!db.databaseName.includes("test")) {
    throw new Error(`TEST_MONGODB_URI must point to a test database (name with "test"), not "${db.databaseName}".`);
  }
  beforeAll(async () => {
    await ensureSchema(db);
  });
  factories.push({
    name: "mongodb",
    create: () => new MongoCommerceStore(db),
    cleanup: async () => {
      const ours = { $regex: `^${runId}` };
      const names = [
        COLLECTIONS.users,
        COLLECTIONS.loginTokens,
        COLLECTIONS.sessions,
        COLLECTIONS.rateLimits,
        COLLECTIONS.auditLog,
        COLLECTIONS.products,
        COLLECTIONS.prices,
        COLLECTIONS.emailOutbox,
        COLLECTIONS.orders,
        COLLECTIONS.stripeEvents,
        COLLECTIONS.ticketGrants,
        COLLECTIONS.ticketDevices,
        COLLECTIONS.discounts,
        COLLECTIONS.counters,
        COLLECTIONS.documents,
        COLLECTIONS.quotes,
        COLLECTIONS.partners,
        COLLECTIONS.partnerClicks,
        COLLECTIONS.reviews,
        COLLECTIONS.suppressions,
      ];
      for (const name of names) await db.collection<{ _id: string }>(name).deleteMany({ _id: ours });
      // Ledger ids start with "accrual:"/"adjustment:"; their order ids are this run's.
      await db.collection(COLLECTIONS.commissions).deleteMany({ orderId: ours });
      // Tax settings are found by version number: this run used its own, very high ones.
      await db.collection(COLLECTIONS.taxSettings).deleteMany({ version: { $in: taxVersionsUsed } });
      await mongoClient.close();
    },
  });
}

describe.each(factories)("$name commerce store", ({ create, cleanup }) => {
  const store = create();
  if (cleanup) afterAll(cleanup);

  test("users: saved, found by id and by email, replaced by id", async () => {
    const id = unique("user");
    const address = `${id.toLowerCase()}@example.com`;
    const user = { id, email: address, roles: ["ADMIN" as const], active: true, createdAt: NOW.toISOString(), lastLoginAt: null };
    await store.saveUser(user);
    expect(await store.findUserById(id)).toEqual(user);
    expect(await store.findUserByEmail(address)).toEqual(user);
    await store.saveUser({ ...user, lastLoginAt: LATER.toISOString() });
    expect((await store.findUserById(id))?.lastLoginAt).toBe(LATER.toISOString());
    expect(await store.findUserByEmail(`nobody-${id}@example.com`)).toBeNull();
  });

  test("a sign-in link is used once, never after it expired, and two at once can't both use it", async () => {
    const tokenHash = unique("link");
    await store.saveLoginToken({ tokenHash, userId: "u1", expiresAt: LATER });
    const [first, second] = await Promise.all([store.consumeLoginToken(tokenHash, NOW), store.consumeLoginToken(tokenHash, NOW)]);
    expect([first, second].filter(Boolean)).toEqual([{ userId: "u1" }]);

    const expired = unique("link");
    await store.saveLoginToken({ tokenHash: expired, userId: "u1", expiresAt: NOW });
    expect(await store.consumeLoginToken(expired, NOW)).toBeNull();
    expect(await store.consumeLoginToken(unique("unknown"), NOW)).toBeNull();
  });

  test("sessions: found until they expire, gone after deleting", async () => {
    const tokenHash = unique("session");
    await store.saveSession({ tokenHash, userId: "u1", createdAt: NOW, expiresAt: LATER });
    expect(await store.findSession(tokenHash, NOW)).toEqual({ userId: "u1", expiresAt: LATER });
    expect(await store.findSession(tokenHash, LATER)).toBeNull();
    await store.deleteSession(tokenHash);
    expect(await store.findSession(tokenHash, NOW)).toBeNull();
  });

  test("rate-limit counters count up, also at the same moment, per key", async () => {
    const key = unique("counter");
    const counts = await Promise.all([1, 2, 3, 4, 5].map(() => store.incrementCounter(key, LATER)));
    expect([...counts].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(await store.incrementCounter(unique("other"), LATER)).toBe(1);
  });

  test("audit log: newest first, paginated, with the total", async () => {
    const before = (await store.listAudit({ skip: 0, limit: 1 })).total;
    for (const [index, minute] of ["01", "02", "03"].entries()) {
      await store.appendAudit({
        id: unique("audit"),
        actorId: null,
        actorEmail: null,
        action: "price-set",
        target: `test:${runId}`,
        details: { index },
        at: `2099-01-01T00:${minute}:00.000Z`,
      });
    }
    const page = await store.listAudit({ skip: 0, limit: 2 });
    expect(page.total).toBe(before + 3);
    expect(page.entries.map((entry) => entry.details.index)).toEqual([2, 1]);
  });

  test("products: inserted once (a second insert with the same id is refused), replaced, listed", async () => {
    const id = unique("product");
    expect(await store.insertProductIfMissing(product(id))).toBe(true);
    expect(await store.insertProductIfMissing({ ...product(id), name: "Other" })).toBe(false);
    expect((await store.getProduct(id))?.name).toBe("Hidden Pubs");
    await store.saveProduct({ ...product(id), active: true, taxCategoryId: "experience", name: "Renamed" });
    expect(await store.getProduct(id)).toMatchObject({ active: true, taxCategoryId: "experience", name: "Renamed" });
    expect((await store.listProducts()).some((candidate) => candidate.id === id)).toBe(true);
    expect(await store.getProduct(unique("missing"))).toBeNull();
  });

  test("prices: kept as a history per product", async () => {
    const productId = unique("product");
    await store.addPrice({ id: unique("price"), productId, amountCents: 995, currency: "EUR", validFrom: NOW.toISOString(), createdBy: "system" });
    await store.addPrice({ id: unique("price"), productId, amountCents: 1095, currency: "EUR", validFrom: LATER.toISOString(), createdBy: "a@b.c" });
    const prices = await store.listPrices(productId);
    expect(prices.map((price) => price.amountCents).sort()).toEqual([1095, 995]);
    expect(await store.listPrices(unique("none"))).toEqual([]);
  });

  test("outbox: one email per id, due ones listed oldest first, claimed once, updated", async () => {
    const id = unique("mail");
    expect(await store.enqueueEmail(email(id), LATER)).toBe("queued");
    expect(await store.enqueueEmail(email(id), LATER)).toBe("duplicate");
    const notYet = unique("mail");
    await store.enqueueEmail(email(notYet, { nextAttemptAt: LATER.toISOString() }), LATER);

    const due = (await store.listDueEmails(NOW, 1000)).filter((candidate) => candidate.id.startsWith(runId));
    expect(due.map((candidate) => candidate.id)).toContain(id);
    expect(due.map((candidate) => candidate.id)).not.toContain(notYet);

    const claims = await Promise.all([store.claimEmail(id, 0, NOW, LATER), store.claimEmail(id, 0, NOW, LATER)]);
    expect(claims.filter(Boolean)).toHaveLength(1);
    // Claimed: no longer due for anyone else.
    expect((await store.listDueEmails(NOW, 1000)).some((candidate) => candidate.id === id)).toBe(false);

    await store.updateEmail(id, { status: "sent", attempts: 1, text: null, sentAt: NOW.toISOString() });
    const sentLater = (await store.listDueEmails(LATER, 1000)).some((candidate) => candidate.id === id);
    expect(sentLater).toBe(false);
  });

  // ── P2 ──

  test("tax settings: the newest version wins; a version number can't be saved twice", async () => {
    const base = taxVersionBase + (store instanceof MemoryCommerceStore ? 0 : 50);
    taxVersionsUsed.push(base + 1, base + 2);
    const settings = {
      version: base + 1,
      regime: "vat-registered" as const,
      homeCountry: "BE",
      categories: [{ id: "experience", label: "Experiences", rateBasisPoints: 1 }],
      ossEnabled: false,
      ossRates: [],
      exemptionNote: null,
      confirmedByAccountant: false,
      updatedAt: NOW.toISOString(),
      updatedBy: "a@b.c",
    };
    expect(await store.insertTaxSettings(settings)).toBe(true);
    expect(await store.insertTaxSettings({ ...settings, version: base + 2, confirmedByAccountant: true })).toBe(true);
    expect(await store.insertTaxSettings({ ...settings, version: base + 2 })).toBe(false);
    expect(await store.getTaxSettings()).toEqual({ ...settings, version: base + 2, confirmedByAccountant: true });
  });

  test("orders: saved with nested data, found by id and payment, changed only from the expected status (once)", async () => {
    const id = unique("order");
    await store.insertOrder(order(id));
    expect(await store.getOrder(id)).toEqual(order(id));
    const paidChanges = { status: "paid" as const, paidAt: LATER.toISOString(), stripe: { checkoutSessionId: `cs_${id}`, paymentIntentId: `pi_${id}` } };
    const results = await Promise.all([store.transitionOrder(id, ["pending"], paidChanges), store.transitionOrder(id, ["pending"], paidChanges)]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(await store.findOrderByPaymentIntent(`pi_${id}`)).toMatchObject({ id, status: "paid", paidAt: LATER.toISOString() });
    await store.updateOrder(id, { refundedCents: 500 });
    expect((await store.getOrder(id))?.refundedCents).toBe(500);
    expect(await store.getOrder(unique("missing"))).toBeNull();
    const page = await store.listOrders({ skip: 0, limit: 500, status: "paid" });
    expect(page.orders.some((candidate) => candidate.id === id)).toBe(true);
    expect(page.orders.every((candidate) => candidate.status === "paid")).toBe(true);
  });

  test("Stripe events: new the first time, duplicate after; done once marked", async () => {
    const id = unique("evt");
    expect(await store.recordStripeEvent({ id, type: "checkout.completed", receivedAt: NOW, expiresAt: LATER })).toBe("new");
    expect(await store.recordStripeEvent({ id, type: "checkout.completed", receivedAt: NOW, expiresAt: LATER })).toBe("duplicate");
    expect(await store.isStripeEventDone(id)).toBe(false);
    await store.markStripeEventDone(id, NOW);
    expect(await store.isStripeEventDone(id)).toBe(true);
  });

  test("tickets: one per order, seats never overbooked (also at once), devices found until they expire", async () => {
    const orderId = unique("order");
    const first = await store.insertGrantIfMissing(grant(unique("grant"), orderId, 2));
    const second = await store.insertGrantIfMissing(grant(unique("grant"), orderId, 9));
    expect(second.id).toBe(first.id);
    expect(await store.getGrantByOrder(orderId)).toEqual(first);

    const claims = await Promise.all([1, 2, 3, 4].map(() => store.claimTicketSeat(first.id)));
    expect(claims.filter(Boolean)).toHaveLength(2);
    expect((await store.getGrant(first.id))?.devicesUsed).toBe(2);

    const device = unique("device");
    await store.saveTicketDevice({ tokenHash: device, grantId: first.id, walkSlug: "classics-of-antwerp", createdAt: NOW, expiresAt: LATER });
    expect(await store.findTicketDevice(device, NOW)).toEqual({ grantId: first.id, walkSlug: "classics-of-antwerp" });
    expect(await store.findTicketDevice(device, LATER)).toBeNull();
    await store.deleteTicketDevices(first.id);
    expect(await store.findTicketDevice(device, NOW)).toBeNull();

    await store.updateGrant(first.id, { status: "revoked", devicesUsed: 0 });
    expect(await store.claimTicketSeat(first.id)).toBe(false);
  });

  test("a ticket's game (P3): reserved by only one of two at once, then confirmed; never on a revoked ticket", async () => {
    const ticket = await store.insertGrantIfMissing(grant(unique("grant"), unique("order"), 4));
    const reservations = await Promise.all([store.swapGrantGame(ticket.id, null, "pending:1:a"), store.swapGrantGame(ticket.id, null, "pending:1:b")]);
    expect(reservations.filter(Boolean)).toHaveLength(1);
    const winner = reservations[0] ? "pending:1:a" : "pending:1:b";
    expect(await store.swapGrantGame(ticket.id, "pending:1:wrong", "ABCDEF")).toBe(false);
    expect(await store.swapGrantGame(ticket.id, winner, "ABCDEF")).toBe(true);
    expect((await store.getGrant(ticket.id))?.gameCode).toBe("ABCDEF");

    const revoked = await store.insertGrantIfMissing({ ...grant(unique("grant"), unique("order")), status: "revoked" });
    expect(await store.swapGrantGame(revoked.id, null, "pending:1:c")).toBe(false);
  });

  test("discounts: unique codes, uses reserved atomically up to the maximum, given back", async () => {
    const id = unique("discount");
    const code = `${runId}CODE${counter}`.slice(0, 30);
    const discount: Discount = {
      id,
      code,
      kind: "percent",
      value: 10,
      productIds: [],
      validFrom: null,
      validUntil: LATER.toISOString(),
      maxRedemptions: 2,
      redemptions: 0,
      active: true,
      createdAt: NOW.toISOString(),
      createdBy: "a@b.c",
    };
    expect(await store.insertDiscount(discount)).toBe(true);
    expect(await store.insertDiscount({ ...discount, id: unique("discount") })).toBe(false);
    expect(await store.getDiscountByCode(code)).toEqual(discount);
    const reservations = await Promise.all([1, 2, 3].map(() => store.reserveDiscount(id)));
    expect(reservations.filter(Boolean)).toHaveLength(2);
    await store.releaseDiscount(id);
    expect((await store.getDiscount(id))?.redemptions).toBe(1);
    await store.updateDiscount(id, { active: false });
    expect(await store.reserveDiscount(id)).toBe(false);
    expect((await store.listDiscounts()).some((candidate) => candidate.id === id)).toBe(true);
  });

  test("quote requests (P4): saved, found by duplicate key within the window, listed by status, status changed once", async () => {
    const id = unique("quote");
    const quote = {
      id,
      status: "NEW" as const,
      company: "Brewery NV",
      contactName: "An",
      email: "an@example.com",
      phone: null,
      preferredDate: "2099-12-05",
      participants: 20,
      activity: "team-building" as const,
      language: "nl",
      formula: "guided" as const,
      wishes: "Line one\nline two",
      history: [{ status: "NEW" as const, at: NOW.toISOString(), by: null, note: null }],
      createdAt: NOW.toISOString(),
      updatedAt: NOW.toISOString(),
    };
    const dedupeKey = unique("dedupe");
    await store.insertQuote(quote, dedupeKey, LATER);
    expect(await store.getQuote(id)).toEqual(quote);
    expect(await store.findQuoteByDedupeKey(dedupeKey, new Date(NOW.getTime() - 1000))).toEqual(quote);
    expect(await store.findQuoteByDedupeKey(dedupeKey, NOW)).toBeNull();

    const entry = (status: "CONTACTED" | "DECLINED") => ({ status, at: LATER.toISOString(), by: "a@b.c", note: null });
    const results = await Promise.all([store.transitionQuote(id, "NEW", entry("CONTACTED")), store.transitionQuote(id, "NEW", entry("DECLINED"))]);
    expect(results.filter(Boolean)).toHaveLength(1);
    const changed = await store.getQuote(id);
    expect(changed?.history).toHaveLength(2);
    expect(changed?.updatedAt).toBe(LATER.toISOString());
    const listed = await store.listQuotes({ skip: 0, limit: 500, status: changed!.status });
    expect(listed.quotes.some((candidate) => candidate.id === id)).toBe(true);
  });

  test("reports (P5): paid orders before a date (oldest first), open quotes count, documents and groups lists", async () => {
    const early = unique("order");
    const late = unique("order");
    await store.insertOrder(order(early, { status: "paid", paidAt: "2099-01-02T10:00:00.000Z" }));
    await store.insertOrder(order(late, { status: "refunded", paidAt: "2099-01-01T10:00:00.000Z" }));
    await store.insertOrder(order(unique("order"), { status: "pending", paidAt: null }));
    const ours = (orders: Order[]) => orders.map((candidate) => candidate.id).filter((id) => id === early || id === late);
    expect(ours(await store.listPaidOrdersUntil(new Date("2099-01-03T00:00:00.000Z"), 100_000))).toEqual([late, early]);
    expect(ours(await store.listPaidOrdersUntil(new Date("2099-01-02T00:00:00.000Z"), 100_000))).toEqual([late]);

    expect(typeof (await store.countQuotes(["NEW", "CONTACTED", "QUOTED"]))).toBe("number");

    const documentId = unique("invoice");
    await store.insertDocumentIfMissing({ id: documentId, number: null, kind: "invoice", orderId: early, provider: "billit", status: "awaiting-provider", amountCents: 1, createdAt: "2099-01-05T10:00:00.000Z" });
    const waiting = await store.listDocuments({ skip: 0, limit: 5, status: "awaiting-provider" });
    expect(waiting.documents[0].id).toBe(documentId);

    const withGame = await store.insertGrantIfMissing({ ...grant(unique("grant"), unique("order")), gameCode: "QWERTY", createdAt: "2099-01-06T10:00:00.000Z" });
    await store.insertGrantIfMissing({ ...grant(unique("grant"), unique("order")), gameCode: "pending:1:x", createdAt: "2099-01-07T10:00:00.000Z" });
    const groups = await store.listGrantsWithGame({ skip: 0, limit: 5 });
    expect(groups.grants[0].id).toBe(withGame.id);
  });

  test("partners (P7): unique codes, users of a partner, click counters per day and campaign, a partner's paid orders", async () => {
    const id = unique("partner");
    const code = `P${counter}${runId.slice(2, 7).toUpperCase()}`;
    expect(await store.insertPartner(partner(id, code))).toBe(true);
    expect(await store.insertPartner(partner(unique("partner"), code))).toBe(false);
    expect(await store.getPartnerByCode(code)).toEqual(partner(id, code));
    await store.updatePartner(id, { active: false, commission: { kind: "none" }, updatedAt: LATER.toISOString() });
    expect(await store.getPartner(id)).toMatchObject({ code, active: false, commission: { kind: "none" } });
    expect((await store.listPartners()).some((candidate) => candidate.id === id)).toBe(true);

    const userId = unique("user");
    const partnerUser = { id: userId, email: `${userId.toLowerCase()}@example.com`, roles: ["PARTNER" as const], partnerId: id, active: true, createdAt: NOW.toISOString(), lastLoginAt: null };
    await store.saveUser(partnerUser);
    expect(await store.findUserById(userId)).toEqual(partnerUser);
    expect(await store.listPartnerUsers(id)).toEqual([partnerUser]);

    await Promise.all([store.incrementPartnerClicks(id, "2099-02-01", ""), store.incrementPartnerClicks(id, "2099-02-01", "")]);
    await store.incrementPartnerClicks(id, "2099-02-01", "lobby");
    await store.incrementPartnerClicks(id, "2099-02-03", "");
    const clicks = await store.listPartnerClicks({ partnerId: id, fromDay: "2099-02-01", toDay: "2099-02-02" });
    expect(clicks.map(({ day, campaign, clicks: count }) => ({ day, campaign, count })).sort((a, b) => a.campaign.localeCompare(b.campaign))).toEqual([
      { day: "2099-02-01", campaign: "", count: 2 },
      { day: "2099-02-01", campaign: "lobby", count: 1 },
    ]);

    const referral = { partnerId: id, code, campaign: null, clickedAt: NOW.toISOString(), rule: { kind: "percent-net" as const, basisPoints: 1500 } };
    const inside = unique("order");
    await store.insertOrder(order(inside, { status: "paid", paidAt: "2099-02-01T12:00:00.000Z", partner: referral }));
    await store.insertOrder(order(unique("order"), { status: "paid", paidAt: "2099-03-01T12:00:00.000Z", partner: referral }));
    await store.insertOrder(order(unique("order"), { status: "pending", paidAt: null, partner: referral }));
    await store.insertOrder(order(unique("order"), { status: "paid", paidAt: "2099-02-01T12:00:00.000Z" }));
    const found = await store.listPartnerOrders(id, new Date("2099-02-01T00:00:00Z"), new Date("2099-02-02T00:00:00Z"), 10);
    expect(found.map((candidate) => candidate.id)).toEqual([inside]);
    expect(found[0].partner).toEqual(referral);
  });

  test("commission ledger (P7): one line per id, atomic status steps with history, filters", async () => {
    const partnerId = unique("partner");
    const orderId = unique("order");
    const line = commission(`accrual:${orderId}`, partnerId, orderId);
    const [first, second] = await Promise.all([store.insertCommissionIfMissing(line), store.insertCommissionIfMissing({ ...line, amountCents: 999 })]);
    expect([first, second].sort()).toEqual([false, true]);
    // Whichever of the two arrived first is the one line (the other is refused, never merged).
    const [kept] = await store.listCommissionsForOrder(orderId);
    expect(await store.listCommissionsForOrder(orderId)).toHaveLength(1);
    expect(kept).toEqual({ ...line, amountCents: kept.amountCents });
    expect([150, 999]).toContain(kept.amountCents);

    const steps = await Promise.all([
      store.transitionCommission(line.id, ["pending"], { status: "approved", at: LATER.toISOString(), by: "a@b.c" }),
      store.transitionCommission(line.id, ["pending"], { status: "approved", at: LATER.toISOString(), by: "a@b.c" }),
    ]);
    expect(steps.filter(Boolean)).toHaveLength(1);
    expect(await store.transitionCommission(line.id, ["payable"], { status: "paid", at: LATER.toISOString(), by: "a@b.c" })).toBe(false);
    await store.transitionCommission(line.id, ["approved"], { status: "payable", at: LATER.toISOString(), by: "a@b.c" });
    await store.transitionCommission(line.id, ["payable"], { status: "paid", at: LATER.toISOString(), by: "a@b.c", payoutReference: "TRANSFER-1" });
    const [paid] = await store.listCommissionsForOrder(orderId);
    expect(paid).toMatchObject({ status: "paid", payoutReference: "TRANSFER-1", amountCents: kept.amountCents });
    expect(paid.history.map((entry) => entry.status)).toEqual(["pending", "approved", "payable", "paid"]);

    const adjustment = commission(`adjustment:${orderId}:500`, partnerId, orderId, { kind: "adjustment", amountCents: -50, orderPaidAt: "2099-02-01T10:00:00.000Z" });
    await store.insertCommissionIfMissing(adjustment);
    await store.insertCommissionIfMissing(commission(`accrual:${unique("order")}`, partnerId, unique("order"), { orderPaidAt: "2099-04-01T10:00:00.000Z" }));
    const february = await store.listCommissions({ partnerId, orderPaidFrom: new Date("2099-02-01T00:00:00Z"), orderPaidTo: new Date("2099-03-01T00:00:00Z"), skip: 0, limit: 10 });
    expect(february.total).toBe(2);
    expect(february.entries.map((entry) => entry.amountCents).sort((a, b) => a - b)).toEqual([-50, kept.amountCents]);
    const pending = await store.listCommissions({ partnerId, status: "pending", skip: 0, limit: 10 });
    expect(pending.entries.map((entry) => entry.orderPaidAt)).toEqual(["2099-04-01T10:00:00.000Z", "2099-02-01T10:00:00.000Z"]);
  });

  test("P8: a walk is finished once (also at the same moment); a game's ticket is found by its code", async () => {
    const stored = await store.insertGrantIfMissing({ ...grant(unique("grant"), unique("order")), gameCode: `G${counter}${runId.slice(2, 6).toUpperCase()}` });
    const results = await Promise.all([store.markGrantCompleted(stored.id, NOW.toISOString()), store.markGrantCompleted(stored.id, LATER.toISOString())]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect((await store.getGrant(stored.id))?.completedAt).toMatch(/^2026-10-16T1[01]:00:00.000Z$/);
    expect(await store.markGrantCompleted(stored.id, LATER.toISOString())).toBe(false);
    expect((await store.getGrantByGameCode(stored.gameCode!))?.id).toBe(stored.id);
    expect(await store.getGrantByGameCode("NOSUCHGAME")).toBeNull();
  });

  test("P8: one review per ticket (also at the same moment), listed by status, updated, deleted", async () => {
    const grantId = unique("grant");
    const review: Review = {
      id: unique("review"),
      grantId,
      orderId: unique("order"),
      walkSlug: "classics-of-antwerp",
      productId: "classics-of-antwerp",
      rating: 4,
      text: "Lovely",
      displayName: null,
      mayPublish: true,
      locale: "nl",
      status: "pending",
      incentivised: true,
      rewardDiscountId: null,
      createdAt: "2099-03-01T10:00:00.000Z",
      moderatedAt: null,
      moderatedBy: null,
    };
    const results = await Promise.all([store.insertReview(review), store.insertReview({ ...review, id: unique("review") })]);
    expect([...results].sort()).toEqual(["duplicate", "inserted"]);
    // Whichever of the two arrived first is the ticket's one review.
    const kept = (await store.getReviewByGrant(grantId))!;
    expect(kept).toEqual({ ...review, id: kept.id });
    await store.updateReview(kept.id, { status: "approved", moderatedAt: LATER.toISOString(), moderatedBy: "a@b.c" });
    expect(await store.getReview(kept.id)).toMatchObject({ status: "approved", moderatedAt: LATER.toISOString() });
    const approved = await store.listReviews({ skip: 0, limit: 5, status: "approved" });
    expect(approved.reviews[0].id).toBe(kept.id);
    await store.deleteReview(kept.id);
    expect(await store.getReview(kept.id)).toBeNull();
  });

  test("P8: unsubscribed addresses (hash only), idempotent", async () => {
    const hash = unique("emailhash");
    expect(await store.isSuppressed(hash)).toBe(false);
    await store.addSuppression(hash, "unsubscribed", NOW.toISOString());
    await store.addSuppression(hash, "unsubscribed", LATER.toISOString());
    expect(await store.isSuppressed(hash)).toBe(true);
  });

  test("P9: a person's records by email (any case), deleted or anonymised; retention deletes only what is old", async () => {
    const address = `${unique("person").toLowerCase()}@example.com`;
    const orderId = unique("order");
    await store.insertOrder(order(orderId, { status: "paid", paidAt: NOW.toISOString(), email: address }));
    expect((await store.findOrdersByEmail(address.toUpperCase())).map((found) => found.id)).toEqual([orderId]);
    expect(await store.findOrdersByEmail(`x${address}`)).toEqual([]);
    // An address with regex characters is matched literally.
    expect(await store.findOrdersByEmail(".*@example.com")).toEqual([]);

    const quoteId = unique("quote");
    await store.insertQuote(
      { id: quoteId, status: "NEW", company: "Acme", contactName: "Jan", email: address, phone: null, preferredDate: null, participants: 10, activity: "team-building", language: "nl", formula: "unsure", wishes: null, history: [], createdAt: NOW.toISOString(), updatedAt: NOW.toISOString() },
      unique("dedupe"),
      LATER,
    );
    expect((await store.findQuotesByEmail(address)).map((found) => found.id)).toEqual([quoteId]);
    await store.deleteQuote(quoteId);
    expect(await store.findQuotesByEmail(address)).toEqual([]);

    await store.enqueueEmail(email(unique("mail"), { to: address }), LATER);
    expect(await store.listEmailsTo(address.toUpperCase())).toHaveLength(1);
    expect(await store.deleteEmailsTo(address)).toBe(1);

    const actorId = unique("actor");
    await store.appendAudit({ id: unique("audit"), actorId, actorEmail: address, action: "login", target: "x", details: {}, at: "1990-01-01T00:00:00.000Z" });
    expect(await store.anonymiseAuditActor(actorId)).toBe(1);
    expect(await store.deleteAuditBefore(new Date("1990-06-01T00:00:00.000Z"))).toBeGreaterThanOrEqual(1);

    const oldUnpaid = unique("order");
    await store.insertOrder(order(oldUnpaid, { status: "canceled", createdAt: "1990-01-01T00:00:00.000Z" }));
    const oldPaid = unique("order");
    await store.insertOrder(order(oldPaid, { status: "paid", paidAt: "1990-01-01T00:00:00.000Z", createdAt: "1990-01-01T00:00:00.000Z", email: address }));
    expect(await store.deleteUnpaidOrdersBefore(new Date("1990-06-01T00:00:00.000Z"))).toBeGreaterThanOrEqual(1);
    expect(await store.getOrder(oldUnpaid)).toBeNull();
    const stale = await store.listOrdersWithPersonalDataBefore(new Date("1990-06-01T00:00:00.000Z"), 100);
    expect(stale.map((found) => found.id)).toContain(oldPaid);
    expect(stale.map((found) => found.id)).not.toContain(orderId);
    await store.updateOrder(oldPaid, { email: null, erasedAt: NOW.toISOString() });
    expect((await store.listOrdersWithPersonalDataBefore(new Date("1990-06-01T00:00:00.000Z"), 100)).map((found) => found.id)).not.toContain(oldPaid);
    expect((await store.getOrder(oldPaid))?.erasedAt).toBe(NOW.toISOString());
  });

  test("settings: the corporate price table is saved and read back", async () => {
    const pricing = {
      tiers: [{ persons: 12, selfGuidedCents: 18_000, guidedCents: null, guidedFrom: false }],
      pricesIncludeVat: true,
      updatedAt: NOW.toISOString(),
      updatedBy: "a@b.c",
    };
    await store.saveCorporatePricing(pricing);
    expect(await store.getCorporatePricing()).toEqual(pricing);
  });

  test("numbers and documents: a series counts up without gaps at once; a document id is stored once", async () => {
    const series = unique("series");
    const numbers = await Promise.all([1, 2, 3, 4, 5].map(() => store.nextNumber(series)));
    expect([...numbers].sort()).toEqual([1, 2, 3, 4, 5]);
    const orderId = unique("order");
    const document = { id: unique("receipt"), number: "R2099-000001", kind: "receipt" as const, orderId, provider: "internal" as const, status: "issued" as const, amountCents: 1590, createdAt: NOW.toISOString() };
    expect(await store.insertDocumentIfMissing(document)).toEqual(document);
    expect(await store.insertDocumentIfMissing({ ...document, number: "other" })).toEqual(document);
    expect(await store.getDocument(document.id)).toEqual(document);
    expect(await store.listDocumentsForOrder(orderId)).toEqual([document]);
  });
});

test.skipIf(Boolean(testMongoUri))("MongoDB commerce store tests are skipped: set TEST_MONGODB_URI to run them", () => {
  expect(testMongoUri).toBeFalsy();
});

describe("MongoDB commerce store without a database", () => {
  const unreachableUri = "mongodb://127.0.0.1:1/hiddenantwerp_test";

  test("an unreachable database: a fixed error, and only its name in the log", async () => {
    const client = new MongoClient(unreachableUri, { ...MONGO_CLIENT_OPTIONS, serverSelectionTimeoutMS: 300 });
    const store = new MongoCommerceStore(databaseOf(client));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = await store.listProducts().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(CommerceStoreUnavailableError);
    expect((error as Error).message).not.toContain("127.0.0.1");
    expect(log).toHaveBeenCalledWith("[Hidden Antwerp] commerce database call failed: MongoServerSelectionError");
    for (const call of log.mock.calls) expect(String(call)).not.toContain("127.0.0.1");
    await client.close();
  });

  test("NoSQL injection: an object where an email or key belongs is refused before any query", async () => {
    const client = createMongoClient(unreachableUri);
    const store = new MongoCommerceStore(databaseOf(client));
    const attack = { $ne: "" } as unknown as string;
    // A TypeError (not the "unavailable" error an unreachable database would give): the query is never sent.
    await expect(store.findUserByEmail(attack)).rejects.toThrow(TypeError);
    await expect(store.consumeLoginToken(attack, NOW)).rejects.toThrow(TypeError);
    await expect(store.findSession(attack, NOW)).rejects.toThrow(TypeError);
    await expect(store.getProduct(attack)).rejects.toThrow(TypeError);
    await expect(store.incrementCounter(attack, NOW)).rejects.toThrow(TypeError);
    await client.close();
  });
});
