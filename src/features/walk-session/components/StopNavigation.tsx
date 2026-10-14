"use client";

import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import { QuestClueButton } from "@/features/quests/components/QuestClueButton";
import { useT } from "@/i18n/client";
import type { CurrentStop } from "../logic/current-stop";
import type { PlayerShell } from "../state/usePlayerShell";

interface StopNavigationProps {
  shell: Pick<PlayerShell, "navigationKey" | "isGpsEnabled" | "enableGps" | "openRoute">;
  stop: Pick<CurrentStop, "location" | "routeToCurrent">;
  onArrive: () => void;
}

/**
 * Walking navigation to the current stop, the same in the game and the guide player.
 * A stop with a "find the place" quest gets a search zone instead of a pin, and its clue
 * stays at hand. (A "find a detail" quest starts only after arriving: normal navigation.)
 */
export function StopNavigation({ shell, stop, onArrive }: StopNavigationProps) {
  const t = useT();
  const quest = stop.location.quest?.type === "location" ? stop.location.quest : undefined;

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
      zoneSearch={
        quest ? { zone: quest.searchZone, arrivalRadiusMeters: quest.arrivalRadiusMeters, hint: quest.zoneHint } : undefined
      }
      extraActions={quest ? <QuestClueButton quest={quest} t={t} /> : undefined}
    />
  );
}
