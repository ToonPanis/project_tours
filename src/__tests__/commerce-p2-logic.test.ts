import { describe, expect, test } from "vitest";
import { MAX_PERSONS_PER_ORDER, MIN_ORDER_CENTS } from "@/features/commerce/config";
import { parseDiscountInput } from "@/features/commerce/logic/discounts";
import { discountAmount, discountProblem, normalizeDiscountCode, priceOrder } from "@/features/commerce/logic/pricing";
import { applyTax, defaultTaxSettings, parseTaxSettingsInput, percentToBasisPoints, taxAllowsSales, taxBasisFor } from "@/features/commerce/logic/tax";
import { signTicketToken, verifyTicketToken } from "@/features/commerce/server/ticket-token";
import type { Discount, Product, ProductPrice, TaxSettings } from "@/types/commerce";
import { TEST_TAX } from "./fixtures/commerce-sales";

const NOW = new Date("2026-10-16T12:00:00Z");
const product: Product = {
  id: "classics-of-antwerp",
  walkSlug: "classics-of-antwerp",
  name: "Classics",
  unit: "person",
  active: true,
  taxCategoryId: "experience",
  sortOrder: 0,
  createdAt: NOW.toISOString(),
  updatedAt: NOW.toISOString(),
};
const price: ProductPrice = { id: "p", productId: product.id, amountCents: 795, currency: "EUR", validFrom: NOW.toISOString(), createdBy: "test" };
function discount(overrides: Partial<Discount> = {}): Discount {
  return {
    id: "d",
    code: "WELCOME",
    kind: "percent",
    value: 10,
    productIds: [],
    validFrom: null,
    validUntil: null,
    maxRedemptions: null,
    redemptions: 0,
    active: true,
    createdAt: NOW.toISOString(),
    createdBy: "test",
    ...overrides,
  };
}

describe("tax settings (decision B8: nothing built in)", () => {
  test("by default nothing is configured and nothing can be sold", () => {
    const settings = defaultTaxSettings();
    expect(settings).toMatchObject({ version: 0, regime: "not-configured", categories: [], confirmedByAccountant: false });
    expect(taxAllowsSales(settings)).toBe(false);
  });

  test("sales need a chosen regime AND the accountant's confirmation", () => {
    const parsed = parseTaxSettingsInput(TEST_TAX);
    if (!parsed.ok) throw new Error(parsed.error);
    const settings: TaxSettings = { ...parsed.value, version: 1, updatedAt: NOW.toISOString(), updatedBy: "a" };
    expect(taxAllowsSales(settings)).toBe(true);
    expect(taxAllowsSales({ ...settings, confirmedByAccountant: false })).toBe(false);
    expect(taxAllowsSales({ ...settings, regime: "not-configured" })).toBe(false);
  });

  test("the form is checked field by field; unknown fields are ignored", () => {
    const parsed = parseTaxSettingsInput({ ...TEST_TAX, homeCountry: " be ", version: 99, extra: "x" });
    expect(parsed.ok && parsed.value.homeCountry).toBe("BE");
    expect(parsed.ok && "version" in parsed.value).toBe(false);
  });

  test.each([
    [{ ...TEST_TAX, regime: "maybe" }, "invalid-regime"],
    [{ ...TEST_TAX, homeCountry: "Belgium" }, "invalid-country"],
    [{ ...TEST_TAX, categories: "x" }, "invalid-categories"],
    [{ ...TEST_TAX, categories: [{ id: "Bad Id", label: "x", rateBasisPoints: 100 }] }, "invalid-categories"],
    [{ ...TEST_TAX, categories: [{ id: "a", label: "x", rateBasisPoints: 10_001 }] }, "invalid-categories"],
    [{ ...TEST_TAX, categories: [{ id: "a", label: "x", rateBasisPoints: 1 }, { id: "a", label: "y", rateBasisPoints: 2 }] }, "duplicate-category"],
    [{ ...TEST_TAX, ossRates: [{ country: "US", categoryId: "experience", rateBasisPoints: 1 }] }, "invalid-oss"],
    [{ ...TEST_TAX, ossRates: [{ country: "NL", categoryId: "unknown", rateBasisPoints: 1 }] }, "invalid-oss"],
    [{ ...TEST_TAX, ossEnabled: "yes" }, "invalid-oss"],
    [{ ...TEST_TAX, exemptionNote: "x".repeat(301) }, "invalid-note"],
    [{ ...TEST_TAX, confirmedByAccountant: "true" }, "invalid-confirmation"],
    [{ ...TEST_TAX, categories: [], ossRates: [] }, "categories-required"],
    [{ ...TEST_TAX, regime: "exempt", exemptionNote: "" }, "note-required"],
    [null, "invalid-body"],
  ])("refuses %# (%s)", (body, error) => {
    expect(parseTaxSettingsInput(body)).toEqual({ ok: false, error });
  });

  test.each([
    ["21", 2100],
    ["5,5", 550],
    ["5.5", 550],
    ["0", 0],
    ["100", 10_000],
    [" 6 %", 600],
  ])("reads the rate %j as %i basis points", (typed, basisPoints) => {
    expect(percentToBasisPoints(typed)).toBe(basisPoints);
  });

  test.each(["", "abc", "101", "-1", "5,555"])("refuses the rate %j", (typed) => {
    expect(percentToBasisPoints(typed)).toBeNull();
  });
});

