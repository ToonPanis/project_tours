import type { NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { saveDirectUpload } from "@/features/pub-game/server/game-service";
import { checkSameOrigin, errorResponse, playerToken, toResponse } from "@/features/pub-game/server/http";
import { MAX_VIDEO_BYTES } from "@/features/pub-game/media";

/**
 * POST /api/games/[code]/media?task=<task id>: DEVELOPMENT upload (no Blob
 * store). The body is the file itself; Content-Type says what it is.
 * Answer: { mediaId } to send with SUBMIT_EVIDENCE.
 * In production phones upload straight to Vercel Blob (see ./upload).
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/games/[code]/media">) {
  const refused = checkSameOrigin(request);
  if (refused) return refused;

  // Refuse a too-big file before reading it.
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_VIDEO_BYTES) return errorResponse(413, "too-large");

  const code = (await ctx.params).code.toUpperCase();
  const bytes = new Uint8Array(await request.arrayBuffer());
  return toResponse(
    await saveDirectUpload(
      getGameContext(),
      code,
      playerToken(request, code),
      request.nextUrl.searchParams.get("task"),
      request.headers.get("content-type") ?? "",
      bytes,
    ),
  );
}
