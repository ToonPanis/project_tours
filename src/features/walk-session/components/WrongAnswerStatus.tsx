"use client";

import { useT } from "@/i18n/client";

interface WrongAnswerStatusProps {
  /** Referenced by the answer field's aria-describedby. */
  id: string;
  wrongAttempts: number;
  /** The walk's own "wrong answer" line, e.g. "The Ledger remains silent." */
  message: string;
}

/**
 * Feedback after a wrong answer. The element is always there (empty before the
 * first wrong answer): screen readers only announce changes to a status that
 * already exists. The count changes the text on every attempt, so a second or
 * third wrong answer is announced too, and a team tapping in sunlight sees
 * that the tap registered.
 */
export function WrongAnswerStatus({ id, wrongAttempts, message }: WrongAnswerStatusProps) {
  const t = useT();
  return (
    <div id={id} role="status" className={wrongAttempts > 0 ? "flex flex-col gap-1" : undefined}>
      {wrongAttempts > 0 && (
        <>
          <p className="font-display text-xl italic text-gold">{message}</p>
          <p className="text-sm text-parchment/75">{t("game.challenge.wrongAttempts", { count: wrongAttempts })}</p>
        </>
      )}
    </div>
  );
}
