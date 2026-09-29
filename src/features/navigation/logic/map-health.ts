/**
 * Whether the map can show the streets, from the events MapLibre sends.
 * Pure logic (no MapLibre import), so it can be tested without a browser.
 *
 * - An error before the map ever loaded (style unreachable, worker missing,
 *   no WebGL) means the walker sees nothing: "load-failed".
 * - After that, a single failed tile is harmless (a short signal drop), but
 *   several in a row mean the connection or the tile service is gone: grey
 *   squares without explanation. Then "tiles-failing", until a tile loads again.
 */
export type MapHealth = "ok" | "load-failed" | "tiles-failing";

export interface MapHealthState {
  hasLoaded: boolean;
  hasLoadFailed: boolean;
  tileErrorsInARow: number;
}

export type MapHealthEvent =
  | { type: "loaded" }
  /** `isTileError`: the error belongs to one map tile (MapLibre puts the tile on the event). */
  | { type: "error"; isTileError: boolean }
  | { type: "tile-loaded" };

/** Failed tiles in a row before the walker is told part of the map is missing. */
export const TILE_ERRORS_BEFORE_NOTICE = 3;

export const INITIAL_MAP_HEALTH: MapHealthState = { hasLoaded: false, hasLoadFailed: false, tileErrorsInARow: 0 };

export function updateMapHealth(state: MapHealthState, event: MapHealthEvent): MapHealthState {
  switch (event.type) {
    case "loaded":
      return { hasLoaded: true, hasLoadFailed: false, tileErrorsInARow: 0 };
    case "error":
      if (!state.hasLoaded) return { ...state, hasLoadFailed: true };
      // Other errors after loading (e.g. a missing icon) don't leave grey squares.
      return event.isTileError ? { ...state, tileErrorsInARow: state.tileErrorsInARow + 1 } : state;
    case "tile-loaded":
      return state.tileErrorsInARow === 0 ? state : { ...state, tileErrorsInARow: 0 };
  }
}

export function getMapHealth(state: MapHealthState): MapHealth {
  if (state.hasLoadFailed) return "load-failed";
  if (state.tileErrorsInARow >= TILE_ERRORS_BEFORE_NOTICE) return "tiles-failing";
  return "ok";
}
