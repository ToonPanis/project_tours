"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale, useT } from "@/i18n/client";
import { postCommerce } from "../components/commerce-errors";
import { partnerErrorKey } from "./partner-api";

/** Step 1 of the partner sign-in: ask for a link by email (in the visitor's language). */
export function PartnerLoginForm() {
  const t = useT();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setMessage(null);
    const result = await postCommerce<{ sent: true }>("/api/partner/auth/login-link", { email, locale });
    setIsSending(false);
    setMessage(
      result.ok
        ? { tone: "success", text: t("partner.login.sent", { email: email.trim() }) }
        : { tone: "error", text: t(partnerErrorKey(result.error)) },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("partner.login.email")}</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus:outline-none"
        />
      </label>
      <Button type="submit" disabled={isSending} fullWidth>
        {isSending ? t("partner.login.sending") : t("partner.login.submit")}
      </Button>
      {/* Always mounted, so screen readers announce the answer. */}
      <p
        role="status"
        className={
          message
            ? `rounded-sm border p-3 text-parchment ${message.tone === "error" ? "border-red-400/50 bg-red-950/40" : "border-emerald-400/50 bg-emerald-950/40"}`
            : "sr-only"
        }
      >
        {message?.text ?? ""}
      </p>
    </form>
  );
}
