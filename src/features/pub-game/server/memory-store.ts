import type { CommitInput, CommitResult, GameStore, StoredEvent, StoredGame } from "./game-store";

interface MemoryGame {
  game: StoredGame;
  /** action id → the version it produced */
  actions: Map<string, number>;
  events: StoredEvent[];
  /** token hash → player id */
  tokens: Map<string, string>;
}

/**
 * Games in memory: for development and tests. Everything is lost when the
 * server restarts, and on Vercel every server instance would have its own
 * memory, so production needs the Postgres store (stage 3).
 *
 * `commitAction` is atomic here for free: JavaScript runs one piece of code at
 * a time, and the check + save happen without an `await` in between.
 */
export class MemoryGameStore implements GameStore {
  private games = new Map<string, MemoryGame>();

  constructor(private readonly now: () => Date = () => new Date()) {}

  async createGame(game: StoredGame): Promise<boolean> {
    if (this.find(game.code)) return false;
    this.games.set(game.code, { game: structuredClone(game), actions: new Map(), events: [], tokens: new Map() });
    return true;
  }

  async getGame(code: string): Promise<StoredGame | null> {
    const found = this.find(code);
    // A copy, so a caller can't change the saved game by accident.
    return found ? structuredClone(found.game) : null;
  }

  async commitAction(input: CommitInput): Promise<CommitResult> {
    const found = this.find(input.code);
    if (!found) return { status: "conflict" };

    const earlier = found.actions.get(input.actionId);
    if (earlier !== undefined) return { status: "duplicate", version: earlier };
    if (found.game.version !== input.expectedVersion) return { status: "conflict" };

    const version = found.game.version + 1;
    found.game = { ...found.game, state: structuredClone(input.state), version };
    found.actions.set(input.actionId, version);
    found.events.push(...input.events.map((event) => ({ version, event: structuredClone(event) })));
    return { status: "committed", version };
  }

  async findAction(code: string, actionId: string): Promise<number | null> {
    return this.find(code)?.actions.get(actionId) ?? null;
  }

  async eventsSince(code: string, version: number, limit: number): Promise<StoredEvent[]> {
    const events = this.find(code)?.events.filter((item) => item.version > version) ?? [];
    return structuredClone(events.slice(0, limit));
  }

  async savePlayerToken(code: string, tokenHash: string, playerId: string): Promise<void> {
    this.find(code)?.tokens.set(tokenHash, playerId);
  }

  async findPlayerByToken(code: string, tokenHash: string): Promise<string | null> {
    return this.find(code)?.tokens.get(tokenHash) ?? null;
  }

  /** The game, after removing it when it has expired. */
  private find(code: string): MemoryGame | undefined {
    const found = this.games.get(code);
    if (found && new Date(found.game.expiresAt) <= this.now()) {
      this.games.delete(code);
      return undefined;
    }
    return found;
  }
}
