import { after, NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { handlePaymentEvent } from "@/features/commerce/server/fulfilment-service";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { PaymentProviderError, WebhookSignatureError } from "@/features/commerce/server/payment-gateway";

/** Stripe's events are small; anything bigger is not from Stripe. */
const MAX_BODY_BYTES = 1_000_000;

/**
 * POST /api/webhooks/stripe: Stripe tells us about payments, expiries and refunds.
 *
 * - The body is read as RAW TEXT: the signature is computed over the exact bytes
 *   Stripe sent, so it must be checked before anything parses the JSON.
 * - A wrong signature → 400 and nothing happens.
 * - Our own error (e.g. the database is down) → 500: Stripe then retries the
 *   event later (for up to 3 days); handling is idempotent, so a retry is safe.
 * - No same-origin check here: the request comes from Stripe's servers, and the
 *   signature is the proof of who sent it.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) return NextResponse.json({ error: "too-large" }, { status: 413 });

  const baseUrl = siteBaseUrl(request);
  if (!baseUrl) {
    // Production without APP_BASE_URL: ticket links can't be made. 500, so Stripe retries once it's set.
    console.error("[Hidden Antwerp] Stripe webhook: APP_BASE_URL is not set");
    return NextResponse.json({ error: "not-configured" }, { status: 500 });
  }

  const ctx = getCommerceContext();
  let event;
  try {
    event = ctx.payments.parseWebhook(rawBody, request.headers.get("stripe-signature"));
  } catch (error) {
    if (error instanceof WebhookSignatureError) return NextResponse.json({ error: "invalid-signature" }, { status: 400 });
    if (error instanceof PaymentProviderError) return NextResponse.json({ error: "not-configured" }, { status: 503 });
    throw error;
  }

  const handledAs = await handlePaymentEvent(ctx, event, baseUrl);
  // Confirmation and refund emails go out after the answer: Stripe gets its 200 quickly.
  after(() => deliverDueEmails(ctx));
  return NextResponse.json({ received: true, handledAs }, { headers: { "Cache-Control": "no-store" } });
}
