import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/features/contact/ContactForm";
import { getTranslator } from "@/i18n/server";
import { canonicalUrl } from "@/lib/canonical";
import { baseOpenGraph } from "@/lib/shared-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const canonical = canonicalUrl("/contact");
  return {
    title: t("pages.contact.meta.title"),
    description: t("pages.contact.meta.description"),
    alternates: canonical ? { canonical } : undefined,
    openGraph: { ...baseOpenGraph(t.locale), title: t("pages.contact.meta.title"), description: t("pages.contact.meta.description"), url: canonical },
  };
}

/**
 * The address the contact form writes to: CONTACT_EMAIL (server setting, read
 * at request time so it can change without a rebuild). Only a plausible
 * address is used; never a made-up fallback.
 */
function contactEmail(): string | null {
  const value = process.env.CONTACT_EMAIL?.trim() ?? "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? value : null;
}

/**
 * /contact (frontend redesign, brief phase 4). No contact backend exists (and
 * none may be added): the form opens the visitor's own email app. Groups and
 * companies are sent to the existing quote form on /corporate, which does have
 * a backend. Only real contact details are shown (the postal address).
 */
export default async function ContactPage() {
  const t = await getTranslator();
  const email = contactEmail();
  const card = "flex flex-col gap-2 rounded-sm border border-parchment/20 p-5";
  return (
    <div className="bg-night-map min-h-full text-parchment">
      <section className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6">
        <header className="flex max-w-2xl flex-col gap-4">
          <h1 className="font-display text-5xl font-semibold leading-tight [overflow-wrap:anywhere]">{t("pages.contact.title")}</h1>
          <p className="text-lg leading-relaxed text-parchment/85">{t("pages.contact.intro")}</p>
        </header>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
          <ContactForm contactEmail={email} />
          <aside aria-labelledby="contact-more" className="flex flex-col gap-4">
            <h2 id="contact-more" className="font-display text-2xl font-semibold">
              {t("pages.contact.more.title")}
            </h2>
            <div className={card}>
              <h3 className="font-semibold text-gold">{t("pages.contact.more.groupsTitle")}</h3>
              <p className="text-parchment/85">{t("pages.contact.more.groupsText")}</p>
              <Link href="/corporate#quote" className="text-gold underline underline-offset-4">
                {t("pages.contact.more.groupsLink")}
              </Link>
            </div>
            <div className={card}>
              <h3 className="font-semibold text-gold">{t("pages.contact.more.partnersTitle")}</h3>
              <p className="text-parchment/85">{t("pages.contact.more.partnersText")}</p>
            </div>
            <div className={card}>
              <h3 className="font-semibold text-gold">{t("pages.contact.more.supportTitle")}</h3>
              <p className="text-parchment/85">{t("pages.contact.more.supportText")}</p>
            </div>
            <div className={card}>
              <h3 className="font-semibold text-gold">{t("pages.contact.more.postTitle")}</h3>
              <address className="not-italic text-parchment/85">{t("pages.contact.more.postAddress")}</address>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
