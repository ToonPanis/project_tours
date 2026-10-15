import { isLocale } from "@/i18n/config";
import type { CorporatePriceTier, CorporatePricing, QuoteActivity, QuoteFormula, QuoteStatus } from "@/types/commerce";
import { MAX_QUOTE_PARTICIPANTS, QUOTE_MIN_FILL_MS } from "../config";
import type { Parsed } from "./catalog";
import { normalizeEmail } from "./email";
import { parseEuroAmount } from "./money";

export const QUOTE_ACTIVITIES: QuoteActivity[] = [
  "team-building",
  "hidden-pubs-team-challenge",
  "alcohol-free-city-challenge",
  "private-walk",
  "company-outing",
  "international-group",
  "something-else",
];
export const QUOTE_FORMULAS: QuoteFormula[] = ["self-guided", "guided", "unsure"];
export const QUOTE_STATUSES: QuoteStatus[] = ["NEW", "CONTACTED", "QUOTED", "ACCEPTED", "DECLINED", "COMPLETED", "CANCELLED"];

/**
 * Which status may follow which (brief 5.4). DECLINED, COMPLETED and
 * CANCELLED end a request; nothing goes backwards, so the history stays honest.
 */
const NEXT: Record<QuoteStatus, QuoteStatus[]> = {
  NEW: ["CONTACTED", "QUOTED", "DECLINED", "CANCELLED"],
  CONTACTED: ["QUOTED", "DECLINED", "CANCELLED"],
  QUOTED: ["ACCEPTED", "DECLINED", "CANCELLED"],
  ACCEPTED: ["COMPLETED", "CANCELLED"],
  DECLINED: [],
  COMPLETED: [],
  CANCELLED: [],
};

export function nextStatuses(status: QuoteStatus): QuoteStatus[] {
  return NEXT[status];
}

export function canMoveTo(from: QuoteStatus, to: QuoteStatus): boolean {
  return NEXT[from].includes(to);
}

export interface QuoteInput {
  company: string;
  contactName: string;
  email: string;
  phone: string | null;
  preferredDate: string | null;
  participants: number;
  activity: QuoteActivity;
  language: string;
  formula: QuoteFormula;
  wishes: string | null;
}

/** Spaces collapsed, trimmed; null when empty; undefined when too long. */
function text(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().replace(/[^\S\n]+/g, " ");
  if (cleaned.length === 0) return null;
  return cleaned.length <= maxLength ? cleaned : undefined;
}

const PHONE_SHAPE = /^\+?[0-9 ()./-]{6,25}$/;
const DAY_SHAPE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Checks the quote form field by field (the browser's checks are only a help).
 * Also recognises bots: a filled-in hidden field ("website": people never see
 * it) or a form sent faster than a person can type. Those are answered as if
 * all went well, so a bot learns nothing, but nothing is saved (`isSpam`).
 */
export function parseQuoteInput(body: unknown, today: Date): Parsed<QuoteInput> & { isSpam?: boolean } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "invalid-body" };
  const input = body as Record<string, unknown>;

  const looksLikeBot =
    (typeof input.website === "string" && input.website.trim() !== "") ||
    typeof input.elapsedMs !== "number" ||
    input.elapsedMs < QUOTE_MIN_FILL_MS;

  const company = text(input.company, 120);
  if (!company) return { ok: false, error: "invalid-company" };
  const contactName = text(input.contactName, 80);
  if (!contactName) return { ok: false, error: "invalid-name" };
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "invalid-email" };

  const phone = text(input.phone, 25);
  if (phone === undefined || (phone !== null && !PHONE_SHAPE.test(phone))) return { ok: false, error: "invalid-phone" };

  let preferredDate: string | null = null;
  if (input.preferredDate !== undefined && input.preferredDate !== null && input.preferredDate !== "") {
    if (typeof input.preferredDate !== "string" || !DAY_SHAPE.test(input.preferredDate)) return { ok: false, error: "invalid-date" };
    const day = new Date(`${input.preferredDate}T00:00:00.000Z`);
    const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const twoYears = startOfToday + 2 * 366 * 24 * 60 * 60 * 1000;
    if (Number.isNaN(day.getTime()) || day.getTime() < startOfToday || day.getTime() > twoYears) return { ok: false, error: "invalid-date" };
    preferredDate = input.preferredDate;
  }

  const participants = typeof input.participants === "string" ? Number(input.participants) : input.participants;
  if (typeof participants !== "number" || !Number.isInteger(participants) || participants < 2 || participants > MAX_QUOTE_PARTICIPANTS) {
    return { ok: false, error: "invalid-participants" };
  }

  if (!QUOTE_ACTIVITIES.includes(input.activity as QuoteActivity)) return { ok: false, error: "invalid-activity" };
  if (!isLocale(input.language)) return { ok: false, error: "invalid-language" };
  if (!QUOTE_FORMULAS.includes(input.formula as QuoteFormula)) return { ok: false, error: "invalid-formula" };

  const wishes = text(input.wishes, 2000);
  if (wishes === undefined) return { ok: false, error: "invalid-wishes" };

  return {
    ok: true,
    isSpam: looksLikeBot,
    value: {
      company,
      contactName,
      email,
      phone,
      preferredDate,
      participants,
      activity: input.activity as QuoteActivity,
      language: input.language,
      formula: input.formula as QuoteFormula,
      wishes,
    },
  };
}

