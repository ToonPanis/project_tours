import type { Source } from "./content";

/** How well a piece of real history has been checked. */
export type VerificationStatus = "verified" | "partially-verified" | "research-required";

/**
 * Real history about a location, shown AFTER its challenge is solved:
 * players discover something first, then learn why it matters.
 * Never put fiction here; the ledger story lives in `content` (kind "story").
 */
export interface HistoricalReveal {
  status: VerificationStatus;
  paragraphs: string[];
  /** Where the facts come from. Required before `status` can be "verified". */
  sources: Source[];
}
