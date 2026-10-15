"use client"; // Error boundaries must be Client Components.

import { useEffect, useState, useSyncExternalStore } from "react";
import { readCookieLocale } from "@/i18n/client";
import { defaultLocale, type Locale } from "@/i18n/config";
import english from "@/i18n/locales/en";
import type { LocaleMessages } from "@/i18n/messages";
import { buildTranslator } from "@/i18n/translator";
import { logError } from "@/lib/log-error";
import { reloadPage } from "@/lib/reload-page";
import "./globals.css";

/**
 * Last-resort error page for crashes in the root layout itself. It replaces the
 * whole layout, so it needs its own <html>/<body> and has no <LocaleProvider>:
 * it reads the language from the cookie directly. Kept deliberately simple:
 * it uses system fonts, because the app's fonts are attached by the root layout.
 * Errors inside the walk player are handled by walks/[slug]/play/error.tsx.
 */
/** The cookie doesn't change while this page is shown, so there is nothing to subscribe to. */
const noSubscription = () => () => {};

/**
 * This page is part of every page's JavaScript, so it can't bring all 8
 * languages along. English is there anyway (the fallback); another language's
 * error texts (one small file) are loaded only when this page actually shows.
 */
const errorTexts: Partial<Record<Locale, () => Promise<{ default: LocaleMessages["errors"] }>>> = {
  nl: () => import("@/i18n/locales/nl/errors.json"),
  fr: () => import("@/i18n/locales/fr/errors.json"),
  es: () => import("@/i18n/locales/es/errors.json"),
  it: () => import("@/i18n/locales/it/errors.json"),
  de: () => import("@/i18n/locales/de/errors.json"),
  ru: () => import("@/i18n/locales/ru/errors.json"),
  uk: () => import("@/i18n/locales/uk/errors.json"),
};

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  // English on the server (no cookie access here), the cookie's language in the browser.
  // useSyncExternalStore handles that difference without a hydration mismatch.
  const locale = useSyncExternalStore(
    noSubscription,
    () => readCookieLocale() ?? defaultLocale,
    () => defaultLocale,
  );
  const [loaded, setLoaded] = useState<{ locale: Locale; errors: LocaleMessages["errors"] } | null>(null);
  const messages = loaded?.locale === locale ? { errors: loaded.errors } : undefined;
  // Until (or unless: no network) the texts are there, the page shows English.
  const t = buildTranslator(messages ? locale : defaultLocale, messages, english);

  useEffect(() => {
    logError(error);
  }, [error]);

  useEffect(() => {
    const load = errorTexts[locale];
    if (!load) return;
    let cancelled = false;
    load()
      .then((module) => {
        if (!cancelled) setLoaded({ locale, errors: module.default });
      })
      .catch(() => {
        // No network: English stays.
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <html lang={t.locale}>
      <body className="bg-night-map min-h-dvh font-sans text-parchment">
        <title>{t("errors.globalError.title")}</title>
        <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16">
          <h1 className="text-3xl font-semibold">{t("errors.globalError.title")}</h1>
          <p>{t("errors.globalError.text")}</p>
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => reloadPage()}
              className="min-h-11 rounded-sm bg-gold px-6 py-3 font-semibold uppercase tracking-[0.12em] text-ink"
            >
              {t("errors.playError.tryAgain")}
            </button>
            {/* A plain link (full page load) on purpose: the app's router may be the broken part. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/walks" className="flex min-h-11 items-center justify-center underline underline-offset-4">
              {t("errors.playError.allWalks")}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
