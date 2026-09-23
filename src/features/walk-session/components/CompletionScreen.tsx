"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { WalkSession } from "@/types/session";
import type { GameCopy, Walk } from "@/types/walk";
import { getElapsedTime, getSessionStats } from "../logic/session-stats";
import { ContentBlockView } from "./ContentBlockView";
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
  const closingStory = walk.finale?.closingStory ?? [];
  // The closing story comes first; the summary follows.
  const [hasReadStory, setHasReadStory] = useState(closingStory.length === 0);

  const stats = getSessionStats(walk, session);
  const elapsedTime = getElapsedTime(session, new Date());
  const playerNames = session.team.players.map((player) => player.name).join(", ");

  const teamLabel = session.team.name ? `${session.team.name} (${playerNames})` : playerNames;
  const shareText = `We solved ${walk.narrative?.title ?? walk.title} with Hidden Antwerp: ${stats.solvedStops}/${stats.totalStops} ${copy.locationsDiscoveredLabel} in ${elapsedTime}!`;

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
    { label: copy.locationsDiscoveredLabel, value: `${stats.solvedStops} / ${stats.totalStops}` },
    ...(stats.totalClues > 0
      ? [{ label: "Clues recovered", value: `${stats.collectedClues} / ${stats.totalClues}` }]
      : []),
    { label: "Challenges completed", value: String(stats.challengesCompleted) },
    { label: "Time", value: elapsedTime },
  ];

  if (!hasReadStory) {
    return (
      <PlayScreen
        eyebrow={walk.narrative?.title ?? walk.title}
        title="The last page"
        actions={
          <Button onClick={() => setHasReadStory(true)} fullWidth>
            Close the ledger
          </Button>
        }
      >
        <div className="animate-[reveal_1200ms_ease-out] space-y-5">
          {closingStory.map((block, index) => (
            <ContentBlockView key={index} block={block} />
          ))}
        </div>
      </PlayScreen>
    );
  }

  return (
    <PlayScreen
      eyebrow={walk.narrative ? `${walk.title} · ${walk.narrative.title}` : walk.title}
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
        {teamLabel}
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
