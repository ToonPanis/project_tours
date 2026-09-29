"use client";

import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import type { CurrentStop } from "../logic/current-stop";
import type { PlayerShell } from "../state/usePlayerShell";

interface StopNavigationProps {
  shell: Pick<PlayerShell, "navigationKey" | "isGpsEnabled" | "enableGps" | "openRoute">;
  stop: Pick<CurrentStop, "location" | "routeToCurrent">;
  onArrive: () => void;
}

/** Walking navigation to the current stop, the same in the game and the guide player. */
export function StopNavigation({ shell, stop, onArrive }: StopNavigationProps) {
  return (
    <NavigationScreen
      // A new stop (or a playtest reset) starts a fresh navigation screen: its GPS tracking starts clean.
      key={`${stop.location.id}-${shell.navigationKey}`}
      destination={stop.location}
      route={stop.routeToCurrent}
      gpsAlreadyEnabled={shell.isGpsEnabled}
      onGpsEnabled={shell.enableGps}
      onArrive={onArrive}
      onShowRoute={shell.openRoute}
    />
  );
}
