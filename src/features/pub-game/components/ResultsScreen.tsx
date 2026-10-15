"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import { shareOrCopy } from "../client/share";
import type { PlayerView } from "../logic/player-view";
import { bestAt, leaderboardRows, winners } from "../logic/view-helpers";
import { Beery } from "./Beery";
import { Leaderboard } from "./Leaderboard";

/**
 * The end (every team finished Den Engel, or the host ended the game): Beery
 * announces the winner (or a shared win, D27), the winner's tradition (D28),
 * the ranking, a few highlights (never about drinks) and a way to share the
 * result. Bonus photos still waiting for the host can change the scores: it
 * says so, and the screen updates by itself when the host reviews them.
 */
export function ResultsScreen({ view }: { view: PlayerView }) {
  const t = useT();
  const rows = leaderboardRows(view);
  const top = winners(rows);
  const pending = view.evidence.filter((item) => item.status === "pending").length;
  const [copied, setCopied] = useState(false);

  const title =
    top.length === 1
      ? t("pubgame.results.winner", { name: top[0].name })
      : t("pubgame.results.sharedWin", { names: top.map((row) => row.name).join(" & ") });

  const highlights = [
    { row: bestAt(rows, "firstAttemptCorrect"), line: (name: string, count: number) => t("pubgame.results.firstTry", { name, count }) },
    { row: bestAt(rows, "correctAnswers"), line: (name: string, count: number) => t("pubgame.results.mostCorrect", { name, count }) },
    { row: bestAt(rows, "approvedTasks"), line: (name: string, count: number) => t("pubgame.results.mostBonus", { name, count }) },
  ];

  async function share() {
    const text = [
      t("pubgame.results.shareTitle"),
      ...rows.map((row) => t("pubgame.results.shareLine", { position: row.position, name: row.name, points: row.total })),
    ].join("\n");
    const result = await shareOrCopy({ title: t("pubgame.results.shareTitle"), text }, text);
    if (result !== "shared") setCopied(result === "copied");
  }

  return (
    <PlayScreen
      eyebrow={t("pubgame.results.eyebrow")}
      title={title}
      screenId="pub-game-results"
      actions={
        <>
          <Button onClick={share} fullWidth>
            {t("pubgame.results.share")}
          </Button>
          <p role="status" className={copied ? "text-center text-sm text-gold" : "sr-only"}>
            {copied ? t("pubgame.results.copied") : ""}
          </p>
        </>
      }
    >
      <Beery size="large">
        <p>{t("pubgame.results.tradition")}</p>
      </Beery>

      {/* Always mounted: the message is announced when it appears or changes. */}
      <div role="status">
        {pending > 0 && (
          <p className="rounded-sm border border-gold/50 bg-ink/40 p-3 text-sm">{t.plural("pubgame.results.pending", pending)}</p>
        )}
      </div>

      <Leaderboard view={view} />

      {highlights.some((item) => item.row) && (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold text-parchment">{t("pubgame.results.statsTitle")}</h2>
          <ul className="flex flex-col gap-1">
            {highlights.map(
              ({ row, line }, index) =>
                row && (
                  <li key={index}>
                    <span aria-hidden="true">🏅 </span>
                    {line(
                      row.name,
                      index === 0 ? row.firstAttemptCorrect : index === 1 ? row.correctAnswers : row.approvedTasks,
                    )}
                  </li>
                ),
            )}
          </ul>
        </section>
      )}
    </PlayScreen>
  );
}
