import { after, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { clientKey } from "@/features/commerce/server/http";
import { submitReview } from "@/features/commerce/server/review-service";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/reviews: a verified review. Body: { token, rating, text?, displayName?, mayPublish, locale }.
 * Answer: { reward } (the personal code, if rewards are on). One review per ticket.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;
  const ctx = getCommerceContext();
  const result = await submitReview(ctx, await readJson(request), clientKey(request));
  if (result.ok) after(() => deliverDueEmails(ctx));
  return toResponse(result);
}
