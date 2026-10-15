import { NextResponse, type NextRequest } from "next/server";
import { RATE_LIMITS } from "@/features/commerce/config";
import { startCheckout } from "@/features/commerce/server/checkout-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { BUYER_COOKIE, buyerCookieOptions, clientKey, siteBaseUrl } from "@/features/commerce/server/http";
import { allowRequest } from "@/features/commerce/server/support";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/checkout: opens Stripe's payment page for a walk.
 * Body: { walkSlug, quantity, discountCode?, locale }. Answer: { url } (the
 * browser goes there) + the buyer cookie for the success page.
 * The amount is computed on the server; the browser never sends a price.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const baseUrl = siteBaseUrl(request);
  if (!baseUrl) return errorResponse(503, "payments-unavailable");

  const ctx = getCommerceContext();
  if (!(await allowRequest(ctx, "checkout-client", clientKey(request), RATE_LIMITS.checkoutPerClient))) {
    return errorResponse(429, "too-many-requests");
  }
  const result = await startCheckout(ctx, await readJson(request), baseUrl);
  if (!result.ok) return toResponse(result);

  const response = NextResponse.json({ url: result.data.url }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(BUYER_COOKIE, result.data.buyerSecret, buyerCookieOptions());
  return response;
}
