import { Button } from "@/components/ui/Button";
import type { Walk } from "@/types/walk";
import { getHowItWorksSteps } from "@/features/walks/utils/walk-content";
import { PlayScreen } from "./PlayScreen";

interface GameIntroProps {
  walk: Walk;
  onBegin: () => void;
}

/** Shown once, right after team setup: the story premise and how a stop works. */
export function GameIntro({ walk, onBegin }: GameIntroProps) {
  const hasDrinkRounds = walk.locations.some((location) => location.drinkRound);

  return (
    <PlayScreen
      eyebrow="The Ledger · fiction"
      title={walk.narrative?.title ?? walk.title}
      actions={
        <Button onClick={onBegin} fullWidth>
          Begin the adventure
        </Button>
      }
    >
      {walk.narrative && (
        <p className="font-display text-xl leading-relaxed">{walk.narrative.premise}</p>
      )}

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          At every stop
        </h2>
        <ol className="mt-3 space-y-2">
          {getHowItWorksSteps(walk).map((step, index) => (
            <li key={step} className="flex items-baseline gap-3">
              <span className="font-display text-lg font-semibold text-gold">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {hasDrinkRounds && (
        <p className="rounded-sm border border-parchment/20 p-4 text-sm text-parchment/80">
          The team&apos;s drink vote is only a suggestion. There is always an alcohol-free option,
          everyone can choose their own drink, and you can skip any round. Progress never depends
          on drinking.
        </p>
      )}
    </PlayScreen>
  );
}
