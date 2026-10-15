import { after, NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { completeWalkOnDevice } from "@/features/commerce/server/follow-up-service";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { ticketCookieName } from "@/features/commerce/server/ticket-service";
import { checkPostRequest, readJson } from "@/features/pub-game/server/http";

/**
 * POST /api/tickets/complete: the completion screen of a guide walk says "this
 * walk is finished" (P8, decision B9). Body: { walkSlug }. Only the phone's
 * ticket cookie identifies the ticket; nothing else is sent (no location, no
 * progress). The answer is always the same, so it reveals nothing.
 */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;
  const body = await readJson(request);
  const walkSlug = typeof body === "object" && body !== null && "walkSlug" in body ? body.walkSlug : null;
  const baseUrl = siteBaseUrl(request);
  if (baseUrl && typeof walkSlug === "string") {
    try {
      const ctx = getCommerceContext();
      await completeWalkOnDevice(ctx, walkSlug, request.cookies.get(ticketCookieName(walkSlug))?.value, baseUrl);
      after(() => deliverDueEmails(ctx));
    } catch (error) {
      // The visitor's screen never depends on this.
      console.error(`[Hidden Antwerp] walk completion not recorded: ${error instanceof Error ? error.name : "unknown"}`);
    }
  }
  return NextResponse.json({ received: true }, { headers: { "Cache-Control": "no-store" } });
}
