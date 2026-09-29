"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Translator } from "@/i18n/translate";
import type { SearchTask, SearchTaskItem } from "@/types/guide";
import { CollectionItemLabel } from "./CollectionItemCard";
import { ImageCredit } from "./GuideImageFigure";

interface ItemProgress {
  hintsShown: number;
  revealed: boolean;
  found: boolean;
}

const START: ItemProgress = { hintsShown: 0, revealed: false, found: false };

interface SearchTaskViewProps {
  task: SearchTask;
  t: Translator;
  /** Called once every solution has been seen (found or revealed). */
  onAllRevealed?: () => void;
  /** Shown as "skip" when the story waits for this task. */
  onSkip?: () => void;
}

/**
 * Look, compare, then reveal. Never blocks the walk: hints and the solution
 * are always one tap away, and nothing is scored. The progress is kept in
 * memory only (a reload simply starts the task again).
 */
export function SearchTaskView({ task, t, onAllRevealed, onSkip }: SearchTaskViewProps) {
  const [progress, setProgress] = useState<Record<string, ItemProgress>>({});
  // The item whose solution was just shown: the button that was pressed disappears,
  // so focus moves to the solution (screen readers read it, keyboard users keep their place).
  const [justRevealedId, setJustRevealedId] = useState<string | null>(null);
  const revealedSolutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (justRevealedId) revealedSolutionRef.current?.focus();
  }, [justRevealedId]);

  function update(item: SearchTaskItem, changes: Partial<ItemProgress>) {
    const next = { ...progress, [item.id]: { ...(progress[item.id] ?? START), ...changes } };
    setProgress(next);
    if (changes.revealed) setJustRevealedId(item.id);
    if (task.items.every((candidate) => next[candidate.id]?.revealed)) onAllRevealed?.();
  }

  const allRevealed = task.items.every((item) => progress[item.id]?.revealed);

  return (
    <section aria-labelledby="search-task-heading" className="flex flex-col gap-5 rounded-sm border-2 border-gold-deep/50 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
          <span aria-hidden="true">🔎 </span>
          {t("guide.searchTask")}
        </p>
        <h2 id="search-task-heading" className="font-display text-3xl font-semibold leading-tight">
          {task.title}
        </h2>
        <p className="mt-2 leading-relaxed">{task.intro}</p>
      </div>

      <ol className="flex flex-col gap-8">
        {task.items.map((item, index) => {
          const itemProgress = progress[item.id] ?? START;
          const hasMoreHints = itemProgress.hintsShown < item.hints.length;

          return (
            <li key={item.id} className="flex flex-col gap-3 border-t border-ink/15 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sepia">
                {t("guide.itemOf", { item: index + 1, total: task.items.length })}
                {itemProgress.found && <span className="ml-2 text-emerald-800">✓ {t("guide.found")}</span>}
              </p>
              <h3 className="font-display text-xl font-semibold">{item.question}</h3>

              {/* No caption and a neutral alt text: the caption would give the address away. */}
              <figure>
                <Image
                  src={item.drawing.image.src}
                  alt={`${t("guide.searchTask")}: ${item.question}`}
                  width={item.drawing.image.width}
                  height={item.drawing.image.height}
                  sizes="(min-width: 32rem) 20rem, 100vw"
                  className="mx-auto h-auto w-full max-w-xs rounded-sm border border-ink/10"
                />
                <figcaption className="mt-1 text-center text-[0.7rem] text-sepia/75">
                  <ImageCredit image={item.drawing.image} />
                </figcaption>
              </figure>

              {itemProgress.hintsShown > 0 && (
                <ul className="space-y-2">
                  {item.hints.slice(0, itemProgress.hintsShown).map((hint, hintIndex) => (
                    <li key={hint} className="rounded-sm bg-parchment-dark/70 p-3">
                      <span className="font-semibold">{t("guide.hint", { number: hintIndex + 1 })}: </span>
                      {hint}
                    </li>
                  ))}
                </ul>
              )}

              {itemProgress.revealed ? (
                <div
                  ref={item.id === justRevealedId ? revealedSolutionRef : undefined}
                  tabIndex={-1}
                  className="flex flex-col gap-2 rounded-sm bg-white/60 p-4 outline-none"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">{t("guide.solution")}</p>
                  <p className="font-display text-xl font-semibold leading-snug">{item.solution}</p>
                  <CollectionItemLabel item={item.drawing} t={t} />
                  {item.explanation.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {hasMoreHints && (
                    <Button variant="outline-light" onClick={() => update(item, { hintsShown: itemProgress.hintsShown + 1 })} fullWidth>
                      {itemProgress.hintsShown === 0 ? t("guide.showHint") : t("guide.showNextHint")}
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="dark" onClick={() => update(item, { found: true, revealed: true })}>
                      {t("guide.foundIt")}
                    </Button>
                    <Button variant="outline-light" onClick={() => update(item, { revealed: true })}>
                      {t("guide.showSolution")}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {allRevealed && task.outro && <p className="font-display text-lg italic leading-relaxed text-sepia">{task.outro}</p>}

      {onSkip && !allRevealed && (
        <div className="flex flex-col gap-2 border-t border-ink/15 pt-4">
          <p className="text-sm text-sepia">{t("guide.storyAfterTask")}</p>
          <button type="button" onClick={onSkip} className="min-h-11 self-start text-sm font-semibold underline underline-offset-4">
            {t("guide.skipTask")}
          </button>
        </div>
      )}
    </section>
  );
}
