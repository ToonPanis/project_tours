"use client";

import { useT } from "@/i18n/client";
import { errorMessageKey } from "../client/api";

/**
 * The server's refusal, translated. Always mounted (empty when there's no
 * error), so screen readers announce a new message.
 */
export function FormError({ error }: { error: string | null }) {
  const t = useT();
  return (
    <p role="status" className={error ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3 text-parchment" : "sr-only"}>
      {error ? t(errorMessageKey(error)) : ""}
    </p>
  );
}
