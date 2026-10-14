import type { NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { getLobby } from "@/features/pub-game/server/game-service";
import { toResponse } from "@/features/pub-game/server/http";

/** GET /api/games/[code]: the join screen's data (teams, free places). Needs no cookie. */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/games/[code]">) {
  const { code } = await ctx.params;
  return toResponse(await getLobby(getGameContext(), code.toUpperCase()));
}
