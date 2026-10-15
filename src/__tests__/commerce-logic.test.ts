import { describe, expect, test } from "vitest";
import { getWalks } from "@/data/walks";
import { ALLOWED_VAT_RATES_BASIS_POINTS, MAX_PRICE_CENTS, MAX_PRODUCT_NAME_LENGTH } from "@/features/commerce/config";
import { currentPrice, parsePriceInput, parseProductUpdate } from "@/features/commerce/logic/catalog";
import { normalizeEmail, parseEmailList } from "@/features/commerce/logic/email";
import { isValidPriceCents, parseEuroAmount, splitGrossAmount } from "@/features/commerce/logic/money";
import { isWithinLimit, rateLimitKey, windowStart } from "@/features/commerce/logic/rate-limit";
import { STARTER_PRODUCTS } from "@/features/commerce/logic/starter-catalog";
import type { ProductPrice } from "@/types/commerce";

describe("money", () => {
  test.each([
    ["14,95", 1495],
    ["14.95", 1495],
    ["7,9", 790],
    ["12", 1200],
    ["€ 9,95", 995],
    ["9,95 €", 995],
    [" 0,01 ", 1],
  ])("reads %j as %i cents", (typed, cents) => {
    expect(parseEuroAmount(typed)).toBe(cents);
  });

  test.each(["", "abc", "1.234,56", "14,955", "-5", "0", "0,00", "1e3", "99999,99", 1495, null])("refuses %j", (typed) => {
    expect(parseEuroAmount(typed)).toBeNull();
  });

  test("a valid price is whole cents between 1 and the maximum", () => {
    expect(isValidPriceCents(1)).toBe(true);
    expect(isValidPriceCents(MAX_PRICE_CENTS)).toBe(true);
    expect(isValidPriceCents(MAX_PRICE_CENTS + 1)).toBe(false);
    expect(isValidPriceCents(0)).toBe(false);
    expect(isValidPriceCents(9.5)).toBe(false);
    expect(isValidPriceCents("995")).toBe(false);
  });

  test("net + VAT is always exactly the price paid, for every rate and many prices", () => {
    for (const rate of ALLOWED_VAT_RATES_BASIS_POINTS) {
      for (let gross = 1; gross <= 20_000; gross += 7) {
        const { netCents, vatCents } = splitGrossAmount(gross, rate);
        expect(netCents + vatCents).toBe(gross);
        expect(vatCents).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("known examples: €14.95 at 21 % and 6 %, 0 % has no VAT", () => {
    expect(splitGrossAmount(1495, 2100)).toEqual({ netCents: 1236, vatCents: 259 });
    expect(splitGrossAmount(1495, 600)).toEqual({ netCents: 1410, vatCents: 85 });
    expect(splitGrossAmount(1495, 0)).toEqual({ netCents: 1495, vatCents: 0 });
  });
});

describe("email addresses", () => {
  test("one fixed form: trimmed and lower case", () => {
    expect(normalizeEmail("  Toon@Example.COM ")).toBe("toon@example.com");
  });

  test.each(["", "no-at-sign", "a@b", "two words@example.com", `${"x".repeat(250)}@example.com`, 42, null, { $ne: "" }])(
    "refuses %j",
    (value) => {
      expect(normalizeEmail(value)).toBeNull();
    },
  );

  test("ADMIN_EMAILS: comma separated, invalid entries and duplicates left out", () => {
    expect(parseEmailList(" Owner@example.com, not-an-email ,owner@example.com,second@example.com ")).toEqual([
      "owner@example.com",
      "second@example.com",
    ]);
    expect(parseEmailList(undefined)).toEqual([]);
    expect(parseEmailList("")).toEqual([]);
  });
});

describe("rate limits", () => {
  test("requests in the same window share a key; the next window starts again", () => {
    const windowMs = 15 * 60 * 1000;
    const a = windowStart(new Date("2026-10-16T09:01:00Z"), windowMs);
    const b = windowStart(new Date("2026-10-16T09:14:59Z"), windowMs);
    const c = windowStart(new Date("2026-10-16T09:15:00Z"), windowMs);
    expect(a).toEqual(b);
    expect(c.getTime() - a.getTime()).toBe(windowMs);
    expect(rateLimitKey("login", "hash", a)).toBe(rateLimitKey("login", "hash", b));
    expect(rateLimitKey("login", "hash", a)).not.toBe(rateLimitKey("login", "hash", c));
  });

  test("the limit itself is still allowed, one more is not", () => {
    expect(isWithinLimit(5, { limit: 5, windowMs: 1 })).toBe(true);
    expect(isWithinLimit(6, { limit: 5, windowMs: 1 })).toBe(false);
  });
});

describe("catalogue input", () => {
  const price = (id: string, validFrom: string): ProductPrice => ({
    id,
    productId: "p",
    amountCents: 100,
    currency: "EUR",
    validFrom,
    createdBy: "test",
  });

  test("the current price is the newest one that has started", () => {
    const prices = [price("old", "2026-01-01T00:00:00Z"), price("now", "2026-10-01T00:00:00Z"), price("future", "2027-01-01T00:00:00Z")];
    expect(currentPrice(prices, new Date("2026-10-16T00:00:00Z"))?.id).toBe("now");
    expect(currentPrice(prices, new Date("2025-01-01T00:00:00Z"))).toBeNull();
    expect(currentPrice([], new Date())).toBeNull();
  });

  test("a product update keeps only the allowed fields, checked", () => {
    expect(parseProductUpdate({ name: "  17   Gates ", active: true, vatRateBasisPoints: 600, id: "x", walkSlug: "y" })).toEqual({
      ok: true,
      value: { name: "17 Gates", active: true, vatRateBasisPoints: 600 },
    });
    expect(parseProductUpdate({ vatRateBasisPoints: null })).toEqual({ ok: true, value: { vatRateBasisPoints: null } });
  });

  test.each([
    [null, "invalid-body"],
    ["text", "invalid-body"],
    [{}, "nothing-to-update"],
    [{ id: "only-unknown-fields" }, "nothing-to-update"],
    [{ name: "" }, "invalid-name"],
    [{ name: "x".repeat(MAX_PRODUCT_NAME_LENGTH + 1) }, "invalid-name"],
    [{ name: { $set: "x" } }, "invalid-name"],
    [{ active: "yes" }, "invalid-active"],
    [{ vatRateBasisPoints: 2000 }, "invalid-vat-rate"],
    [{ vatRateBasisPoints: "2100" }, "invalid-vat-rate"],
  ])("refuses %j (%s)", (body, error) => {
    expect(parseProductUpdate(body)).toEqual({ ok: false, error });
  });

  test("a price is typed in euros and stored in cents", () => {
    expect(parsePriceInput({ amount: "9,95" })).toEqual({ ok: true, value: 995 });
    expect(parsePriceInput({ amount: 995 })).toEqual({ ok: false, error: "invalid-amount" });
    expect(parsePriceInput(null)).toEqual({ ok: false, error: "invalid-amount" });
  });
});

describe("starter catalogue", () => {
  test("every starter product belongs to a walk that exists, sold per person at a valid price", () => {
    const slugs = new Set(getWalks("en").map((walk) => walk.slug));
    for (const product of STARTER_PRODUCTS) {
      expect(slugs.has(product.walkSlug)).toBe(true);
      expect(isValidPriceCents(product.priceCents)).toBe(true);
    }
    expect(new Set(STARTER_PRODUCTS.map((product) => product.id)).size).toBe(STARTER_PRODUCTS.length);
  });

  test("decision B2: the Poortjes walk is sold as \"17 Gates\"", () => {
    expect(STARTER_PRODUCTS.find((product) => product.walkSlug === "poortjes-van-antwerpen")?.name).toBe("17 Gates");
  });
});
