import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { playablePubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { pubGameReveals } from "@/data/walks/hidden-pubs/game/reveals/index.server";
import type { GameContext, GameData } from "./game-service";
import type { GameStore } from "./game-store";
import { newId, secureRandom } from "./identity";
import { BlobMediaStore, MemoryMediaStore, type MediaStore } from "./media-store";
import { MemoryGameStore } from "./memory-store";
import { createSql, PostgresGameStore } from "./postgres-store";

/** Which walks are multiplayer pub games, and their (server-only) data. */
function getGameData(walkSlug: string): GameData | null {
  // Questions still waiting for the owner's answer are left out (playablePubGameDefinition).
  return walkSlug === "hidden-pubs" ? { definition: playablePubGameDefinition, answerKey: pubGameAnswerKey, reveals: pubGameReveals } : null;
}

// Kept on `globalThis`: Next.js reloads changed modules in development, and
// without this every reload would open new database connections (or, for the
// memory store, forget every game).
const globalForGames = globalThis as typeof globalThis & { pubGameStore?: GameStore; pubGameMedia?: MediaStore };

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

/**
 * Evidence files: Vercel Blob (private) when BLOB_READ_WRITE_TOKEN is set,
 * otherwise in memory (development only, like the game store).
 */
function getMediaStore(): MediaStore {
  if (globalForGames.pubGameMedia) return globalForGames.pubGameMedia;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    globalForGames.pubGameMedia = new BlobMediaStore();
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("Hidden Pubs evidence uploads need BLOB_READ_WRITE_TOKEN in production (see .env.example).");
  } else {
    globalForGames.pubGameMedia = new MemoryMediaStore();
  }
  return globalForGames.pubGameMedia;
}

/** The real context for the Route Handlers. Tests build their own. */
export function getGameContext(): GameContext {
  return {
    store: getStore(),
    // Lazy: only the routes that touch photos or videos need the media store.
    get media() {
      return getMediaStore();
    },
    getGameData,
    random: secureRandom,
    newId,
    now: () => new Date(),
  };
}

/**
 * For the pages: how phones upload evidence here. Doesn't create the store, so
 * a page never fails because of a missing Blob token (only uploads do).
 */
export function uploadModeForPages(): "blob" | "direct" {
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "direct";
}
