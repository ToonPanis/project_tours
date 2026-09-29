"use client";

import { useT } from "@/i18n/client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Clue } from "@/types/clue";
import type { ChallengeAnswer, FinaleProgress } from "@/types/session";
import type { WalkCopy, WalkFinale } from "@/types/walk";
import { canRevealFinaleAnswer, getRevealContent } from "../logic/reveal-answer";
import { PlayScreen } from "./PlayScreen";
import { RevealAnswer } from "./RevealAnswer";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

interface FinaleScreenProps {
  finale: WalkFinale;
  progress: FinaleProgress;
  collectedClues: Clue[];
  /** Every clue of the walk: a revealed answer is read from its clue even if that one was missed. */
  allClues: Clue[];
  copy: WalkCopy;
  /** Small title above the finale, e.g. the name of the walk's story. */
  eyebrow: string;
  onSubmit: (questionId: string, answer: ChallengeAnswer) => void;
  /** After a few wrong answers: the team saw the answer and goes on. */
  onRevealAnswer: (questionId: string) => void;
}

/** The final page: first the collected clues, then one question per screen. */
export function FinaleScreen({
  finale,
  progress,
  collectedClues,
  allClues,
  copy,
  eyebrow,
  onSubmit,
  onRevealAnswer,
}: FinaleScreenProps) {
  const t = useT();
  // Skip the intro when coming back to a finale that's already under way.
  const [hasStarted, setHasStarted] = useState(progress.solvedQuestionIds.length > 0);

  const clueList = (
    <ol className="flex flex-col gap-2">
      {collectedClues.map((clue, index) => (
        <li key={clue.id} className="flex items-baseline gap-4 border-b border-parchment/10 pb-2">
          <span className="w-10 shrink-0 font-display text-lg text-gold">{ROMAN_NUMERALS[index]}</span>
          <span className="font-display text-xl tracking-wider text-parchment">{clue.value}</span>
        </li>
      ))}
    </ol>
  );

  if (!hasStarted) {
    return (
      <PlayScreen
        eyebrow={eyebrow}
        title={finale.title}
        screenId="finale-intro"
        actions={
          <Button onClick={() => setHasStarted(true)} fullWidth>
            {t("game.finale.openFinalPage")}
          </Button>
        }
      >
        {clueList}
        <p className="font-display text-xl italic leading-relaxed text-gold">{finale.intro}</p>
      </PlayScreen>
    );
  }

  const questionIndex = finale.questions.findIndex(
    (question) => !progress.solvedQuestionIds.includes(question.id),
  );
  const question = finale.questions[questionIndex];
  if (!question) return null;

  return (
    <FinaleQuestion
      // A new key resets the answer field for each question.
      key={question.id}
      questionId={question.id}
      number={questionIndex + 1}
      total={finale.questions.length}
      question={question.question}
      wrongAttempts={progress.wrongAttemptsByQuestion[question.id] ?? 0}
      wrongMessage={copy.wrongAnswer}
      clueList={clueList}
      revealContent={getRevealContent(question, allClues)}
      onSubmit={(answer) => onSubmit(question.id, answer)}
      onRevealAnswer={() => onRevealAnswer(question.id)}
    />
  );
}

interface FinaleQuestionProps {
  questionId: string;
  number: number;
  total: number;
  question: string;
  wrongAttempts: number;
  wrongMessage: string;
  clueList: React.ReactNode;
  revealContent: { answer: string | null; explanation: string | null };
  onSubmit: (answer: string) => void;
  onRevealAnswer: () => void;
}

function FinaleQuestion({
  questionId,
  number,
  total,
  question,
  wrongAttempts,
  wrongMessage,
  clueList,
  revealContent,
  onSubmit,
  onRevealAnswer,
}: FinaleQuestionProps) {
  const t = useT();
  const [answer, setAnswer] = useState("");
  const [showClues, setShowClues] = useState(false);
  const [isAnswerShown, setIsAnswerShown] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim() !== "") onSubmit(answer);
  }

  return (
    <PlayScreen eyebrow={t("game.finale.questionOf", { number, total })} title={question} screenId={`finale-${questionId}`}>
      {!isAnswerShown && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="sr-only" htmlFor="finale-answer">
            {t("common.yourAnswer")}
          </label>
          <input
            id="finale-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={t("common.yourAnswer")}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-h-14 w-full rounded-sm border border-parchment/30 bg-ink/40 px-4 text-xl text-parchment focus:border-gold focus:outline-none"
          />
          <Button type="submit" disabled={answer.trim() === ""} fullWidth>
            {t("common.submit")}
          </Button>
        </form>
      )}

      {wrongAttempts > 0 && !isAnswerShown && (
        <p role="status" className="font-display text-xl italic text-gold">
          {wrongMessage}
        </p>
      )}

      {!isAnswerShown && (
        <>
          <Button variant="outline" onClick={() => setShowClues((current) => !current)} fullWidth>
            {showClues ? t("game.finale.hideClues") : t("game.finale.showClues")}
          </Button>
          {showClues && clueList}
        </>
      )}

      {/* The final page can't become a dead end either: same rule as at the stops. */}
      {canRevealFinaleAnswer(wrongAttempts) && (
        <RevealAnswer
          isShown={isAnswerShown}
          onShow={() => setIsAnswerShown(true)}
          {...revealContent}
          onContinue={onRevealAnswer}
        />
      )}
    </PlayScreen>
  );
}
