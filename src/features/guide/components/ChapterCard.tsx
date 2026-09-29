"use client";

import { Button } from "@/components/ui/Button";
import { useScreenFocus } from "@/hooks/useScreenFocus";
import type { Translator } from "@/i18n/translate";
import type { WalkChapter } from "@/types/guide";

interface ChapterCardProps {
  chapter: WalkChapter;
  totalChapters: number;
  t: Translator;
  onContinue: () => void;
}

/** Shown when the walk enters a new area, so the walker feels the change of character. */
export function ChapterCard({ chapter, totalChapters, t, onContinue }: ChapterCardProps) {
  const headingRef = useScreenFocus(chapter.id);
  return (
    <section
      aria-labelledby="chapter-heading"
      className="flex min-h-[calc(100dvh-10rem)] animate-[reveal_700ms_ease-out] flex-col justify-center gap-6 px-6 py-10 text-parchment"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
        {t("guide.chapterOf", { number: chapter.number, total: totalChapters })}
      </p>
      <h1
        id="chapter-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-5xl font-semibold leading-tight outline-none"
      >
        {chapter.title}
      </h1>
      <div aria-hidden="true" className="h-px w-24 bg-gold/60" />
      <p className="font-display text-xl leading-relaxed text-parchment/90">{chapter.intro}</p>
      <Button onClick={onContinue} fullWidth>
        {t("common.continue")}
      </Button>
    </section>
  );
}
