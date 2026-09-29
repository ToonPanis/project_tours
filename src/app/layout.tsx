import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LocaleProvider, LocaleSync } from "@/i18n/client";
import { getLocale, getTranslator } from "@/i18n/server";
import "./globals.css";

// Headings: a classic serif with an engraved, historical feel.
// Both fonts include Cyrillic, so Russian and Ukrainian look the same as the rest.
// `subsets` only decides which font files are PRELOADED: next/font still adds every
// subset (Cyrillic, Latin-extended…) with a unicode-range, so the browser downloads
// those only when a page uses their characters. Preloading just "latin" saves
// about 150 KB of font downloads for most visitors. Trade-off: Russian and Ukrainian
// text may show the fallback font for a moment while its Cyrillic file loads.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Body text: a clean sans-serif that stays readable on phones outdoors.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

/** Title and description in the visitor's language (also for link previews). */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: {
      default: t("meta.siteTitle"),
      template: "%s | Hidden Antwerp",
    },
    description: t("meta.siteDescription"),
    openGraph: {
      title: t("meta.siteTitle"),
      description: t("meta.siteDescription"),
      siteName: "Hidden Antwerp",
      locale: t.locale,
      type: "website",
    },
    // PROTOTYPE: keep the whole site out of search engines while it contains
    // placeholder content next to real café names. Remove this at launch.
    robots: { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <LocaleProvider locale={locale}>
          <LocaleSync />
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
