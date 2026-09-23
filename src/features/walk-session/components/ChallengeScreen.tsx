"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Challenge } from "@/types/challenge";
import type { Clue } from "@/types/clue";
import type { ChallengeAnswer, LocationProgress } from "@/types/session";
import type { GameCopy } from "@/types/walk";
import { optionLetter } from "../logic/option-letter";
import { PlayScreen } from "./PlayScreen";

interface ChallengeScreenProps {
  challenge: Challenge;
  progress: LocationProgress;
  copy: GameCopy;
  /** Clues this challenge needs, as collected by the team (for final puzzles). */
  requiredClues: Clue[];
  onSubmit: (answer: ChallengeAnswer) => void;
  onRevealHint: () => void;
}

const inputClasses =
  "min-h-14 w-full rounded-sm border border-parchment/30 bg-ink/40 px-4 text-xl text-parchment focus:border-gold focus:outline-none";

export function ChallengeScreen({
  challenge,
  progress,
  copy,
  requiredClues,
  onSubmit,
  onRevealHint,
}: ChallengeScreenProps) {
  const [answer, setAnswer] = useState("");

  const hasWrongAnswer = progress.wrongAttempts > 0;
  const hintsAvailable = Math.min(progress.wrongAttempts, challenge.hints.length);
  const canRevealHint = progress.hintsRevealed < hintsAvailable;
  const revealedHints = challenge.hints.slice(0, progress.hintsRevealed);

  function submitTypedAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim() === "") return;
    onSubmit(answer);
  }

  return (
    <PlayScreen eyebrow="Challenge" title={challenge.title}>
      {challenge.researchStatus && (
        <p className="self-start rounded-full border border-dashed border-parchment/40 px-3 py-1 text-xs uppercase tracking-wider text-parchment/70">
          {challenge.researchStatus === "on-site-verification-required"
            ? "On-site verification required"
            : "Research required"}
        </p>
      )}

      {challenge.instruction && challenge.type !== "observation" && (
        <p className="rounded-sm bg-gold/10 p-4 text-parchment">{challenge.instruction}</p>
      )}

      <p className="font-display text-2xl leading-snug text-parchment">{challenge.question}</p>

      {requiredClues.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Your clues</p>
          <ol className="mt-2 flex flex-wrap gap-2">
            {requiredClues.map((clue) => (
              <li
                key={clue.id}
                className="min-w-11 rounded-sm border border-gold/50 px-3 py-2 text-center font-display text-2xl font-semibold"
              >
                {clue.value}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Answer input: one layout per challenge type. */}
      {challenge.type === "multiple-choice" && (
        <div className="flex flex-col gap-3">
          {challenge.options.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => onSubmit(String(index))}
              className="group flex min-h-14 w-full items-center gap-4 rounded-sm border border-gold/60 px-4 text-left text-lg text-parchment transition-colors hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-gold"
            >
              <span className="font-display text-xl font-semibold text-gold group-hover:text-ink">{optionLetter(index)}</span>
              {option}
            </button>
          ))}
        </div>
      )}

      {(challenge.type === "text-answer" || challenge.type === "code" || challenge.type === "number-answer") && (
        <form onSubmit={submitTypedAnswer} className="flex flex-col gap-3">
          <label className="sr-only" htmlFor="challenge-answer">
            Your answer
          </label>
          <input
            id="challenge-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Your answer"
            // Number challenges open the number keypad on phones.
            inputMode={challenge.type === "number-answer" ? "numeric" : "text"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className={inputClasses}
          />
          <Button type="submit" disabled={answer.trim() === ""} fullWidth>
            Submit
          </Button>
        </form>
      )}

      {challenge.type === "observation" && (
        <>
          <p>{challenge.instruction}</p>
          <Button onClick={() => onSubmit("")} fullWidth>
            {challenge.confirmLabel}
          </Button>
        </>
      )}

      {challenge.type === "sequence" && (
        <p className="text-parchment/70">This challenge type can&apos;t be played yet.</p>
      )}

      {/* Feedback and hints */}
      {hasWrongAnswer && (
        <p role="status" className="font-display text-xl italic text-gold">
          {copy.wrongAnswer}
        </p>
      )}

      {revealedHints.length > 0 && (
        <ol className="flex flex-col gap-2">
          {revealedHints.map((hint, index) => (
            <li key={hint} className="rounded-sm bg-parchment/10 p-3 text-sm">
              <span className="font-semibold text-gold">Hint {index + 1}: </span>
              {hint}
            </li>
          ))}
        </ol>
      )}

      {canRevealHint && (
        <Button variant="outline" onClick={onRevealHint} fullWidth>
          Need a hint?
        </Button>
      )}
    </PlayScreen>
  );
}
