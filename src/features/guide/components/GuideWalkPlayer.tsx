"use client";

import { useState } from "react";
import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import { getDetourCost, getRouteLeg, getRouteLegToCurrent } from "@/features/navigation/logic/route-legs";
import { LedgerPanel } from "@/features/walk-session/components/LedgerPanel";
import { PlayHeader } from "@/features/walk-session/components/PlayHeader";
import { getGameCopy } from "@/features/walk-session/logic/game-copy";
import { getOrderedLocations } from "@/features/walk-session/logic/route";
import { getSessionStats } from "@/features/walk-session/logic/session-stats";
import { PlaytestControls } from "@/features/walk-session/playtest/PlaytestControls";
import { useWalkSession } from "@/features/walk-session/state/useWalkSession";
import { useT } from "@/i18n/client";
import type { Team } from "@/types/team";
import type { Walk } from "@/types/walk";
import { ChapterCard } from "./ChapterCard";
import { CollectionList } from "./CollectionList";
import { GuideCompletionScreen } from "./GuideCompletionScreen";
import { GuideStartScreen } from "./GuideStartScreen";
import { GuideStopPage, type DetourOption } from "./GuideStopPage";

/** A guide walk has no teams; one "visitor" follows the route. */
const VISITOR_TEAM: Team = { id: "visitor", name: "", players: [{ id: "visitor", name: "You" }] };

/**
 * The player for guide walks (experience: "guide"). It reuses the game's
 * session, saving, navigation, route panel and playtest tools, but replaces
 * the game screens with narrated stop pages:
 *
 *   (chapter card) → travelling → (navigation) → arrived → stop page → next stop …
 *
 * Optional (bonus) stops are offered as a choice on the stop page before
 * them; skipping one navigates straight to the stop after it.
 */
export function GuideWalkPlayer({ walk }: { walk: Walk }) {
  const { isLoaded, session, dispatch, startNewSession, resetSession } = useWalkSession(walk);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [navigationKey, setNavigationKey] = useState(0);
  // Chapter cards seen in this visit (not saved: after a reload the card simply shows again).
  const [seenChapterIds, setSeenChapterIds] = useState<string[]>([]);

  const t = useT();
  const copy = getGameCopy(walk, t);
  const orderedLocations = getOrderedLocations(walk);

  function restart() {
    resetSession();
    setIsPlaying(false);
    setIsRouteOpen(false);
    setSeenChapterIds([]);
  }

  if (!isLoaded) {
    return <p className="px-4 py-16 text-center text-parchment/70">{t("common.loading")}</p>;
  }

  if (!session || !isPlaying) {
    return (
      <GuideStartScreen
        walk={walk}
        savedSession={session}
        t={t}
        onStart={() => {
          startNewSession(VISITOR_TEAM);
          setIsPlaying(true);
        }}
        onContinue={() => setIsPlaying(true)}
        onRestart={restart}
      />
    );
  }

  const currentIndex = orderedLocations.findIndex((location) => location.id === session.currentLocationId);
  const location = orderedLocations[currentIndex];
  const nextLocation = orderedLocations[currentIndex + 1];
  const progress = session.locations[session.currentLocationId];
  const stats = getSessionStats(walk, session);
  const routeToCurrent = getRouteLegToCurrent(walk, session)?.route ?? null;
  const routeToNext = nextLocation ? (getRouteLeg(walk, location.id, nextLocation.id)?.route ?? null) : null;

  const detourOption: DetourOption | null = nextLocation?.isBonus
    ? {
        detour: nextLocation,
        cost: getDetourCost(walk, location.id, nextLocation.id),
        afterDetour: orderedLocations.slice(currentIndex + 2).find((candidate) => !candidate.isBonus),
      }
    : null;

  const chapters = walk.chapters ?? [];
  const chapterStartingHere = chapters.find((chapter) => chapter.firstLocationId === location.id);
  const isTravelling = progress.status === "travelling" || progress.status === "locked";
  const showChapterCard = isTravelling && chapterStartingHere && !seenChapterIds.includes(chapterStartingHere.id);

  /** Marks this stop as visited and moves on (or finishes the walk after the last stop). */
  function completeStop(skipBonus = false) {
    dispatch({ type: "COMPLETE_VISIT" });
    dispatch({ type: "CONTINUE_TO_NEXT_LOCATION", at: new Date().toISOString(), skipBonus });
  }

  const routePanel = (
    <LedgerPanel
      walk={walk}
      session={session}
      copy={copy}
      open={isRouteOpen}
      onClose={() => setIsRouteOpen(false)}
    >
      {walk.collection && (
        <details className="rounded-sm bg-parchment p-4 text-ink">
          <summary className="min-h-11 cursor-pointer py-2 font-display text-xl font-semibold">
            {walk.collection.title} ({walk.collection.items.length})
          </summary>
          <div className="mt-3">
            <CollectionList collection={walk.collection} chapters={chapters} t={t} headingLevel="h4" />
          </div>
        </details>
      )}
    </LedgerPanel>
  );
  const playtestControls = (
    <PlaytestControls
      walk={walk}
      session={session}
      dispatch={dispatch}
      startNewSession={startNewSession}
      onRestart={restart}
      navigation={
        progress.status === "travelling"
          ? { route: routeToCurrent, destination: location.coordinates, onReset: () => setNavigationKey((key) => key + 1) }
          : null
      }
    />
  );

  if (session.completedAt) {
    return (
      <>
        <GuideCompletionScreen walk={walk} session={session} copy={copy} t={t} onShowRoute={() => setIsRouteOpen(true)} />
        {routePanel}
        {playtestControls}
      </>
    );
  }

  return (
    <>
      <PlayHeader walk={walk} session={session} onOpenLedger={() => setIsRouteOpen(true)} />

      {showChapterCard ? (
        <ChapterCard
          chapter={chapterStartingHere}
          totalChapters={chapters.length}
          t={t}
          onContinue={() => setSeenChapterIds((ids) => [...ids, chapterStartingHere.id])}
        />
      ) : isTravelling ? (
        <NavigationScreen
          key={`${location.id}-${navigationKey}`}
          destination={location}
          route={routeToCurrent}
          gpsAlreadyEnabled={isGpsEnabled}
          onGpsEnabled={() => setIsGpsEnabled(true)}
          onArrive={() => dispatch({ type: "ARRIVE" })}
          onShowRoute={() => setIsRouteOpen(true)}
        />
      ) : location.guide ? (
        <GuideStopPage
          key={location.id}
          location={location}
          guide={location.guide}
          stopLabel={stats.isAtBonusStop ? t("guide.extraStop") : t("guide.stopOf", { stop: stats.currentStopNumber, total: stats.totalStops })}
          t={t}
          nextLocation={nextLocation}
          routeToNext={routeToNext}
          detourOption={detourOption}
          onStartWalking={() => completeStop()}
          onSkipDetour={() => completeStop(true)}
          onFinish={() => completeStop()}
        />
      ) : null}

      {routePanel}
      {playtestControls}
    </>
  );
}
