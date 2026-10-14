"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { playablePubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PubQuestion, QuestionProgress } from "@/types/pub-game";
import type { PubGameHandle } from "../client/usePubGame";
import { usePubGameTexts } from "../client/texts-context";
import { useCafeReveal } from "../client/useCafeReveal";
import { pointsForAttempt } from "../logic/scoring";
import { FormError } from "./FormError";
import { TaskCard } from "./TaskCard";

const EMPTY_PROGRESS: QuestionProgress = { wrongOptionIds: [], status: "open", correctOptionId: null, points: 0 };

interface PubtaskStepProps {
  game: PubGameHandle;
  /**
   * Shown after the pubtask is finished (the team already moved on), so the
   * last answer and its explanation don't vanish: "Continue" calls this.
   */
  onDone?: () => void;
}

/**
 * The café's pubtask: multiple-choice questions, 100 / 80 / 60 points for a
 * right answer on the 1st / 2nd / 3rd try, then the answer is shown (0 points).
 * The SERVER checks every answer; this screen never knows the right option
 * until the question is finished. Photo tasks that belong to the pubtask
 * (Café Barries: Lucie) are listed below the questions.
 */
export function PubtaskStep({ game, onDone }: PubtaskStepProps) {
  const t = useT();
  const texts = usePubGameTexts();
  const { view } = game;
  const cafeId = view.team.route[view.team.cafeIndex];
  const cafe = playablePubGameDefinition.cafes.find((candidate) => candidate.id === cafeId);
  const cafeTexts = texts.cafes[cafeId];
  const questions = cafe?.questions ?? [];
  const tasks = (cafe?.tasks ?? []).filter((task) => task.presentedAs === "pubtask");

  // Ask the server for explanations whenever another question is finished.
  const finishedCount = questions.filter((question) => (view.answers[question.id]?.status ?? "open") !== "open").length;
  const reveal = useCafeReveal(game.code, cafeId, `answered-${finishedCount}`);

  const scorerId = view.scoringMode === "player" ? view.me.id : view.team.id;
  const score = view.scores.find((item) => item.scorerId === scorerId)?.total ?? 0;

  return (
    <PlayScreen
      eyebrow={t("pubgame.pubtask.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length })}
      title={t("pubgame.pubtask.title")}
      screenId={`pub-game-pubtask-${cafeId}`}
      actions={
        onDone ? (
          <Button onClick={onDone} fullWidth>
            {t("pubgame.pubtask.continue")}
          </Button>
        ) : undefined
      }
    >
      <p className="text-sm text-parchment/75">
        {view.scoringMode === "player" ? t("pubgame.pubtask.playerAnswers") : t("pubgame.pubtask.teamAnswers")}
      </p>

      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          game={game}
          question={question}
          number={index + 1}
          total={questions.length}
          text={cafeTexts?.questions[question.id]}
          explanation={reveal?.explanations[question.id]}
        />
      ))}

      {tasks.map((task) => (
        <TaskCard key={task.id} game={game} task={task} text={cafeTexts?.tasks[task.id]} />
      ))}

      <p className="font-semibold text-gold">{t("pubgame.pubtask.score", { points: score })}</p>
    </PlayScreen>
  );
}

interface QuestionCardProps {
  game: PubGameHandle;
  question: PubQuestion;
  number: number;
  total: number;
  text: { question: string; options: Record<string, string>; hints: string[] } | undefined;
  explanation: string | undefined;
}

function QuestionCard({ game, question, number, total, text, explanation }: QuestionCardProps) {
  const t = useT();
  const { view, act, busy } = game;
  const [error, setError] = useState<string | null>(null);
  const progress = view.answers[question.id] ?? EMPTY_PROGRESS;
  const wrong = progress.wrongOptionIds.length;
  const finished = progress.status !== "open";
  const optionText = (optionId: string) => text?.options[optionId] ?? optionId;
  const hint = !finished && wrong > 0 ? text?.hints[wrong - 1] : undefined;
  const statusId = `status-${question.id}`;

  return (
    <section className="flex flex-col gap-3 rounded-sm border border-gold/30 bg-ink/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">
        {t("pubgame.pubtask.questionOf", { current: number, total })}
      </p>
      <h2 className="font-display text-2xl font-semibold leading-snug text-parchment">{text?.question ?? question.id}</h2>
      {!finished && (
        <p className="text-sm text-parchment/75">
          {t("pubgame.pubtask.worth", { attempt: wrong + 1, points: pointsForAttempt(wrong) })}
        </p>
      )}

      <div className="flex flex-col gap-2" role="group" aria-describedby={statusId}>
        {question.optionIds.map((optionId) => {
          const isWrong = progress.wrongOptionIds.includes(optionId);
          const isRight = progress.correctOptionId === optionId;
          return (
            <button
              key={optionId}
              type="button"
              disabled={busy || finished || isWrong}
              onClick={async () => setError(await act({ type: "ANSWER", questionId: question.id, optionId }))}
              className={`flex min-h-14 items-center justify-between gap-3 rounded-sm border px-4 text-left text-lg transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
                isRight
                  ? "border-green-500 bg-green-900/50 text-parchment"
                  : isWrong
                    ? "border-red-400/50 text-parchment/50 line-through"
                    : "border-gold/40 text-parchment hover:bg-gold/10 disabled:opacity-60"
              }`}
            >
              <span>{optionText(optionId)}</span>
              {isRight && <span aria-label={t("pubgame.pubtask.rightOption")}>✓</span>}
              {isWrong && <span aria-label={t("pubgame.pubtask.wrongOption")}>✗</span>}
            </button>
          );
        })}
      </div>

      {/* Always mounted: every wrong answer, the result and the hint are announced. */}
      <div id={statusId} role="status" className="flex flex-col gap-1">
        {progress.status === "correct" && (
          <p className="font-display text-xl text-green-300">{t("pubgame.pubtask.correct", { points: progress.points })}</p>
        )}
        {progress.status === "revealed" && progress.correctOptionId && (
          <p className="text-lg text-gold">{t("pubgame.pubtask.revealed", { answer: optionText(progress.correctOptionId) })}</p>
        )}
        {!finished && wrong > 0 && <p>{t.plural("pubgame.pubtask.wrong", wrong)}</p>}
        {hint && <p className="italic text-gold">{t("pubgame.pubtask.hint", { hint })}</p>}
      </div>

      {finished && explanation && <p className="border-l-2 border-gold/60 pl-3 text-parchment/90">{explanation}</p>}
      <FormError error={error} />
    </section>
  );
}
