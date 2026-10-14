/**
 * The texts of Hidden Pubs 2.0, per language. Two kinds:
 *
 * - PubGameTexts (content/<lang>.ts): what a phone may know before answering:
 *   questions, options, hints, task descriptions. The game page sends them to
 *   the phone in the player's language.
 * - PubGameReveals (reveals.server.ts): what gives an answer away: the
 *   explanation after a question and the café's fun fact. They stay on the
 *   server and are sent only once the question or café is finished.
 *
 * Café names, drink names and street names are not here: they're the same in
 * every language.
 */
export interface QuestionText {
  question: string;
  /** Text per option id (definition.ts). */
  options: Record<string, string>;
  /** Shown one by one after each wrong answer. Only hints from the concept or approved by the owner (D24). */
  hints: string[];
}

export interface TaskText {
  title: string;
  instruction: string;
}

export interface CafeTexts {
  questions: Record<string, QuestionText>;
  tasks: Record<string, TaskText>;
}

export interface PubGameTexts {
  cafes: Record<string, CafeTexts>;
}

/** History is labelled as history (with its research status), legends as legends, and the cafés' own stories as theirs. */
export type FunFactKind = "history" | "legend" | "cafe-story";

export interface FunFact {
  title: string;
  kind: FunFactKind;
  /** For history: how sure we are. Unresearched text also carries a visible [research required] marker. */
  status: "verified" | "partially-verified" | "research-required";
  paragraphs: string[];
}

export interface CafeReveals {
  /** After the question is finished (right or shown), per question id. */
  explanations: Record<string, string>;
  /** After the café's pubtask. */
  funFact: FunFact;
}

export interface PubGameReveals {
  cafes: Record<string, CafeReveals>;
}
