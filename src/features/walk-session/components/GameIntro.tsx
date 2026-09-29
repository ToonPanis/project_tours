import { useT } from "@/i18n/client";
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
  const t = useT();
  const hasDrinkRounds = walk.locations.some((location) => location.drinkRound);

  return (
    <PlayScreen
      eyebrow={t("game.intro.eyebrow")}
      title={walk.narrative?.title ?? walk.title}
      actions={
        <Button onClick={onBegin} fullWidth>
          {t("game.intro.begin")}
        </Button>
      }
    >
      {walk.narrative && (
        <p className="font-display text-xl leading-relaxed">{walk.narrative.premise}</p>
      )}

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {t("game.intro.atEveryStop")}
        </h2>
        <ol className="mt-3 space-y-2">
          {getHowItWorksSteps(walk, t).map((step, index) => (
            <li key={step} className="flex items-baseline gap-3">
              <span className="font-display text-lg font-semibold text-gold">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {hasDrinkRounds && (
        <p className="rounded-sm border border-parchment/20 p-4 text-sm text-parchment/80">
          {t("game.intro.drinkNote")}
        </p>
      )}
    </PlayScreen>
  );
}
