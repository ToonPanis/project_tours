import type { NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { openMedia } from "@/features/pub-game/server/game-service";
import { errorResponse, playerToken } from "@/features/pub-game/server/http";

/**
 * GET /api/games/[code]/media/file?id=<media id>: a photo or video, streamed
 * from the (private) store. Only for its own team, the host, or everyone once
 * the game is over (openMedia checks). Never cached by shared caches.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/games/[code]/media/file">) {
  const code = (await ctx.params).code.toUpperCase();
  const mediaId = request.nextUrl.searchParams.get("id") ?? "";
  const result = await openMedia(getGameContext(), code, playerToken(request, code), mediaId);
  if (!result.ok) return errorResponse(result.status, result.error);

  const { stream, contentType, size } = result.data;
  return new Response(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      // Only this player's browser may keep it, for a short while.
      "Cache-Control": "private, max-age=600",
      "Content-Disposition": "inline",
    },
  });
}