/**
 * The indicative prices from the brief (5.2), used until an admin saves their
 * own in /admin/quotes. Amounts in cents; "from" for the 50-person guided price.
 */
export function defaultCorporatePricing(): CorporatePricing {
  return {
    tiers: [
      { persons: 10, selfGuidedCents: 14_900, guidedCents: 29_900, guidedFrom: false },
      { persons: 20, selfGuidedCents: 27_900, guidedCents: 49_900, guidedFrom: false },
      { persons: 30, selfGuidedCents: 39_900, guidedCents: 69_900, guidedFrom: false },
      { persons: 50, selfGuidedCents: 64_900, guidedCents: 99_900, guidedFrom: true },
    ],
    pricesIncludeVat: false,
    updatedAt: null,
    updatedBy: null,
  };
}

/** An optional amount in euros as typed ("" = not offered). */
function optionalEuros(value: unknown): number | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  const cents = parseEuroAmount(typeof value === "number" ? String(value) : value);
  return cents ?? undefined;
}

/** The admin's price table form: up to 8 lines, persons rising, amounts in euros as typed. */
export function parseCorporatePricing(body: unknown): Parsed<Pick<CorporatePricing, "tiers" | "pricesIncludeVat">> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "invalid-body" };
  const input = body as Record<string, unknown>;
  if (!Array.isArray(input.tiers) || input.tiers.length < 1 || input.tiers.length > 8) return { ok: false, error: "invalid-tiers" };
  if (typeof input.pricesIncludeVat !== "boolean") return { ok: false, error: "invalid-vat-flag" };

  const tiers: CorporatePriceTier[] = [];
  for (const raw of input.tiers as unknown[]) {
    const row = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
    const persons = typeof row.persons === "string" ? Number(row.persons) : row.persons;
    const selfGuidedCents = optionalEuros(row.selfGuided);
    const guidedCents = optionalEuros(row.guided);
    if (typeof persons !== "number" || !Number.isInteger(persons) || persons < 2 || persons > MAX_QUOTE_PARTICIPANTS) {
      return { ok: false, error: "invalid-tiers" };
    }
    if (selfGuidedCents === undefined || guidedCents === undefined || (selfGuidedCents === null && guidedCents === null)) {
      return { ok: false, error: "invalid-tiers" };
    }
    if (tiers.length > 0 && persons <= tiers[tiers.length - 1].persons) return { ok: false, error: "tiers-not-rising" };
    tiers.push({ persons, selfGuidedCents, guidedCents, guidedFrom: row.guidedFrom === true });
  }
  return { ok: true, value: { tiers, pricesIncludeVat: input.pricesIncludeVat } };
}
