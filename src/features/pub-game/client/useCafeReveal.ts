"use client";

import { useEffect, useState } from "react";
import type { CafeReveal } from "../logic/api-types";
import { fetchReveal } from "./api";

/**
 * The explanations and fun fact this player has earned at a café, fetched
 * from the server (they give answers away, so they're not in the page).
 * `progressKey` changes when something new may be revealed (a question
 * finished, the fun-fact step reached): then it asks again.
 */
export function useCafeReveal(code: string, cafeId: string, progressKey: string): CafeReveal | null {
  const [reveal, setReveal] = useState<{ key: string; data: CafeReveal } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const key = `${cafeId}|${progressKey}`;
    void fetchReveal(code, cafeId).then((result) => {
      if (!cancelled && result.ok) setReveal({ key, data: result.data });
    });
    return () => {
      cancelled = true;
    };
  }, [code, cafeId, progressKey]);

  // An older answer (other café) never shows on a new café.
  return reveal && reveal.key.startsWith(`${cafeId}|`) ? reveal.data : null;
}