describe("the VAT in a price paid", () => {
  const settings: TaxSettings = { ...(parseTaxSettingsInput(TEST_TAX) as { ok: true; value: TaxSettings }).value, version: 3, updatedAt: "", updatedBy: null };
  const basis = taxBasisFor(settings, "experience");
  const homeRate = settings.categories[0].rateBasisPoints;
  const nlRate = settings.ossRates[0].rateBasisPoints;

  test("the order keeps a copy of exactly what applied (version, category, rates)", () => {
    expect(basis).toMatchObject({ settingsVersion: 3, regime: "vat-registered", categoryId: "experience", homeRateBasisPoints: homeRate, ossEnabled: true });
    expect(basis.ossRates).toEqual([{ country: "NL", rateBasisPoints: nlRate }]);
  });

  test("a buyer at home pays the home rate; net + VAT = the price paid", () => {
    const tax = applyTax(basis, "BE", 1590);
    expect(tax).toMatchObject({ rateBasisPoints: homeRate, oss: false, country: "BE" });
    expect(tax.netCents + tax.vatCents).toBe(1590);
  });

  test("with OSS, a buyer in another EU country with a set rate pays that rate", () => {
    expect(applyTax(basis, "NL", 1590)).toMatchObject({ rateBasisPoints: nlRate, oss: true });
  });

  test("a country without an OSS rate, OSS switched off, or no country: the home rate", () => {
    expect(applyTax(basis, "FR", 1590)).toMatchObject({ rateBasisPoints: homeRate, oss: false });
    expect(applyTax({ ...basis, ossEnabled: false }, "NL", 1590)).toMatchObject({ rateBasisPoints: homeRate, oss: false });
    expect(applyTax(basis, null, 1590)).toMatchObject({ rateBasisPoints: homeRate, oss: false, country: null });
  });

  test("exempt: no VAT, and the accountant's mention is kept", () => {
    const exempt = { ...basis, regime: "exempt" as const, exemptionNote: "Mention from the accountant" };
    expect(applyTax(exempt, "BE", 1590)).toEqual({ rateBasisPoints: 0, country: "BE", oss: false, netCents: 1590, vatCents: 0, note: "Mention from the accountant" });
  });

  test("an unknown category gives rate 0 in the copy (such a product can't be on sale anyway)", () => {
    expect(taxBasisFor(settings, null)).toMatchObject({ categoryId: null, homeRateBasisPoints: 0, ossRates: [] });
  });
});

describe("pricing an order (server only)", () => {
  test("price × persons, from the catalogue", () => {
    const priced = priceOrder(product, price, 4, null);
    expect(priced).toEqual({
      ok: true,
      value: {
        line: { productId: product.id, productName: "Classics", walkSlug: product.walkSlug, quantity: 4, unitPriceCents: 795, totalCents: 3180 },
        subtotalCents: 3180,
        discountCents: 0,
        totalCents: 3180,
      },
    });
  });

  test.each([0, -1, 1.5, MAX_PERSONS_PER_ORDER + 1, "4", null])("refuses %j persons", (quantity) => {
    expect(priceOrder(product, price, quantity, null)).toEqual({ ok: false, error: "invalid-quantity" });
  });

  test("percent and fixed discounts; never more than the subtotal", () => {
    expect(discountAmount(discount({ kind: "percent", value: 10 }), 3180)).toBe(318);
    expect(discountAmount(discount({ kind: "percent", value: 15 }), 795)).toBe(119);
    expect(discountAmount(discount({ kind: "fixed", value: 500 }), 3180)).toBe(500);
    expect(discountAmount(discount({ kind: "fixed", value: 99_999 }), 3180)).toBe(3180);
    expect(priceOrder(product, price, 4, discount())).toMatchObject({ ok: true, value: { discountCents: 318, totalCents: 2862 } });
  });

  test(`a total under €${MIN_ORDER_CENTS / 100} can't be paid online`, () => {
    expect(priceOrder(product, price, 1, discount({ kind: "percent", value: 100 }))).toEqual({ ok: false, error: "total-too-low" });
  });

  test("why a code can't be used", () => {
    expect(discountProblem(null, product.id, NOW)).toBe("unknown-discount");
    expect(discountProblem(discount({ active: false }), product.id, NOW)).toBe("unknown-discount");
    expect(discountProblem(discount({ validFrom: "2026-10-17T00:00:00Z" }), product.id, NOW)).toBe("discount-not-valid-yet");
    expect(discountProblem(discount({ validUntil: "2026-10-16T12:00:00Z" }), product.id, NOW)).toBe("discount-expired");
    expect(discountProblem(discount({ productIds: ["hidden-pubs"] }), product.id, NOW)).toBe("discount-not-for-product");
    expect(discountProblem(discount({ maxRedemptions: 2, redemptions: 2 }), product.id, NOW)).toBe("discount-used-up");
    expect(discountProblem(discount({ productIds: [product.id], maxRedemptions: 2, redemptions: 1 }), product.id, NOW)).toBeNull();
  });

  test("codes are typed in any case, with spaces around", () => {
    expect(normalizeDiscountCode(" welcome-10 ")).toBe("WELCOME-10");
    for (const bad of ["ab", "with space", "x".repeat(31), "€uro", 10, null, { $ne: "" }]) expect(normalizeDiscountCode(bad)).toBeNull();
  });
});

