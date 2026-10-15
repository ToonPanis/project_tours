import type { NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { getReveal } from "@/features/pub-game/server/game-service";
import { errorResponse, playerToken, toResponse } from "@/features/pub-game/server/http";
import { getLocale } from "@/i18n/server";

/**
 * GET /api/games/[code]/reveal?cafe=<café id>: explanations of finished
 * questions and the café's fun fact, in the player's language. Only what this
 * player has already earned (see getReveal).
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/games/[code]/reveal">) {
  const code = (await ctx.params).code.toUpperCase();
  const cafeId = request.nextUrl.searchParams.get("cafe");
  if (!cafeId || !/^[a-z0-9-]{1,64}$/.test(cafeId)) return errorResponse(400, "invalid-request");
  return toResponse(await getReveal(getGameContext(), code, playerToken(request, code), cafeId, await getLocale()));
}
