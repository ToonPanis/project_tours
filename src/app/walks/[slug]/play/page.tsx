import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { walkRepository } from "@/lib/repositories";

export async function generateStaticParams() {
  const walks = await walkRepository.getAllWalks();
  return walks.map((walk) => ({ slug: walk.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/walks/[slug]/play">): Promise<Metadata> {
  const { slug } = await params;
  const walk = await walkRepository.getWalkBySlug(slug);
  return {
    title: walk ? `Play ${walk.title}` : "Walk not found",
    // Game screens are not useful search results.
    robots: { index: false },
  };
}

/**
 * Server Component: loads the walk, then hands it to the interactive
 * <WalkPlayer> (a Client Component) that runs the game in the browser.
 */
export default async function PlayWalkPage({ params }: PageProps<"/walks/[slug]/play">) {
  const { slug } = await params;
  const walk = await walkRepository.getWalkBySlug(slug);
  if (!walk) notFound();

  return (
    <div data-walk-theme={walk.theme} className="bg-night-map min-h-full">
      <div className="mx-auto max-w-lg">
        <WalkPlayer walk={walk} />
      </div>
    </div>
  );
}
