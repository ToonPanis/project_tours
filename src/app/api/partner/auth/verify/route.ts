import { NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { PARTNER_COOKIE, clientKey, partnerCookieOptions } from "@/features/commerce/server/http";
import { verifyPartnerLoginLink } from "@/features/commerce/server/partner-auth-service";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";

/** POST /api/partner/auth/verify: uses a sign-in link ({ token }) and starts the portal session (httpOnly cookie). */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;
  const result = await verifyPartnerLoginLink(getCommerceContext(), await readJson(request), clientKey(request));
  if (!result.ok) return toResponse(result);
  const response = NextResponse.json({ signedIn: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(PARTNER_COOKIE, result.data.sessionSecret, partnerCookieOptions());
  return response;
}
