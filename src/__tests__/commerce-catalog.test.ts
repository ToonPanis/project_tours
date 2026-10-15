import { describe, expect, test } from "vitest";
import { STARTER_PRODUCTS } from "@/features/commerce/logic/starter-catalog";
import { ensureStarterCatalog, listAuditPage, listCatalog, setPrice, updateProduct } from "@/features/commerce/server/catalog-service";
import type { Actor } from "@/features/commerce/server/support";
import { ADMIN_EMAIL, testCommerceContext } from "./fixtures/commerce-context";

const ADMIN: Actor = { id: "admin-1", email: ADMIN_EMAIL };
const PRODUCT = STARTER_PRODUCTS[2];

async function auditActions(setup: ReturnType<typeof testCommerceContext>) {
  return (await setup.store.listAudit({ skip: 0, limit: 100 })).entries.map((entry) => entry.action);
}

describe("starter catalogue", () => {
  test("a new database gets every starter product, inactive, without VAT rate, at its starter price per person", async () => {
    const setup = testCommerceContext();
    const catalog = await listCatalog(setup.ctx);
    expect(catalog.map((entry) => entry.product.id)).toEqual(STARTER_PRODUCTS.map((product) => product.id));
    for (const [index, entry] of catalog.entries()) {
      expect(entry.product).toMatchObject({ active: false, vatRateBasisPoints: null, unit: "person" });
      expect(entry.currentPrice?.amountCents).toBe(STARTER_PRODUCTS[index].priceCents);
    }
    expect(await auditActions(setup)).toEqual(["catalog-seeded"]);
  });

  test("seeding again (also twice at the same moment) never duplicates or changes anything", async () => {
    const setup = testCommerceContext();
    await Promise.all([ensureStarterCatalog(setup.ctx), ensureStarterCatalog(setup.ctx)]);
    await updateProduct(setup.ctx, ADMIN, PRODUCT.id, { name: "Renamed" });
    await ensureStarterCatalog(setup.ctx);
    expect(await setup.store.listProducts()).toHaveLength(STARTER_PRODUCTS.length);
    expect(await setup.store.listPrices(PRODUCT.id)).toHaveLength(1);
    expect((await setup.store.getProduct(PRODUCT.id))?.name).toBe("Renamed");
  });
});

describe("changing products", () => {
  test("name and VAT rate change, and the audit log says old → new", async () => {
    const setup = testCommerceContext();
    await ensureStarterCatalog(setup.ctx);
    const result = await updateProduct(setup.ctx, ADMIN, PRODUCT.id, { name: "Hidden Pubs Night", vatRateBasisPoints: 2100 });
    expect(result.ok && result.data).toMatchObject({ name: "Hidden Pubs Night", vatRateBasisPoints: 2100 });
    const [latest] = (await setup.store.listAudit({ skip: 0, limit: 1 })).entries;
    expect(latest).toMatchObject({
      action: "product-updated",
      actorEmail: ADMIN_EMAIL,
      target: `product:${PRODUCT.id}`,
      details: { name: `${PRODUCT.name} → Hidden Pubs Night`, vatRateBasisPoints: "null → 2100" },
    });
  });

  test("can't go on sale without a VAT rate (decision B8), then can", async () => {
    const setup = testCommerceContext();
    await ensureStarterCatalog(setup.ctx);
    expect(await updateProduct(setup.ctx, ADMIN, PRODUCT.id, { active: true })).toEqual({ ok: false, status: 409, error: "vat-rate-required" });
    expect((await updateProduct(setup.ctx, ADMIN, PRODUCT.id, { active: true, vatRateBasisPoints: 600 })).ok).toBe(true);
    expect((await setup.store.getProduct(PRODUCT.id))?.active).toBe(true);
  });

  test("can't go on sale without a price", async () => {
    const setup = testCommerceContext();
    await setup.store.insertProductIfMissing({
      id: "no-price",
      walkSlug: "classics-of-antwerp",
      name: "No price",
      unit: "person",
      active: false,
      vatRateBasisPoints: 2100,
      sortOrder: 9,
      createdAt: setup.ctx.now().toISOString(),
      updatedAt: setup.ctx.now().toISOString(),
    });
    expect(await updateProduct(setup.ctx, ADMIN, "no-price", { active: true })).toEqual({ ok: false, status: 409, error: "price-required" });
  });

  test("a request that changes nothing writes no audit line", async () => {
    const setup = testCommerceContext();
    await ensureStarterCatalog(setup.ctx);
    await updateProduct(setup.ctx, ADMIN, PRODUCT.id, { name: PRODUCT.name });
    expect(await auditActions(setup)).toEqual(["catalog-seeded"]);
  });

  test("unknown products and invalid input are refused", async () => {
    const setup = testCommerceContext();
    expect(await updateProduct(setup.ctx, ADMIN, "nope", { name: "x" })).toEqual({ ok: false, status: 404, error: "unknown-product" });
    expect(await updateProduct(setup.ctx, ADMIN, PRODUCT.id, { vatRateBasisPoints: 1900 })).toEqual({
      ok: false,
      status: 400,
      error: "invalid-vat-rate",
    });
  });
});

describe("prices", () => {
  test("a new price applies from now on; the old one stays in the history; the audit log has both amounts", async () => {
    const setup = testCommerceContext();
    await ensureStarterCatalog(setup.ctx);
    setup.advance(1000);
    const result = await setPrice(setup.ctx, ADMIN, PRODUCT.id, { amount: "16,50" });
    expect(result.ok && result.data.currentPrice?.amountCents).toBe(1650);
    expect(await setup.store.listPrices(PRODUCT.id)).toHaveLength(2);
    const entry = (await listCatalog(setup.ctx)).find((candidate) => candidate.product.id === PRODUCT.id);
    expect(entry?.currentPrice).toMatchObject({ amountCents: 1650, createdBy: ADMIN_EMAIL });
    const [latest] = (await setup.store.listAudit({ skip: 0, limit: 1 })).entries;
    expect(latest).toMatchObject({ action: "price-set", details: { fromCents: PRODUCT.priceCents, toCents: 1650 } });
  });

  test("invalid amounts and unknown products are refused", async () => {
    const setup = testCommerceContext();
    await ensureStarterCatalog(setup.ctx);
    expect(await setPrice(setup.ctx, ADMIN, PRODUCT.id, { amount: "free" })).toEqual({ ok: false, status: 400, error: "invalid-amount" });
    expect(await setPrice(setup.ctx, ADMIN, "nope", { amount: "1" })).toEqual({ ok: false, status: 404, error: "unknown-product" });
  });
});

describe("audit log pages", () => {
  test("newest first, a page at a time; a bad page number shows page 1", async () => {
    const setup = testCommerceContext();
    await ensureStarterCatalog(setup.ctx);
    for (let i = 1; i <= 4; i++) {
      setup.advance(1000);
      await setPrice(setup.ctx, ADMIN, PRODUCT.id, { amount: `${10 + i}` });
    }
    const first = await listAuditPage(setup.ctx, 1, 2);
    expect(first).toMatchObject({ total: 5, page: 1, pageCount: 3 });
    expect(first.entries[0].details.toCents).toBe(1400);
    expect((await listAuditPage(setup.ctx, 3, 2)).entries.map((entry) => entry.action)).toEqual(["catalog-seeded"]);
    expect((await listAuditPage(setup.ctx, Number.NaN, 2)).page).toBe(1);
    expect((await listAuditPage(setup.ctx, -1, 2)).page).toBe(1);
  });
});
