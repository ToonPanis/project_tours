import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import type { GameContext, GameData } from "./game-service";
import type { GameStore } from "./game-store";
import { newId, secureRandom } from "./identity";
import { MemoryGameStore } from "./memory-store";
import { createSql, PostgresGameStore } from "./postgres-store";

/** Which walks are multiplayer pub games, and their (server-only) data. */
function getGameData(walkSlug: string): GameData | null {
  return walkSlug === "hidden-pubs" ? { definition: pubGameDefinition, answerKey: pubGameAnswerKey } : null;
}

// Kept on `globalThis`: Next.js reloads changed modules in development, and
// without this every reload would open new database connections (or, for the
// memory store, forget every game).
const globalForGames = globalThis as typeof globalThis & { pubGameStore?: GameStore };

/**
 * - DATABASE_URL set (production, or development with a Neon database): Postgres.
 * - Not set, in development: games in memory (lost when the dev server stops).
 * - Not set, in production: an error. On Vercel every server instance has its
 *   own memory, so phones would end up in different "games".
 */
function getStore(): GameStore {
  if (globalForGames.pubGameStore) return globalForGames.pubGameStore;

  const url = process.env.DATABASE_URL;
  if (url) {
    globalForGames.pubGameStore = new PostgresGameStore(createSql(url));
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("Hidden Pubs multiplayer needs DATABASE_URL in production (see .env.example).");
  } else {
    globalForGames.pubGameStore = new MemoryGameStore();
  }
  return globalForGames.pubGameStore;
}

/** The real context for the Route Handlers. Tests build their own. */
export function getGameContext(): GameContext {
  return {
    store: getStore(),
    getGameData,
    random: secureRandom,
    newId,
    now: () => new Date(),
  };
}
