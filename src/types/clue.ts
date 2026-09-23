/** Icon names map to SVG icons in the UI (no emoji). */
export type ClueIcon = "key" | "lion" | "number" | "compass" | "cellar" | "quill";

/**
 * A collectible piece of information earned at a location.
 * Clues live on the walk (not the location) so the Ledger can list them all,
 * and final puzzles can reference them by id.
 */
export interface Clue {
  id: string;
  /** Shown in the Ledger, e.g. "A carved beast". */
  title: string;
  /** The actual clue, e.g. "THE LION". */
  value: string;
  description?: string;
  icon?: ClueIcon;
  /** The location where this clue is earned. */
  sourceLocationId: string;
}
