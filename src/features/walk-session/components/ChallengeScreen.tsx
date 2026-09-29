"use client";

import { useT } from "@/i18n/client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Challenge } from "@/types/challenge";
import type { Clue } from "@/types/clue";
import type { ChallengeAnswer, LocationProgress } from "@/types/session";
import type { GameCopy } from "@/types/walk";
import { optionLetter } from "../logic/option-letter";
import { canRevealAnswer, getRevealContent } from "../logic/reveal-answer";
import { PlayScreen } from "./PlayScreen";

interface ChallengeScreenProps {
  challenge: Challenge;
  progress: LocationProgress;
  copy: GameCopy;
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
  const answerBoxRef = useRef<HTMLDivElement>(null);
  const mayRevealAnswer = canRevealAnswer(challenge, progress);
  const revealed = getRevealContent(challenge);

  // Move focus to the revealed answer, so screen-reader users hear it right away.
  useEffect(() => {
    if (isAnswerShown) answerBoxRef.current?.focus();
  }, [isAnswerShown]);

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
    <PlayScreen eyebrow={t("game.challenge.eyebrow")} title={challenge.title}>
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
      {hasWrongAnswer && (
        <p role="status" className="font-display text-xl italic text-gold">
          {copy.wrongAnswer}
        </p>
      )}

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
      {mayRevealAnswer && !isAnswerShown && (
        <div className="flex flex-col gap-2 border-t border-parchment/20 pt-4">
          {/* role="status": screen readers announce the offer when it appears. */}
          <p role="status" className="text-sm text-parchment/80">
            {t("game.challenge.revealOffer")}
          </p>
          <Button variant="outline" onClick={() => setIsAnswerShown(true)} fullWidth>
            {t("game.challenge.revealAnswer")}
          </Button>
        </div>
      )}
      {mayRevealAnswer && isAnswerShown && (
        <div className="flex flex-col gap-3 rounded-sm border border-gold/60 p-4">
          {/* Focus lands on the answer text itself, so screen readers read it out. */}
          <div
            ref={answerBoxRef}
            tabIndex={-1}
            className="flex flex-col gap-2 break-words focus-visible:outline-2 focus-visible:outline-gold"
          >
            {revealed.answer !== null && (
              <p className="font-display text-2xl text-parchment">
                {t("game.challenge.answerIs", { answer: revealed.answer })}
              </p>
            )}
            {revealed.explanation && (
              <p className="font-display text-xl leading-snug text-parchment/90">{revealed.explanation}</p>
            )}
          </div>
          <Button onClick={onRevealAnswer} fullWidth>
            {t("common.continue")}
          </Button>
        </div>
      )}
    </PlayScreen>
  );
}
