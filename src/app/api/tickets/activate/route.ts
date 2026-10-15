import { NextResponse, type NextRequest } from "next/server";
import { RATE_LIMITS } from "@/features/commerce/config";
import { getCommerceContext } from "@/features/commerce/server/context";
import { clientKey, ticketCookieOptions } from "@/features/commerce/server/http";
import { allowRequest } from "@/features/commerce/server/support";
import { activateTicket, ticketCookieName } from "@/features/commerce/server/ticket-service";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/tickets/activate: opens a ticket on this phone.
 * Body: { token } (the part after "#" in the ticket link). Answer: { walkSlug }
 * + this phone's ticket cookie (one seat). The same phone again takes no extra seat.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const ctx = getCommerceContext();
  if (!(await allowRequest(ctx, "ticket-client", clientKey(request), RATE_LIMITS.ticketPerClient))) {
    return errorResponse(429, "too-many-requests");
  }
  const result = await activateTicket(ctx, await readJson(request), (walkSlug) => request.cookies.get(ticketCookieName(walkSlug))?.value);
  if (!result.ok) return toResponse(result);

  const response = NextResponse.json({ walkSlug: result.data.walkSlug }, { headers: { "Cache-Control": "no-store" } });
  if (result.data.deviceSecret) {
    response.cookies.set(ticketCookieName(result.data.walkSlug), result.data.deviceSecret, ticketCookieOptions(result.data.validUntil));
  }
  return response;
}