describe("discount form", () => {
  const known = ["classics-of-antwerp", "hidden-pubs"];
  test("percent and fixed (euros → cents), products, dates, maximum", () => {
    expect(parseDiscountInput({ code: "welcome", kind: "percent", value: "10", productIds: ["hidden-pubs"], validFrom: "2026-11-01", validUntil: "2026-12-01", maxRedemptions: "50" }, known)).toEqual({
      ok: true,
      value: {
        code: "WELCOME",
        kind: "percent",
        value: 10,
        productIds: ["hidden-pubs"],
        validFrom: "2026-11-01T00:00:00.000Z",
        validUntil: "2026-12-01T00:00:00.000Z",
        maxRedemptions: 50,
      },
    });
    expect(parseDiscountInput({ code: "FIVE", kind: "fixed", value: "2,50", productIds: [], validFrom: "", validUntil: null, maxRedemptions: "" }, known)).toMatchObject({
      ok: true,
      value: { kind: "fixed", value: 250, validFrom: null, validUntil: null, maxRedemptions: null },
    });
  });

  test.each([
    [{ code: "x", kind: "percent", value: 10 }, "invalid-code"],
    [{ code: "OK1", kind: "half", value: 10 }, "invalid-kind"],
    [{ code: "OK1", kind: "percent", value: 101 }, "invalid-value"],
    [{ code: "OK1", kind: "percent", value: 0 }, "invalid-value"],
    [{ code: "OK1", kind: "fixed", value: "free" }, "invalid-value"],
    [{ code: "OK1", kind: "percent", value: 10, productIds: ["nope"] }, "unknown-product"],
    [{ code: "OK1", kind: "percent", value: 10, validFrom: "01/11/2026" }, "invalid-dates"],
    [{ code: "OK1", kind: "percent", value: 10, validFrom: "2026-12-01", validUntil: "2026-11-01" }, "invalid-dates"],
    [{ code: "OK1", kind: "percent", value: 10, maxRedemptions: "0" }, "invalid-max"],
    [null, "invalid-body"],
  ])("refuses %# (%s)", (body, error) => {
    expect(parseDiscountInput(body, known)).toEqual({ ok: false, error });
  });
});

describe("ticket links (signed, not stored)", () => {
  const KEY = "a-key-for-this-test-only-long-enough";
  test("a signed link gives its ticket id back", () => {
    const token = signTicketToken("8f0e5c1a-0000-4000-8000-000000000001", KEY);
    expect(verifyTicketToken(token, KEY)).toBe("8f0e5c1a-0000-4000-8000-000000000001");
  });

  test("a changed id, another key, a cut-off or made-up link: refused", () => {
    const token = signTicketToken("8f0e5c1a-0000-4000-8000-000000000001", KEY);
    const [, signature] = token.split(".");
    expect(verifyTicketToken(`8f0e5c1a-0000-4000-8000-000000000002.${signature}`, KEY)).toBeNull();
    expect(verifyTicketToken(token, `${KEY}-other`)).toBeNull();
    expect(verifyTicketToken(token.slice(0, -2), KEY)).toBeNull();
    for (const bad of ["", "no-dot", "a.b.c", `${"x".repeat(150)}.${"y".repeat(60)}`, 42, null, { $ne: "" }]) expect(verifyTicketToken(bad, KEY)).toBeNull();
  });
});
