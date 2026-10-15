import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { QuoteForm } from "@/features/commerce/components/QuoteForm";
import { defaultCorporatePricing } from "@/features/commerce/logic/quotes";
import { getCommerceContext } from "@/features/commerce/server/context";
import { getCorporatePricing } from "@/features/commerce/server/quote-service";
import { getTranslator } from "@/i18n/server";
import { baseOpenGraph } from "@/lib/shared-metadata";
import type { CorporatePricing, QuoteActivity } from "@/types/commerce";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("corporate.meta.title"),
    description: t("corporate.meta.description"),
    openGraph: { ...baseOpenGraph(t.locale), title: t("corporate.meta.title"), description: t("corporate.meta.description") },
  };
}

const OFFERS: Exclude<QuoteActivity, "something-else">[] = [
  "team-building",
  "hidden-pubs-team-challenge",
  "alcohol-free-city-challenge",
  "private-walk",
  "company-outing",
  "international-group",
];

/** The price table comes from the admin area; if the database can't be reached, the brief's starting prices are shown. */
async function loadPricing(): Promise<CorporatePricing> {
  try {
    return await getCorporatePricing(getCommerceContext());
  } catch {
    return defaultCorporatePricing();
  }
}

/**
 * /corporate (brief phase 5): team building and company outings, the
 * indicative prices (editable in /admin/quotes) and the quote request form.
 */
export default async function CorporatePage() {
  const t = await getTranslator();
  const pricing = await loadPricing();
  const euros = (cents: number) => new Intl.NumberFormat(`${t.locale}-BE`, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);

  return (
    <article>
      <section className="bg-night-map text-parchment">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t("corporate.eyebrow")}</p>
          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[1.05] [overflow-wrap:anywhere] sm:text-6xl">{t("corporate.title")}</h1>
          <p className="max-w-xl text-lg leading-relaxed text-parchment/80">{t("corporate.intro")}</p>
          <div>
            <ButtonLink href="#quote">{t("corporate.cta")}</ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="offers-heading" className="bg-parchment-texture">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 id="offers-heading" className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("corporate.offersTitle")}</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERS.map((offer) => (
              <li key={offer} className="rounded-sm border border-gold-deep/25 bg-parchment/60 p-5">
                <h3 className="font-display text-xl font-semibold text-ink">{t(`corporate.activities.${offer}`)}</h3>
                <p className="mt-2 text-sepia">{t(`corporate.offers.${offer}`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="prices-heading" className="border-t border-gold-deep/20 bg-parchment-dark/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 id="prices-heading" className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("corporate.pricesTitle")}</h2>
          <p className="mt-2 text-sepia">{t("corporate.pricesIntro")}</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[18rem] border-collapse text-left text-ink">
              <thead>
                <tr className="border-b border-gold-deep/40">
                  <th scope="col" className="py-2 pr-4">{t("corporate.persons")}</th>
                  <th scope="col" className="py-2 pr-4">{t("corporate.selfGuided")}</th>
                  <th scope="col" className="py-2">{t("corporate.guided")}</th>
                </tr>
              </thead>
              <tbody>
                {pricing.tiers.map((tier) => (
                  <tr key={tier.persons} className="border-b border-gold-deep/15">
                    <th scope="row" className="py-2 pr-4 font-semibold tabular-nums">{tier.persons}</th>
                    <td className="py-2 pr-4 tabular-nums">{tier.selfGuidedCents === null ? t("corporate.onRequest") : euros(tier.selfGuidedCents)}</td>
                    <td className="py-2 tabular-nums">
                      {tier.guidedCents === null
                        ? t("corporate.onRequest")
                        : tier.guidedFrom
                          ? t("corporate.from", { amount: euros(tier.guidedCents) })
                          : euros(tier.guidedCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-sepia">
            {pricing.pricesIncludeVat ? t("corporate.inclVat") : t("corporate.exclVat")} {t("corporate.notIncluded")}
          </p>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="bg-parchment-texture">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 id="how-heading" className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("corporate.howTitle")}</h2>
          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["step1", "step2", "step3"] as const).map((step, index) => (
              <li key={step} className="flex gap-3 text-sepia">
                <span aria-hidden="true" className="font-display text-3xl font-semibold text-gold-deep">{index + 1}</span>
                <span>{t(`corporate.how.${step}`)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="quote" aria-labelledby="quote-heading" className="bg-night-map scroll-mt-14 text-parchment">
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <h2 id="quote-heading" className="mb-6 font-display text-3xl font-semibold sm:text-4xl">{t("corporate.form.title")}</h2>
          <QuoteForm />
        </div>
      </section>
    </article>
  );
}
