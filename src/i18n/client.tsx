"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { defaultLocale, isLocale, LOCALE_COOKIE, LOCALE_STORAGE_KEY, type Locale } from "./config";
import { createTranslator, type Translator } from "./translate";

/**
 * The language in the browser. The server decides the language (see
 * server.ts) and passes it to <LocaleProvider>; Client Components read it
 * with useLocale() / useT(). All interface texts are bundled, so switching
 * languages needs no extra download.
 */

const LocaleContext = createContext<Locale>(defaultLocale);

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage can be unavailable (private mode). The cookie still remembers the choice.
  }
}

/** The language saved in the cookie, if any (also used by app/global-error.tsx, which has no provider). */
export function readCookieLocale(): Locale | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  return match && isLocale(match[1]) ? match[1] : null;
}

/** Makes the current language available to Client Components below it. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/**
 * The cookie can disappear (cleared cookies) while localStorage keeps the
 * visitor's own choice. This restores it, because a chosen language always
 * beats browser detection. Rendered once, in the root layout.
 */
export function LocaleSync() {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      return;
    }
    if (isLocale(stored) && readCookieLocale() === null && stored !== locale) {
      saveLocale(stored);
      router.refresh();
    }
  }, [locale, router]);

  return null;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** The translator for the current language: `const t = useT(); t("common.close")`. */
export function useT(): Translator {
  const locale = useLocale();
  return useMemo(() => createTranslator(locale), [locale]);
}

/** Switches the language: remembers it and re-renders the page (URL and state stay the same). */
export function useChangeLocale(): (locale: Locale) => void {
  const router = useRouter();
  return useCallback(
    (locale: Locale) => {
      saveLocale(locale);
      document.documentElement.lang = locale;
      router.refresh();
    },
    [router],
  );
}
