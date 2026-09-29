"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useScreenFocus } from "@/hooks/useScreenFocus";
import { formatWalkingDistance, formatWalkingTime } from "@/features/navigation/logic/maneuver-display";
import type { DetourCost } from "@/features/navigation/logic/route-legs";
import type { Translator } from "@/i18n/translate";
import type { GuideClosing, GuideStopContent } from "@/types/guide";
import type { WalkLocation } from "@/types/location";
import type { WalkingRoute } from "@/types/navigation";
import { getReadingMinutes } from "../logic/reading-time";
import { CardDeck } from "./CardDeck";
import { CollectionItemCard } from "./CollectionItemCard";
import { GlossaryList } from "./GlossaryList";
import { GuideImageFigure } from "./GuideImageFigure";
import { InfoBoxView } from "./InfoBoxView";
import { SearchTaskView } from "./SearchTaskView";
import { StatusBadge } from "./StatusBadge";
import { StorySection } from "./StorySection";
import { ThenNowComparison } from "./ThenNowComparison";

/** The next stop is an optional detour: the walker chooses. */
export interface DetourOption {
  detour: WalkLocation;
  cost: DetourCost | null;
  /** The next main stop, reached when the detour is skipped (none at the very end). */
  afterDetour: WalkLocation | undefined;
}

interface GuideStopPageProps {
  location: WalkLocation;
  guide: GuideStopContent;
  /** E.g. "Stop 3 of 33" or "Extra stop". */
  stopLabel: string;
  t: Translator;
  nextLocation: WalkLocation | undefined;
  routeToNext: WalkingRoute | null;
  detourOption: DetourOption | null;
  onStartWalking: () => void;
  onSkipDetour: () => void;
  onFinish: () => void;
}


/**
 * One stop of a guide walk, as a long, calm reading page on "paper". Every
 * block below is optional and only shown when the stop has data for it:
 *
 *   header (drawing or photo, status) → what you see → pause → search task →
 *   story → slides → terms → then & now → look at this → did you know? →
 *   vanished gates nearby → practical info → sources → the way on.
 */
