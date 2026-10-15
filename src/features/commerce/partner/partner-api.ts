import type { MessageKey } from "@/i18n/translate";

/** Error codes the partner sign-in screens explain; anything else becomes "unknown". */
const KNOWN = new Set(["invalid-email", "too-many-requests", "invalid-link", "not-allowed", "not-configured", "offline"]);

export function partnerErrorKey(code: string): MessageKey {
  return (KNOWN.has(code) ? `partner.errors.${code}` : "partner.errors.unknown") as MessageKey;
}
