import { after, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { clientKey, siteBaseUrl } from "@/features/commerce/server/http";
import { submitQuote } from "@/features/commerce/server/quote-service";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/quotes: a company asks for a quote (form on /corporate).
 * Body: { company, contactName, email, phone?, preferredDate?, participants, activity,
 * language, formula, wishes?, website (hidden: must stay empty), elapsedMs }.
 * Answer: { received: true }. Rate limited; bots and duplicates get the same answer.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const baseUrl = siteBaseUrl(request);
  if (!baseUrl) return errorResponse(503, "not-configured");

  const ctx = getCommerceContext();
  const result = await submitQuote(ctx, await readJson(request), clientKey(request), baseUrl);
  // The confirmation and the admins' notice go out after the answer.
  if (result.ok) after(() => deliverDueEmails(ctx));
  return toResponse(result);
}
