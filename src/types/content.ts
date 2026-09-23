/**
 * Location content is a list of typed blocks, so the app always knows whether
 * a paragraph is real history, a local legend or fictional game story.
 */

export interface Source {
  title: string;
  url?: string;
}

/**
 * When a block is shown during play: on arrival (default) or after the
 * location's challenge is solved.
 */
export type RevealMoment = "arrival" | "solved";

interface BaseBlock {
  body: string;
  revealAt?: RevealMoment;
}

/** Real history. Must be "verified" before it can be presented as fact. */
export interface HistoryBlock extends BaseBlock {
  kind: "history";
  /** "research-needed" = placeholder text; the UI must show it as unverified. */
  verification: "verified" | "research-needed";
  sources?: Source[];
}

/** A local legend: told as a legend, never presented as fact. */
export interface LegendBlock extends BaseBlock {
  kind: "legend";
  sources?: Source[];
}

/** Fictional game narrative (e.g. "The Lost Tavern Ledger"). */
export interface StoryBlock extends BaseBlock {
  kind: "story";
  /** Chapter name, used later by the Ledger screen. */
  chapterTitle?: string;
}

export type ContentBlock = HistoryBlock | LegendBlock | StoryBlock;

export type ContentBlockKind = ContentBlock["kind"];
