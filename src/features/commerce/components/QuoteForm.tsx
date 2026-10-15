"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { localeNames, locales } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { MAX_QUOTE_PARTICIPANTS } from "../config";
import { QUOTE_ACTIVITIES, QUOTE_FORMULAS } from "../logic/quotes";
import { postCommerce } from "./commerce-errors";

const field =
  "min-h-12 w-full rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus:outline-none";

const KNOWN_ERRORS = new Set([
  "invalid-company",
  "invalid-name",
  "invalid-email",
  "invalid-phone",
  "invalid-date",
  "invalid-participants",
  "invalid-activity",
  "invalid-language",
  "invalid-formula",
  "invalid-wishes",
  "too-many-requests",
  "offline",
]);
const errorKey = (code: string) => (KNOWN_ERRORS.has(code) ? `corporate.errors.${code}` : "corporate.errors.generic") as MessageKey;

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-gold">{label}</span>
      {children}
      {hint && <span className="text-sm text-parchment/70">{hint}</span>}
    </label>
  );
}

/**
 * The quote request form on /corporate (brief 5.3): only what's needed for an
 * offer. Two quiet bot checks: a hidden field people never see ("website")
 * and the time it took to fill in; the server decides with both.
 */
export function QuoteForm() {
  const t = useT();
  const locale = useLocale();
  const startedAt = useRef(0);
  const [values, setValues] = useState({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    preferredDate: "",
    participants: "20",
    activity: "team-building",
    language: locale,
    formula: "unsure",
    wishes: "",
    website: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<MessageKey | null>(null);
  const [sent, setSent] = useState(false);

  // When the form appeared (not during rendering: that must stay pure).
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (name: keyof typeof values) => (event: { target: { value: string } }) => setValues((current) => ({ ...current, [name]: event.target.value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setError(null);
    const result = await postCommerce<{ received: true }>("/api/quotes", {
      ...values,
      participants: Number(values.participants),
      elapsedMs: Date.now() - startedAt.current,
    });
    setIsSending(false);
    if (result.ok) setSent(true);
    else setError(errorKey(result.error));
  }

  if (sent) {
    return (
      <p role="status" className="rounded-sm border border-gold/50 bg-ink/40 p-4 text-lg text-parchment">
        {t("corporate.form.thanks")}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 text-parchment">
      <Field label={t("corporate.form.company")}>
        <input value={values.company} onChange={set("company")} required maxLength={120} autoComplete="organization" className={field} />
      </Field>
      <Field label={t("corporate.form.contactName")}>
        <input value={values.contactName} onChange={set("contactName")} required maxLength={80} autoComplete="name" className={field} />
      </Field>
      <Field label={t("corporate.form.email")}>
        <input type="email" value={values.email} onChange={set("email")} required maxLength={254} autoComplete="email" className={field} />
      </Field>
      <Field label={t("corporate.form.phone")}>
        <input type="tel" value={values.phone} onChange={set("phone")} maxLength={25} autoComplete="tel" className={field} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("corporate.form.date")} hint={t("corporate.form.dateHint")}>
          <input type="date" value={values.preferredDate} onChange={set("preferredDate")} className={field} />
        </Field>
        <Field label={t("corporate.form.participants")}>
          <input type="number" inputMode="numeric" min={2} max={MAX_QUOTE_PARTICIPANTS} value={values.participants} onChange={set("participants")} required className={field} />
        </Field>
      </div>
      <Field label={t("corporate.form.activity")}>
        <select value={values.activity} onChange={set("activity")} className={field}>
          {QUOTE_ACTIVITIES.map((activity) => (
            <option key={activity} value={activity}>
              {t(`corporate.activities.${activity}`)}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("corporate.form.language")}>
          <select value={values.language} onChange={set("language")} className={field}>
            {locales.map((option) => (
              <option key={option} value={option} lang={option}>
                {localeNames[option].nativeName}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("corporate.form.formula")}>
          <select value={values.formula} onChange={set("formula")} className={field}>
            {QUOTE_FORMULAS.map((formula) => (
              <option key={formula} value={formula}>
                {t(`corporate.formulas.${formula}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={t("corporate.form.wishes")}>
        <textarea value={values.wishes} onChange={set("wishes")} maxLength={2000} rows={4} className={`${field} py-3`} />
      </Field>
      {/* For bots only: hidden from people and screen readers, never filled in by them. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {t("corporate.form.honeypot")}
          <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>
      <p className="text-sm text-parchment/70">{t("corporate.form.privacy")}</p>
      <Button type="submit" disabled={isSending} fullWidth>
        {isSending ? t("corporate.form.sending") : t("corporate.form.submit")}
      </Button>
      <p role="status" className={error ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3" : "sr-only"}>
        {error ? t(error) : ""}
      </p>
    </form>
  );
}
