import type { AppliedTax, OrderTaxBasis, OssRate, TaxCategory, TaxRegime, TaxSettings } from "@/types/commerce";
import { EU_COUNTRIES, MAX_OSS_RATES, MAX_TAX_CATEGORIES } from "../config";
import type { Parsed } from "./catalog";
import { splitGrossAmount } from "./money";

/**
 * Tax (decision B8): nothing is built in. The admin chooses the regime, the
 * categories with their rates and, if the accountant says so, OSS rates per
 * EU country. Every order copies what applied (`OrderTaxBasis`) and the final
 * split is worked out when the payment arrives and the buyer's country is known.
 */

/** Before anything is saved: nothing configured, nothing for sale. */
export function defaultTaxSettings(): TaxSettings {
  return {
    version: 0,
    regime: "not-configured",
    homeCountry: "BE",
    categories: [],
    ossEnabled: false,
    ossRates: [],
    exemptionNote: null,
    confirmedByAccountant: false,
    updatedAt: new Date(0).toISOString(),
    updatedBy: null,
  };
}

/** A rate as an admin types it ("21", "5,5", "0") → basis points (2100, 550, 0), or null. */
export function percentToBasisPoints(input: string): number | null {
  const match = /^(\d{1,3})(?:[.,](\d{1,2}))?$/.exec(input.trim().replace(/\s*%$/, ""));
  if (!match) return null;
  const basisPoints = Number(match[1]) * 100 + Number((match[2] ?? "0").padEnd(2, "0"));
  return basisPoints <= 10_000 ? basisPoints : null;
}

/** Ticket sales are only possible once the regime is chosen and the accountant confirmed it. */
export function taxAllowsSales(settings: TaxSettings): boolean {
  return settings.regime !== "not-configured" && settings.confirmedByAccountant;
}

const ID_SHAPE = /^[a-z0-9][a-z0-9-]{0,29}$/;
const COUNTRY_SHAPE = /^[A-Z]{2}$/;
const isRate = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 10_000;
const REGIMES: TaxRegime[] = ["not-configured", "exempt", "vat-registered"];

/** What the admin may set (version, dates and author are added by the service). */
export type TaxSettingsInput = Omit<TaxSettings, "version" | "updatedAt" | "updatedBy">;

/** Checks the tax form field by field. Anything unknown is ignored. */
export function parseTaxSettingsInput(body: unknown): Parsed<TaxSettingsInput> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "invalid-body" };
  const input = body as Record<string, unknown>;

  if (!REGIMES.includes(input.regime as TaxRegime)) return { ok: false, error: "invalid-regime" };
  const homeCountry = typeof input.homeCountry === "string" ? input.homeCountry.trim().toUpperCase() : "";
  if (!COUNTRY_SHAPE.test(homeCountry)) return { ok: false, error: "invalid-country" };

  if (!Array.isArray(input.categories) || input.categories.length > MAX_TAX_CATEGORIES) return { ok: false, error: "invalid-categories" };
  const categories: TaxCategory[] = [];
  for (const raw of input.categories as unknown[]) {
    const category = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
    const id = typeof category.id === "string" ? category.id.trim() : "";
    const label = typeof category.label === "string" ? category.label.trim() : "";
    if (!ID_SHAPE.test(id) || label.length < 1 || label.length > 80 || !isRate(category.rateBasisPoints)) {
      return { ok: false, error: "invalid-categories" };
    }
    if (categories.some((existing) => existing.id === id)) return { ok: false, error: "duplicate-category" };
    categories.push({ id, label, rateBasisPoints: category.rateBasisPoints });
  }

  if (typeof input.ossEnabled !== "boolean") return { ok: false, error: "invalid-oss" };
  if (!Array.isArray(input.ossRates) || input.ossRates.length > MAX_OSS_RATES) return { ok: false, error: "invalid-oss" };
  const ossRates: OssRate[] = [];
  for (const raw of input.ossRates as unknown[]) {
    const rate = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
    const country = typeof rate.country === "string" ? rate.country.trim().toUpperCase() : "";
    const categoryId = typeof rate.categoryId === "string" ? rate.categoryId : "";
    if (!(EU_COUNTRIES as readonly string[]).includes(country) || !categories.some((c) => c.id === categoryId) || !isRate(rate.rateBasisPoints)) {
      return { ok: false, error: "invalid-oss" };
    }
    if (ossRates.some((existing) => existing.country === country && existing.categoryId === categoryId)) return { ok: false, error: "invalid-oss" };
    ossRates.push({ country, categoryId, rateBasisPoints: rate.rateBasisPoints });
  }

  const note = typeof input.exemptionNote === "string" ? input.exemptionNote.trim() : "";
  if (note.length > 300) return { ok: false, error: "invalid-note" };
  if (typeof input.confirmedByAccountant !== "boolean") return { ok: false, error: "invalid-confirmation" };

  const regime = input.regime as TaxRegime;
  // A VAT-registered business needs at least one category; an exempt one needs the legal mention.
  if (regime === "vat-registered" && categories.length === 0) return { ok: false, error: "categories-required" };
  if (regime === "exempt" && note.length === 0) return { ok: false, error: "note-required" };

  return {
    ok: true,
    value: {
      regime,
      homeCountry,
      categories,
      ossEnabled: input.ossEnabled,
      ossRates,
      exemptionNote: note || null,
      confirmedByAccountant: input.confirmedByAccountant,
    },
  };
}

/** The part of the settings one order needs, copied into the order when it's created. */
export function taxBasisFor(settings: TaxSettings, categoryId: string | null): OrderTaxBasis {
  const category = settings.categories.find((candidate) => candidate.id === categoryId) ?? null;
  return {
    settingsVersion: settings.version,
    regime: settings.regime,
    homeCountry: settings.homeCountry,
    categoryId: category?.id ?? null,
    homeRateBasisPoints: category?.rateBasisPoints ?? 0,
    ossEnabled: settings.ossEnabled,
    ossRates: settings.ossRates
      .filter((rate) => rate.categoryId === category?.id)
      .map((rate) => ({ country: rate.country, rateBasisPoints: rate.rateBasisPoints })),
    exemptionNote: settings.exemptionNote,
  };
}

/**
 * The VAT in a price paid (VAT included), for a buyer in `country`.
 * - exempt: no VAT, with the legal mention;
 * - VAT-registered: the home rate, or, with OSS enabled, the rate set for the
 *   buyer's other EU country (if the admin set one: otherwise the home rate).
 * Businesses with a VAT number are treated the same here; how B2B invoices
 * show VAT (e.g. reverse charge) is for the invoicing provider and the accountant.
 */
export function applyTax(basis: OrderTaxBasis, country: string | null, grossCents: number): AppliedTax {
  if (basis.regime !== "vat-registered") {
    return { rateBasisPoints: 0, country, oss: false, netCents: grossCents, vatCents: 0, note: basis.exemptionNote };
  }
  const ossRate =
    basis.ossEnabled && country && country !== basis.homeCountry ? basis.ossRates.find((rate) => rate.country === country) : undefined;
  const rateBasisPoints = ossRate ? ossRate.rateBasisPoints : basis.homeRateBasisPoints;
  return { rateBasisPoints, country, oss: Boolean(ossRate), ...splitGrossAmount(grossCents, rateBasisPoints), note: null };
}
