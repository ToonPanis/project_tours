/**
 * The admin pages' calls to /api/admin/*. JSON in, JSON out; a refusal comes
 * back as its short error code, which `adminErrorMessage` turns into a sentence.
 *
 * The admin area is English only, like the playtest tools: it's used by the
 * owner, not by visitors (see the commercial plan, P1 report).
 */

export type AdminResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function postJson<T>(url: string, body: unknown): Promise<AdminResult<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => ({}))) as T & { error?: string };
    if (!response.ok) return { ok: false, error: typeof data.error === "string" ? data.error : `http-${response.status}` };
    return { ok: true, data };
  } catch {
    return { ok: false, error: "offline" };
  }
}

const MESSAGES: Record<string, string> = {
  "invalid-email": "That doesn't look like an email address.",
  "too-many-requests": "Too many attempts. Wait a quarter of an hour and try again.",
  "invalid-link": "This sign-in link is not valid anymore (used, expired or incomplete). Ask for a new one.",
  "not-allowed": "This address is not (or no longer) an admin.",
  "not-configured": "Sign-in is not configured on this server yet (APP_BASE_URL is missing).",
  "sign-in-required": "Your session has ended. Sign in again.",
  "invalid-name": "The name must be 1 to 80 characters.",
  "invalid-tax-category": "Choose a tax category from the list.",
  "unknown-tax-category": "That tax category doesn't exist (anymore). Check the tax settings.",
  "tax-category-required": "Choose the tax category before putting this product on sale.",
  "invalid-amount": "Type an amount in euros, e.g. 14,95 (at most €10,000; for a refund at most what's left).",
  // Tax settings
  "invalid-regime": "Choose a tax regime.",
  "invalid-country": "The home country must be a two-letter code, e.g. BE.",
  "invalid-categories": "Each category needs a short id (a–z, 0–9, -), a name and a rate between 0 and 100 %.",
  "duplicate-category": "Two categories have the same id.",
  "invalid-oss": "Each OSS rate needs an EU country, an existing category and a rate; no country and category twice.",
  "invalid-note": "The exemption mention can be at most 300 characters.",
  "invalid-confirmation": "Tick or untick the accountant's confirmation.",
  "categories-required": "A VAT-registered business needs at least one tax category.",
  "note-required": "An exempt business needs the legal mention the accountant gives (it's printed on receipts).",
  "category-in-use": "A category you removed is still used by a product. Change that product first.",
  "saved-at-the-same-time": "Someone else saved the tax settings at the same moment. Reload and try again.",
  // Discounts
  "invalid-code": "A code is 3 to 30 letters, digits or dashes.",
  "invalid-kind": "Choose percent or fixed amount.",
  "invalid-value": "Percent: a whole number from 1 to 100. Fixed: an amount in euros.",
  "invalid-dates": "Check the dates: 'until' must be after 'from'.",
  "invalid-max": "The maximum number of uses must be a whole number of at least 1.",
  "code-exists": "That code already exists.",
  "unknown-discount": "This discount code doesn't exist (anymore).",
  "invalid-active": "Something went wrong switching the code on or off.",
  // Orders
  "unknown-order": "This order doesn't exist.",
  "not-refundable": "Only a paid order can be refunded.",
  "no-ticket": "This order has no ticket.",
  "nothing-to-resend": "Only a paid order with a ticket can have its confirmation resent.",
  // Quotes and the price guide
  "invalid-status": "Choose one of the next statuses.",
  "unknown-quote": "This quote request doesn't exist (anymore).",
  "status-not-allowed": "That status can't follow the current one.",
  "changed-meanwhile": "Someone else changed this request at the same moment. Reload the page.",
  "invalid-tiers": "Each line needs a number of persons (2–1000) and at least one price in euros.",
  "tiers-not-rising": "Put the lines in order of rising numbers of persons, without repeats.",
  "invalid-vat-flag": "Tick or untick 'prices include VAT'.",
  "price-required": "Set a price before activating this product.",
  "unknown-product": "This product doesn't exist (anymore).",
  // Partners and commissions (P7)
  "invalid-type": "Choose the kind of partner.",
  "invalid-commission": "Check the commission: a percentage from 0,01 to 100, or an amount in euros (at most €1,000).",
  "unknown-partner": "This partner doesn't exist (anymore).",
  "admin-address": "This address is an admin address (ADMIN_EMAILS); use another address for the partner portal.",
  "email-in-use": "This address already has access to another partner's portal.",
  "unknown-user": "This user doesn't exist or doesn't belong to this partner.",
  "invalid-action": "Unknown action.",
  "invalid-selection": "Select at least one line (at most 200).",
  "payout-reference-required": "Type the reference of the bank transfer (2 to 100 characters).",
  // Reviews and unique codes (P8)
  "unknown-review": "This review doesn't exist (anymore).",
  "invalid-count": "Choose how many codes: a whole number from 1 to 500.",
  // Personal data requests (P9)
  "confirmation-mismatch": "Type exactly the same address in the confirmation field.",
  offline: "No connection to the server. Check your internet and try again.",
};

export function adminErrorMessage(error: string): string {
  // "refund-failed:<Stripe code>": the code helps when looking it up in Stripe's dashboard.
  if (error.startsWith("refund-failed:")) return `Stripe refused or couldn't be reached (${error.slice(14)}). Nothing was refunded.`;
  return MESSAGES[error] ?? `Something went wrong (${error}).`;
}

/** €14,95 style, as on the rest of the site (Belgian format). */
export function formatEuros(cents: number): string {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(cents / 100);
}
