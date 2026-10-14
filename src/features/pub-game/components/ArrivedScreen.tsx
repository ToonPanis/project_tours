"use client";

import { cafeName } from "@/data/walks/hidden-pubs/game/cafes";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PlayerView } from "../logic/player-view";
import { Beery } from "./Beery";

/**
 * The team has arrived at its café. Stage 6 adds the drink choice and
 * Drunken Bastard below Beery's welcome.
 */
export function ArrivedScreen({ view }: { view: PlayerView }) {
  const t = useT();
  const cafeId = view.team.route[view.team.cafeIndex];
  return (
    <PlayScreen
      eyebrow={t("pubgame.nextCafe.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length })}
      title={t("pubgame.arrived.title", { cafe: cafeName(cafeId) })}
      screenId={`pub-game-arrived-${cafeId}`}
    >
      <Beery>
        <p>{t("pubgame.arrived.text")}</p>
      </Beery>
    </PlayScreen>
  );
}
