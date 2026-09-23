"use client";

/**
 * PLAYTEST TOOLING: not part of the game.
 * To remove: delete this folder and the <PlaytestControls> line in WalkPlayer.
 */
import { useState } from "react";
import type { WalkLocation } from "@/types/location";
import type { SessionAction } from "@/types/session";
import { getSolveCurrentStopActions } from "./get-correct-answer";

/** On in development; in production only with NEXT_PUBLIC_PLAYTEST_TOOLS=true. */
export const isPlaytestToolsEnabled =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_PLAYTEST_TOOLS === "true";

interface PlaytestControlsProps {
  currentLocation: WalkLocation | undefined;
  dispatch: (action: SessionAction) => void;
  onRestart: () => void;
}

export function PlaytestControls({ currentLocation, dispatch, onRestart }: PlaytestControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isPlaytestToolsEnabled) return null;

  function solveCurrentStop() {
    getSolveCurrentStopActions(currentLocation?.challenge).forEach(dispatch);
  }

  function jumpToNextStop() {
    solveCurrentStop();
    dispatch({ type: "CONTINUE_TO_NEXT_LOCATION", at: new Date().toISOString() });
  }

  function clearStorage() {
    window.localStorage.clear();
    window.location.reload();
  }

  const toolButtonClasses =
    "min-h-10 rounded-sm bg-yellow-300 px-3 text-left text-sm font-semibold text-black hover:bg-yellow-200";

  return (
    <div className="fixed bottom-3 right-3 z-50 font-sans">
      {isOpen ? (
        <div className="flex w-56 flex-col gap-2 rounded-sm border-4 border-dashed border-yellow-300 bg-black p-3 text-white shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Playtest controls</p>
          <button type="button" className={toolButtonClasses} onClick={() => dispatch({ type: "ARRIVE" })}>
            Simulate arrival
          </button>
          <button type="button" className={toolButtonClasses} onClick={solveCurrentStop}>
            Solve this stop
          </button>
          <button type="button" className={toolButtonClasses} onClick={jumpToNextStop}>
            Jump to next stop
          </button>
          <button type="button" className={toolButtonClasses} onClick={onRestart}>
            Restart game
          </button>
          <button type="button" className={toolButtonClasses} onClick={clearStorage}>
            Clear localStorage
          </button>
          <button type="button" className="mt-1 text-xs underline" onClick={() => setIsOpen(false)}>
            Hide
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-sm border-2 border-dashed border-yellow-300 bg-black px-3 py-2 text-xs font-bold uppercase tracking-wider text-yellow-300 shadow-lg"
        >
          Playtest
        </button>
      )}
    </div>
  );
}
