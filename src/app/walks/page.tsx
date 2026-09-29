import type { Metadata } from "next";
import { baseOpenGraph } from "@/lib/shared-metadata";
import { UpcomingWalkCard } from "@/features/walks/components/UpcomingWalkCard";
import { WalkCard } from "@/features/walks/components/WalkCard";
import { getTranslator } from "@/i18n/server";
import { walkRepository } from "@/lib/repositories";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.walksTitle"),
    description: t("meta.walksDescription"),
    openGraph: { ...baseOpenGraph(t.locale), title: t("meta.walksTitle"), description: t("meta.walksDescription") },
  };
}

export default async function ExploreWalksPage() {
  const t = await getTranslator();
  // Both requests are independent, so run them in parallel.
  const [walks, upcomingWalks] = await Promise.all([
    walkRepository.getAllWalks(t.locale),
    walkRepository.getUpcomingWalks(t.locale),
  ]);

  return (
    <div className="bg-parchment-texture">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
            {t("walks.explore.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{t("walks.explore.title")}</h1>
          <p className="mt-3 text-lg text-sepia">{t("walks.explore.intro")}</p>
        </header>

        <section aria-labelledby="available-walks" className="mt-10">
          <h2 id="available-walks" className="sr-only">
            {t("walks.explore.availableWalks")}
          </h2>
          {walks.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {walks.map((walk) => (
                <li key={walk.id} className="flex">
                  <WalkCard walk={walk} t={t} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sepia">{t("walks.explore.empty")}</p>
          )}
        </section>

        {upcomingWalks.length > 0 && (
          <section aria-labelledby="upcoming-walks" className="mt-16">
            <h2 id="upcoming-walks" className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {t("walks.explore.comingSoon")}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingWalks.map((walk) => (
                <li key={walk.id} className="flex">
                  <UpcomingWalkCard walk={walk} t={t} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
