"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Clue } from "@/types/clue";
import type { WalkLocation } from "@/types/location";
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
          eyebrow="Correct"
          title={copy.correctAnswer}
          actions={
            <Button onClick={goToNextStep} fullWidth>
              {location.historicalReveal ? "Discover why it matters" : "Continue"}
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
          title="Why it matters"
          actions={
            <Button onClick={goToNextStep} fullWidth>
              Continue
            </Button>
          }
        >
          {progress.bonusStatus === "solved" && (
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">Bonus solved ✓</p>
          )}
          <HistoricalRevealView reveal={location.historicalReveal} />
        </PlayScreen>
      ) : null;

    case "clue":
      return (
        <PlayScreen
          eyebrow={copy.clueCollectedTitle}
          title="Clue discovered"
          actions={
            <Button onClick={goToNextStep} fullWidth>
              Continue
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
function NextStep({ location, nextLocation, hasFinale, copy, onContinue, onShowRoute }: SolvedScreenProps) {
  const teaserBlocks = location.content.filter((block) => block.revealAt === "solved");

  if (!nextLocation) {
    return (
      <PlayScreen
        eyebrow={location.name}
        title={hasFinale ? "The final page awaits" : "The end of the route"}
        actions={
          <Button onClick={onContinue} fullWidth>
            {hasFinale ? "Open the final page" : "Close the case"}
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
            Continue journey
          </Button>
          <Button variant="outline" onClick={onShowRoute} fullWidth>
            Show route
          </Button>
        </>
      }
    >
      {teaserBlocks.map((block, index) => (
        <ContentBlockView key={index} block={block} />
      ))}
      <div className="animate-[reveal_700ms_ease-out]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          New location discovered
        </p>
        <p className="mt-2 text-lg">{nextLocation.address}</p>
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
  const [answer, setAnswer] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim() !== "") onSubmit(answer);
  }

  return (
    <PlayScreen eyebrow="Optional bonus" title={title}>
      <p className="font-display text-2xl leading-snug">{question}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="bonus-answer">
          Your answer
        </label>
        <input
          id="bonus-answer"
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
      <Button variant="outline" onClick={onSkip} fullWidth>
        Skip the bonus
      </Button>
    </PlayScreen>
  );
}
