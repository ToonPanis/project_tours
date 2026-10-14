import { NextResponse, type NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { joinGame } from "@/features/pub-game/server/game-service";
import { checkPostRequest, playerToken, readJson, toResponse } from "@/features/pub-game/server/http";
import { playerCookieName, playerCookieOptions } from "@/features/pub-game/server/identity";

/**
 * POST /api/games/[code]/join: a player joins a team on their own phone.
 * Body: { name, teamId, adultsConfirmed }. Answer: { playerId } + the player cookie.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/games/[code]/join">) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const code = (await ctx.params).code.toUpperCase();
  const result = await joinGame(getGameContext(), code, playerToken(request, code), await readJson(request));
  if (!result.ok) return toResponse(result);

  const { playerId, token } = result.data;
  const response = NextResponse.json({ playerId }, { headers: { "Cache-Control": "no-store" } });
  // Null: the phone was already in this game and keeps its cookie.
  if (token) response.cookies.set(playerCookieName(code), token, playerCookieOptions());
  return response;
}
