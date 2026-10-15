"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { usePreloadMap } from "@/features/navigation/preload-map";
import { useT } from "@/i18n/client";
import { usePubGame } from "../client/usePubGame";
import type { PlayerView } from "../logic/player-view";
import type { QrCode } from "../logic/qr";
import { BeeryIntro } from "./BeeryIntro";
import { LobbyScreen } from "./LobbyScreen";
import type { PubGameTexts } from "@/data/walks/hidden-pubs/game/content/types";
import { playablePubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { PubGameTextsProvider } from "../client/texts-context";
import type { UploadMode } from "../client/upload";
import { BonusStep } from "./BonusStep";
import { CardStep } from "./CardStep";
import { FunFactStep } from "./FunFactStep";
import { PubtaskStep } from "./PubtaskStep";
import { ResultsScreen } from "./ResultsScreen";
import { ScoresButton } from "./ScoresButton";
import { TeamFinishedScreen } from "./TeamFinishedScreen";
import { DrinkStep } from "./DrinkStep";
import { EffectsBar } from "./EffectsBar";
import { EventPopup } from "./EventPopup";
import { NextCafeScreen } from "./NextCafeScreen";

interface PubGameProps {
  code: string;
  /** Join link + QR code; null once the game has started (the page then skips the QR work). */
  invite: { joinUrl: string; qrCode: QrCode } | null;
  initialView: PlayerView;
  initialVersion: number;
  /** Questions, options, hints and tasks in the player's language (chosen by the server page). */
  texts: PubGameTexts;
  /** How photos and videos are uploaded here ("blob" in production). */
  uploadMode?: UploadMode;
}

/** The round's last card as "café:card" (after a reshuffle the same card can come up at a later café). */
function lastCardOf(view: PlayerView): string | null {
  return view.team.currentCard ? `${view.team.cafeIndex}:${view.team.currentCard.cardId}` : null;
}

/** True when the café has playable questions or a pubtask photo task (else the team skips the pubtask). */
function hasPubtask(cafeId: string): boolean {
  const cafe = playablePubGameDefinition.cafes.find((candidate) => candidate.id === cafeId);
  return Boolean(cafe && (cafe.questions.length > 0 || cafe.tasks.some((task) => task.presentedAs === "pubtask")));
}

/** Remembers on this phone that the rules were shown for this game (a convenience: losing it just shows them again). */
const introKey = (code: string) => `hidden-antwerp:pub-intro:${code}`;

/** localStorage has no change events for the same tab: nothing to subscribe to. */
const noSubscription = () => () => {};

function readIntroSeen(code: string): boolean {
  try {
    return window.localStorage.getItem(introKey(code)) === "seen";
  } catch {
    return false;
  }
}

/**
 * One phone's Hidden Pubs game. Picks the screen from the live game state:
 * lobby → Beery's rules → the team's current café step → the end.
 */
export function PubGame({ code, invite, initialView, initialVersion, texts, uploadMode = "direct" }: PubGameProps) {
  const t = useT();
  const game = usePubGame(code, initialView, initialVersion);
  const { view, connection } = game;
  // Once the game runs, teams walk between cafés: the map code downloads in the background.
  usePreloadMap(view.phase === "playing");
  // Read from localStorage in the browser; null during the server render (no localStorage there).
  // useSyncExternalStore does this without a hydration mismatch.
  const storedIntroSeen = useSyncExternalStore(noSubscription, () => readIntroSeen(code), () => null);
  const [finishedIntroNow, setFinishedIntroNow] = useState(false);
  const introSeen = storedIntroSeen === null ? null : storedIntroSeen || finishedIntroNow;
  const [showRules, setShowRules] = useState(false);
  // Location allowed once in this game: the next cafés skip the explainer.
  const [gpsEnabled, setGpsEnabled] = useState(false);
  // What this phone has already looked at after the team moved on: the round's last
  // card ("On to the pubtask") and the finished pubtask with its explanations ("Continue").
  // Only a step change this phone SEES is held: a phone that opens the game (or reloads)
  // after the round or the pubtask is over goes straight to where the team is.
  const [seenLastCard, setSeenLastCard] = useState<string | null>(() =>
    initialView.team.step === "cards" ? null : lastCardOf(initialView),
  );
  const [seenPubtask, setSeenPubtask] = useState<number | null>(() =>
    initialView.team.step === "bonus" || initialView.team.step === "fun-fact" ? initialView.team.cafeIndex : null,
  );
  const lastCard = lastCardOf(view);

  function finishIntro() {
    try {
      window.localStorage.setItem(introKey(code), "seen");
    } catch {
      // Private mode: the rules may show once more next time, that's all.
    }
    setFinishedIntroNow(true);
    setShowRules(false);
  }

  let screen;
  if (view.phase === "lobby") {
    screen = <LobbyScreen code={code} invite={invite} game={game} />;
  } else if (view.phase === "finished") {
    screen = <ResultsScreen view={view} />;
  } else if (introSeen === null) {
    screen = null;
  } else if (!introSeen || showRules) {
    screen = <BeeryIntro onDone={finishIntro} />;
  } else if (view.team.step === "travelling") {
    screen = <NextCafeScreen game={game} gpsEnabled={gpsEnabled} onGpsEnabled={() => setGpsEnabled(true)} />;
  } else if (view.team.step === "drinks") {
    // Keyed by café: the drink choice starts empty at every café.
    screen = <DrinkStep key={view.team.cafeIndex} game={game} />;
  } else if (view.team.finishedAt) {
    screen = <TeamFinishedScreen view={view} />;
  } else if (view.team.step === "cards") {
    screen = <CardStep key={view.team.cafeIndex} game={game} />;
  } else if (lastCard && seenLastCard !== lastCard) {
    // The round just ended: show its last card until this player moves on.
    screen = <CardStep key={view.team.cafeIndex} game={game} onRoundSeen={() => setSeenLastCard(lastCard)} />;
  } else if (view.team.step === "pubtask") {
    screen = <PubtaskStep key={view.team.cafeIndex} game={game} />;
  } else if (hasPubtask(view.team.route[view.team.cafeIndex]) && seenPubtask !== view.team.cafeIndex) {
    // The pubtask just ended: keep its answers and explanations until this player continues.
    screen = <PubtaskStep key={view.team.cafeIndex} game={game} onDone={() => setSeenPubtask(view.team.cafeIndex)} />;
  } else if (view.team.step === "bonus") {
    screen = <BonusStep key={view.team.cafeIndex} game={game} />;
  } else {
    screen = <FunFactStep key={view.team.cafeIndex} game={game} />;
  }
  const showEffects = view.phase === "playing" && introSeen === true && !showRules;

  return (
    <PubGameTextsProvider texts={texts} uploadMode={uploadMode}>
      <nav aria-label={t("pubgame.menu.label")} className="flex items-center justify-between gap-3 px-4 pt-4 text-sm sm:px-6">
        <span className="font-mono tracking-[0.2em] text-parchment/60">{code}</span>
        <span className="flex gap-4">
          {view.phase === "playing" && (
            <>
              <ScoresButton view={view} />
              <button type="button" onClick={() => setShowRules(true)} className="min-h-11 text-gold underline-offset-4 hover:underline">
                {t("pubgame.menu.rules")}
              </button>
            </>
          )}
          {view.me.isHost && (
            <Link href={`/games/${code}/host`} className="flex min-h-11 items-center text-gold underline-offset-4 hover:underline">
              {t("pubgame.menu.host")}
            </Link>
          )}
        </span>
      </nav>

      {/* Always mounted, so screen readers announce a lost connection. */}
      <p role="status" className={connection === "online" ? "sr-only" : "mx-4 mt-3 rounded-sm bg-red-950/60 p-3 text-parchment sm:mx-6"}>
        {connection === "offline" ? t("pubgame.connection.offline") : connection === "gone" ? t("pubgame.connection.gone") : ""}
      </p>

      {showEffects && <EffectsBar game={game} />}
      {screen}
      {view.phase !== "lobby" && <EventPopup game={game} />}
    </PubGameTextsProvider>
  );
}
