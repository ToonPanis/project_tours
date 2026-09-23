"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Clue } from "@/types/clue";
import type { WalkLocation } from "@/types/location";
import type { GameCopy } from "@/types/walk";
import { ContentBlockView } from "./ContentBlockView";
import { PlayScreen } from "./PlayScreen";

interface SolvedScreenProps {
  location: WalkLocation;
  earnedClues: Clue[];
  nextLocation: WalkLocation | undefined;
  copy: GameCopy;
  onContinue: () => void;
  onShowRoute: () => void;
}

/** Two steps: "correct + clue", then "new location discovered" (or the finish). */
export function SolvedScreen({
  location,
  earnedClues,
  nextLocation,
  copy,
  onContinue,
  onShowRoute,
}: SolvedScreenProps) {
  const [step, setStep] = useState<"clue" | "next-location">("clue");
  const solvedBlocks = location.content.filter((block) => block.revealAt === "solved");

  if (step === "clue") {
    return (
      <PlayScreen
        eyebrow="Correct"
        title={copy.correctAnswer}
        actions={
          <Button onClick={() => (nextLocation ? setStep("next-location") : onContinue())} fullWidth>
            {nextLocation ? "Continue" : "Close the case"}
          </Button>
        }
      >
        {location.challenge?.explanation && <p className="text-lg">{location.challenge.explanation}</p>}

        {earnedClues.map((clue) => (
          <div
            key={clue.id}
            className="animate-[reveal_700ms_ease-out] rounded-sm border border-gold bg-gold/10 p-6 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Clue discovered</p>
            <p className="mt-2 font-display text-5xl font-semibold tracking-widest text-parchment">
              {clue.value}
            </p>
            <p className="mt-1 text-sm text-parchment/70">{clue.title}</p>
          </div>
        ))}

        {solvedBlocks.map((block, index) => (
          <ContentBlockView key={index} block={block} />
        ))}
      </PlayScreen>
    );
  }

  return (
    <PlayScreen
      eyebrow={copy.nextLocationTitle}
      title={nextLocation?.name ?? ""}
      actions={
        <>
          <Button onClick={onContinue} fullWidth>
            Continue journey
          </Button>
          <Button variant="outline" onClick={onShowRoute} fullWidth>
            Show route
          </Button>
        </>
      }
    >
      <div className="animate-[reveal_700ms_ease-out]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          New location discovered
        </p>
        <p className="mt-2 text-lg">{nextLocation?.address}</p>
      </div>
    </PlayScreen>
  );
}
