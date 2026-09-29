"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/client";

interface RevealAnswerProps {
  /** False: show the offer and the "Show the answer" button. True: show the answer. */
  isShown: boolean;
  onShow: () => void;
  /** Short answer line (e.g. "B. Stepped"), or null when only the explanation fits the language. */
  answer: string | null;
  explanation: string | null;
  /** The team saw the answer and goes on (the question counts as solved). */
  onContinue: () => void;
}

/**
 * "Stuck? Show the answer": offered after a few wrong answers, at stops and in
 * the final puzzle, so a team can never get stuck. The parent decides when it
 * is allowed (see logic/reveal-answer.ts) and hides its answer form once shown.
 */
export function RevealAnswer({ isShown, onShow, answer, explanation, onContinue }: RevealAnswerProps) {
  const t = useT();
  const answerRef = useRef<HTMLDivElement>(null);

  // Move focus to the answer, so screen-reader users hear it right away.
  useEffect(() => {
    if (isShown) answerRef.current?.focus();
  }, [isShown]);

  if (!isShown) {
    return (
      <div className="flex flex-col gap-2 border-t border-parchment/20 pt-4">
        {/* role="status": screen readers announce the offer when it appears. */}
        <p role="status" className="text-sm text-parchment/80">
          {t("game.challenge.revealOffer")}
        </p>
        <Button variant="outline" onClick={onShow} fullWidth>
          {t("game.challenge.revealAnswer")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-gold/60 p-4">
      <div
        ref={answerRef}
        tabIndex={-1}
        className="flex flex-col gap-2 break-words focus-visible:outline-2 focus-visible:outline-gold"
      >
        {answer !== null && (
          <p className="font-display text-2xl text-parchment">{t("game.challenge.answerIs", { answer })}</p>
        )}
        {explanation && <p className="font-display text-xl leading-snug text-parchment/90">{explanation}</p>}
      </div>
      <Button onClick={onContinue} fullWidth>
        {t("common.continue")}
      </Button>
    </div>
  );
}
