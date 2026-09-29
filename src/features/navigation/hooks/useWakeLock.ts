"use client";

import { useEffect } from "react";

/**
 * Keeps the screen on while `active` (Screen Wake Lock API), so the phone
 * doesn't sleep during a short walk. Progressive enhancement: browsers
 * without support simply ignore it, and navigation works the same.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

    let wakeLock: WakeLockSentinel | null = null;
    let isCancelled = false;

    async function requestWakeLock() {
      try {
        const sentinel = await navigator.wakeLock.request("screen");
        if (isCancelled) {
          await sentinel.release();
        } else {
          wakeLock = sentinel;
        }
      } catch {
        // Not allowed right now (e.g. low battery mode). Not a problem.
      }
    }

    // The browser releases the lock when the page is hidden; ask again when it's back.
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void requestWakeLock();
    }

    void requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isCancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void wakeLock?.release();
    };
  }, [active]);
}
