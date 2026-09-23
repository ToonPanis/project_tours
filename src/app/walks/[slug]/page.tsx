import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getButtonClasses } from "@/components/ui/ButtonLink";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { LocationPreviewList } from "@/features/walks/components/LocationPreviewList";
import { WalkCover } from "@/features/walks/components/WalkCover";
import { WalkStats } from "@/features/walks/components/WalkStats";
import { formatPrice } from "@/features/walks/utils/format-walk";
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
  const walk = await walkRepository.getWalkBySlug(slug);
  if (!walk) return { title: "Walk not found" };

  return { title: walk.title, description: walk.shortDescription };
}

export default async function WalkDetailPage({ params }: PageProps<"/walks/[slug]">) {
  // In this Next.js version, `params` is a Promise and must be awaited.
  const { slug } = await params;
  const walk = await walkRepository.getWalkBySlug(slug);

  // Renders the nearest not-found.tsx (./not-found.tsx).
  if (!walk) notFound();

  const descriptionParagraphs = walk.description.split("\n\n");

  return (
    <article className="bg-parchment-texture">
      {/* Cover + title */}
      <header className="relative text-parchment">
        <div className="relative h-56 sm:h-72">
          <WalkCover image={walk.coverImage} sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
        <div className="mx-auto -mt-24 max-w-3xl px-4 pb-6 sm:px-6 relative">
          <Link href="/walks" className="text-sm text-gold hover:underline underline-offset-4">
            ← All walks
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-parchment sm:text-5xl">
            {walk.title}
          </h1>
          <p className="mt-1 text-lg italic text-gold">{walk.tagline}</p>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 pb-16 pt-4 sm:px-6">
        {walk.contentStatus === "placeholder" && <PlaceholderNotice />}

        <WalkStats
          durationInMinutes={walk.durationInMinutes}
          distanceInMeters={walk.distanceInMeters}
          difficulty={walk.difficulty}
          locationCount={walk.locations.length}
        />

        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="font-display text-2xl font-semibold text-ink">
            About this walk
          </h2>
          <div className="mt-3 space-y-4 leading-relaxed text-sepia">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Start box */}
        <section
          aria-labelledby="start-heading"
          className="bg-night-map flex flex-col gap-4 rounded-sm p-6 text-parchment sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 id="start-heading" className="font-display text-2xl font-semibold">
              Ready to explore?
            </h2>
            <p className="text-parchment/80">
              <span className="font-display text-2xl font-semibold text-gold">
                {formatPrice(walk.price)}
              </span>{" "}
              per team
            </p>
          </div>
          {/* The walk player is the next milestone, so this button is disabled for now. */}
          <button
            type="button"
            disabled
            className={`${getButtonClasses("primary")} cursor-not-allowed opacity-60`}
          >
            Start walk · available soon
          </button>
        </section>

        <section aria-labelledby="route-heading">
          <h2 id="route-heading" className="font-display text-2xl font-semibold text-ink">
            The route
          </h2>
          <p className="mb-6 mt-1 text-sm text-sepia">
            A preview of the stops. The stories are revealed during the walk.
          </p>
          <LocationPreviewList locations={walk.locations} />
        </section>
      </div>
    </article>
  );
}
