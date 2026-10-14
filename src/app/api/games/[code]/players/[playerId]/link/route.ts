import { NextResponse, type NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { createPlayerLink } from "@/features/pub-game/server/game-service";
import { checkPostRequest, playerToken, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/games/[code]/players/[playerId]/link: the host asks for a personal
 * link for a player (late joiner, new phone). Answer: { path } to share.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/games/[code]/players/[playerId]/link">) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const { code: rawCode, playerId } = await ctx.params;
  const code = rawCode.toUpperCase();
  const result = await createPlayerLink(getGameContext(), code, playerToken(request, code), playerId);
  if (!result.ok) return toResponse(result);
  // The secret goes after "#": browsers never send that part to a server, so it
  // doesn't end up in server or proxy logs. The claim page reads it in the browser.
  return NextResponse.json({ path: `/games/${code}/claim#${result.data.token}` }, { headers: { "Cache-Control": "no-store" } });
}
