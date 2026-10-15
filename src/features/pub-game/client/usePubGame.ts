"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PubGameEvent } from "@/types/pub-game";
import type { ClientAction } from "../logic/client-action";
import type { VersionedEvent } from "../logic/api-types";
import type { PlayerView } from "../logic/player-view";
import { isPopupEvent } from "../logic/popups";
import { fetchGameUpdate, newActionId, sendAction } from "./api";

/** How often each phone asks "anything new?" while the game is on screen. */
export const POLL_INTERVAL_MS = 2_000;

export type ConnectionStatus = "online" | "offline" | "gone";

/** An event waiting for its popup. `id` is unique on this phone (one action can create several events). */
export interface QueuedPopup {
  id: number;
  event: PubGameEvent;
}

export interface PubGameHandle {
  /** The game code, e.g. "K7M2QX". */
  code: string;
  view: PlayerView;
  /** Events waiting for a popup, oldest first. */
  popups: QueuedPopup[];
  /** Closes the oldest popup. */
  dismissPopup: () => void;
  connection: ConnectionStatus;
  /** Sends an action. Resolves to null on success, or the server's error code. */
  act: (action: ClientAction) => Promise<string | null>;
  /** True while an action is on its way (to disable buttons against double taps). */
  busy: boolean;
  /** True while this phone uploads a photo or video (see `whileUploading`). */
  uploading: boolean;
  /** Runs an upload; `uploading` stays true until it's done, so the team can't move on halfway. */
  whileUploading: <T>(work: () => Promise<T>) => Promise<T>;
}

/** Answers worth sending the SAME tap again for: no answer at all (0), or a server problem (5xx). */
function isRetryable(status: number): boolean {
  return status === 0 || status >= 500;
}

/**
 * The live game on one phone. Starts from the view the server rendered the
 * page with, then:
 * - polls /state every 2 s while the tab is visible (not in a pocket: saves
 *   battery and data), and right away when it becomes visible again;
 * - sends actions and shows the result immediately, without waiting for the poll.
 *
 * A newer version always wins: an answer that arrives late (slow network)
 * never replaces a newer view.
 */
export function usePubGame(code: string, initialView: PlayerView, initialVersion: number): PubGameHandle {
  const [view, setView] = useState(initialView);
  const [popups, setPopups] = useState<QueuedPopup[]>([]);
  const [connection, setConnection] = useState<ConnectionStatus>("online");
  // Counters, not booleans: two overlapping actions (or uploads) must both finish before buttons work again.
  const [actionsInFlight, setActionsInFlight] = useState(0);
  const [uploadsInFlight, setUploadsInFlight] = useState(0);
  const versionRef = useRef(initialVersion);
  /** The newest event version already seen: every event becomes a popup at most once. */
  const eventVersionRef = useRef(initialVersion);
  const pollingRef = useRef(false);
  const popupIdRef = useRef(0);
  /** The game no longer exists (expired, or this phone isn't in it): stop asking. */
  const goneRef = useRef(false);

  const applyView = useCallback((version: number, nextView: PlayerView) => {
    if (version < versionRef.current) return;
    versionRef.current = version;
    setView(nextView);
  }, []);

  /**
   * Queues the popups not seen yet (a poll and an action can both bring the
   * same events). Other events are only skipped: their effect is already in the view.
   */
  const addEvents = useCallback((incoming: VersionedEvent[]) => {
    const fresh = incoming.filter((item) => item.version > eventVersionRef.current);
    if (fresh.length === 0) return;
    eventVersionRef.current = Math.max(...fresh.map((item) => item.version));
    const newPopups = fresh
      .filter((item) => isPopupEvent(item.event))
      .map((item) => ({ id: ++popupIdRef.current, event: item.event }));
    if (newPopups.length > 0) setPopups((current) => [...current, ...newPopups]);
  }, []);

  const poll = useCallback(async () => {
    // One request at a time: a slow network must not pile up requests.
    if (pollingRef.current || goneRef.current) return;
    pollingRef.current = true;
    try {
      const since = versionRef.current;
      const result = await fetchGameUpdate(code, since);
      if (!result.ok) {
        goneRef.current = result.status === 404 || result.status === 401;
        setConnection(goneRef.current ? "gone" : "offline");
        return;
      }
      setConnection("online");
      if (!result.data.changed || result.data.version <= since) return;
      applyView(result.data.version, result.data.view);
      addEvents(result.data.events);
    } finally {
      pollingRef.current = false;
    }
  }, [code, applyView, addEvents]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") void poll();
    };
    const timer = window.setInterval(tick, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [poll]);

  const act = useCallback(
    async (action: ClientAction): Promise<string | null> => {
      setActionsInFlight((count) => count + 1);
      const actionId = newActionId();
      try {
        const knownVersion = versionRef.current;
        let result = await sendAction(code, action, actionId, knownVersion);
        // No answer, or the server stumbled (perhaps after saving): try once more with
        // the SAME id. The server applies an id at most once, so this never counts twice.
        if (!result.ok && isRetryable(result.status)) result = await sendAction(code, action, actionId, knownVersion);
        if (!result.ok) {
          if (result.status === 0) setConnection("offline");
          // Someone else was quicker: fetch the newest state so the screen matches.
          if (result.status === 409) void poll();
          return result.error;
        }
        setConnection("online");
        applyView(result.data.version, result.data.view);
        // Popups for what this tap caused (a new buddy, a buddy who drinks along…).
        addEvents(result.data.events);
        return null;
      } finally {
        setActionsInFlight((count) => count - 1);
      }
    },
    [code, applyView, addEvents, poll],
  );

  const whileUploading = useCallback(async <T,>(work: () => Promise<T>): Promise<T> => {
    setUploadsInFlight((count) => count + 1);
    try {
      return await work();
    } finally {
      setUploadsInFlight((count) => count - 1);
    }
  }, []);

  const dismissPopup = useCallback(() => setPopups((current) => current.slice(1)), []);

  return {
    code,
    view,
    popups,
    dismissPopup,
    connection,
    act,
    busy: actionsInFlight > 0,
    uploading: uploadsInFlight > 0,
    whileUploading,
  };
}
