import { after, NextResponse, type NextRequest } from "next/server";
import { verifyLoginLink } from "@/features/commerce/server/auth-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { ADMIN_COOKIE, adminCookieOptions, clientKey } from "@/features/commerce/server/http";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/admin/auth/verify: uses a sign-in link and starts the admin session.
 * Body: { token } (the part after "#" in the link). Answer: { email } + the
 * session cookie. The session secret only goes into the httpOnly cookie.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const ctx = getCommerceContext();
  const result = await verifyLoginLink(ctx, await readJson(request), clientKey(request));
  if (!result.ok) return toResponse(result);
  // The sign-in alert (P9) goes out right after the answer, not only with the nightly round.
  after(() => deliverDueEmails(ctx));

  const response = NextResponse.json({ email: result.data.admin.email }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_COOKIE, result.data.sessionSecret, adminCookieOptions());
  return response;
}
