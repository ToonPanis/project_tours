"use client";

import { useT } from "@/i18n/client";
import type { PlayerView } from "../logic/player-view";
import { leaderboardRows } from "../logic/view-helpers";

/**
 * The live ranking (updated with every poll): position, name, points, cafés
 * done and approved bonus points. Equal places share a number (D27). Only
 * points and progress: never anything about drinks.
 */
export function Leaderboard({ view }: { view: PlayerView }) {
  const t = useT();
  const rows = leaderboardRows(view);
  const totalCafes = view.team.route.length;

  return (
    <ol aria-label={t("pubgame.leaderboard.label")} className="flex flex-col gap-2">
      {rows.map((row) => (
        <li
          key={row.scorerId}
          className={`flex items-center gap-3 rounded-sm border p-3 ${
            row.isOwn ? "border-gold bg-gold/15" : "border-parchment/15 bg-umber/60"
          }`}
        >
          <span
            aria-hidden="true"
            // The body font: in the display font an old-style "1" looks like an "I".
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold tabular-nums ${
              row.position === 1 ? "bg-gold text-ink" : "bg-ink/60 text-parchment"
            }`}
          >
            {row.position}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-display text-xl font-semibold text-parchment">
              <span className="sr-only">{row.position}. </span>
              {row.name}
              {row.isOwn && <span className="text-sm text-gold"> · {t("pubgame.leaderboard.own")}</span>}
            </span>
            <span className="text-xs text-parchment/70">
              {view.scoringMode === "player"
                ? t("pubgame.leaderboard.detailsPlayer", { bonus: row.bonusPoints })
                : t("pubgame.leaderboard.details", { done: row.cafesCompleted, total: totalCafes, bonus: row.bonusPoints })}
            </span>
          </span>
          <span className="shrink-0 text-right font-semibold text-gold">{t.plural("pubgame.leaderboard.points", row.total)}</span>
        </li>
      ))}
    </ol>
  );
}
