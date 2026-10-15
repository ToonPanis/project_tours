"use client";

import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PlayerView } from "../logic/player-view";
import { Beery } from "./Beery";
import { Leaderboard } from "./Leaderboard";

/** The team finished Den Engel: its score and the live ranking until every team is done (then: ResultsScreen). */
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
      {/* Live: the other teams' progress while they finish. */}
      <Leaderboard view={view} />
    </PlayScreen>
  );
}
