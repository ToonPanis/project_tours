"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getDetourCost } from "@/features/navigation/logic/route-legs";
import { PlayHeader } from "@/features/walk-session/components/PlayHeader";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { RoutePanel } from "@/features/walk-session/components/RoutePanel";
import { StopNavigation } from "@/features/walk-session/components/StopNavigation";
import { getCurrentStop } from "@/features/walk-session/logic/current-stop";
import { getSessionStats } from "@/features/walk-session/logic/session-stats";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { getPlaytestNavigation, PlaytestControls } from "@/features/walk-session/playtest/PlaytestControls";
import { usePlayerShell } from "@/features/walk-session/state/usePlayerShell";
import { useT } from "@/i18n/client";
import { getOrderedLocations } from "@/lib/walk-locations";
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
  // Shared with the game player: saved session, route panel, GPS flag, navigation reset.
  const shell = usePlayerShell(walk);
  const { isLoaded, session, dispatch, startNewSession } = shell;
  const [isPlaying, setIsPlaying] = useState(false);
  // Chapter cards seen in this visit (not saved: after a reload the card simply shows again).
  const [seenChapterIds, setSeenChapterIds] = useState<string[]>([]);

  const t = useT();
  const copy = getWalkCopy(walk, t);
  const orderedLocations = getOrderedLocations(walk);

  function restart() {
    shell.restartBase();
    setIsPlaying(false);
    setSeenChapterIds([]);
  }

  if (!session || !isPlaying) {
    return (
      <GuideStartScreen
        walk={walk}
        savedSession={session}
        // Until the save is read (also during server rendering) the hero shows without buttons.
        isLoading={!isLoaded}
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

  const stop = getCurrentStop(walk, session);
  const { index: currentIndex, location, nextLocation, progress, routeToNext } = stop;
  const stats = getSessionStats(walk, session);

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
    <RoutePanel
      walk={walk}
      session={session}
      copy={copy}
      open={shell.isRouteOpen}
      onClose={shell.closeRoute}
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
    </RoutePanel>
  );
  const playtestControls = (
    <PlaytestControls
      walk={walk}
      session={session}
      dispatch={dispatch}
      startNewSession={startNewSession}
      onRestart={restart}
      navigation={getPlaytestNavigation(stop, shell.resetNavigation)}
    />
  );

  if (session.completedAt) {
    return (
      <>
        <GuideCompletionScreen walk={walk} session={session} copy={copy} t={t} onShowRoute={shell.openRoute} />
        {routePanel}
        {playtestControls}
      </>
    );
  }

  return (
    <>
      <PlayHeader walk={walk} session={session} onOpenRoute={shell.openRoute} />

      {showChapterCard ? (
        <ChapterCard
          chapter={chapterStartingHere}
          totalChapters={chapters.length}
          t={t}
          onContinue={() => setSeenChapterIds((ids) => [...ids, chapterStartingHere.id])}
        />
      ) : isTravelling ? (
        <StopNavigation shell={shell} stop={stop} onArrive={() => dispatch({ type: "ARRIVE" })} />
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
      ) : (
        // A stop without its page (a data mistake; validateWalk catches it in tests):
        // never a blank screen or a dead end, the walker can always go on.
        // (PlayScreen: starts at the top and focuses the title, like every other screen.)
        <PlayScreen
          title={location.name}
          screenId={`stop-unavailable-${location.id}`}
          actions={
            <Button onClick={() => completeStop()} fullWidth>
              {t("common.continue")}
            </Button>
          }
        >
          <p className="text-parchment/80">{t("guide.stopUnavailable")}</p>
        </PlayScreen>
      )}

      {routePanel}
      {playtestControls}
    </>
  );
}
