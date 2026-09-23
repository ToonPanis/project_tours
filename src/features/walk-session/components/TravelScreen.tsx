import { Button } from "@/components/ui/Button";
import type { WalkLocation } from "@/types/location";
import { PlayScreen } from "./PlayScreen";

interface TravelScreenProps {
  location: WalkLocation;
  isFirstStop: boolean;
  onArrive: () => void;
  onShowRoute: () => void;
}

export function TravelScreen({ location, isFirstStop, onArrive, onShowRoute }: TravelScreenProps) {
  return (
    <PlayScreen
      eyebrow={isFirstStop ? "Your first destination" : "Your next destination"}
      title={location.name}
      actions={
        <>
          {/* Simulates GPS for now. Later a location check dispatches the same action. */}
          <Button onClick={onArrive} fullWidth>
            I&apos;ve arrived
          </Button>
          <Button variant="outline" onClick={onShowRoute} fullWidth>
            Show route
          </Button>
        </>
      }
    >
      <p className="text-lg">{location.address}</p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.name}, ${location.address}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-sm text-gold underline underline-offset-4"
      >
        Open in maps
      </a>
    </PlayScreen>
  );
}
