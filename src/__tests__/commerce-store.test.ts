import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { MongoClient } from "mongodb";
import { COLLECTIONS, ensureSchema } from "../../db/mongo-schema.mjs";
import type { CommerceStore } from "@/features/commerce/server/commerce-store";
import { CommerceStoreUnavailableError } from "@/features/commerce/server/commerce-store";
import { MemoryCommerceStore } from "@/features/commerce/server/memory-store";
import { MongoCommerceStore } from "@/features/commerce/server/mongo-store";
import { createMongoClient, databaseOf, MONGO_CLIENT_OPTIONS } from "@/features/pub-game/server/mongo";
import type { OutboxEmail, Product } from "@/types/commerce";

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
    vatRateBasisPoints: null,
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
      ];
      for (const name of names) await db.collection<{ _id: string }>(name).deleteMany({ _id: ours });
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
    await store.saveProduct({ ...product(id), active: true, vatRateBasisPoints: 2100, name: "Renamed" });
    expect(await store.getProduct(id)).toMatchObject({ active: true, vatRateBasisPoints: 2100, name: "Renamed" });
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
