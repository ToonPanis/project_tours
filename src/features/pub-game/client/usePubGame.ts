"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PubGameEvent } from "@/types/pub-game";
import type { ClientAction } from "../logic/client-action";
import type { VersionedEvent } from "../logic/api-types";
import type { PlayerView } from "../logic/player-view";
import { fetchGameUpdate, newActionId, sendAction } from "./api";

/** How often each phone asks "anything new?" while the game is on screen. */
export const POLL_INTERVAL_MS = 2_000;

export type ConnectionStatus = "online" | "offline" | "gone";

export interface PubGameHandle {
  /** The game code, e.g. "K7M2QX". */
  code: string;
  view: PlayerView;
  /** New events (for popups), oldest first. Remove them with `dismissEvents`. */
  events: PubGameEvent[];
  dismissEvents: (count: number) => void;
  connection: ConnectionStatus;
  /** Sends an action. Resolves to null on success, or the server's error code. */
  act: (action: ClientAction) => Promise<string | null>;
  /** True while an action is on its way (to disable buttons against double taps). */
  busy: boolean;
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
  const [events, setEvents] = useState<PubGameEvent[]>([]);
  const [connection, setConnection] = useState<ConnectionStatus>("online");
  const [busy, setBusy] = useState(false);
  const versionRef = useRef(initialVersion);
  /** The newest event version already queued: every event becomes a popup at most once. */
  const eventVersionRef = useRef(initialVersion);
  const pollingRef = useRef(false);

  const applyView = useCallback((version: number, nextView: PlayerView) => {
    if (version < versionRef.current) return;
    versionRef.current = version;
    setView(nextView);
  }, []);

  /** Queues the events not seen yet (a poll and an action can both bring the same ones). */
  const addEvents = useCallback((incoming: VersionedEvent[]) => {
    const fresh = incoming.filter((item) => item.version > eventVersionRef.current);
    if (fresh.length === 0) return;
    eventVersionRef.current = Math.max(...fresh.map((item) => item.version));
    setEvents((current) => [...current, ...fresh.map((item) => item.event)]);
  }, []);

  const poll = useCallback(async () => {
    // One request at a time: a slow network must not pile up requests.
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const since = versionRef.current;
      const result = await fetchGameUpdate(code, since);
      if (!result.ok) {
        setConnection(result.status === 404 || result.status === 401 ? "gone" : "offline");
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
      setBusy(true);
      const actionId = newActionId();
      try {
        const knownVersion = versionRef.current;
        let result = await sendAction(code, action, actionId, knownVersion);
        // Lost connection: try once more with the SAME id (applied at most once).
        if (!result.ok && result.status === 0) result = await sendAction(code, action, actionId, knownVersion);
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
        setBusy(false);
      }
    },
    [code, applyView, addEvents, poll],
  );

  const dismissEvents = useCallback((count: number) => setEvents((current) => current.slice(count)), []);

  return { code, view, events, dismissEvents, connection, act, busy };
}
