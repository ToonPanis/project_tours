import { ButtonLink } from "@/components/ui/ButtonLink";
import { HowItWorksSteps, type HowItWorksStep } from "@/features/walks/components/HowItWorksSteps";
import { WalkCard } from "@/features/walks/components/WalkCard";
import { getTranslator } from "@/i18n/server";
import { walkRepository } from "@/lib/repositories";

export default async function HomePage() {
  const t = await getTranslator();
  const walks = await walkRepository.getAllWalks(t.locale);
  const featuredWalk = walks[0];

  const steps: HowItWorksStep[] = [
    { title: t("home.steps.chooseTitle"), text: t("home.steps.chooseText") },
    { title: t("home.steps.followTitle"), text: t("home.steps.followText") },
    { title: t("home.steps.solveTitle"), text: t("home.steps.solveText") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-night-map text-parchment">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t("home.eyebrow")}</p>
          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[1.05] [overflow-wrap:anywhere] sm:text-6xl">
            {t("home.titleStart")} <span className="text-gold">{t("home.titleHighlight")}</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-parchment/80">{t("home.intro")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/walks">{t("home.exploreWalks")}</ButtonLink>
            <ButtonLink href="#how-it-works" variant="outline">
              {t("home.howItWorks")}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-parchment-texture scroll-mt-14">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("home.howItWorks")}</h2>
          <div className="mt-8">
            <HowItWorksSteps steps={steps} />
          </div>
        </div>
      </section>

      {/* Featured walk */}
      {featuredWalk && (
        <section className="border-t border-gold-deep/20 bg-parchment-dark/40">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
                {t("home.featured.eyebrow")}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
                {t("home.featured.title", { title: featuredWalk.title })}
              </h2>
              <p className="mt-3 text-sepia">{t("home.featured.text")}</p>
              <ButtonLink href="/walks" variant="outline-light" className="mt-6">
                {t("home.featured.seeAll")}
              </ButtonLink>
            </div>
            <WalkCard walk={featuredWalk} t={t} />
          </div>
        </section>
      )}
    </>
  );
}
