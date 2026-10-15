"use client";

import { GuideWalkPlayer } from "@/features/guide/components/GuideWalkPlayer";
import { PositionSimulationProvider } from "@/features/navigation/simulation/PositionSimulation";
import type { Walk } from "@/types/walk";

interface WalkPlayerProps {
  walk: Walk;
}

/**
 * The whole play experience of a walk on one page (/walks/[slug]/play).
 * Every walk played here is a guide walk; the multiplayer pub game has its
 * own pages at /games/… (the play page redirects there).
 */
export function WalkPlayer({ walk }: WalkPlayerProps) {
  return (
    // Lets the playtest tools feed simulated GPS positions to navigation.
    <PositionSimulationProvider>
      <GuideWalkPlayer walk={walk} />
    </PositionSimulationProvider>
  );
}
