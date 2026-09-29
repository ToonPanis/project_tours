import { useT } from "@/i18n/client";
import { Button } from "@/components/ui/Button";
import type { WalkLocation } from "@/types/location";
import { ContentBlockView } from "./ContentBlockView";
import { PlayScreen } from "./PlayScreen";

interface StoryScreenProps {
  location: WalkLocation;
  onContinue: () => void;
}

export function StoryScreen({ location, onContinue }: StoryScreenProps) {
  const t = useT();
  // Blocks marked "solved" are saved for after the challenge.
  const arrivalBlocks = location.content.filter((block) => block.revealAt !== "solved");

  return (
    <PlayScreen
      eyebrow={location.name}
      title={t("game.story.title")}
      screenId={`story-${location.id}`}
      actions={
        <Button onClick={onContinue} fullWidth>
          {location.challenge ? t("game.story.toChallenge") : t("common.continue")}
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
