import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getTranslator } from "@/i18n/server";
import { LanguageSelector } from "./LanguageSelector";

const linkClass =
  "flex min-h-11 items-center px-2 text-sm text-parchment/85 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold";

export async function SiteHeader() {
  const t = await getTranslator();
  const links = [
    { href: "/walks", label: t("navigation.walks") },
    { href: "/about", label: t("navigation.about") },
    { href: "/reviews", label: t("navigation.reviews") },
    { href: "/contact", label: t("navigation.contact") },
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
          {/* "Hidden" in the text colour, "Antwerp" in gold. */}
          {SITE_NAME.split(" ")[0]} <span className="ml-1.5 text-gold">{SITE_NAME.split(" ").slice(1).join(" ")}</span>
        </Link>

        <nav aria-label={t("navigation.mainNavigation")} className="min-w-0">
          <ul className="flex items-center gap-1 md:gap-3">
            {/* Wide screens: every link in the bar. */}
            {links.map((link) => (
              <li key={link.href} className="hidden md:block">
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Tablets: the walks stay visible next to the menu. Phones: everything in the menu, so long words
                (German, Russian) never push the bar wider than the screen. The menu works without JavaScript. */}
            <li className="hidden sm:block md:hidden">
              <Link href="/walks" className={linkClass}>
                {t("navigation.walks")}
              </Link>
            </li>
            <li className="relative md:hidden">
              <details className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-center px-2 text-sm text-parchment/85 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
                  {t("navigation.menu")}
                  <span aria-hidden="true" className="ml-1 transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <ul className="absolute right-0 top-full mt-1 flex w-56 flex-col rounded-sm border border-gold/25 bg-ink p-2 shadow-lg">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={`${linkClass} w-full rounded-sm px-3 hover:bg-parchment/10`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/#how-it-works" className={`${linkClass} w-full rounded-sm px-3 hover:bg-parchment/10`}>
                      {t("navigation.howItWorks")}
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <LanguageSelector />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
