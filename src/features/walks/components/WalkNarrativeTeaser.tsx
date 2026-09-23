import type { WalkNarrative } from "@/types/walk";

interface WalkNarrativeTeaserProps {
  narrative: WalkNarrative;
}

/**
 * The walk's fictional storyline. Always labelled as fiction, so it's never
 * confused with real history.
 */
export function WalkNarrativeTeaser({ narrative }: WalkNarrativeTeaserProps) {
  return (
    <section
      aria-labelledby="narrative-heading"
      className="relative border border-gold-deep/30 bg-parchment-dark/50 px-5 py-6 sm:px-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
        The story · fiction
      </p>
      <h2 id="narrative-heading" className="mt-1 font-display text-2xl font-semibold italic text-ink">
        {narrative.title}
      </h2>
      <p className="mt-2 font-display text-lg leading-relaxed text-sepia">{narrative.premise}</p>
    </section>
  );
}
