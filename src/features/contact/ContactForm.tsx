"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";

export const CONTACT_TYPES = ["general", "booking", "group", "corporate", "partnership", "technical", "something"] as const;
type ContactType = (typeof CONTACT_TYPES)[number];

const field =
  "min-h-12 w-full rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";
const labelText = "text-xs font-semibold uppercase tracking-wider text-gold";

interface Values {
  name: string;
  email: string;
  subject: string;
  type: ContactType;
  message: string;
  privacy: boolean;
}
type Field = Exclude<keyof Values, "type">;

/** The checks, also used by the tests: a key per field that's wrong. */
export function contactErrors(values: Values): Partial<Record<Field, MessageKey>> {
  const errors: Partial<Record<Field, MessageKey>> = {};
  if (values.name.trim().length < 2) errors.name = "pages.contact.form.errors.name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "pages.contact.form.errors.email";
  if (values.subject.trim().length < 2) errors.subject = "pages.contact.form.errors.subject";
  if (values.message.trim().length < 10) errors.message = "pages.contact.form.errors.message";
  if (!values.privacy) errors.privacy = "pages.contact.form.errors.privacy";
  return errors;
}

/** The mailto link with the message filled in (subject + body), for the visitor's own email app. */
export function contactMailto(to: string, values: Values, typeLabel: string): string {
  const body = [`${values.message.trim()}`, "", "—", `${values.name.trim()} <${values.email.trim()}>`, typeLabel].join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(`[${typeLabel}] ${values.subject.trim()}`)}&body=${encodeURIComponent(body)}`;
}

/**
 * The contact form (frontend redesign, brief 4.2–4.3). There is no contact
 * backend and none may be added: the form opens the visitor's OWN email app
 * with the message filled in (mailto to CONTACT_EMAIL). It never claims a
 * message was sent or stored. Without a configured address it explains that.
 */
export function ContactForm({ contactEmail }: { contactEmail: string | null }) {
  const t = useT();
  const [values, setValues] = useState<Values>({ name: "", email: "", subject: "", type: "general", message: "", privacy: false });
  const [errors, setErrors] = useState<Partial<Record<Field, MessageKey>>>({});
  const [opened, setOpened] = useState(false);
  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactEmail) return;
    const found = contactErrors(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move the keyboard to the first field with a problem.
      const first = (["name", "email", "subject", "message", "privacy"] as Field[]).find((key) => found[key]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    window.location.href = contactMailto(contactEmail, values, t(`pages.contact.form.types.${values.type}`));
    setOpened(true);
  }

  const error = (key: Field) =>
    errors[key] ? (
      <span id={`contact-${key}-error`} className="text-sm text-red-300">
        {t(errors[key] as MessageKey)}
      </span>
    ) : null;
  const describedBy = (key: Field) => (errors[key] ? `contact-${key}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 rounded-sm border border-parchment/20 bg-ink/40 p-5">
      <h2 className="font-display text-2xl font-semibold">{t("pages.contact.form.title")}</h2>
      {!contactEmail && <p className="rounded-sm border border-yellow-300/50 bg-yellow-950/30 p-3 text-sm">{t("pages.contact.form.notConfigured")}</p>}
      <fieldset disabled={!contactEmail} className="flex flex-col gap-5 disabled:opacity-60">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className={labelText}>{t("pages.contact.form.name")}</span>
            <input id="contact-name" autoComplete="name" value={values.name} onChange={(event) => set("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} className={field} />
            {error("name")}
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelText}>{t("pages.contact.form.email")}</span>
            <input id="contact-email" type="email" autoComplete="email" value={values.email} onChange={(event) => set("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} className={field} />
            {error("email")}
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("pages.contact.form.type")}</span>
          <select value={values.type} onChange={(event) => set("type", event.target.value as ContactType)} className={field}>
            {CONTACT_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`pages.contact.form.types.${type}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("pages.contact.form.subject")}</span>
          <input id="contact-subject" value={values.subject} maxLength={120} onChange={(event) => set("subject", event.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={describedBy("subject")} className={field} />
          {error("subject")}
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("pages.contact.form.message")}</span>
          <textarea id="contact-message" rows={6} maxLength={3000} value={values.message} onChange={(event) => set("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message")} className={`${field} py-3`} />
          {error("message")}
        </label>
        <label className="flex items-start gap-3">
          <input id="contact-privacy" type="checkbox" checked={values.privacy} onChange={(event) => set("privacy", event.target.checked)} aria-invalid={Boolean(errors.privacy)} aria-describedby={describedBy("privacy")} className="mt-1 size-5 shrink-0" />
          <span className="text-parchment/90">
            {t("pages.contact.form.privacy")}{" "}
            <a href="/privacy" className="text-gold underline underline-offset-4">
              {t("pages.contact.form.privacyLink")}
            </a>
          </span>
        </label>
        {error("privacy")}
        <Button type="submit" fullWidth>
          {t("pages.contact.form.submit")}
        </Button>
        <p className="text-sm text-parchment/80">{t("pages.contact.form.mailtoNote")}</p>
      </fieldset>
      {/* Always mounted, so screen readers announce it (CLAUDE.md, accessibility). */}
      <p role="status" className={opened && contactEmail ? "rounded-sm border border-emerald-400/50 bg-emerald-950/40 p-3" : "sr-only"}>
        {opened && contactEmail ? t("pages.contact.form.opened", { email: contactEmail }) : ""}
      </p>
    </form>
  );
}
