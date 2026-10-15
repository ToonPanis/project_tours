import type { PubGameAction, PubGameEvent, PubGameState } from "@/types/pub-game";

/** A game as it's saved. `version` goes up by one with every accepted action. */
export interface StoredGame {
  code: string;
  walkSlug: string;
  state: PubGameState;
  version: number;
  createdAt: string;
  /** Games (and their photos) are deleted 7 days after creation (D29). */
  expiresAt: string;
  /**
   * At most this many players, the organiser included: the number of tickets
   * bought (commercial platform P3). Not part of the game state: the game rules
   * don't know about it; joining and adding players check it. Absent = no limit.
   */
  seatLimit?: number;
}

/** An event, with the game version its action created (phones ask for "events since version X"). */
export interface StoredEvent {
  version: number;
  event: PubGameEvent;
}

export interface CommitInput {
  code: string;
  /** The version the new state was computed from. */
  expectedVersion: number;
  /** The phone's id for this tap: the same id twice = the same action (retry, double tap). */
  actionId: string;
  playerId: string;
  action: PubGameAction;
  state: PubGameState;
  events: PubGameEvent[];
}

export type CommitResult =
  | { status: "committed"; version: number }
  /** This action id was already applied: nothing changed. */
  | { status: "duplicate"; version: number }
  /** Someone else changed the game in between: load it again and retry. */
  | { status: "conflict" };

/**
 * Where games are saved. Two implementations: `MemoryGameStore` (development
 * and tests, lost on restart) and `MongoGameStore` (MongoDB Atlas). The game
 * service only talks to this interface, so it doesn't know which one it uses
 * (the same idea as `walkRepository` for walks).
 *
 * `commitAction` must be ATOMIC: it saves the new state only when the game is
 * still at `expectedVersion` and the action id is new, all in one step.
 */
export interface GameStore {
  /** Saves a new game. Returns false when the code is already taken. */
  createGame(game: StoredGame): Promise<boolean>;
  /** The game, or null when it doesn't exist or has expired. */
  getGame(code: string): Promise<StoredGame | null>;
  /**
   * Only the game's version (null: no such game, or expired). Polls ask this first:
   * when the phone already has this version, the whole game isn't read at all.
   */
  getVersion(code: string): Promise<number | null>;
  commitAction(input: CommitInput): Promise<CommitResult>;
  /** The version an action id produced, or null when the action id is unknown. */
  findAction(code: string, actionId: string): Promise<number | null>;
  /**
   * Events of the actions after `afterVersion` up to and including `upToVersion`
   * (the version of the state they're sent with), oldest first, at most `limit`.
   */
  eventsSince(code: string, afterVersion: number, upToVersion: number, limit: number): Promise<StoredEvent[]>;

  /** Player identity: only a hash of the secret in the player's cookie is stored. */
  /** `expiresAt`: the game's, so the token is deleted together with it. */
  savePlayerToken(code: string, tokenHash: string, playerId: string, expiresAt: string): Promise<void>;
  findPlayerByToken(code: string, tokenHash: string): Promise<string | null>;
}
