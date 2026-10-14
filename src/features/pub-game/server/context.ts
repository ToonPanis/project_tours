import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import type { GameContext, GameData } from "./game-service";
import type { GameStore } from "./game-store";
import { newId, secureRandom } from "./identity";
import { MemoryGameStore } from "./memory-store";

/** Which walks are multiplayer pub games, and their (server-only) data. */
function getGameData(walkSlug: string): GameData | null {
  return walkSlug === "hidden-pubs" ? { definition: pubGameDefinition, answerKey: pubGameAnswerKey } : null;
}

// In development, Next.js reloads changed modules; keeping the store on
// `globalThis` means games survive that reload (not a server restart).
const globalForGames = globalThis as typeof globalThis & { pubGameStore?: GameStore };

function getStore(): GameStore {
  if (process.env.NODE_ENV === "production") {
    // On Vercel every server instance has its own memory: phones would land in
    // different "games". The Postgres store comes in stage 3.
    throw new Error("Hidden Pubs multiplayer needs a database in production (DATABASE_URL, stage 3).");
  }
  globalForGames.pubGameStore ??= new MemoryGameStore();
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
