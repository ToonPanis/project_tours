"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { WalkSession } from "@/types/session";
import type { GameCopy, Walk } from "@/types/walk";
import { getElapsedTime, getSessionStats } from "../logic/session-stats";
import { PlayScreen } from "./PlayScreen";

interface CompletionScreenProps {
  walk: Walk;
  session: WalkSession;
  copy: GameCopy;
  onOpenLedger: () => void;
}

/**
 * The finale. Deliberately shows stops, clues, challenges and time, and never
 * how many drinks were ordered.
 */
export function CompletionScreen({ walk, session, copy, onOpenLedger }: CompletionScreenProps) {
  const [shareFallbackText, setShareFallbackText] = useState<string | null>(null);

  const stats = getSessionStats(walk, session);
  const elapsedTime = getElapsedTime(session, new Date());
  const playerNames = session.team.players.map((player) => player.name).join(", ");

  const shareText = `We solved ${walk.narrative?.title ?? walk.title} with Hidden Antwerp: ${stats.solvedStops}/${stats.totalStops} stops in ${elapsedTime}!`;

  async function shareResult() {
    // The Web Share API only works on HTTPS pages. Otherwise, show the text to copy.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: walk.title, text: shareText });
        return;
      } catch {
        // Cancelled or not allowed: fall through to the fallback.
      }
    }
    setShareFallbackText(shareText);
  }

  const statItems = [
    { label: "Stops discovered", value: `${stats.solvedStops} / ${stats.totalStops}` },
    ...(stats.totalClues > 0
      ? [{ label: "Clues collected", value: `${stats.collectedClues} / ${stats.totalClues}` }]
      : []),
    { label: "Challenges completed", value: String(stats.challengesCompleted) },
    { label: "Time", value: elapsedTime },
  ];

  return (
    <PlayScreen
      eyebrow={walk.narrative?.title ?? walk.title}
      title={copy.completionTitle}
      actions={
        <>
          <Button onClick={onOpenLedger} fullWidth>
            {walk.clues ? "View ledger" : "View route"}
          </Button>
          <Button variant="outline" onClick={shareResult} fullWidth>
            Share result
          </Button>
          <ButtonLink href="/walks" variant="outline" className="w-full">
            Discover another walk
          </ButtonLink>
        </>
      }
    >
      <p className="animate-[reveal_900ms_ease-out] font-display text-2xl italic text-gold">
        {copy.completionMessage}
      </p>

      <dl className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="rounded-sm border border-parchment/15 p-3">
            <dt className="text-xs uppercase tracking-wider text-parchment/60">{item.label}</dt>
            <dd className="font-display text-2xl font-semibold text-parchment">{item.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-parchment/75">
        <span className="text-xs uppercase tracking-wider text-parchment/60">Team: </span>
        {playerNames}
      </p>

      {shareFallbackText && (
        <div className="rounded-sm border border-parchment/20 p-3 text-sm">
          <p className="text-parchment/60">Sharing isn&apos;t available here. Copy this text:</p>
          <p className="mt-1 select-all text-parchment">{shareFallbackText}</p>
        </div>
      )}
    </PlayScreen>
  );
}
