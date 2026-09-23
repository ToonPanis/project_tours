import { Button } from "@/components/ui/Button";
import type { WalkLocation } from "@/types/location";
import { ContentBlockView } from "./ContentBlockView";
import { PlayScreen } from "./PlayScreen";

interface StoryScreenProps {
  location: WalkLocation;
  onContinue: () => void;
}

export function StoryScreen({ location, onContinue }: StoryScreenProps) {
  // Blocks marked "solved" are saved for after the challenge.
  const arrivalBlocks = location.content.filter((block) => block.revealAt !== "solved");

  return (
    <PlayScreen
      eyebrow={location.name}
      title="The ledger opens"
      actions={
        <Button onClick={onContinue} fullWidth>
          {location.challenge ? "To the challenge" : "Continue"}
        </Button>
      }
    >
      {location.observationPrompt && (
        <p className="rounded-sm bg-gold/10 p-4 text-parchment">{location.observationPrompt}</p>
      )}
      {arrivalBlocks.map((block, index) => (
        <ContentBlockView key={index} block={block} />
      ))}
    </PlayScreen>
  );
}
