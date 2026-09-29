import { useT } from "@/i18n/client";
import { Button } from "@/components/ui/Button";
import type { WalkLocation } from "@/types/location";
import { PlayScreen } from "./PlayScreen";

interface ArrivedScreenProps {
  location: WalkLocation;
  playerCount: number;
  onStartVote: () => void;
  onSkipDrinkRound: () => void;
  onContinue: () => void;
}

export function ArrivedScreen({
  location,
  playerCount,
  onStartVote,
  onSkipDrinkRound,
  onContinue,
}: ArrivedScreenProps) {
  const t = useT();
  // Locations without a drink round go straight on to the story.
  if (!location.drinkRound) {
    return (
      <PlayScreen
        eyebrow={t("game.arrived.eyebrow")}
        title={location.name}
        screenId={`arrived-${location.id}`}
        actions={
          <Button onClick={onContinue} fullWidth>
            {t("common.continue")}
          </Button>
        }
      />
    );
  }

  return (
    <PlayScreen
      eyebrow={t("game.arrived.eyebrow")}
      title={location.name}
      screenId={`arrived-${location.id}`}
      actions={
        <>
          <Button onClick={onStartVote} fullWidth>
            {t("game.arrived.startVote")}
          </Button>
          <Button variant="outline" onClick={onSkipDrinkRound} fullWidth>
            {t("game.arrived.skipRound")}
          </Button>
        </>
      }
    >
      <p className="font-display text-xl leading-relaxed">
        {playerCount > 1
          ? t("game.arrived.teamChooses")
          : t("game.arrived.soloChooses")}
      </p>
      <p className="text-sm text-parchment/70">
        {t("game.arrived.alcoholFreeNote")}
      </p>
    </PlayScreen>
  );
}
