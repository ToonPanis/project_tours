import { after, NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import {
  confirmTicketGame,
  newGameAccess,
  releaseTicketGame,
  reserveTicketForGame,
  ticketCookieName,
} from "@/features/commerce/server/ticket-service";
import { getGameContext } from "@/features/pub-game/server/context";
import { createGame, deleteExpiredMediaIfDue } from "@/features/pub-game/server/game-service";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";
import { playerCookieName, playerCookieOptions } from "@/features/pub-game/server/identity";

/**
 * POST /api/games: the organiser creates a game.
 * Body: { walkSlug, teamNames, playersPerTeam, hostName, hostTeamIndex, adultsConfirmed }
 * Answer: { code, playerId } + the organiser's player cookie.
 *
 * Tickets (commercial platform P3): when ticket sales are open and this game is
 * on sale, the organiser's phone needs an unused ticket (opened from the
 * confirmation email). The ticket is reserved, the game gets as many places as
 * tickets were bought, and the ticket then belongs to this game. With sales
 * closed nothing of this runs (no database call) and games are made as before.
 * The game service itself knows nothing about tickets: this route connects them.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const body = await readJson(request);
  const walkSlug = typeof body === "object" && body !== null && "walkSlug" in body ? body.walkSlug : null;
  const slug = typeof walkSlug === "string" ? walkSlug : "";
  const ctx = getGameContext();

  const commerce = getCommerceContext();
  const access = await newGameAccess(commerce, slug, request.cookies.get(ticketCookieName(slug))?.value);
  if (access.status === "ticket-required") return errorResponse(403, "ticket-required");
  if (access.status === "used") return errorResponse(409, "ticket-used");

  let reservation: { grantId: string; marker: string } | null = null;
  if (access.status === "ready") {
    const marker = await reserveTicketForGame(commerce, access.grantId, access.current);
    if (!marker) return errorResponse(409, "ticket-used");
    reservation = { grantId: access.grantId, marker };
  }

  const result = await createGame(ctx, slug, body, access.status === "ready" ? { seatLimit: access.seats } : {});
  if (reservation) {
    // Created: the ticket belongs to this game. Refused (e.g. a typo in the form): the ticket stays usable.
    if (result.ok) await confirmTicketGame(commerce, reservation.grantId, reservation.marker, result.data.code);
    else await releaseTicketGame(commerce, reservation.grantId, reservation.marker);
  }
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
