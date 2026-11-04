"use client";

import { useRef, useState } from "react";
import { AudioGuidePlayer } from "@/features/audio/components/AudioGuidePlayer";
import type { Translator } from "@/i18n/translate";
import type { GuideCard } from "@/types/guide";
import { GuideImageFigure } from "./GuideImageFigure";
import { StorySection } from "./StorySection";

/**
 * A few "slides" within one stop (e.g. Grote Markt, Stadhuis, Brabo at the
 * pause). One card is shown at a time; the chips at the top and the buttons
 * at the bottom switch between them.
 */
export function CardDeck({ cards, t }: { cards: GuideCard[]; t: Translator }) {
  const [index, setIndex] = useState(0);
  const deckRef = useRef<HTMLElement>(null);
  const card = cards[index];

  function goTo(nextIndex: number) {
    setIndex(nextIndex);
    // A card can be long: start the next one at its top.
    deckRef.current?.scrollIntoView?.({ block: "start", behavior: "smooth" });
  }

  return (
    <section
      ref={deckRef}
      aria-label={cards.map((candidate) => candidate.title).join(", ")}
      className="flex scroll-mt-32 flex-col gap-4"
    >
      <div className="flex flex-wrap gap-2">
        {cards.map((candidate, candidateIndex) => (
          <button
            key={candidate.id}
            type="button"
            aria-pressed={candidateIndex === index}
            onClick={() => goTo(candidateIndex)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
              candidateIndex === index ? "border-ink bg-ink text-parchment" : "border-gold-deep/40 text-sepia"
            }`}
          >
            {candidate.title}
          </button>
        ))}
      </div>

      <GuideCardArticle key={card.id} card={card} t={t} label={t("guide.cardOf", { card: index + 1, total: cards.length })} />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="min-h-11 rounded-sm border border-ink/30 px-3 font-semibold disabled:opacity-40"
        >
          ← {t("common.previous")}
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === cards.length - 1}
          className="min-h-11 rounded-sm border border-ink/30 px-3 font-semibold disabled:opacity-40"
        >
          {t("common.next")} →
        </button>
      </div>
    </section>
  );
}

interface GuideCardArticleProps {
  card: GuideCard;
  t: Translator;
  /** Small label above the title, e.g. "2 of 3". */
  label?: string;
}

/** One card: title, its own audio, image, story sections with more images woven in, "Did you know?". */
export function GuideCardArticle({ card, t, label }: GuideCardArticleProps) {
  const images = card.images ?? [];

  return (
    <article className="flex flex-col gap-5 rounded-sm border border-ink/15 bg-white/50 p-5">
      <div>
        {label && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">{label}</p>}
        <h2 className="font-display text-3xl font-semibold leading-tight">{card.title}</h2>
        {card.subtitle && <p className="font-display text-lg italic text-sepia">{card.subtitle}</p>}
      </div>
      {/* Only this slide's story: another slide has its own recording. */}
      {card.audio && <AudioGuidePlayer key={card.audio.src} track={card.audio} title={card.title} t={t} />}
      {card.image && <GuideImageFigure image={card.image} />}
      {card.sections.map((section, sectionIndex) => (
        <div key={section.heading ?? sectionIndex} className="flex flex-col gap-5">
          <StorySection section={section} t={t} />
          {images[sectionIndex] && <GuideImageFigure image={images[sectionIndex]} />}
        </div>
      ))}
      {images.slice(card.sections.length).map((image) => (
        <GuideImageFigure key={image.id} image={image} />
      ))}
      {card.didYouKnow && card.didYouKnow.length > 0 && (
        <div className="border-l-4 border-gold pl-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
            <span aria-hidden="true">💡 </span>
            {t("guide.didYouKnow")}
          </p>
          {card.didYouKnow.map((fact) => (
            <p key={fact} className="mt-1 font-display text-lg leading-snug">
              {fact}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}
