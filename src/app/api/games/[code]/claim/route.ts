import { NextResponse, type NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { claimPlayerLink } from "@/features/pub-game/server/game-service";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";
import { playerCookieName, playerCookieOptions } from "@/features/pub-game/server/identity";

/** POST /api/games/[code]/claim { token }: a phone opened a player link and becomes that player. */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/games/[code]/claim">) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const code = (await ctx.params).code.toUpperCase();
  const result = await claimPlayerLink(getGameContext(), code, await readJson(request));
  if (!result.ok) return toResponse(result);

  const response = NextResponse.json({ playerId: result.data.playerId }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(playerCookieName(code), result.data.token, playerCookieOptions());
  return response;
}
