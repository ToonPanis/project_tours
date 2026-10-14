/**
 * Hidden Pubs 2.0: the multiplayer pub game.
 * Rules: HIDDEN_PUBS_GAME_RULES.md. Logic: src/features/pub-game/logic/.
 *
 * Everything here is plain data (no classes, no Dates), so a game can be
 * saved as JSON in the database and sent to every phone.
 */

// ─── Game definition: the cafés, the same for every game ────────────────────

/**
 * A part of the route. The cafés of a group are visited one after another;
 * `shuffle: true` means in a random order (per team).
 *
 * Hidden Pubs: [Rococo] [cafés 2–7, shuffled] [8, 9] [10, 11 shuffled] [Den Engel]
 */
export interface RouteGroup {
  cafeIds: string[];
  shuffle: boolean;
}

/** A multiple-choice question. The correct option is NOT here: see `AnswerKey`. */
export interface PubQuestion {
  id: string;
  optionIds: string[];
}

/**
 * A task proven with a photo or video. Points are only added after the host
 * approves the evidence.
 */
export interface EvidenceTask {
  id: string;
  /** "pubtask": part of the café's pubtask. "bonus": Beery's optional bonus. */
  presentedAs: "pubtask" | "bonus";
  evidence: "photo" | "video";
  points: number;
  /** "per-player": `points` for every player who took part (Barok). "per-team": once. */
  scoring: "per-player" | "per-team";
}

export interface PubGameCafe {
  id: string;
  questions: PubQuestion[];
  tasks: EvidenceTask[];
}

export interface PubGameDefinition {
  cafes: PubGameCafe[];
  route: RouteGroup[];
}

/**
 * The correct option per question id. SERVER ONLY: it's passed to the logic by
 * the server and never stored in the game state or sent to a phone before the
 * question is finished.
 */
export type AnswerKey = Record<string, string>;

// ─── Cards ──────────────────────────────────────────────────────────────────

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

/** A card id looks like "1-hearts-Q": deck number, suit, rank. */
export type CardId = string;

export interface Card {
  id: CardId;
  deck: number;
  suit: Suit;
  rank: Rank;
}

export interface TeamDeck {
  /** Cards that can still be offered. */
  drawPile: CardId[];
  /** Drawn cards. They go back into the draw pile when it gets too small. */
  drawn: CardId[];
}

/** What the drawn card still needs from the player before the next draw. */
export type CardFollowUp =
  | "choose-target" // 2: who gets the sip?
  | "choose-buddy" // 8: who is my drinking buddy?
  | "write-rule" // J: the new rule
  | "report-loser" // 4, 7, 9, 10: who lost? (optional)
  | null;

export interface CurrentCard {
  playerId: string;
  cardId: CardId;
  followUp: CardFollowUp;
}

export interface TeamRule {
  id: string;
  text: string;
  playerId: string;
}

/** Card powers. Each holds until someone else in the team draws the same rank. */
export interface TeamRoles {
  questionBitch: string | null;
  thumbKing: string | null;
  beunaas: string | null;
}

// ─── Questions and evidence ─────────────────────────────────────────────────

export interface QuestionProgress {
  wrongOptionIds: string[];
  status: "open" | "correct" | "revealed";
  /** Only set once the question is finished (correct or revealed). */
  correctOptionId: string | null;
  points: number;
}

export interface EvidenceSubmission {
  id: string;
  taskId: string;
  teamId: string;
  submittedBy: string;
  /** Players who did the task (for "per-player" points and single-team scoring). */
  participantIds: string[];
  mediaId: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
}

// ─── The game ───────────────────────────────────────────────────────────────

export interface PubGamePlayer {
  id: string;
  name: string;
  teamId: string;
  isHost: boolean;
}

/** Where a team is in the current café. */
export type CafeStep = "travelling" | "drinks" | "cards" | "pubtask" | "bonus" | "fun-fact";

export interface PubGameTeam {
  id: string;
  name: string;
  /** Café ids in visiting order, drawn at the start. Private to the team. */
  route: string[];
  /** Index in `route` of the current café. */
  cafeIndex: number;
  step: CafeStep;
  deck: TeamDeck;
  /** Players who drew a card at the current café. */
  drewThisCafe: string[];
  /** The 10 face-down cards offered to the player whose turn it is. */
  offer: { playerId: string; cardIds: CardId[] } | null;
  currentCard: CurrentCard | null;
  roles: TeamRoles;
  rules: TeamRule[];
  /** Skipped or submitted evidence tasks of this team (task ids). */
  doneTaskIds: string[];
  finishedAt: string | null;
}

