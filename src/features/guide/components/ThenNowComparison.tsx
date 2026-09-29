"use client";

import Image from "next/image";
import { useState } from "react";
import { englishTranslator, type Translator } from "@/i18n/translate";
import type { ThenNowPair } from "@/types/guide";
import { ImageCredit } from "./GuideImageFigure";

/**
 * THEN / NOW: switch between a historical and a modern photo of the same place.
 * A toggle rather than a drag slider: the two photos are rarely taken from the
 * exact same spot, and a slider over mismatched photos looks broken.
 */
export function ThenNowComparison({ pair, t = englishTranslator }: { pair: ThenNowPair; t?: Translator }) {
  const [showing, setShowing] = useState<"then" | "now">("then");
  const image = showing === "then" ? pair.then : pair.now;

  return (
    <figure className="flex flex-col gap-2">
      <div role="group" aria-label={t("guide.compareThenNow")} className="grid grid-cols-2 rounded-full border border-gold-deep/40 p-1">
        {(["then", "now"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={showing === option}
            onClick={() => setShowing(option)}
            className={`min-h-11 rounded-full text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
              showing === option ? "bg-ink text-parchment" : "text-sepia"
            }`}
          >
            {option === "then" ? t("guide.thenLabel", { year: pair.then.approximateYear }) : t("guide.nowLabel")}
          </button>
        ))}
      </div>

      {/* Both images stay loaded; switching fades between them. */}
      <div className="relative overflow-hidden rounded-sm">
        {[pair.then, pair.now].map((candidate, index) => (
          <Image
            key={candidate.id}
            src={candidate.src}
            alt={candidate.alt}
            width={candidate.width}
            height={candidate.height}
            sizes="(min-width: 32rem) 32rem, 100vw"
            className={`h-auto w-full transition-opacity duration-500 ${
              index === 0 ? "" : "absolute inset-0 h-full object-cover"
            } ${candidate.id === image.id ? "opacity-100" : "opacity-0"}`}
            aria-hidden={candidate.id !== image.id}
          />
        ))}
      </div>

      <figcaption className="px-1" aria-live="polite">
        <p className="font-display text-base italic leading-snug text-ink">{image.caption}</p>
        <p className="mt-0.5 text-[0.7rem] text-sepia/75">
          <ImageCredit image={image} />
        </p>
      </figcaption>
    </figure>
  );
}
