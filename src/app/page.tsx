import { ButtonLink } from "@/components/ui/ButtonLink";
import { WalkCard } from "@/features/walks/components/WalkCard";
import { walkRepository } from "@/lib/repositories";

const steps = [
  {
    title: "Choose your walk",
    text: "Pick a route and start it on your phone. No app to download.",
  },
  {
    title: "Follow the trail",
    text: "Walk from stop to stop. Each location reveals its story when you arrive.",
  },
  {
    title: "Solve & discover",
    text: "Crack riddles and answer questions to unlock the next hidden place.",
  },
];

export default async function HomePage() {
  const walks = await walkRepository.getAllWalks();
  const featuredWalk = walks[0];

  return (
    <>
      {/* Hero */}
      <section className="bg-night-map text-parchment">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Interactive city walks
          </p>
          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">
            Antwerp keeps its secrets. <span className="text-gold">Come find them.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-parchment/80">
            Self-guided walks full of stories, riddles and hidden places. Part city guide,
            part treasure hunt, all in your mobile browser.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/walks">Explore walks</ButtonLink>
            <ButtonLink href="#how-it-works" variant="outline">
              How it works
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-parchment-texture scroll-mt-14">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-gold-deep/40 pt-4">
                <p aria-hidden="true" className="font-display text-4xl font-semibold text-gold-deep">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sepia">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured walk */}
      {featuredWalk && (
        <section className="border-t border-gold-deep/20 bg-parchment-dark/40">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
                Featured walk
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Start with {featuredWalk.title}
              </h2>
              <p className="mt-3 text-sepia">
                Our first route. More walks through Antwerp&apos;s pubs, dark history and
                art are on the way.
              </p>
              <ButtonLink href="/walks" variant="outline-light" className="mt-6">
                See all walks
              </ButtonLink>
            </div>
            <WalkCard walk={featuredWalk} />
          </div>
        </section>
      )}
    </>
  );
}
