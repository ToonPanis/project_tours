"use client";

import { useEffect } from "react";
import { mapWorkerUrl } from "./config";

/**
 * Downloads the map code ahead of time, while the walker is still reading a
 * stop or a café screen, so the map opens quickly when they tap "navigate".
 * Without this, opening the first map on slow 4G first waits for ~430 KB
 * (the MapLibre code ≈ 280 KB + its worker ≈ 150 KB, gzip).
 *
 * - Only in idle time, after the page itself is done (never competes with it).
 * - Not when the phone asks to save data (Data Saver).
 * - The same import as NavigationScreen's next/dynamic, so it is one download, cached.
 */
let started = false;

/** Starts the download once per page visit. Exported for tests. */
export function preloadWalkingMap(): void {
  if (started || typeof window === "undefined") return;
  // Production only: in `next dev` chunks are compiled on demand (preloading would only slow the
  // dev server down), and unit tests (jsdom) must never load the real map library by surprise.
  if (process.env.NODE_ENV !== "production") return;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;
  started = true;

  void import("./components/WalkingMap")
    .then(() => import("maplibre-gl"))
    .then(({ getVersion }) => {
      // The worker files: a hint for the browser cache (Safari ignores it; then they load with the map).
      const workerUrl = mapWorkerUrl(getVersion());
      for (const href of [workerUrl, workerUrl.replace("maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs")]) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "script";
        link.href = href;
        document.head.append(link);
      }
    })
    .catch(() => {
      // Offline or blocked: the map loads (or explains) itself when it opens.
      started = false;
    });
}

/** Test helper: forget that the download started. */
export function resetMapPreload(): void {
  started = false;
}

/** Calls preloadWalkingMap() once the browser is idle (or after 2 s where requestIdleCallback is missing: Safari). */
export function usePreloadMap(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => preloadWalkingMap(), { timeout: 5_000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(preloadWalkingMap, 2_000);
    return () => window.clearTimeout(timer);
  }, [enabled]);
}
