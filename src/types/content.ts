/**
 * Location content is a list of typed blocks, so the app always knows whether
 * a paragraph is real history, a local legend or fictional game story.
 */

export interface Source {
  title: string;
  url?: string;
}

/** Real history. Must be "verified" before it can be presented as fact. */
export interface HistoryBlock {
  kind: "history";
  body: string;
  /** "research-needed" = placeholder text; the UI must show it as unverified. */
  verification: "verified" | "research-needed";
  sources?: Source[];
}

/** A local legend: told as a legend, never presented as fact. */
export interface LegendBlock {
  kind: "legend";
  body: string;
  sources?: Source[];
}

/** Fictional game narrative (e.g. "The Lost Tavern Ledger"). */
export interface StoryBlock {
  kind: "story";
  body: string;
  /** Chapter name, used later by the Ledger screen. */
  chapterTitle?: string;
}

export type ContentBlock = HistoryBlock | LegendBlock | StoryBlock;

export type ContentBlockKind = ContentBlock["kind"];
