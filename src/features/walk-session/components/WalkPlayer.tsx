"use client";

import { useT } from "@/i18n/client";
import { useState } from "react";
import { GuideWalkPlayer } from "@/features/guide/components/GuideWalkPlayer";
import { PositionSimulationProvider } from "@/features/navigation/simulation/PositionSimulation";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getWalkCopy } from "../logic/walk-copy";
import { getPlaytestNavigation, PlaytestControls } from "../playtest/PlaytestControls";
import { usePlayerShell } from "../state/usePlayerShell";
import { getCurrentStop } from "../logic/current-stop";
import { StopNavigation } from "./StopNavigation";
import { ArrivedScreen } from "./ArrivedScreen";
import { ChallengeScreen } from "./ChallengeScreen";
import { CompletionScreen } from "./CompletionScreen";
import { DrinkVoting } from "./DrinkVoting";
import { FinaleScreen } from "./FinaleScreen";
import { GameIntro } from "./GameIntro";
import { RoutePanel } from "./RoutePanel";
import { PlayHeader } from "./PlayHeader";
import { SolvedScreen } from "./SolvedScreen";
import { StartScreen } from "./StartScreen";
import { StoryScreen } from "./StoryScreen";
import { TeamSetup } from "./TeamSetup";
import { VoteResult } from "./VoteResult";

/** Screens before/around the game itself (not saved; the game state is). */
type Phase = "start" | "team-setup" | "intro" | "playing";

interface WalkPlayerProps {
  walk: Walk;
}

/**
 * The whole play experience on one page. It reads the saved session and
 * shows exactly one screen for the current game status.
 */
export function WalkPlayer({ walk }: WalkPlayerProps) {
  return (
    // Lets the playtest tools feed simulated GPS positions to navigation.
    <PositionSimulationProvider>
      {/* Guide walks (no game elements) get their own screens. */}
      {walk.experience === "guide" ? <GuideWalkPlayer walk={walk} /> : <WalkPlayerContent walk={walk} />}
    </PositionSimulationProvider>
  );
}

