import type { Metadata } from "next";
import { baseOpenGraph, PROTOTYPE_ROBOTS } from "@/lib/shared-metadata";
import { notFound } from "next/navigation";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { getTranslator } from "@/i18n/server";
import { getWalk } from "@/lib/repositories";

// No generateStaticParams: these pages read the language cookie, so Next.js renders
// them per request (in the visitor's language) instead of at build time.

export async function generateMetadata({
  params,
}: PageProps<"/walks/[slug]/play">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslator();
  const walk = await getWalk(slug, t.locale);
  const title = walk ? t("meta.playTitle", { title: walk.title }) : t("meta.walkNotFound");
  return {
    title,
    openGraph: { ...baseOpenGraph(t.locale), title },
    // Game screens are not useful search results. Setting `robots` here replaces the
    // layout's whole `robots`, so the shared rule keeps "nofollow" too.
    // AT LAUNCH: keep `{ index: false }` here when the site-wide rule goes.
    robots: PROTOTYPE_ROBOTS,
  };
}

/**
 * Server Component: loads the walk, then hands it to the interactive
 * <WalkPlayer> (a Client Component) that runs the game in the browser.
 */
export default async function PlayWalkPage({ params }: PageProps<"/walks/[slug]/play">) {
  const { slug } = await params;
  const t = await getTranslator();
  // The walk arrives with its texts in the visitor's language. Switching the
  // language re-renders this page; the saved progress (by stop id) stays.
  const walk = await getWalk(slug, t.locale);
  if (!walk) notFound();

  return (
    <div data-walk-theme={walk.theme} className="bg-night-map min-h-full">
      <div className="mx-auto max-w-lg">
        <WalkPlayer walk={walk} />
      </div>
    </div>
  );
}
