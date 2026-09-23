"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { DrinkRound } from "@/types/drink";
import type { LocationProgress } from "@/types/session";
import type { GameCopy } from "@/types/walk";
import { tallyVotes } from "../logic/voting";
import { PlayScreen } from "./PlayScreen";

const TIE_SUSPENSE_MS = 1800;

interface VoteResultProps {
  drinkRound: DrinkRound;
  progress: LocationProgress;
  copy: GameCopy;
  /** True only right after voting closed with a tie (not after a page refresh). */
  playTieAnimation: boolean;
  onContinue: () => void;
}

export function VoteResult({ drinkRound, progress, copy, playTieAnimation, onContinue }: VoteResultProps) {
  const [isRevealed, setIsRevealed] = useState(!playTieAnimation);

  useEffect(() => {
    if (isRevealed) return;
    const timer = window.setTimeout(() => setIsRevealed(true), TIE_SUSPENSE_MS);
    return () => window.clearTimeout(timer);
  }, [isRevealed]);

  if (!isRevealed) {
    return (
      <PlayScreen eyebrow="Voting closed" title={copy.tieTitle}>
        <p className="animate-pulse font-display text-2xl italic text-gold" role="status">
          {copy.tieSubtitle}
        </p>
      </PlayScreen>
    );
  }

  const tally = tallyVotes(drinkRound, progress.votes);
  const highestCount = Math.max(1, ...tally.map((entry) => entry.count));
  const winner = drinkRound.options.find((option) => option.id === progress.selectedDrinkOptionId);

  return (
    <PlayScreen
      eyebrow={`${progress.votes.length} ${progress.votes.length === 1 ? "vote" : "votes"} counted`}
      title={copy.voteResultTitle}
      actions={
        <Button onClick={onContinue} fullWidth>
          Continue
        </Button>
      }
    >
      <ul className="flex flex-col gap-3">
        {drinkRound.options.map((option) => {
          const count = tally.find((entry) => entry.drinkOptionId === option.id)?.count ?? 0;
          const isWinner = option.id === winner?.id;
          return (
            <li key={option.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className={isWinner ? "font-semibold text-parchment" : "text-parchment/75"}>
                  {option.name}
                </span>
                <span className="text-sm text-parchment/75">
                  {count} {count === 1 ? "vote" : "votes"}
                </span>
              </div>
              <div aria-hidden="true" className="mt-1 h-3 overflow-hidden rounded-full bg-parchment/10">
                <div
                  className={`h-full rounded-full ${isWinner ? "bg-gold" : "bg-parchment/40"}`}
                  style={{ width: `${(count / highestCount) * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {winner && (
        <div className="animate-[reveal_600ms_ease-out] rounded-sm border border-gold/60 bg-gold/10 p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {progress.wasTie ? "Chosen by the ledger" : "The team's choice"}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-parchment">{winner.name}</p>
        </div>
      )}

      <p className="font-display text-lg italic">{copy.afterVoteMessage}</p>
      <p className="text-sm text-parchment/70">
        Prefer something else? Everyone can always choose their own drink, including the
        alcohol-free option.
      </p>
    </PlayScreen>
  );
}
