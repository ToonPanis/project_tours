"use client";

import { useState } from "react";
import type { Walk } from "@/types/walk";
import { useWalkSession, type WalkSessionControls } from "./useWalkSession";

export interface PlayerShell extends WalkSessionControls {
  /** The route panel (list of stops; "Ledger" in Hidden Pubs). */
  isRouteOpen: boolean;
  openRoute: () => void;
  closeRoute: () => void;
  /** Live GPS is asked for once per visit (not remembered after a reload). */
  isGpsEnabled: boolean;
  enableGps: () => void;
  /** Changing this key restarts the navigation screen (playtest "reset navigation"). */
  navigationKey: number;
  resetNavigation: () => void;
  /** Deletes the saved walk and closes the route panel. Each player adds its own resets. */
  restartBase: () => void;
}

/**
 * The state both players (game and guide) share: the saved session plus a few
 * visit-only switches. Each player keeps its own screens and flow (game phases,
 * chapter cards, detours…) on top of this.
 */
export function usePlayerShell(walk: Walk): PlayerShell {
  const walkSession = useWalkSession(walk);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [navigationKey, setNavigationKey] = useState(0);

  return {
    ...walkSession,
    isRouteOpen,
    openRoute: () => setIsRouteOpen(true),
    closeRoute: () => setIsRouteOpen(false),
    isGpsEnabled,
    enableGps: () => setIsGpsEnabled(true),
    navigationKey,
    resetNavigation: () => setNavigationKey((key) => key + 1),
    restartBase: () => {
      walkSession.resetSession();
      setIsRouteOpen(false);
    },
  };
}
