"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import { usePubGame } from "../client/usePubGame";
import type { PlayerView } from "../logic/player-view";
import { Beery } from "./Beery";
import { BeeryIntro } from "./BeeryIntro";
import { LobbyScreen } from "./LobbyScreen";
import { NextCafeScreen } from "./NextCafeScreen";

interface PubGameProps {
  code: string;
  joinUrl: string;
  initialView: PlayerView;
  initialVersion: number;
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
export function PubGame({ code, joinUrl, initialView, initialVersion }: PubGameProps) {
  const t = useT();
  const game = usePubGame(code, initialView, initialVersion);
  const { view, connection } = game;
  // Read from localStorage in the browser; null during the server render (no localStorage there).
  // useSyncExternalStore does this without a hydration mismatch.
  const storedIntroSeen = useSyncExternalStore(noSubscription, () => readIntroSeen(code), () => null);
  const [finishedIntroNow, setFinishedIntroNow] = useState(false);
  const introSeen = storedIntroSeen === null ? null : storedIntroSeen || finishedIntroNow;
  const [showRules, setShowRules] = useState(false);

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
    screen = <LobbyScreen code={code} joinUrl={joinUrl} game={game} />;
  } else if (view.phase === "finished") {
    screen = (
      <PlayScreen title={t("pubgame.finished.title")} screenId="pub-game-finished">
        <Beery>
          <p>{t("pubgame.finished.text")}</p>
        </Beery>
      </PlayScreen>
    );
  } else if (introSeen === null) {
    screen = null;
  } else if (!introSeen || showRules) {
    screen = <BeeryIntro onDone={finishIntro} />;
  } else {
    // Stages 5–7 add the drink, card, pubtask, bonus and fun-fact screens per `view.team.step`.
    screen = <NextCafeScreen view={view} />;
  }

  return (
    <>
      <nav aria-label={t("pubgame.menu.label")} className="flex items-center justify-between gap-3 px-4 pt-4 text-sm sm:px-6">
        <span className="font-mono tracking-[0.2em] text-parchment/60">{code}</span>
        <span className="flex gap-4">
          {view.phase === "playing" && (
            <button type="button" onClick={() => setShowRules(true)} className="min-h-11 text-gold underline-offset-4 hover:underline">
              {t("pubgame.menu.rules")}
            </button>
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

      {screen}
    </>
  );
}
