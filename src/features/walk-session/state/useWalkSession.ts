"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createId } from "@/lib/create-id";
import type { SessionAction, WalkSession } from "@/types/session";
import type { Team } from "@/types/team";
import type { Walk } from "@/types/walk";
import { createWalkSession } from "../logic/create-session";
import { applySessionAction } from "../logic/session-reducer";
import { reconcileSessionWithWalk } from "../logic/reconcile-session";
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
  // Which walk (and store) the session was loaded for.
  const loadedFromRef = useRef<{ slug: string; store: WalkSessionStore } | null>(null);

  // Load once per walk, in the browser. (The server has no localStorage, so this
  // can't happen during the first render without a hydration mismatch.)
  // Switching the language re-renders the page with a new `walk` object for the
  // SAME walk: the session in memory is kept then. Reloading it from storage would
  // lose the game whenever saving has been failing (private mode, storage full).
  useEffect(() => {
    const loadedFrom = loadedFromRef.current;
    if (loadedFrom?.slug === walk.slug && loadedFrom.store === store) {
      // Same walk, new data (e.g. another language, or a content update): keep the game
      // in memory, adapted to the walk's current stops. If it can't be adapted (the
      // team's current stop was removed), the game starts fresh (M-04 decision).
      setSession((current) =>
        current === null ? null : reconcileSessionWithWalk(walk, current),
      );
      return;
    }
    loadedFromRef.current = { slug: walk.slug, store };
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

  // Never hand out another walk's session: right after switching to a different walk
  // the old one is still in state for one render, until the effect above loads the new one.
  const isSessionForThisWalk = session === null || session.walkSlug === walk.slug;
  return {
    isLoaded: isLoaded && isSessionForThisWalk,
    session: isSessionForThisWalk ? session : null,
    dispatch,
    startNewSession,
    resetSession,
  };
}
