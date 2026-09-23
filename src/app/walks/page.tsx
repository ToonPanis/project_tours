import type { Metadata } from "next";
import { UpcomingWalkCard } from "@/features/walks/components/UpcomingWalkCard";
import { WalkCard } from "@/features/walks/components/WalkCard";
import { walkRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Explore walks",
  description: "Choose an interactive self-guided walk through Antwerp.",
};

export default async function ExploreWalksPage() {
  // Both requests are independent, so run them in parallel.
  const [walks, upcomingWalks] = await Promise.all([
    walkRepository.getAllWalks(),
    walkRepository.getUpcomingWalks(),
  ]);

  return (
    <div className="bg-parchment-texture">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
            Antwerp
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Explore walks
          </h1>
          <p className="mt-3 text-lg text-sepia">
            Every walk is a route full of stories and challenges. Pick one and start
            whenever you like.
          </p>
        </header>

        <section aria-labelledby="available-walks" className="mt-10">
          <h2 id="available-walks" className="sr-only">
            Available walks
          </h2>
          {walks.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {walks.map((walk) => (
                <li key={walk.id} className="flex">
                  <WalkCard walk={walk} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sepia">No walks are available yet. Check back soon.</p>
          )}
        </section>

        {upcomingWalks.length > 0 && (
          <section aria-labelledby="upcoming-walks" className="mt-16">
            <h2 id="upcoming-walks" className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Coming soon
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingWalks.map((walk) => (
                <li key={walk.id} className="flex">
                  <UpcomingWalkCard walk={walk} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
