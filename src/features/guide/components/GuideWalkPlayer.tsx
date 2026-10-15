"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getDetourCost } from "@/features/navigation/logic/route-legs";
import { usePreloadMap } from "@/features/navigation/preload-map";
import { QuestBriefing } from "@/features/quests/components/QuestBriefing";
import { QuestFoundScreen } from "@/features/quests/components/QuestFoundScreen";
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
import type { Walk } from "@/types/walk";
import { ChapterCard } from "./ChapterCard";
import { CollectionList } from "./CollectionList";
import { GuideCompletionScreen } from "./GuideCompletionScreen";
import { GuideStartScreen } from "./GuideStartScreen";
import { GuideStopPage, type DetourOption } from "./GuideStopPage";

/**
 * The player for guide walks (experience: "guide"): the shared session, saving,
 * navigation, route panel and playtest tools, with narrated stop pages:
 *
 *   (chapter card) → travelling → (navigation) → arrived → stop page → next stop …
 *
 * A stop with a quest adds Spooky, the same in look and steps for every kind of task:
 *   find the place:  briefing (popup + clue) → navigation to a search zone → found by
 *                    GPS → "you found it" popup → stop page (its real name only then)
 *   find a detail:   navigation → arrived → briefing → "I've found it" (the stop moves
 *                    on to "story", saved with the walk) → "well found" popup → stop page
 *
 * Optional (bonus) stops are offered as a choice on the stop page before
 * them; skipping one navigates straight to the stop after it.
 */
export function GuideWalkPlayer({ walk }: { walk: Walk }) {
  // Saved session, route panel, GPS flag, navigation reset.
  const shell = usePlayerShell(walk);
  const { isLoaded, session, dispatch, startNewSession } = shell;
  const [isPlaying, setIsPlaying] = useState(false);
  // Chapter cards seen in this visit (not saved: after a reload the card simply shows again).
  const [seenChapterIds, setSeenChapterIds] = useState<string[]>([]);
  // Quests whose briefing was read in this visit (like chapter cards: after a reload it shows again).
  const [briefedQuestIds, setBriefedQuestIds] = useState<string[]>([]);
  // The quest done just now: its congratulations show once. Being done itself is saved
  // with the walk (the stop is "arrived", or "story" after a detail was found), so after a
  // reload the story is simply open.
  const [justFoundQuestId, setJustFoundQuestId] = useState<string | null>(null);

  const t = useT();
  // While the start screen or a stop is read, the map code downloads in the background.
  usePreloadMap();
  const copy = getWalkCopy(walk, t);
  const orderedLocations = getOrderedLocations(walk);

  function restart() {
    shell.restartBase();
    setIsPlaying(false);
    setSeenChapterIds([]);
    setBriefedQuestIds([]);
    setJustFoundQuestId(null);
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
          startNewSession();
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
  const quest = location.quest;
  const searchQuest = quest?.type === "location" ? quest : undefined;
  // Find the place: the briefing comes before the navigation (once per visit).
  const showSearchBriefing = isTravelling && searchQuest && !briefedQuestIds.includes(location.id);
  // Find a detail: the task comes right after arriving, until the walker has found it.
  const showDiscoveryTask = quest?.type === "discovery" && progress.status === "arrived";
  const showQuestFound = !isTravelling && quest && justFoundQuestId === location.id;

  function arrive() {
    if (searchQuest) setJustFoundQuestId(location.id);
    dispatch({ type: "ARRIVE" });
  }

  /** "I've found it": remembered with the walk (the stop moves on to its story). */
  function completeDiscovery() {
    setJustFoundQuestId(location.id);
    dispatch({ type: "SHOW_STORY" });
  }

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
      ) : showSearchBriefing ? (
        <QuestBriefing
          stopId={location.id}
          quest={searchQuest}
          t={t}
          actionLabel={t("quest.startSearching")}
          onAction={() => setBriefedQuestIds((ids) => [...ids, location.id])}
        />
      ) : isTravelling ? (
        <StopNavigation shell={shell} stop={stop} onArrive={arrive} />
      ) : showQuestFound ? (
        <QuestFoundScreen
          t={t}
          title={quest.type === "location" ? t("quest.foundTitle") : t("quest.discoveryFoundTitle")}
          body={quest.type === "location" ? t("quest.foundBody") : undefined}
          onDiscover={() => setJustFoundQuestId(null)}
        />
      ) : showDiscoveryTask ? (
        <QuestBriefing stopId={location.id} quest={quest} t={t} actionLabel={t("quest.foundIt")} onAction={completeDiscovery} />
      ) : location.guide ? (
        <GuideStopPage
          key={location.id}
          // Found: now the stop's real name and address may show.
          location={searchQuest ? { ...location, name: searchQuest.revealedName, address: searchQuest.revealedAddress } : location}
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
