"use client";

/**
 * PLAYTEST TOOLING: not part of the game.
 * To remove: delete this folder and the <PlaytestControls> line in WalkPlayer.
 */
import { useState } from "react";
import type { SessionAction, WalkSession } from "@/types/session";
import type { Team } from "@/types/team";
import type { Walk } from "@/types/walk";
import { getOrderedLocations } from "../logic/route";
import { getJumpToStopActions, getNextStageActions, getUnlockNextActions } from "./get-correct-answer";

/**
 * Always on in development. In a production build (e.g. Vercel) only when
 * NEXT_PUBLIC_PLAYTEST_TOOLS=true is set. Remove that variable before real
 * players use the site.
 */
export const isPlaytestToolsEnabled =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_PLAYTEST_TOOLS === "true";

interface PlaytestControlsProps {
  walk: Walk;
  session: WalkSession;
  dispatch: (action: SessionAction) => void;
  /** Starts a fresh session with the same team (used to jump to a stop). */
  startNewSession: (team: Team) => void;
  onRestart: () => void;
}

export function PlaytestControls({ walk, session, dispatch, startNewSession, onRestart }: PlaytestControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isPlaytestToolsEnabled) return null;

  const orderedLocations = getOrderedLocations(walk);
  const currentLocation = orderedLocations.find((location) => location.id === session.currentLocationId);
  const now = () => new Date().toISOString();

  function unlockNextLocation() {
    if (currentLocation) getUnlockNextActions(currentLocation, now()).forEach(dispatch);
  }

  function jumpToStop(stopNumber: number) {
    // Start over with the same team, then fast-forward with normal actions.
    // (React applies these queued updates in order.)
    startNewSession(session.team);
    getJumpToStopActions(walk, stopNumber, now()).forEach(dispatch);
    setIsOpen(false);
  }

  function clearStorage() {
    window.localStorage.clear();
    window.location.reload();
  }

  const toolButtonClasses =
    "min-h-10 rounded-sm bg-yellow-300 px-3 text-left text-sm font-semibold text-black hover:bg-yellow-200";

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 right-3 z-50 rounded-sm border-2 border-dashed border-yellow-300 bg-black/80 px-2 py-1 font-sans text-[0.65rem] font-bold uppercase tracking-wider text-yellow-300"
      >
        Playtest tools
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 flex max-h-[80dvh] w-60 flex-col gap-2 overflow-y-auto rounded-sm border-4 border-dashed border-yellow-300 bg-black p-3 font-sans text-white shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Playtest tools</p>

      <button type="button" className={toolButtonClasses} onClick={() => dispatch({ type: "ARRIVE" })}>
        Simulate arrival
      </button>
      <button
        type="button"
        className={toolButtonClasses}
        onClick={() => getNextStageActions(walk, session, now()).forEach(dispatch)}
      >
        Skip to next stage
      </button>
      <button type="button" className={toolButtonClasses} onClick={unlockNextLocation}>
        Unlock next location
      </button>

      <label className="flex flex-col gap-1 text-xs font-semibold">
        Jump to stop
        <select
          className="min-h-10 rounded-sm bg-yellow-300 px-2 text-sm text-black"
          value=""
          onChange={(event) => jumpToStop(Number(event.target.value))}
        >
          <option value="" disabled>
            Choose…
          </option>
          {orderedLocations.map((location) => (
            <option key={location.id} value={location.order}>
              {location.order}. {location.name}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className={toolButtonClasses} onClick={onRestart}>
        Reset walk
      </button>
      <button type="button" className={toolButtonClasses} onClick={clearStorage}>
        Clear localStorage
      </button>
      <button type="button" className="mt-1 text-xs underline" onClick={() => setIsOpen(false)}>
        Hide
      </button>
    </div>
  );
}
