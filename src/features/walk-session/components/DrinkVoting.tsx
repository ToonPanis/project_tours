"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { DrinkRound } from "@/types/drink";
import type { LocationProgress, SessionAction } from "@/types/session";
import type { Team, Vote } from "@/types/team";
import { findLeadingOptionIds, haveAllPlayersVoted, pickRandomWinner, tallyVotes } from "../logic/voting";
import { PlayScreen } from "./PlayScreen";

interface DrinkVotingProps {
  drinkRound: DrinkRound;
  team: Team;
  progress: LocationProgress;
  dispatch: (action: SessionAction) => void;
  /** Called when the last vote closes the round (used to play the tie animation). */
  onVotingClosed: () => void;
}

const OPTION_LETTERS = ["A", "B", "C"];

/**
 * Pass-the-phone voting. Whose turn it is comes from the saved votes (the
 * first player without one), so a page refresh resumes at the right player.
 * A player's choice is never shown again after they confirm it.
 */
export function DrinkVoting({ drinkRound, team, progress, dispatch, onVotingClosed }: DrinkVotingProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isPassingPhone, setIsPassingPhone] = useState(false);

  const currentPlayer = team.players.find(
    (player) => !progress.votes.some((vote) => vote.playerId === player.id),
  );
  const isSolo = team.players.length === 1;

  function confirmVote() {
    if (!currentPlayer || !selectedOptionId) return;

    dispatch({ type: "CAST_VOTE", playerId: currentPlayer.id, drinkOptionId: selectedOptionId });
    setSelectedOptionId(null);

    // Work out the votes including this one (state updates aren't instant).
    const votesAfterThis: Vote[] = [
      ...progress.votes.filter((vote) => vote.playerId !== currentPlayer.id),
      { playerId: currentPlayer.id, drinkOptionId: selectedOptionId },
    ];

    if (haveAllPlayersVoted(team, votesAfterThis)) {
      // The random tie-break happens HERE, before dispatching, never in the reducer.
      const leaders = findLeadingOptionIds(tallyVotes(drinkRound, votesAfterThis));
      const winnerOptionId = leaders.length > 1 ? pickRandomWinner(leaders) : leaders[0];
      dispatch({ type: "CLOSE_VOTING", winnerOptionId, wasTie: leaders.length > 1 });
      onVotingClosed();
    } else {
      setIsPassingPhone(true);
    }
  }

  function skipRound() {
    dispatch({ type: "SKIP_DRINK_ROUND" });
    dispatch({ type: "SHOW_STORY" });
  }

  if (!currentPlayer) return null;

  if (isPassingPhone) {
    return (
      <PlayScreen
        eyebrow="Vote saved"
        title={`Pass the phone to ${currentPlayer.name}`}
        actions={
          <Button onClick={() => setIsPassingPhone(false)} fullWidth>
            I&apos;m {currentPlayer.name}
          </Button>
        }
      >
        <p className="text-parchment/75">
          {progress.votes.length} of {team.players.length} votes cast. Votes stay secret until
          everyone has chosen.
        </p>
      </PlayScreen>
    );
  }

  return (
    <PlayScreen
      eyebrow={isSolo ? "Drink vote" : `${currentPlayer.name}'s turn`}
      title="Choose your drink"
      actions={
        <>
          <Button onClick={confirmVote} disabled={!selectedOptionId} fullWidth>
            Confirm vote
          </Button>
          <Button variant="outline" onClick={skipRound} fullWidth>
            Skip this round
          </Button>
        </>
      }
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Drink options</legend>
        {drinkRound.options.map((option, index) => {
          const isSelected = option.id === selectedOptionId;
          return (
            <label
              key={option.id}
              className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-sm border p-4 transition-colors ${
                isSelected ? "border-gold bg-gold/15" : "border-parchment/25 hover:border-gold/60"
              }`}
            >
              <input
                type="radio"
                name="drink"
                value={option.id}
                checked={isSelected}
                onChange={() => setSelectedOptionId(option.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-xl font-semibold ${
                  isSelected ? "border-gold bg-gold text-ink" : "border-gold/60 text-gold"
                }`}
              >
                {OPTION_LETTERS[index]}
              </span>
              <span className="flex flex-col">
                <span className="text-lg font-semibold text-parchment">{option.name}</span>
                {!option.alcoholic && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                    Alcohol-free
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>
    </PlayScreen>
  );
}
