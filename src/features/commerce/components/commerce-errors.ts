import type { MessageKey } from "@/i18n/translate";

/** Error codes the buyer's screens can show; everything else becomes "generic". */
const KNOWN = new Set([
  "sales-closed",
  "unknown-product",
  "invalid-quantity",
  "total-too-low",
  "unknown-discount",
  "discount-not-valid-yet",
  "discount-expired",
  "discount-not-for-product",
  "discount-used-up",
  "payments-unavailable",
  "invalid-ticket",
  "ticket-revoked",
  "ticket-expired",
  "ticket-full",
  "offline",
]);

/** The translation key for a server error code (codes are fixed strings from our own routes). */
export function commerceErrorKey(code: string): MessageKey {
  return (KNOWN.has(code) ? `commerce.errors.${code}` : "commerce.errors.generic") as MessageKey;
}

/** POSTs JSON to one of our routes; a refusal comes back as its error code. */
export async function postCommerce<T>(url: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = (await response.json().catch(() => ({}))) as T & { error?: string };
    return response.ok ? { ok: true, data } : { ok: false, error: typeof data.error === "string" ? data.error : "generic" };
  } catch {
    return { ok: false, error: "offline" };
  }
}
