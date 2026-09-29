import Link from "next/link";
import { getTranslator } from "@/i18n/server";
import { LanguageSelector } from "./LanguageSelector";

export async function SiteHeader() {
  const t = await getTranslator();
  const navigationLinks = [
    { href: "/walks", label: t("navigation.walks") },
    // Hidden on the smallest phones to leave room for the language menu; the
    // home page itself links to "How it works".
    { href: "/#how-it-works", label: t("navigation.howItWorks"), className: "hidden sm:flex" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-gold/20 bg-ink/95 text-parchment backdrop-blur">
      {/* Lets keyboard users jump past the navigation. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-gold focus:px-3 focus:py-2 focus:text-ink"
      >
        {t("navigation.skipToContent")}
      </a>

      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={t("navigation.home")}
          className="flex min-h-11 shrink-0 items-center font-display text-xl font-semibold tracking-wide"
        >
          Hidden <span className="ml-1.5 text-gold">Antwerp</span>
        </Link>

        <nav aria-label={t("navigation.mainNavigation")} className="min-w-0">
          <ul className="flex items-center gap-1 sm:gap-4">
            {navigationLinks.map((link) => (
              <li key={link.href} className={link.className}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center px-2 text-sm text-parchment/85 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <LanguageSelector />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
