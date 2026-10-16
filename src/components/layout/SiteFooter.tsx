import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getTranslator } from "@/i18n/server";

const linkClass = "min-h-11 content-center underline-offset-4 hover:text-gold hover:underline";

export async function SiteFooter() {
  const t = await getTranslator();
  const links = [
    { href: "/walks", label: t("navigation.exploreWalks") },
    { href: "/about", label: t("navigation.about") },
    { href: "/reviews", label: t("navigation.reviews") },
    { href: "/corporate", label: t("navigation.forCompanies") },
    { href: "/contact", label: t("navigation.contact") },
    { href: "/privacy", label: t("navigation.privacy") },
  ];

  return (
    <footer className="border-t border-gold/20 bg-ink text-parchment/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-display text-base text-parchment">{SITE_NAME}</span>
          {" · "}
          {t("navigation.footerTagline")}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