export function GuideStopPage({
  location,
  guide,
  stopLabel,
  t,
  nextLocation,
  routeToNext,
  detourOption,
  onStartWalking,
  onSkipDetour,
  onFinish,
}: GuideStopPageProps) {
  // A new stop starts at the top, and screen readers announce its name.
  const headingRef = useScreenFocus(location.id);
  const task = guide.searchTask;
  // The story waits for the task when it would give the answer away.
  const [isStoryVisible, setIsStoryVisible] = useState(!task?.hideStoryUntilDone);

  // Search tasks show their own drawings; otherwise the first drawing is the hero.
  const featuredItems = task ? [] : (guide.featuredItems ?? []);
  const [heroDrawing, ...otherDrawings] = featuredItems;
  const heroPhoto = heroDrawing ? undefined : guide.images[0];
  const otherImages = heroDrawing ? guide.images : guide.images.slice(1);
  const gateNumbers = (guide.featuredItems ?? []).flatMap((item) => (item.number !== undefined ? [item.number] : []));
  const pauseBoxes = (guide.infoBoxes ?? []).filter((box) => box.kind === "pause");
  const practicalBoxes = (guide.infoBoxes ?? []).filter((box) => box.kind !== "pause");
  const readingMinutes = getReadingMinutes(guide);

  return (
    <article className="bg-parchment text-ink">
      {/* Header */}
      <header className="flex flex-col gap-4 px-4 pb-6 pt-6">
        {heroDrawing && <CollectionItemCard item={heroDrawing} t={t} variant="featured" preload />}
        {heroPhoto && <GuideImageFigure image={heroPhoto} preload />}
        <div>
          <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
            <span>{stopLabel}</span>
            {gateNumbers.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{t("guide.gateNumber", { numbers: gateNumbers.join(" · ") })}</span>
              </>
            )}
            {guide.status && <StatusBadge status={guide.status} t={t} />}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-1 font-display text-4xl font-semibold leading-tight outline-none"
          >
            {location.name}
          </h1>
          <p className="mt-1 font-display text-xl italic text-sepia">{guide.subtitle}</p>
          <p className="mt-3 text-sm text-sepia/80">
            <span aria-hidden="true">📍 </span>
            {location.address}
            <span aria-hidden="true"> · 📖 </span>
            <span className="sr-only">, </span>
            {t("guide.minRead", { minutes: readingMinutes })}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-8 px-4 pb-10">
        {/* What you see */}
        <div className="space-y-4 text-lg leading-relaxed">
          {featuredItems.length > 0 && (
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">{t("guide.whatYouSee")}</h2>
          )}
          {guide.introduction.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-none first-letter:text-gold-deep" : ""}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* More drawings when several gates share this stop */}
        {otherDrawings.map((item) => (
          <CollectionItemCard key={item.id} item={item} t={t} variant="featured" />
        ))}

        {pauseBoxes.map((box) => (
          <InfoBoxView key={box.title} box={box} t={t} />
        ))}

        {task && (
          <SearchTaskView
            task={task}
            t={t}
            onAllRevealed={() => setIsStoryVisible(true)}
            onSkip={isStoryVisible ? undefined : () => setIsStoryVisible(true)}
          />
        )}

        {isStoryVisible && (
          <>
            {/* The story, with the other images woven in */}
            {guide.sections.map((section, index) => (
              <div key={section.heading ?? index} className="flex flex-col gap-8">
                <StorySection section={section} t={t} />
                {otherImages[index] && <GuideImageFigure image={otherImages[index]} />}
              </div>
            ))}
            {otherImages.slice(guide.sections.length).map((image) => (
              <GuideImageFigure key={image.id} image={image} />
            ))}

            {guide.cards && guide.cards.length > 0 && <CardDeck cards={guide.cards} t={t} />}

            {guide.glossary && guide.glossary.length > 0 && <GlossaryList terms={guide.glossary} t={t} />}

            {(guide.thenAndNow || guide.thenNow) && (
              <section aria-labelledby={`${location.id}-then-now`} className="flex flex-col gap-4">
                <h2 id={`${location.id}-then-now`} className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
                  <span aria-hidden="true">🕰 </span>
                  {t("guide.thenAndNow")}
                </h2>
                {guide.thenAndNow?.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {guide.thenNow && <ThenNowComparison pair={guide.thenNow} t={t} />}
              </section>
            )}

            {guide.lookAt && guide.lookAt.length > 0 && (
              <aside aria-labelledby={`${location.id}-look`} className="rounded-sm border border-ink/15 p-5">
                <h2 id={`${location.id}-look`} className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
                  <span aria-hidden="true">👀 </span>
                  {t("guide.lookAtThis")}
                </h2>
                <div className="mt-3 space-y-4">
                  {guide.lookAt.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                      <p className="mt-1 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </aside>
            )}

            {guide.didYouKnow.length > 0 && (
              <aside aria-labelledby={`${location.id}-dyk`} className="rounded-sm border-l-4 border-gold bg-parchment-dark/70 p-5">
                <h2 id={`${location.id}-dyk`} className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
                  <span aria-hidden="true">💡 </span>
                  {t("guide.didYouKnow")}
                </h2>
                <ul className="mt-3 space-y-3">
                  {guide.didYouKnow.map((fact) => (
                    <li key={fact} className="font-display text-lg leading-snug">
                      {fact}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {guide.vanishedNearby && guide.vanishedNearby.length > 0 && (
              <section aria-labelledby={`${location.id}-vanished`} className="flex flex-col gap-4">
                <div>
                  <h2 id={`${location.id}-vanished`} className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
                    {t("guide.vanishedNearbyTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-sepia">{t("guide.vanishedNearbyIntro")}</p>
                </div>
                <ul className="flex flex-col gap-5">
                  {guide.vanishedNearby.map((item) => (
                    <li key={item.id}>
                      <CollectionItemCard item={item} t={t} variant="compact" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {guide.closing && <ClosingSection closing={guide.closing} t={t} />}
          </>
        )}

        {practicalBoxes.map((box) => (
          <InfoBoxView key={box.title} box={box} t={t} />
        ))}

        {/* Sources */}
        <details className="text-sm text-sepia">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold">
            {t("guide.sources")}
            {guide.verification !== "verified" ? ` · ${t("guide.reviewPending")}` : ""}
          </summary>
          <ul className="mt-1 list-inside list-disc space-y-1">
            {guide.sources.map((source) => (
              <li key={source.title} lang={source.language}>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {source.title}
                  </a>
                ) : (
                  source.title
                )}
              </li>
            ))}
          </ul>
        </details>

        {/* On to the next stop */}
        <section aria-labelledby="next-heading" className="flex flex-col gap-4 border-t border-ink/15 pt-6">
          {guide.transitionToNext && (
            <p className="font-display text-xl italic leading-relaxed text-sepia">{guide.transitionToNext}</p>
          )}
          {detourOption ? (
            <DetourChoice
              option={detourOption}
              t={t}
              onTakeDetour={onStartWalking}
              onSkipDetour={onSkipDetour}
            />
          ) : nextLocation ? (
            <>
              <div>
                <p id="next-heading" className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
                  {t("guide.next")}
                </p>
                <p className="font-display text-2xl font-semibold">{nextLocation.name}</p>
                {routeToNext && (
                  <p className="text-sepia">
                    {formatWalkingDistance(routeToNext.distanceMeters, t)} · {formatWalkingTime(routeToNext.durationSeconds, t)}
                  </p>
                )}
              </div>
              <Button variant="dark" onClick={onStartWalking} fullWidth>
                {t("guide.startWalking")}
              </Button>
            </>
          ) : (
            <>
              <h2 id="next-heading" className="sr-only">
                {t("guide.endOfWalk")}
              </h2>
              <Button variant="dark" onClick={onFinish} fullWidth>
                {t("guide.finishWalk")}
              </Button>
            </>
          )}
        </section>
      </div>
    </article>
  );
}

interface DetourChoiceProps {
  option: DetourOption;
  t: Translator;
  onTakeDetour: () => void;
  onSkipDetour: () => void;
}

/** "Extra poort bekijken" or "Route verderzetten", with the extra distance and time. */
function DetourChoice({ option, t, onTakeDetour, onSkipDetour }: DetourChoiceProps) {
  const { detour, cost, afterDetour } = option;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-sm border border-dashed border-gold-deep/60 p-4">
        <p id="next-heading" className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
          {t("guide.optionalDetour")}
        </p>
        <p className="font-display text-2xl font-semibold">{detour.name}</p>
        {detour.guide && <p className="text-sepia">{detour.guide.subtitle}</p>}
        {cost && (
          <p className="mt-1 font-semibold">
            {t("guide.detourExtra", { distance: formatWalkingDistance(cost.extraMeters, t), time: formatWalkingTime(cost.extraSeconds, t) })}
          </p>
        )}
      </div>
      <Button variant="dark" onClick={onTakeDetour} fullWidth>
        {t("guide.takeDetour")}
      </Button>
      <Button variant="outline-light" onClick={onSkipDetour} fullWidth>
        {afterDetour ? t("guide.continueRouteTo", { name: afterDetour.name }) : t("guide.finishWithoutDetour")}
      </Button>
    </div>
  );
}

/** The end of the walk: the journey in a few steps, and the final words. */
function ClosingSection({ closing, t }: { closing: GuideClosing; t: Translator }) {
  const lastLineIndex = closing.finalLines.length - 1;

  return (
    <section aria-labelledby="closing-heading" className="flex flex-col gap-5 rounded-sm bg-ink p-6 text-parchment">
      <h2 id="closing-heading" className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
        {t("guide.journeyTitle")}
      </h2>
      <ol className="flex flex-col gap-1">
        {closing.timeline.map((step, index) => (
          <li key={step} className="flex flex-col items-center text-center">
            <span className="font-display text-lg">{step}</span>
            {index < closing.timeline.length - 1 && (
              <span aria-hidden="true" className="text-gold">
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="space-y-3 font-display text-xl leading-relaxed">
        {closing.finalLines.map((line, index) => (
          <p key={line} className={index === lastLineIndex ? "text-2xl font-semibold text-gold" : ""}>
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
