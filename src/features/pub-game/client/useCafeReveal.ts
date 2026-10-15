"use client";

import { useEffect, useState } from "react";
import type { CafeReveal } from "../logic/api-types";
import { fetchReveal } from "./api";

/** After a failed fetch (no network, server trouble), ask again this much later. */
export const REVEAL_RETRY_MS = 5_000;

/**
 * The explanations and fun fact this player has earned at a café, fetched
 * from the server (they give answers away, so they're not in the page).
 * `progressKey` changes when something new may be revealed (a question
 * finished, the fun-fact step reached): then it asks again. A failed fetch
 * is retried, so a fun fact never stays on "loading" after a dead spot.
 */
export function useCafeReveal(code: string, cafeId: string, progressKey: string): CafeReveal | null {
  const [reveal, setReveal] = useState<{ key: string; data: CafeReveal } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | undefined;
    const key = `${cafeId}|${progressKey}`;
    void fetchReveal(code, cafeId).then((result) => {
      if (cancelled) return;
      if (result.ok) setReveal({ key, data: result.data });
      else if (result.status === 0 || result.status >= 500) {
        retryTimer = window.setTimeout(() => setAttempt((count) => count + 1), REVEAL_RETRY_MS);
      }
    });
    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [code, cafeId, progressKey, attempt]);

  // An older answer (other café) never shows on a new café.
  return reveal && reveal.key.startsWith(`${cafeId}|`) ? reveal.data : null;
}
