"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Clue } from "@/types/clue";
import type { ChallengeAnswer, FinaleProgress } from "@/types/session";
import type { GameCopy, WalkFinale } from "@/types/walk";
import { PlayScreen } from "./PlayScreen";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

interface FinaleScreenProps {
  finale: WalkFinale;
  progress: FinaleProgress;
  collectedClues: Clue[];
  copy: GameCopy;
  onSubmit: (questionId: string, answer: ChallengeAnswer) => void;
}

/** The final page: first the collected clues, then one question per screen. */
export function FinaleScreen({ finale, progress, collectedClues, copy, onSubmit }: FinaleScreenProps) {
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
        eyebrow="The Lost Tavern Ledger"
        title={finale.title}
        actions={
          <Button onClick={() => setHasStarted(true)} fullWidth>
            Open the final page
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
      number={questionIndex + 1}
      total={finale.questions.length}
      question={question.question}
      wrongAttempts={progress.wrongAttemptsByQuestion[question.id] ?? 0}
      wrongMessage={copy.wrongAnswer}
      clueList={clueList}
      onSubmit={(answer) => onSubmit(question.id, answer)}
    />
  );
}

interface FinaleQuestionProps {
  number: number;
  total: number;
  question: string;
  wrongAttempts: number;
  wrongMessage: string;
  clueList: React.ReactNode;
  onSubmit: (answer: string) => void;
}

function FinaleQuestion({
  number,
  total,
  question,
  wrongAttempts,
  wrongMessage,
  clueList,
  onSubmit,
}: FinaleQuestionProps) {
  const [answer, setAnswer] = useState("");
  const [showClues, setShowClues] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim() !== "") onSubmit(answer);
  }

  return (
    <PlayScreen eyebrow={`Final question ${number} of ${total}`} title={question}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="finale-answer">
          Your answer
        </label>
        <input
          id="finale-answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Your answer"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-h-14 w-full rounded-sm border border-parchment/30 bg-ink/40 px-4 text-xl text-parchment focus:border-gold focus:outline-none"
        />
        <Button type="submit" disabled={answer.trim() === ""} fullWidth>
          Submit
        </Button>
      </form>

      {wrongAttempts > 0 && (
        <p role="status" className="font-display text-xl italic text-gold">
          {wrongMessage}
        </p>
      )}

      <Button variant="outline" onClick={() => setShowClues((current) => !current)} fullWidth>
        {showClues ? "Hide your clues" : "Show your clues"}
      </Button>
      {showClues && clueList}
    </PlayScreen>
  );
}
