"use client";

import { useCallback, useEffect, useState } from "react";
import { createId } from "@/lib/create-id";
import type { SessionAction, WalkSession } from "@/types/session";
import type { Team } from "@/types/team";
import type { Walk } from "@/types/walk";
import { createWalkSession } from "../logic/create-session";
import { applySessionAction } from "../logic/session-reducer";
import { localWalkSessionStore, type WalkSessionStore } from "../storage/session-storage";

export interface WalkSessionControls {
  /** False until the saved game (if any) has been read from storage. */
  isLoaded: boolean;
  session: WalkSession | null;
  dispatch: (action: SessionAction) => void;
  startNewSession: (team: Team) => void;
  /** Deletes the saved game. */
  resetSession: () => void;
}

/**
 * Holds the current walk session, applies actions through the game rules
 * and saves every change. Components only use this hook, so switching to a
 * server or realtime backend later means changing only this file.
 */
export function useWalkSession(
  walk: Walk,
  store: WalkSessionStore = localWalkSessionStore,
): WalkSessionControls {
  const [session, setSession] = useState<WalkSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load once, in the browser. (The server has no localStorage, so this
  // can't happen during the first render without a hydration mismatch.)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading an external store once on mount
    setSession(store.load(walk));
    setIsLoaded(true);
  }, [walk, store]);

  // Save after every change.
  useEffect(() => {
    if (session) store.save(session);
  }, [session, store]);

  const dispatch = useCallback(
    (action: SessionAction) => {
      // The functional update means several dispatches in a row each see
      // the result of the previous one.
      setSession((current) => (current ? applySessionAction(walk, current, action) : current));
    },
    [walk],
  );

  const startNewSession = useCallback(
    (team: Team) => {
      setSession(
        createWalkSession({ walk, team, sessionId: createId(), startedAt: new Date().toISOString() }),
      );
    },
    [walk],
  );

  const resetSession = useCallback(() => {
    store.clear(walk.slug);
    setSession(null);
  }, [store, walk.slug]);

  return { isLoaded, session, dispatch, startNewSession, resetSession };
}
