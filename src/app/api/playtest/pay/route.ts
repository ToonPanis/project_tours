import { after, NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { fakePaymentsAllowed } from "@/features/commerce/server/fake-payment-gateway";
import { payTestOrder } from "@/features/commerce/server/fake-payments";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";

/** BROWSER TESTS ONLY: "Pay" on the test payment page (the webhook's event, through the real handler). 404 everywhere else. */
export async function POST(request: NextRequest) {
  if (!fakePaymentsAllowed()) return new NextResponse(null, { status: 404 });
  const refused = checkPostRequest(request);
  if (refused) return refused;
  const ctx = getCommerceContext();
  const result = await payTestOrder(ctx, await readJson(request), siteBaseUrl(request) ?? request.nextUrl.origin);
  if (result.ok) after(() => deliverDueEmails(ctx));
  return toResponse(result);
}
