import { NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { PARTNER_COOKIE } from "@/features/commerce/server/http";
import { signOutPartner } from "@/features/commerce/server/partner-auth-service";
import { checkPostRequest } from "@/features/pub-game/server/http";

/** POST /api/partner/auth/logout: ends the portal session and removes the cookie. */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;
  await signOutPartner(getCommerceContext(), request.cookies.get(PARTNER_COOKIE)?.value);
  const response = NextResponse.json({ signedOut: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.delete(PARTNER_COOKIE);
  return response;
}
