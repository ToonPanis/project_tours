import Stripe from "stripe";

/**
 * The payment provider behind one small interface. The services only know
 * these types, never Stripe's own: that keeps them testable without Stripe,
 * and the Stripe-specific code in one file.
 *
 * - StripeGateway: the real Stripe API (official SDK). Test mode now; live keys
 *   are refused until sales are opened (context.ts).
 * - Tests use a fake with the same interface (src/__tests__/fixtures).
 */

export interface CheckoutRequest {
  orderId: string;
  /** What the buyer sees on the payment page, e.g. "Hidden Pubs · 4 persons". */
  description: string;
  /** The order's total, computed by our server. The only amount Stripe gets. */
  amountCents: number;
  /** The buyer's language, for Stripe's page (Stripe has no Ukrainian: it then picks itself). */
  locale: string;
  successUrl: string;
  cancelUrl: string;
  expiresAt: Date;
}

/** Who paid, as typed on the payment page. */
export interface PaymentCustomer {
  email: string | null;
  name: string | null;
  businessName: string | null;
  country: string | null;
  vatNumber: string | null;
}

/** The payment page finished ("completed"), or a delayed payment method finished later ("async-succeeded"). */
export interface CheckoutPaidEvent {
  id: string;
  type: "checkout.completed" | "checkout.async-succeeded";
  sessionId: string;
  orderId: string | null;
  paymentStatus: string;
  amountTotal: number | null;
  currency: string | null;
  paymentIntentId: string | null;
  customer: PaymentCustomer;
}

/** A webhook event, reduced to what we need. `id` is Stripe's event id (for idempotency). */
export type PaymentEvent =
  | CheckoutPaidEvent
  | { id: string; type: "checkout.expired" | "checkout.async-failed"; sessionId: string; orderId: string | null }
  | { id: string; type: "charge.refunded"; paymentIntentId: string | null; amountRefunded: number; currency: string }
  | { id: string; type: "ignored"; stripeType: string };

export interface PaymentGateway {
  /** "test" or "live" for Stripe (from the key), "fake" in tests. */
  readonly mode: "test" | "live" | "fake";
  createCheckout(request: CheckoutRequest): Promise<{ sessionId: string; url: string }>;
  /** `idempotencyKey`: the same refund request twice refunds once. */
  refund(request: { paymentIntentId: string; amountCents: number; idempotencyKey: string }): Promise<{ refundId: string }>;
  /** Checks the signature on the raw body and returns the event; throws WebhookSignatureError otherwise. */
  parseWebhook(rawBody: string, signature: string | null): PaymentEvent;
}

/** The webhook was not signed by Stripe with our secret (or was changed on the way). */
export class WebhookSignatureError extends Error {
  constructor() {
    super("The webhook signature is not valid.");
    this.name = "WebhookSignatureError";
  }
}

/** Stripe couldn't be reached or refused the request. The message never contains the key. */
export class PaymentProviderError extends Error {
  constructor(readonly code: string) {
    super(`The payment provider failed (${code}).`);
    this.name = "PaymentProviderError";
  }
}

/** Languages Stripe's payment page has, from our 8 (no Ukrainian). */
const STRIPE_LOCALES = new Set(["en", "nl", "fr", "es", "it", "de", "ru"]);

export class StripeGateway implements PaymentGateway {
  readonly mode: "test" | "live";
  private readonly stripe: Stripe;

  constructor(
    secretKey: string,
    private readonly webhookSecret: string,
  ) {
    this.mode = secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_") ? "live" : "test";
    // The SDK pins the API version it was written for, so an upgrade of the
    // Stripe account can't silently change the answers' shape.
    this.stripe = new Stripe(secretKey, { maxNetworkRetries: 2, timeout: 15_000 });
  }

  async createCheckout(request: CheckoutRequest) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: "payment",
        // One line with OUR total: the amount never comes from the browser.
        line_items: [
          {
            quantity: 1,
            price_data: { currency: "eur", unit_amount: request.amountCents, product_data: { name: request.description } },
          },
        ],
        client_reference_id: request.orderId,
        metadata: { orderId: request.orderId },
        payment_intent_data: { metadata: { orderId: request.orderId } },
        locale: STRIPE_LOCALES.has(request.locale) ? (request.locale as Stripe.Checkout.SessionCreateParams.Locale) : "auto",
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        expires_at: Math.floor(request.expiresAt.getTime() / 1000),
        // The country decides the VAT (OSS); businesses can add their name and VAT number (B2B invoice).
        billing_address_collection: "required",
        tax_id_collection: { enabled: true },
        name_collection: { business: { enabled: true, optional: true } },
      });
      if (!session.url) throw new PaymentProviderError("no-url");
      return { sessionId: session.id, url: session.url };
    } catch (error) {
      throw toProviderError(error);
    }
  }

  async refund({ paymentIntentId, amountCents, idempotencyKey }: { paymentIntentId: string; amountCents: number; idempotencyKey: string }) {
    try {
      const refund = await this.stripe.refunds.create({ payment_intent: paymentIntentId, amount: amountCents }, { idempotencyKey });
      return { refundId: refund.id };
    } catch (error) {
      throw toProviderError(error);
    }
  }

  parseWebhook(rawBody: string, signature: string | null): PaymentEvent {
    let event: Stripe.Event;
    try {
      // The official check: HMAC over the UNCHANGED body plus a timestamp (5 minutes tolerance against replays).
      event = this.stripe.webhooks.constructEvent(rawBody, signature ?? "", this.webhookSecret);
    } catch {
      throw new WebhookSignatureError();
    }
    return toPaymentEvent(event);
  }
}

function toProviderError(error: unknown): PaymentProviderError {
  if (error instanceof PaymentProviderError) return error;
  // Only Stripe's error type and code (e.g. "StripeConnectionError", "card_declined"), never its message.
  if (error instanceof Stripe.errors.StripeError) return new PaymentProviderError(error.code ?? error.type);
  return new PaymentProviderError("unexpected");
}

/** Stripe's event → our PaymentEvent. Everything we don't use becomes "ignored". */
export function toPaymentEvent(event: Stripe.Event): PaymentEvent {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      const details = session.customer_details;
      return {
        id: event.id,
        type: event.type === "checkout.session.completed" ? "checkout.completed" : "checkout.async-succeeded",
        sessionId: session.id,
        orderId: session.metadata?.orderId ?? session.client_reference_id ?? null,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
        customer: {
          email: details?.email ?? null,
          name: details?.individual_name ?? details?.name ?? null,
          businessName: details?.business_name ?? null,
          country: details?.address?.country ?? null,
          vatNumber: details?.tax_ids?.[0]?.value ?? null,
        },
      };
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      return {
        id: event.id,
        type: event.type === "checkout.session.expired" ? "checkout.expired" : "checkout.async-failed",
        sessionId: session.id,
        orderId: session.metadata?.orderId ?? session.client_reference_id ?? null,
      };
    }
    case "charge.refunded": {
      const charge = event.data.object;
      return {
        id: event.id,
        type: "charge.refunded",
        paymentIntentId: typeof charge.payment_intent === "string" ? charge.payment_intent : (charge.payment_intent?.id ?? null),
        amountRefunded: charge.amount_refunded,
        currency: charge.currency,
      };
    }
    default:
      return { id: event.id, type: "ignored", stripeType: event.type };
  }
}
