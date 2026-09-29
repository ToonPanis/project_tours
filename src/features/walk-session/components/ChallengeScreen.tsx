"use client";

import { useT } from "@/i18n/client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Challenge } from "@/types/challenge";
import type { Clue } from "@/types/clue";
import type { ChallengeAnswer, LocationProgress } from "@/types/session";
import type { WalkCopy } from "@/types/walk";
import { optionLetter } from "../logic/option-letter";
import { canRevealAnswer, getRevealContent } from "../logic/reveal-answer";
import { PlayScreen } from "./PlayScreen";
import { RevealAnswer } from "./RevealAnswer";
import { WrongAnswerStatus } from "./WrongAnswerStatus";

interface ChallengeScreenProps {
  challenge: Challenge;
  progress: LocationProgress;
  copy: WalkCopy;
  /** Clues this challenge needs, as collected by the team (for final puzzles). */
  requiredClues: Clue[];
  onSubmit: (answer: ChallengeAnswer) => void;
  onRevealHint: () => void;
  /** After a few wrong attempts: the team saw the answer and continues (the stop counts as solved). */
  onRevealAnswer: () => void;
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
  onRevealAnswer,
}: ChallengeScreenProps) {
  const t = useT();
  const [answer, setAnswer] = useState("");
  // Step 1 shows the answer on screen; step 2 ("Continue") tells the game.
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  // The last typed answer that was sent: the field is marked invalid while it still holds it.
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  // Multiple choice: each tapped option with the wrong-answer count at that moment. If the
  // count went up afterwards, that option was wrong (a right answer leaves this screen).
  const [pickedOptions, setPickedOptions] = useState<{ index: number; wrongAttemptsBefore: number }[]>([]);
  const wrongOptionIndexes = pickedOptions
    .filter((pick) => progress.wrongAttempts > pick.wrongAttemptsBefore)
    .map((pick) => pick.index);
  const mayRevealAnswer = canRevealAnswer(challenge, progress);

  const hasWrongAnswer = progress.wrongAttempts > 0;
  const hintsAvailable = Math.min(progress.wrongAttempts, challenge.hints.length);
  const canRevealHint = progress.hintsRevealed < hintsAvailable;
  const revealedHints = challenge.hints.slice(0, progress.hintsRevealed);

  function submitTypedAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim() === "") return;
    setSubmittedAnswer(answer);
    onSubmit(answer);
  }

  return (
    <PlayScreen eyebrow={t("game.challenge.eyebrow")} title={challenge.title} screenId={`challenge-${challenge.id}`}>
      {challenge.researchStatus && (
        <p className="self-start rounded-full border border-dashed border-parchment/40 px-3 py-1 text-xs uppercase tracking-wider text-parchment/70">
          {challenge.researchStatus === "on-site-verification-required"
            ? t("game.challenge.onSiteVerification")
            : t("game.challenge.researchRequired")}
        </p>
      )}

      {challenge.instruction && challenge.type !== "observation" && (
        <p className="rounded-sm bg-gold/10 p-4 text-parchment">{challenge.instruction}</p>
      )}

      <p className="font-display text-2xl leading-snug text-parchment">{challenge.question}</p>

      {requiredClues.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t("game.challenge.yourClues")}</p>
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

      {/* Answer input: one layout per challenge type. Hidden once the answer is shown. */}
      {challenge.type === "multiple-choice" && !isAnswerShown && (
        <div className="flex flex-col gap-3">
          {challenge.options.map((option, index) => {
            const isWrong = wrongOptionIndexes.includes(index);
            return (
              <button
                key={option}
                type="button"
                // Already known to be wrong: another tap would only count as another wrong answer.
                aria-disabled={isWrong || undefined}
                onClick={() => {
                  if (isWrong) return;
                  setPickedOptions((picks) => [...picks, { index, wrongAttemptsBefore: progress.wrongAttempts }]);
                  onSubmit(String(index));
                }}
                className={`group flex min-h-14 w-full items-center gap-4 rounded-sm border px-4 text-left text-lg transition-colors hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-gold ${
                  isWrong ? "border-dashed border-parchment/40 text-parchment/70" : "border-gold/60 text-parchment"
                }`}
              >
                <span className="font-display text-xl font-semibold text-gold group-hover:text-ink">{optionLetter(index)}</span>
                {/* Only the option text is struck through (a decoration on the button would cover the letter and ✗ too). */}
                <span className={isWrong ? "line-through" : undefined}>{option}</span>
                {isWrong && (
                  <span className="ml-auto">
                    <span aria-hidden="true">✗</span>
                    <span className="sr-only">, {t("game.challenge.wrongOption")}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {(challenge.type === "text-answer" || challenge.type === "code" || challenge.type === "number-answer") &&
        !isAnswerShown && (
        <form onSubmit={submitTypedAnswer} className="flex flex-col gap-3">
          <label className="sr-only" htmlFor="challenge-answer">
            {t("common.yourAnswer")}
          </label>
          <input
            id="challenge-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={t("common.yourAnswer")}
            // Number challenges open the number keypad on phones.
            inputMode={challenge.type === "number-answer" ? "numeric" : "text"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-invalid={hasWrongAnswer && answer === submittedAnswer}
            aria-describedby="challenge-feedback"
            className={inputClasses}
          />
          <Button type="submit" disabled={answer.trim() === ""} fullWidth>
            {t("common.submit")}
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
        <p className="text-parchment/70">{t("game.challenge.notPlayable")}</p>
      )}

      {/* Feedback and hints */}
      <WrongAnswerStatus id="challenge-feedback" wrongAttempts={progress.wrongAttempts} message={copy.wrongAnswer} />

      {revealedHints.length > 0 && (
        <ol className="flex flex-col gap-2">
          {revealedHints.map((hint, index) => (
            <li key={hint} className="rounded-sm bg-parchment/10 p-3 text-sm">
              <span className="font-semibold text-gold">{t("game.challenge.hint", { number: index + 1 })}</span>
              {hint}
            </li>
          ))}
        </ol>
      )}

      {canRevealHint && !isAnswerShown && (
        <Button variant="outline" onClick={onRevealHint} fullWidth>
          {t("game.challenge.needHint")}
        </Button>
      )}

      {/* Nobody gets stuck: after a few wrong attempts the team may see the answer. */}
      {mayRevealAnswer && (
        <RevealAnswer
          isShown={isAnswerShown}
          onShow={() => setIsAnswerShown(true)}
          {...getRevealContent(challenge)}
          onContinue={onRevealAnswer}
        />
      )}
    </PlayScreen>
  );
}
