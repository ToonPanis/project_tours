import { NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { unsubscribe } from "@/features/commerce/server/follow-up-service";
import { checkPostRequest, errorResponse, readJson } from "@/features/pub-game/server/http";

/**
 * POST /api/unsubscribe: no more follow-up emails for this address (P8, brief 7.5).
 * Two ways in:
 * - the /unsubscribe page: JSON { token } (the token was after "#" in the link);
 * - "one click" from the mail app (RFC 8058): POST /api/unsubscribe?token=… with
 *   the body "List-Unsubscribe=One-Click" (form-encoded, from the mail provider,
 *   so neither JSON nor same-origin). The signed token is the only thing that counts.
 * Purchase emails (ticket, receipt, refund) are not affected.
 */
export async function POST(request: NextRequest) {
  const oneClickToken = request.nextUrl.searchParams.get("token");
  if (oneClickToken) {
    const done = await unsubscribe(getCommerceContext(), oneClickToken);
    return done ? new NextResponse(null, { status: 204 }) : errorResponse(400, "invalid-unsubscribe-link");
  }
  const refused = checkPostRequest(request);
  if (refused) return refused;
  const body = await readJson(request);
  const token = typeof body === "object" && body !== null && "token" in body ? body.token : null;
  const done = await unsubscribe(getCommerceContext(), token);
  return done ? NextResponse.json({ unsubscribed: true }, { headers: { "Cache-Control": "no-store" } }) : errorResponse(400, "invalid-unsubscribe-link");
}
