import postgres from "postgres";
import type { PubGameEvent, PubGameState } from "@/types/pub-game";
import type { CommitInput, CommitResult, GameStore, StoredEvent, StoredGame } from "./game-store";

type Sql = postgres.Sql;

/** JSON for a jsonb column (works on the connection and inside a transaction). The game state is plain data. */
function asJson(sql: Pick<Sql, "json">, value: unknown) {
  return sql.json(value as postgres.JSONValue);
}

interface GameRow {
  code: string;
  walk_slug: string;
  state: PubGameState;
  version: number;
  created_at: Date;
  expires_at: Date;
}

/**
 * Games in Postgres (Neon in production). Tables: db/migrations/001_pub_games.sql.
 *
 * Every query uses the `sql` tagged template: values like ${code} are sent
 * separately from the SQL text, so they can never change the query (no SQL injection).
 */
export class PostgresGameStore implements GameStore {
  constructor(private readonly sql: Sql) {}

  async createGame(game: StoredGame): Promise<boolean> {
    // Clean up while we're here: expired games, with their actions, events and players (ON DELETE CASCADE).
    await this.sql`DELETE FROM pub_games WHERE expires_at <= now()`;
    const rows = await this.sql`
      INSERT INTO pub_games (code, walk_slug, state, version, created_at, expires_at)
      VALUES (${game.code}, ${game.walkSlug}, ${asJson(this.sql, game.state)}, ${game.version},
              ${game.createdAt}, ${game.expiresAt})
      ON CONFLICT (code) DO NOTHING
      RETURNING code`;
    return rows.length === 1;
  }

  async getGame(code: string): Promise<StoredGame | null> {
    const [row] = await this.sql<GameRow[]>`
      SELECT code, walk_slug, state, version, created_at, expires_at
      FROM pub_games WHERE code = ${code} AND expires_at > now()`;
    if (!row) return null;
    return {
      code: row.code,
      walkSlug: row.walk_slug,
      state: row.state,
      version: row.version,
      createdAt: row.created_at.toISOString(),
      expiresAt: row.expires_at.toISOString(),
    };
  }

  /**
   * One transaction. `FOR UPDATE` locks the game row, so two phones saving at
   * the same moment are handled one after the other: the second one sees the
   * new version and gets "conflict" (the service then retries with fresh state).
   */
  async commitAction(input: CommitInput): Promise<CommitResult> {
    return this.sql.begin(async (tx): Promise<CommitResult> => {
      const [game] = await tx<{ version: number }[]>`
        SELECT version FROM pub_games
        WHERE code = ${input.code} AND expires_at > now()
        FOR UPDATE`;
      if (!game) return { status: "conflict" };

      const [earlier] = await tx<{ version: number }[]>`
        SELECT version FROM pub_game_actions
        WHERE game_code = ${input.code} AND action_id = ${input.actionId}`;
      if (earlier) return { status: "duplicate", version: earlier.version };
      if (game.version !== input.expectedVersion) return { status: "conflict" };

      const version = game.version + 1;
      await tx`
        UPDATE pub_games SET state = ${asJson(tx, input.state)}, version = ${version}
        WHERE code = ${input.code}`;
      await tx`
        INSERT INTO pub_game_actions (game_code, action_id, player_id, action, version)
        VALUES (${input.code}, ${input.actionId}, ${input.playerId}, ${asJson(tx, input.action)}, ${version})`;
      for (const [position, event] of input.events.entries()) {
        await tx`
          INSERT INTO pub_game_events (game_code, version, position, event)
          VALUES (${input.code}, ${version}, ${position}, ${asJson(tx, event)})`;
      }
      return { status: "committed", version };
    });
  }

  async findAction(code: string, actionId: string): Promise<number | null> {
    const [row] = await this.sql<{ version: number }[]>`
      SELECT version FROM pub_game_actions WHERE game_code = ${code} AND action_id = ${actionId}`;
    return row?.version ?? null;
  }

  async eventsSince(code: string, version: number, limit: number): Promise<StoredEvent[]> {
    const rows = await this.sql<{ version: number; event: PubGameEvent }[]>`
      SELECT version, event FROM pub_game_events
      WHERE game_code = ${code} AND version > ${version}
      ORDER BY version, position
      LIMIT ${limit}`;
    return rows.map((row) => ({ version: row.version, event: row.event }));
  }

  async savePlayerToken(code: string, tokenHash: string, playerId: string): Promise<void> {
    await this.sql`
      INSERT INTO pub_game_players (game_code, token_hash, player_id)
      VALUES (${code}, ${tokenHash}, ${playerId})
      ON CONFLICT DO NOTHING`;
  }

  async findPlayerByToken(code: string, tokenHash: string): Promise<string | null> {
    const [row] = await this.sql<{ player_id: string }[]>`
      SELECT p.player_id FROM pub_game_players p
      JOIN pub_games g ON g.code = p.game_code
      WHERE p.game_code = ${code} AND p.token_hash = ${tokenHash} AND g.expires_at > now()`;
    return row?.player_id ?? null;
  }
}

/**
 * The connection to the database. `prepare: false` because Neon's pooled
 * connection string goes through PgBouncer, which doesn't keep prepared
 * statements between requests. A few connections per server instance is enough.
 */
export function createSql(url: string): Sql {
  return postgres(url, { max: 5, prepare: false, idle_timeout: 20, onnotice: () => {} });
}
