import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { authorizeBlobUpload } from "@/features/pub-game/server/game-service";
import { checkPostRequest, errorResponse, playerToken } from "@/features/pub-game/server/http";

/**
 * POST /api/games/[code]/media/upload: PRODUCTION uploads. The phone's
 * `upload()` (from @vercel/blob/client) asks this route for a short-lived
 * token, then sends the photo or video straight to Vercel Blob (videos are
 * too big to pass through a server function). Before a token is made,
 * authorizeBlobUpload checks the player, the task and the file path; the token
 * then only allows that kind of file, up to its size limit, as a PRIVATE blob.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/games/[code]/media/upload">) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const code = (await ctx.params).code.toUpperCase();
  const gameContext = getGameContext();
  if (gameContext.media.uploadMode !== "blob") return errorResponse(400, "use-direct-upload");

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const allowed = await authorizeBlobUpload(gameContext, code, playerToken(request, code), pathname, clientPayload);
        if (!allowed.ok) throw new UploadRefused(allowed.status, allowed.error);
        return allowed.data;
      },
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof UploadRefused) return errorResponse(error.status, error.message);
    return errorResponse(400, "invalid-request");
  }
}

class UploadRefused extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
