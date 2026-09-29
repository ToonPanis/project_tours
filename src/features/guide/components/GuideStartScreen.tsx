"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDistance } from "@/features/walks/utils/format-walk";
import { getSessionStats } from "@/features/walk-session/logic/session-stats";
import { englishTranslator, type Translator } from "@/i18n/translate";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

interface GuideStartScreenProps {
  walk: Walk;
  savedSession: WalkSession | null;
  /**
   * True until the saved walk has been read (in the browser, after the first render).
   * The hero already shows, so the page isn't blank while JavaScript loads, but the
   * buttons wait: starting before the save is known could overwrite it.
   */
  isLoading?: boolean;
  t?: Translator;
  onStart: () => void;
  onContinue: () => void;
  onRestart: () => void;
}

/** Whole hours from the walk's duration range (for "± 3 hours"). */
function getApproximateHours(minMinutes: number, maxMinutes: number): number {
  return Math.round((minMinutes + maxMinutes) / 2 / 60);
}

/** The hero screen of a guide walk. */
export function GuideStartScreen({
  walk,
  savedSession,
  isLoading = false,
  t = englishTranslator,
  onStart,
  onContinue,
  onRestart,
}: GuideStartScreenProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const intro = walk.guideIntro;

  const stats = [
    { icon: "⏱", label: t.plural("guide.hours", getApproximateHours(walk.estimatedDuration.minMinutes, walk.estimatedDuration.maxMinutes)) },
    ...(walk.distanceInMeters ? [{ icon: "🚶", label: `± ${formatDistance(walk.distanceInMeters, t)}` }] : []),
    { icon: "📍", label: t.plural("guide.stops", walk.locations.filter((location) => !location.isBonus).length) },
    ...(intro ? [{ icon: "🏛", label: intro.categoryLabel }] : []),
  ];

  return (
    <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-end overflow-hidden text-parchment">
      {walk.coverImage && (
        <Image
          src={walk.coverImage.src}
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover sepia-[.4]"
        />
      )}
      {/* Darken the photo so the text stays readable. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/30" />

      <div className="relative flex flex-col gap-5 px-5 pb-8 pt-40">
        <div>
          <h1 className="font-display text-5xl font-semibold uppercase leading-none tracking-wide">{walk.title}</h1>
          <p className="mt-2 font-display text-2xl italic text-gold">{walk.tagline}</p>
        </div>

        {intro && <p className="font-display text-lg leading-relaxed text-parchment/90">“{intro.quote}”</p>}

        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-2">
              <span aria-hidden="true">{stat.icon}</span>
              {stat.label}
            </li>
          ))}
        </ul>

        {isLoading ? (
          <Button disabled aria-busy="true" fullWidth>
            {t("common.loading")}
          </Button>
        ) : savedSession ? (
          <div className="flex flex-col gap-3">
            <Button onClick={onContinue} fullWidth>
              {savedSession.completedAt
                ? t("guide.viewYourWalk")
                : t("guide.continueAt", { stop: getSessionStats(walk, savedSession).currentStopNumber, total: getSessionStats(walk, savedSession).totalStops })}
            </Button>
            <Button variant="outline" onClick={() => setIsConfirmOpen(true)} fullWidth>
              {t("guide.startAgain")}
            </Button>
          </div>
        ) : (
          <Button onClick={onStart} fullWidth>
            {t("guide.startWalk")}
          </Button>
        )}

        {intro && <p className="text-center text-sm italic text-parchment/70">{intro.footnote}</p>}
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title={t("guide.startAgainTitle")}
        message={t("guide.startAgainMessage")}
        confirmLabel={t("guide.startAgainConfirm")}
        onConfirm={() => {
          setIsConfirmOpen(false);
          onRestart();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </section>
  );
}
