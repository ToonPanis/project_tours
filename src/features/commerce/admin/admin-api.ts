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
  "invalid-vat-rate": "Choose one of the Belgian VAT rates.",
  "invalid-amount": "Type a price in euros, e.g. 14,95 (at most €10,000).",
  "vat-rate-required": "Set the VAT rate before activating this product.",
  "price-required": "Set a price before activating this product.",
  "unknown-product": "This product doesn't exist (anymore).",
  offline: "No connection to the server. Check your internet and try again.",
};

export function adminErrorMessage(error: string): string {
  return MESSAGES[error] ?? `Something went wrong (${error}).`;
}

/** €14,95 style, as on the rest of the site (Belgian format). */
export function formatEuros(cents: number): string {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(cents / 100);
}
