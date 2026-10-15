import { after, NextResponse, type NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { createGame, deleteExpiredMediaIfDue } from "@/features/pub-game/server/game-service";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";
import { playerCookieName, playerCookieOptions } from "@/features/pub-game/server/identity";

/**
 * POST /api/games: the organiser creates a game.
 * Body: { walkSlug, teamNames, playersPerTeam, hostName, hostTeamIndex, adultsConfirmed }
 * Answer: { code, playerId } + the organiser's player cookie.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const body = await readJson(request);
  const walkSlug = typeof body === "object" && body !== null && "walkSlug" in body ? body.walkSlug : null;
  const ctx = getGameContext();
  const result = await createGame(ctx, typeof walkSlug === "string" ? walkSlug : "", body);
  // Old photos and videos (privacy, D29): after the answer has gone out, so the organiser
  // never waits for it. (The daily job /api/cron/media-cleanup is the main cleanup.)
  if (result.ok) after(() => deleteExpiredMediaIfDue(ctx));
  if (!result.ok) return toResponse(result);

  const { code, playerId, token } = result.data;
  // The secret only goes into the httpOnly cookie, never into the JSON.
  const response = NextResponse.json({ code, playerId }, { status: 201, headers: { "Cache-Control": "no-store" } });
  response.cookies.set(playerCookieName(code), token, playerCookieOptions());
  return response;
}
