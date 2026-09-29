"use client";

import { useT } from "@/i18n/client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Clue } from "@/types/clue";
import { formatWalkingDistance, formatWalkingTime } from "@/features/navigation/logic/maneuver-display";
import type { WalkLocation } from "@/types/location";
import type { WalkingRoute } from "@/types/navigation";
import type { ChallengeAnswer, LocationProgress } from "@/types/session";
import type { GameCopy } from "@/types/walk";
import { ContentBlockView } from "./ContentBlockView";
import { HistoricalRevealView } from "./HistoricalRevealView";
import { PlayScreen } from "./PlayScreen";

type Step = "correct" | "bonus" | "reveal" | "clue" | "next";

interface SolvedScreenProps {
  location: WalkLocation;
  progress: LocationProgress;
  earnedClues: Clue[];
  nextLocation: WalkLocation | undefined;
  /** The walking route to the next location, if known (for distance and time). */
  routeToNext: WalkingRoute | null;
  /** True when a final puzzle follows the last location. */
  hasFinale: boolean;
  copy: GameCopy;
  onSubmitBonus: (answer: ChallengeAnswer) => void;
  onSkipBonus: () => void;
  onContinue: () => void;
  onShowRoute: () => void;
}

/**
 * What happens after a correct answer, one focused screen at a time:
 * correct → (bonus) → history → clue → next location.
 * Steps without data (no bonus, no reveal, no clue) are left out.
 */
export function SolvedScreen(props: SolvedScreenProps) {
  const t = useT();
  const { location, progress, earnedClues, copy } = props;

  const steps: Step[] = [
    "correct",
    ...(location.bonusChallenge && progress.bonusStatus === "unanswered" ? (["bonus"] as const) : []),
    ...(location.historicalReveal ? (["reveal"] as const) : []),
    ...(earnedClues.length > 0 ? (["clue"] as const) : []),
    "next",
  ];
  const [stepIndex, setStepIndex] = useState(0);
  // The bonus step disappears from `steps` once answered, so clamp the index.
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const goToNextStep = () => setStepIndex((index) => index + 1);

  switch (step) {
    case "correct":
      return (
        <PlayScreen
          eyebrow={t("game.solved.correct")}
          title={copy.correctAnswer}
          actions={
            <Button onClick={goToNextStep} fullWidth>
              {location.historicalReveal ? t("game.solved.discoverWhy") : t("common.continue")}
            </Button>
          }
        >
          {location.challenge?.explanation && (
            <p className="font-display text-2xl leading-snug">{location.challenge.explanation}</p>
          )}
        </PlayScreen>
      );

    case "bonus":
      return location.bonusChallenge ? (
        <BonusStep
          question={location.bonusChallenge.question}
          title={location.bonusChallenge.title}
          wrongAttempts={progress.bonusWrongAttempts}
          wrongMessage={copy.wrongAnswer}
          onSubmit={props.onSubmitBonus}
          onSkip={props.onSkipBonus}
        />
      ) : null;

    case "reveal":
      return location.historicalReveal ? (
        <PlayScreen
          eyebrow={location.name}
          title={t("game.solved.whyItMatters")}
          actions={
            <Button onClick={goToNextStep} fullWidth>
              {t("common.continue")}
            </Button>
          }
        >
          {progress.bonusStatus === "solved" && (
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">{t("game.solved.bonusSolved")}</p>
          )}
          <HistoricalRevealView reveal={location.historicalReveal} />
        </PlayScreen>
      ) : null;

    case "clue":
      return (
        <PlayScreen
          eyebrow={copy.clueCollectedTitle}
          title={t("game.solved.clueDiscovered")}
          actions={
            <Button onClick={goToNextStep} fullWidth>
              {t("common.continue")}
            </Button>
          }
        >
          {earnedClues.map((clue) => (
            <div
              key={clue.id}
              className="animate-[reveal_700ms_ease-out] rounded-sm border border-gold bg-gold/10 p-6 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{clue.title}</p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-widest text-parchment">
                {clue.value}
              </p>
            </div>
          ))}
        </PlayScreen>
      );

    case "next":
      return <NextStep {...props} />;
  }
}

/** The story teaser, then the next café, or the way into the final puzzle. */
function NextStep({ location, nextLocation, routeToNext, hasFinale, copy, onContinue, onShowRoute }: SolvedScreenProps) {
  const t = useT();
  const teaserBlocks = location.content.filter((block) => block.revealAt === "solved");

  if (!nextLocation) {
    return (
      <PlayScreen
        eyebrow={location.name}
        title={hasFinale ? t("game.solved.finalPageAwaits") : t("game.solved.endOfRoute")}
        actions={
          <Button onClick={onContinue} fullWidth>
            {hasFinale ? t("game.solved.openFinalPage") : t("game.solved.closeCase")}
          </Button>
        }
      >
        {teaserBlocks.map((block, index) => (
          <ContentBlockView key={index} block={block} />
        ))}
      </PlayScreen>
    );
  }

  return (
    <PlayScreen
      eyebrow={copy.nextLocationTitle}
      title={nextLocation.name}
      actions={
        <>
          <Button onClick={onContinue} fullWidth>
            {t("game.solved.startWalking")}
          </Button>
          <Button variant="outline" onClick={onShowRoute} fullWidth>
            {t("game.solved.showRoute")}
          </Button>
        </>
      }
    >
      {teaserBlocks.map((block, index) => (
        <ContentBlockView key={index} block={block} />
      ))}
      <div className="animate-[reveal_700ms_ease-out]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {t("game.solved.newLocation")}
        </p>
        <p className="mt-2 text-lg">{nextLocation.address}</p>
        {routeToNext && (
          <p className="mt-3 font-display text-3xl font-semibold text-parchment">
            {formatWalkingDistance(routeToNext.distanceMeters, t)}
            <span className="ml-3 text-lg font-normal text-parchment/75">
              {formatWalkingTime(routeToNext.durationSeconds, t)}
            </span>
          </p>
        )}
      </div>
    </PlayScreen>
  );
}

interface BonusStepProps {
  title: string;
  question: string;
  wrongAttempts: number;
  wrongMessage: string;
  onSubmit: (answer: ChallengeAnswer) => void;
  onSkip: () => void;
}

/** An optional extra question. Skipping is always allowed. */
function BonusStep({ title, question, wrongAttempts, wrongMessage, onSubmit, onSkip }: BonusStepProps) {
  const t = useT();
  const [answer, setAnswer] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim() !== "") onSubmit(answer);
  }

  return (
    <PlayScreen eyebrow={t("game.solved.optionalBonus")} title={title}>
      <p className="font-display text-2xl leading-snug">{question}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="bonus-answer">
          {t("common.yourAnswer")}
        </label>
        <input
          id="bonus-answer"
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
      {wrongAttempts > 0 && (
        <p role="status" className="font-display text-xl italic text-gold">
          {wrongMessage}
        </p>
      )}
      <Button variant="outline" onClick={onSkip} fullWidth>
        {t("game.solved.skipBonus")}
      </Button>
    </PlayScreen>
  );
}
