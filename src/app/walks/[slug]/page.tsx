import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { CollectionList } from "@/features/guide/components/CollectionList";
import { HowItWorksSteps } from "@/features/walks/components/HowItWorksSteps";
import { LocationPreviewList } from "@/features/walks/components/LocationPreviewList";
import { WalkCover } from "@/features/walks/components/WalkCover";
import { WalkHighlights } from "@/features/walks/components/WalkHighlights";
import { WalkNarrativeTeaser } from "@/features/walks/components/WalkNarrativeTeaser";
import { WalkPracticalInfo } from "@/features/walks/components/WalkPracticalInfo";
import { WalkStats } from "@/features/walks/components/WalkStats";
import { formatPrice } from "@/features/walks/utils/format-walk";
import { getHowItWorksSteps } from "@/features/walks/utils/walk-content";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { getTranslator } from "@/i18n/server";
import { walkRepository } from "@/lib/repositories";

// Pre-render a page for every known walk at build time.
export async function generateStaticParams() {
  const walks = await walkRepository.getAllWalks();
  return walks.map((walk) => ({ slug: walk.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/walks/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslator();
  const walk = await walkRepository.getWalkBySlug(slug, t.locale);
  if (!walk) return { title: t("meta.walkNotFound") };

  return {
    title: walk.title,
    description: walk.shortDescription,
    openGraph: { title: walk.title, description: walk.shortDescription },
  };
}

export default async function WalkDetailPage({ params }: PageProps<"/walks/[slug]">) {
  // In this Next.js version, `params` is a Promise and must be awaited.
  const { slug } = await params;
  const t = await getTranslator();
  const walk = await walkRepository.getWalkBySlug(slug, t.locale);

  // Renders the nearest not-found.tsx (./not-found.tsx).
  if (!walk) notFound();

  const descriptionParagraphs = walk.description.split("\n\n");
  const mainLocationCount = walk.locations.filter((location) => !location.isBonus).length;
  const howItWorksSteps = getHowItWorksSteps(walk, t).map((title) => ({ title }));

  // Every section below is shown only when the walk has data for it,
  // so any walk can use this page without walk-specific conditions.
  return (
    // `data-walk-theme` swaps the color tokens (see globals.css).
    <article data-walk-theme={walk.theme} className="bg-parchment-texture">
      {/* Cover + title */}
      <header className="relative bg-ink text-parchment">
        <div className="relative h-56 sm:h-72">
          <WalkCover image={walk.coverImage} sizes="100vw" preload />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
        <div className="relative mx-auto -mt-24 max-w-3xl px-4 pb-6 sm:px-6">
          <Link href="/walks" className="text-sm text-gold underline-offset-4 hover:underline">
            {t("walks.detail.allWalks")}
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-parchment sm:text-5xl">
            {walk.title}
          </h1>
          <p className="mt-1 text-lg italic text-gold">{walk.tagline}</p>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 pb-16 pt-4 sm:px-6">
        {walk.contentStatus === "placeholder" && <PlaceholderNotice t={t} />}

        <div className="space-y-6">
          <WalkStats
            estimatedDuration={walk.estimatedDuration}
            distanceInMeters={walk.distanceInMeters}
            difficulty={walk.difficulty}
            locationCount={mainLocationCount}
            t={t}
          />
          <WalkPracticalInfo items={walk.practicalInfo ?? []} languages={walk.languages} t={t} />
        </div>

        <DetailSection id="about" title={t("walks.detail.about")}>
          <div className="space-y-4 leading-relaxed text-sepia">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </DetailSection>

        {walk.narrative && <WalkNarrativeTeaser narrative={walk.narrative} t={t} />}

        {/* Start box */}
        <section
          aria-labelledby="start-heading"
          className="bg-night-map flex flex-col gap-4 rounded-sm p-6 text-parchment sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 id="start-heading" className="font-display text-2xl font-semibold">
              {t("walks.detail.readyTitle")}
            </h2>
            <p className="text-parchment/80">
              <span className="font-display text-2xl font-semibold text-gold">
                {formatPrice(walk.price, `${t.locale}-BE`)}
              </span>{" "}
              {t("walks.detail.perTeam")}
            </p>
          </div>
          <ButtonLink href={`/walks/${walk.slug}/play`}>{getWalkCopy(walk, t).startLabel}</ButtonLink>
        </section>

        {walk.highlights && walk.highlights.length > 0 && (
          <DetailSection id="expect" title={t("walks.detail.whatToExpect")}>
            <WalkHighlights highlights={walk.highlights} />
          </DetailSection>
        )}

        <DetailSection id="how" title={t("walks.detail.howItWorks")}>
          <HowItWorksSteps steps={howItWorksSteps} />
        </DetailSection>

        <DetailSection
          id="route"
          title={t("walks.detail.route")}
          intro={t("walks.detail.routeIntro")}
        >
          <LocationPreviewList walk={walk} t={t} />
        </DetailSection>

        {walk.collection && (
          <DetailSection id="collection" title={walk.collection.title}>
            <CollectionList
              collection={walk.collection}
              chapters={walk.chapters ?? []}
              t={t}
            />
          </DetailSection>
        )}
      </div>
    </article>
  );
}

interface DetailSectionProps {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

/** A titled section of the detail page, with an accessible heading link. */
function DetailSection({ id, title, intro, children }: DetailSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="font-display text-2xl font-semibold text-ink">
        {title}
      </h2>
      {intro && <p className="mt-1 text-sm text-sepia">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
