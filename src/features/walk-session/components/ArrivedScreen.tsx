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
  // Locations without a drink round go straight on to the story.
  if (!location.drinkRound) {
    return (
      <PlayScreen
        eyebrow="You've arrived"
        title={location.name}
        actions={
          <Button onClick={onContinue} fullWidth>
            Continue
          </Button>
        }
      />
    );
  }

  return (
    <PlayScreen
      eyebrow="You've arrived"
      title={location.name}
      actions={
        <>
          <Button onClick={onStartVote} fullWidth>
            Start the drink vote
          </Button>
          <Button variant="outline" onClick={onSkipDrinkRound} fullWidth>
            Skip the drink round
          </Button>
        </>
      }
    >
      <p className="font-display text-xl leading-relaxed">
        {playerCount > 1
          ? "Before the ledger speaks, the team chooses a drink. Everyone votes in secret: pass the phone around."
          : "Before the ledger speaks, choose a drink."}
      </p>
      <p className="text-sm text-parchment/70">
        There is always an alcohol-free option, and the result is only a suggestion. Everyone can
        choose their own drink.
      </p>
    </PlayScreen>
  );
}
