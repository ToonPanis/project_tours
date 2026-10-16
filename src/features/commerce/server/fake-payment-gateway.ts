import { WebhookSignatureError, type CheckoutRequest, type PaymentGateway } from "./payment-gateway";

/**
 * BROWSER TESTS ONLY (P10, brief 9.1 and 10.4: "test complete purchase
 * journeys"). Playwright's second test server runs with
 * COMMERCE_FAKE_PAYMENTS=true: the payment page is our own test page
 * (/playtest/checkout) instead of Stripe, and "Pay" sends the same event the
 * Stripe webhook would, through the same handler (handlePaymentEvent). So the
 * whole journey after the payment (order paid, ticket, receipt, emails, game
 * seats, commission) is the real code.
 *
 * Refused unless the commerce data is in memory too, and never on Vercel: no
 * real order can ever be "paid" this way.
 */
export function fakePaymentsAllowed(): boolean {
  return process.env.COMMERCE_FAKE_PAYMENTS === "true" && process.env.COMMERCE_MEMORY_STORES === "true" && process.env.VERCEL !== "1";
}

export class FakeCheckoutGateway implements PaymentGateway {
  readonly mode = "fake" as const;

  async createCheckout(request: CheckoutRequest) {
    const origin = new URL(request.successUrl).origin;
    return { sessionId: `cs_fake_${request.orderId}`, url: `${origin}/playtest/checkout?order=${encodeURIComponent(request.orderId)}` };
  }

  async refund() {
    return { refundId: `re_fake_${Date.now()}` };
  }

  parseWebhook(): never {
    // Real webhooks are never accepted in this mode.
    throw new WebhookSignatureError();
  }
}
