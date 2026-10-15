"use client";

import { useMemo } from "react";
import { cafeDestination, walkBetween } from "@/data/walks/hidden-pubs/game/navigation";
import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import type { PlayerView } from "../logic/player-view";

interface CafeNavigationProps {
  view: PlayerView;
  gpsEnabled: boolean;
  onGpsEnabled: () => void;
  onArrive: () => void;
}

/**
 * The team's walk to its next café, on the same map and GPS navigation as the
 * guide walks: live position, walking directions, distance, arrival detection
 * and "I'm here". The position stays on this phone: only "arrived" goes to the server.
 * Loaded lazily by NextCafeScreen (it brings the walking routes along).
 */
export default function CafeNavigation({ view, gpsEnabled, onGpsEnabled, onArrive }: CafeNavigationProps) {
  const { route, cafeIndex } = view.team;
  const cafeId = route[cafeIndex];
  // The same object on every poll: a new one would re-add the map marker (and reset the camera without GPS).
  const destination = useMemo(() => cafeDestination(cafeId, cafeIndex + 1), [cafeId, cafeIndex]);
  return (
    <NavigationScreen
      // A new café starts a fresh navigation (clean GPS tracking).
      key={cafeId}
      destination={destination}
      route={walkBetween(route[cafeIndex - 1], cafeId)}
      gpsAlreadyEnabled={gpsEnabled}
      onGpsEnabled={onGpsEnabled}
      onArrive={onArrive}
    />
  );
}
