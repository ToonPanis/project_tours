import { NextResponse, type NextRequest } from "next/server";
import { safeReturnPath } from "@/features/commerce/logic/partners";
import { getCommerceContext } from "@/features/commerce/server/context";
import { REFERRAL_COOKIE, clientKey, referralCookieOptions } from "@/features/commerce/server/http";
import { recordPartnerClick } from "@/features/commerce/server/referral-service";

/**
 * GET /api/r?ref=CODE&c=campaign&to=/path: a partner link (P7, reached through
 * src/proxy.ts). Counts the click and sets the referral cookie for an active
 * partner, then always sends the visitor on to `to` (a path on this site only).
 * An unknown code, or a database problem, never blocks the visitor.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const response = NextResponse.redirect(new URL(safeReturnPath(params.get("to")), request.nextUrl.origin), 303);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex");
  try {
    const click = await recordPartnerClick(getCommerceContext(), {
      ref: params.get("ref"),
      campaign: params.get("c"),
      existingCookie: request.cookies.get(REFERRAL_COOKIE)?.value,
      clientKey: clientKey(request),
    });
    if (click.cookieValue) response.cookies.set(REFERRAL_COOKIE, click.cookieValue, referralCookieOptions());
  } catch (error) {
    // The visitor still gets the page; only the click is lost.
    console.error(`[Hidden Antwerp] partner click not recorded: ${error instanceof Error ? error.name : "unknown"}`);
  }
  return response;
}
