import { after, type NextRequest } from "next/server";
import { requestLoginLink } from "@/features/commerce/server/auth-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { clientKey, siteBaseUrl } from "@/features/commerce/server/http";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/admin/auth/login-link: emails a sign-in link to an admin.
 * Body: { email }. Answer: { sent: true } for every valid address (admin or not),
 * so this route can't be used to find out who the admins are.
 */
export async function POST(request: NextRequest) {
  // Same protection as the Hidden Pubs routes: JSON only, from this site only.
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const baseUrl = siteBaseUrl(request);
  if (!baseUrl) return errorResponse(503, "not-configured");

  const ctx = getCommerceContext();
  const result = await requestLoginLink(ctx, await readJson(request), baseUrl, clientKey(request));
  // The email goes out after the answer: the response time doesn't depend on the provider.
  if (result.ok) after(() => deliverDueEmails(ctx));
  return toResponse(result);
}