function WalkPlayerContent({ walk }: WalkPlayerProps) {
  const t = useT();
  // Shared with the guide player: saved session, route panel, GPS flag, navigation reset.
  const shell = usePlayerShell(walk);
  const { isLoaded, session, dispatch, startNewSession } = shell;
  const [phase, setPhase] = useState<Phase>("start");
  // Remembers which stop's vote was JUST closed, so the tie animation plays
  // only then and not again after a page refresh.
  const [justVotedLocationId, setJustVotedLocationId] = useState<string | null>(null);

  const copy = getWalkCopy(walk, t);

  function restart() {
    shell.restartBase();
    setPhase("start");
  }

  if (!isLoaded) {
    return <p className="px-4 py-16 text-center text-parchment/70">{t("common.loading")}</p>;
  }

  // ── Before the game ────────────────────────────────────────────────
  if (!session || phase === "start" || phase === "team-setup") {
    if (phase === "team-setup") {
      return (
        <TeamSetup
          teamSize={walk.team}
          onComplete={(team) => {
            startNewSession(team);
            setPhase("intro");
          }}
        />
      );
    }
    return (
      <StartScreen
        walk={walk}
        savedSession={session}
        onNewAdventure={() => setPhase("team-setup")}
        onContinue={() => setPhase("playing")}
        onRestart={restart}
      />
    );
  }

  if (phase === "intro") {
    return <GameIntro walk={walk} onBegin={() => setPhase("playing")} />;
  }

  // ── The game ───────────────────────────────────────────────────────
  const stop = getCurrentStop(walk, session);
  const { location, nextLocation, progress, routeToNext } = stop;
  // A named constant keeps TypeScript's "not null" knowledge inside the function below.
  const activeSession: WalkSession = session;

  const ledger = (
    <RoutePanel walk={walk} session={session} copy={copy} open={shell.isRouteOpen} onClose={shell.closeRoute} />
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
        <CompletionScreen walk={walk} session={session} copy={copy} onOpenRoute={shell.openRoute} />
        {ledger}
        {playtestControls}
      </>
    );
  }

  // Clues in the order of the walk (not the order they were found).
  const collectedClues = (walk.clues ?? []).filter((clue) =>
    activeSession.collectedClueIds.includes(clue.id),
  );

  function renderCurrentScreen() {
    // After the last location: the final puzzle.
    if (walk.finale && activeSession.finale?.status === "active") {
      return (
        <FinaleScreen
          finale={walk.finale}
          progress={activeSession.finale}
          collectedClues={collectedClues}
          allClues={walk.clues ?? []}
          copy={copy}
          eyebrow={walk.narrative?.title ?? walk.title}
          onSubmit={(questionId, answer) =>
            dispatch({ type: "SUBMIT_FINALE_ANSWER", questionId, answer, at: new Date().toISOString() })
          }
          onRevealAnswer={(questionId) =>
            dispatch({ type: "REVEAL_FINALE_ANSWER", questionId, at: new Date().toISOString() })
          }
        />
      );
    }

    switch (progress.status) {
      case "locked":
      case "travelling":
        return <StopNavigation shell={shell} stop={stop} onArrive={() => dispatch({ type: "ARRIVE" })} />;

      case "arrived":
        return (
          <ArrivedScreen
            location={location}
            playerCount={activeSession.team.players.length}
            onStartVote={() => dispatch({ type: "START_VOTING" })}
            onSkipDrinkRound={() => {
              dispatch({ type: "SKIP_DRINK_ROUND" });
              dispatch({ type: "SHOW_STORY" });
            }}
            onContinue={() => dispatch({ type: "SHOW_STORY" })}
          />
        );

      case "voting":
        return location.drinkRound ? (
          <DrinkVoting
            key={location.id}
            drinkRound={location.drinkRound}
            team={activeSession.team}
            progress={progress}
            dispatch={dispatch}
            onVotingClosed={() => setJustVotedLocationId(location.id)}
          />
        ) : null;

      case "drink-selected":
        return location.drinkRound ? (
          <VoteResult
            key={location.id}
            drinkRound={location.drinkRound}
            progress={progress}
            copy={copy}
            playTieAnimation={progress.wasTie && justVotedLocationId === location.id}
            onContinue={() => dispatch({ type: "SHOW_STORY" })}
          />
        ) : null;

      case "story":
        return <StoryScreen location={location} onContinue={() => dispatch({ type: "START_CHALLENGE" })} />;

      case "challenge":
        return location.challenge ? (
          <ChallengeScreen
            key={location.id}
            challenge={location.challenge}
            progress={progress}
            copy={copy}
            requiredClues={(walk.clues ?? []).filter(
              (clue) =>
                location.challenge?.requiredClueIds?.includes(clue.id) &&
                activeSession.collectedClueIds.includes(clue.id),
            )}
            onSubmit={(answer) => dispatch({ type: "SUBMIT_ANSWER", answer })}
            onRevealHint={() => dispatch({ type: "REVEAL_HINT" })}
            onRevealAnswer={() => dispatch({ type: "REVEAL_ANSWER" })}
          />
        ) : null;

      case "solved":
        return (
          <SolvedScreen
            key={location.id}
            location={location}
            progress={progress}
            earnedClues={(walk.clues ?? []).filter((clue) => clue.sourceLocationId === location.id)}
            nextLocation={nextLocation}
            routeToNext={routeToNext}
            hasFinale={Boolean(walk.finale)}
            copy={copy}
            onSubmitBonus={(answer) => dispatch({ type: "SUBMIT_BONUS_ANSWER", answer })}
            onSkipBonus={() => dispatch({ type: "SKIP_BONUS" })}
            onContinue={() => dispatch({ type: "CONTINUE_TO_NEXT_LOCATION", at: new Date().toISOString() })}
            onShowRoute={shell.openRoute}
          />
        );
    }
  }

  return (
    <>
      <PlayHeader walk={walk} session={session} onOpenRoute={shell.openRoute} />
      {renderCurrentScreen()}
      {ledger}
      {playtestControls}
    </>
  );
}
