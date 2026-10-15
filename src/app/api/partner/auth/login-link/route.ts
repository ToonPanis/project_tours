import { after, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { clientKey, siteBaseUrl } from "@/features/commerce/server/http";
import { requestPartnerLoginLink } from "@/features/commerce/server/partner-auth-service";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/partner/auth/login-link: emails a portal sign-in link to a partner user.
 * Body: { email, locale }. The same answer for every valid address (partner or not).
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;
  const baseUrl = siteBaseUrl(request);
  if (!baseUrl) return errorResponse(503, "not-configured");

  const ctx = getCommerceContext();
  const result = await requestPartnerLoginLink(ctx, await readJson(request), baseUrl, clientKey(request));
  if (result.ok) after(() => deliverDueEmails(ctx));
  return toResponse(result);
}
