import Link from "next/link";
import { getTranslator } from "@/i18n/server";

export async function SiteFooter() {
  const t = await getTranslator();

  return (
    <footer className="border-t border-gold/20 bg-ink text-parchment/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-display text-base text-parchment">Hidden Antwerp</span>
          {" · "}
          {t("navigation.footerTagline")}
        </p>
        <Link href="/walks" className="underline-offset-4 hover:text-gold hover:underline">
          {t("navigation.exploreWalks")}
        </Link>
      </div>
    </footer>
  );
}
