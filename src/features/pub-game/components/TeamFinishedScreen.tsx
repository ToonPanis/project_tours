"use client";

import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PlayerView } from "../logic/player-view";
import { Beery } from "./Beery";

/** The team finished Den Engel; the results follow when every team is done (stage 9). */
export function TeamFinishedScreen({ view }: { view: PlayerView }) {
  const t = useT();
  const scorerId = view.scoringMode === "player" ? view.me.id : view.team.id;
  const score = view.scores.find((item) => item.scorerId === scorerId)?.total ?? 0;
  return (
    <PlayScreen title={t("pubgame.teamFinished.title")} screenId="pub-game-team-finished">
      <Beery size="large">
        <p>{t("pubgame.teamFinished.text")}</p>
      </Beery>
      <p className="font-display text-3xl text-gold">{t("pubgame.pubtask.score", { points: score })}</p>
    </PlayScreen>
  );
}
