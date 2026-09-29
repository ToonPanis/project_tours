"use client";

import { useEffect, useId, useRef, useState } from "react";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { useChangeLocale, useLocale, useT } from "@/i18n/client";

/**
 * 🌐 EN ▾: a small language menu in the header. Every language is shown in
 * its own language ("Deutsch", not "German"), so visitors always recognise
 * theirs. The choice is remembered (cookie + localStorage).
 *
 * A disclosure (a button that shows a list of buttons), not an ARIA menu: the
 * list is reached with Tab like any other buttons, and closes when focus leaves it.
 */
export function LanguageSelector() {
  const t = useT();
  const currentLocale = useLocale();
  const changeLocale = useChangeLocale();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on a tap outside the menu, or on Escape (focus goes back to the button).
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function choose(locale: Locale) {
    setIsOpen(false);
    if (locale !== currentLocale) changeLocale(locale);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      // Close when keyboard focus moves to something outside (e.g. Tab past the last language).
      // No relatedTarget means focus went nowhere, e.g. iOS Safari doesn't focus a tapped
      // button: don't close then, or the tap on a language would be lost.
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next && !containerRef.current?.contains(next)) setIsOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={t("common.labelValue", { label: t("navigation.language"), value: localeNames[currentLocale].nativeName })}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-sm font-semibold uppercase tracking-wider text-parchment/85 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-gold"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
        </svg>
        {currentLocale}
        <span aria-hidden="true" className={`text-[0.6rem] transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="absolute right-0 top-full z-30 mt-1 w-56 rounded-sm border border-gold/30 bg-ink py-2 shadow-xl"
        >
          <p className="px-4 pb-2 pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
            {t("navigation.chooseLanguage")}
          </p>
          <ul>
            {locales.map((locale) => {
              const isCurrent = locale === currentLocale;
              return (
                <li key={locale}>
                  <button
                    type="button"
                    lang={locale}
                    aria-current={isCurrent ? "true" : undefined}
                    onClick={() => choose(locale)}
                    className={`flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm transition-colors hover:bg-gold/15 focus-visible:bg-gold/15 focus-visible:outline-none ${
                      isCurrent ? "font-semibold text-gold" : "text-parchment"
                    }`}
                  >
                    <span aria-hidden="true" className="text-lg leading-none">
                      {localeNames[locale].flag}
                    </span>
                    <span className="flex-1">{localeNames[locale].nativeName}</span>
                    {isCurrent && <span aria-hidden="true">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
