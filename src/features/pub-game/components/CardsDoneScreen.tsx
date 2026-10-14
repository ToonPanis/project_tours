"use client";

import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PlayerView } from "../logic/player-view";
import { Beery } from "./Beery";

/** After Drunken Bastard. Stage 7 replaces this with the pubtask, bonus task and fun fact. */
export function CardsDoneScreen({ view }: { view: PlayerView }) {
  const t = useT();
  return (
    <PlayScreen
      eyebrow={t("pubgame.cards.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length })}
      title={t("pubgame.cards.title")}
      screenId={`pub-game-after-cards-${view.team.route[view.team.cafeIndex]}`}
    >
      <Beery>
        <p>{t("pubgame.cards.done")}</p>
      </Beery>
    </PlayScreen>
  );
}
