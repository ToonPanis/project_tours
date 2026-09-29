"use client";

import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatDistance } from "@/features/walks/utils/format-walk";
import { getElapsedTime, getSessionStats } from "@/features/walk-session/logic/session-stats";
import { useScreenFocus } from "@/hooks/useScreenFocus";
import type { Translator } from "@/i18n/translate";
import type { WalkSession } from "@/types/session";
import type { WalkCopy, Walk } from "@/types/walk";

interface GuideCompletionScreenProps {
  walk: Walk;
  session: WalkSession;
  copy: WalkCopy;
  t: Translator;
  onShowRoute: () => void;
}

export function GuideCompletionScreen({ walk, session, copy, t, onShowRoute }: GuideCompletionScreenProps) {
  const stats = getSessionStats(walk, session);
  const headingRef = useScreenFocus("guide-completion");

  const items = [
    { label: copy.locationsDiscoveredLabel, value: `${stats.solvedStops} / ${stats.totalStops}` },
    ...(walk.distanceInMeters ? [{ label: t("guide.distance"), value: `± ${formatDistance(walk.distanceInMeters, t)}` }] : []),
    { label: t("guide.time"), value: getElapsedTime(session, new Date(), t) },
  ];

  return (
    <section className="flex min-h-[calc(100dvh-10rem)] flex-col gap-6 px-5 pb-8 pt-10 text-parchment">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{walk.title}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-semibold outline-none">
          {copy.completionTitle}
        </h1>
      </div>
      <p className="animate-[reveal_900ms_ease-out] font-display text-2xl italic leading-snug text-gold">
        {copy.completionMessage}
      </p>

      <dl className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-sm border border-parchment/15 p-3">
            <dt className="text-[0.65rem] uppercase tracking-wider text-parchment/60">{item.label}</dt>
            <dd className="font-display text-xl font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex flex-col gap-3">
        <Button onClick={onShowRoute} fullWidth>
          {t("guide.viewRoute")}
        </Button>
        <ButtonLink href="/walks" variant="outline" className="w-full">
          {t("guide.discoverAnotherWalk")}
        </ButtonLink>
      </div>
    </section>
  );
}