/**
 * "team": teams compete, a question is answered once per team.
 * "player": a single-team game, every player answers and scores alone.
 */
export type ScoringMode = "team" | "player";

export interface PubGameState {
  phase: "lobby" | "playing" | "finished";
  scoringMode: ScoringMode;
  /** Max players per team chosen by the organiser (1–10). */
  playersPerTeam: number;
  teams: PubGameTeam[];
  players: PubGamePlayer[];
  /** Drinking buddies (card 8), game-wide: each pair once, each player in at most one pair. */
  buddies: [string, string][];
  /**
   * Question progress per scorer (a team id, or a player id in "player" mode),
   * then per question id.
   */
  answers: Record<string, Record<string, QuestionProgress>>;
  evidence: EvidenceSubmission[];
  /** True once the first card of the game is drawn (closes free joining). */
  firstCardDrawn: boolean;
  startedAt: string | null;
  finishedAt: string | null;
}

// ─── Actions and events ─────────────────────────────────────────────────────

/**
 * Everything a phone (or the server, for random draws) can do. Random choices
 * and times are decided by the SERVER before the action is applied, so the
 * game logic stays pure and testable.
 */
export type PubGameAction =
  | { type: "JOIN"; playerId: string; name: string; teamId: string }
  | { type: "ADD_PLAYER"; playerId: string; name: string; teamId: string }
  | { type: "START_GAME"; routes: Record<string, string[]>; at: string }
  | { type: "ARRIVE" }
  | { type: "DRINKS_DONE" }
  | { type: "OFFER_CARDS"; cardIds: CardId[] }
  | { type: "PICK_CARD"; index: number }
  | { type: "GIVE_SIP"; targetId: string }
  | { type: "CHOOSE_BUDDY"; buddyId: string }
  | { type: "WRITE_RULE"; ruleId: string; text: string }
  | { type: "REPORT_LOSER"; playerId: string | null }
  | { type: "REPORT_DRINK"; playerId: string }
  | { type: "ANSWER"; questionId: string; optionId: string }
  | { type: "SUBMIT_EVIDENCE"; submissionId: string; taskId: string; mediaId: string; participantIds: string[]; at: string }
  | { type: "SKIP_TASK"; taskId: string }
  | { type: "REVIEW_EVIDENCE"; submissionId: string; approve: boolean; reason?: string }
  | { type: "CONTINUE"; at: string }
  | { type: "END_GAME"; at: string };

/** One sip instruction, after buddies and the Beunaas are applied. */
export interface Sip {
  playerId: string;
  sips: 1 | 2;
  /** "buddy": drinks because their buddy drinks. */
  because: "card" | "buddy";
}

/** What happened, for popups on every phone. Never used for drink statistics. */
export type PubGameEvent =
  | { type: "player-joined"; playerId: string }
  | { type: "game-started" }
  | { type: "card-drawn"; teamId: string; playerId: string; cardId: CardId }
  | { type: "role-changed"; teamId: string; role: keyof TeamRoles; playerId: string; previousPlayerId: string | null }
  | { type: "buddies-linked"; playerIds: [string, string]; endedPairs: [string, string][] }
  | { type: "drink"; teamId: string; sips: Sip[] }
  | { type: "rule-added"; teamId: string; rule: TeamRule; droppedRuleId: string | null }
  | { type: "answered"; scorerId: string; questionId: string; correct: boolean; points: number; finished: boolean }
  | { type: "evidence-submitted"; submissionId: string; teamId: string }
  | { type: "evidence-reviewed"; submissionId: string; teamId: string; approved: boolean }
  | { type: "next-cafe"; teamId: string; cafeId: string }
  | { type: "team-finished"; teamId: string }
  | { type: "game-finished" };

export type PubGameError =
  | "game-not-started"
  | "game-already-started"
  | "game-finished"
  | "not-a-player"
  | "not-host"
  | "unknown-team"
  | "team-full"
  | "name-taken"
  | "joining-closed"
  | "duplicate-player"
  | "invalid-route"
  | "empty-team"
  | "wrong-step"
  | "not-your-turn"
  | "card-pending"
  | "invalid-offer"
  | "no-offer"
  | "invalid-target"
  | "invalid-text"
  | "unknown-question"
  | "invalid-option"
  | "already-answered"
  | "unknown-task"
  | "task-done"
  | "unknown-submission"
  | "already-reviewed"
  | "unfinished";

export type PubGameResult =
  | { ok: true; state: PubGameState; events: PubGameEvent[] }
  | { ok: false; error: PubGameError };
