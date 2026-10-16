import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { UpcomingWalkCard } from "@/features/walks/components/UpcomingWalkCard";
import { WalkCard } from "@/features/walks/components/WalkCard";
import { getTranslator } from "@/i18n/server";
import { canonicalUrl } from "@/lib/canonical";
import { walkRepository } from "@/lib/repositories";
import { baseOpenGraph } from "@/lib/shared-metadata";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const canonical = canonicalUrl("/about");
  return {
    title: t("pages.about.meta.title"),
    description: t("pages.about.meta.description"),
    alternates: canonical ? { canonical } : undefined,
    openGraph: { ...baseOpenGraph(t.locale), title: t("pages.about.meta.title"), description: t("pages.about.meta.description"), url: canonical },
  };
}

const WHY = ["pace", "stories", "gps", "groups", "noGuide", "languages"] as const;

/**
 * /about (frontend redesign, brief phase 3): who Hidden Antwerp is, the real
 * walks (from the walk repository, with their own images), why book, the
 * partner offer and the future plans (clearly labelled as plans).
 * Server Component: no JavaScript is sent for this page.
 */
export default async function AboutPage() {
  const t = await getTranslator();
  const [walks, upcoming] = await Promise.all([walkRepository.getAllWalks(t.locale), walkRepository.getUpcomingWalks(t.locale)]);
  const base = canonicalUrl("");
  // Organization data for search engines: only facts that are true today (name, site, postal address).
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    ...(base ? { url: base } : {}),
    address: { "@type": "PostalAddress", streetAddress: "Melkmarkt 35", postalCode: "2000", addressLocality: "Antwerpen", addressCountry: "BE" },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />

      <section className="bg-night-map text-parchment">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t("pages.about.eyebrow")}</p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] [overflow-wrap:anywhere] sm:text-6xl">{t("pages.about.title")}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-parchment/85">{t("pages.about.intro")}</p>
          <div>
            <ButtonLink href="/walks">{t("pages.about.cta")}</ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="story-heading" className="bg-parchment-texture">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_2fr]">
          <h2 id="story-heading" className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {t("pages.about.story.title")}
          </h2>
          <div className="flex flex-col gap-4 text-lg leading-relaxed text-sepia">
            <p>{t("pages.about.story.p1")}</p>
            <p>{t("pages.about.story.p2")}</p>
            <p>{t("pages.about.story.p3")}</p>
            <p>{t("pages.about.story.p4")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="experiences-heading" className="border-t border-gold-deep/20 bg-parchment-dark/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 id="experiences-heading" className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {t("pages.about.experiences.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-sepia">{t("pages.about.experiences.intro")}</p>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {walks.map((walk) => (
              <li key={walk.slug}>
                <WalkCard walk={walk} t={t} />
              </li>
            ))}
          </ul>
          {upcoming.length > 0 && (
            <>
              <h3 className="mt-12 font-display text-2xl font-semibold text-ink">{t("pages.about.experiences.upcoming")}</h3>
              <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {upcoming.map((walk) => (
                  <li key={walk.slug}>
                    <UpcomingWalkCard walk={walk} t={t} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="why-heading" className="bg-night-map text-parchment">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 id="why-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            {t("pages.about.why.title")}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((key) => (
              <li key={key} className="rounded-sm border border-gold/25 bg-ink/40 p-5">
                <h3 className="font-display text-xl font-semibold text-gold">{t(`pages.about.why.${key}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-parchment/85">{t(`pages.about.why.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="partners-heading" className="bg-parchment-texture">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <h2 id="partners-heading" className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              {t("pages.about.partners.title")}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-sepia">{t("pages.about.partners.text")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/corporate" variant="outline-light">
                {t("pages.about.partners.corporate")}
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline-light">
                {t("pages.about.partners.contact")}
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-sm border border-gold-deep/25 bg-parchment/60 p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">{t("pages.about.vision.title")}</h2>
            <p className="mt-3 leading-relaxed text-sepia">{t("pages.about.vision.text")}</p>
            <p className="mt-3 text-sm font-semibold text-gold-deep">{t("pages.about.vision.note")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="closing-heading" className="bg-night-map text-parchment">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-16 sm:px-6">
          <h2 id="closing-heading" className="font-display text-4xl font-semibold [overflow-wrap:anywhere]">
            {t("pages.about.closing.title")}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/walks">{t("pages.about.closing.walks")}</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              {t("pages.about.closing.contact")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
