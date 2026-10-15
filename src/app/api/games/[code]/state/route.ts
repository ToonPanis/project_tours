import type { NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { getGameUpdate } from "@/features/pub-game/server/game-service";
import { playerToken, toResponse } from "@/features/pub-game/server/http";

/**
 * GET /api/games/[code]/state?since=<version>: polled every ~2 seconds by each
 * phone. Answers { changed: false } when nothing happened since that version,
 * otherwise the player's view and the new events (for popups).
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/games/[code]/state">) {
  const code = (await ctx.params).code.toUpperCase();
  const sinceText = request.nextUrl.searchParams.get("since");
  const since = sinceText !== null && /^\d{1,9}$/.test(sinceText) ? Number(sinceText) : null;
  return toResponse(await getGameUpdate(getGameContext(), code, playerToken(request, code), since));
}
