import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { CommerceContext } from "@/features/commerce/server/context";
import { PendingBillitProvider, type InvoiceProvider } from "@/features/commerce/server/invoicing";
import { MemoryMailer, type Mailer } from "@/features/commerce/server/mailer";
import { MemoryCommerceStore } from "@/features/commerce/server/memory-store";
import {
  PaymentProviderError,
  type CheckoutRequest,
  type PaymentEvent,
  type PaymentGateway,
} from "@/features/commerce/server/payment-gateway";

export const ADMIN_EMAIL = "owner@example.com";
export const BASE_URL = "https://hidden-antwerp.example";
export const TICKET_KEY = "test-ticket-signing-key-that-is-long-enough";

/**
 * Stands in for Stripe: remembers what it was asked and answers like Stripe
 * would, without any network. `failNext` makes the next call fail like an
 * unreachable Stripe.
 */
export class FakePaymentGateway implements PaymentGateway {
  readonly mode = "fake" as const;
  readonly checkouts: CheckoutRequest[] = [];
  readonly refunds: { paymentIntentId: string; amountCents: number; idempotencyKey: string }[] = [];
  failNext: string | null = null;

  async createCheckout(request: CheckoutRequest) {
    if (this.failNext) {
      const code = this.failNext;
      this.failNext = null;
      throw new PaymentProviderError(code);
    }
    this.checkouts.push(request);
    const sessionId = `cs_test_${this.checkouts.length}`;
    return { sessionId, url: `https://checkout.stripe.test/${sessionId}` };
  }

  async refund(request: { paymentIntentId: string; amountCents: number; idempotencyKey: string }) {
    if (this.failNext) {
      const code = this.failNext;
      this.failNext = null;
      throw new PaymentProviderError(code);
    }
    this.refunds.push(request);
    return { refundId: `re_test_${this.refunds.length}` };
  }

  /** Tests send PaymentEvents as JSON; the real signature check is tested on StripeGateway itself. */
  parseWebhook(rawBody: string): PaymentEvent {
    return JSON.parse(rawBody) as PaymentEvent;
  }
}

/**
 * A commerce context for tests: memory store, memory mailer, fake Stripe and a
 * clock the test moves forward itself (`advance`), so "15 minutes later" takes no time.
 */
export function testCommerceContext(
  options: { mailer?: Mailer; adminEmails?: string[]; salesEnabled?: boolean; invoices?: InvoiceProvider } = {},
) {
  let now = new Date("2026-10-16T09:00:00.000Z");
  const store = new MemoryCommerceStore();
  const mailer = options.mailer ?? new MemoryMailer();
  const payments = new FakePaymentGateway();
  const ctx: CommerceContext = {
    store,
    mailer,
    adminEmails: options.adminEmails ?? [ADMIN_EMAIL],
    now: () => new Date(now),
    newId: () => randomUUID(),
    newSecret: () => randomBytes(32).toString("base64url"),
    payments,
    invoices: options.invoices ?? new PendingBillitProvider(),
    ticketSigningKey: TICKET_KEY,
    salesEnabled: options.salesEnabled ?? false,
  };
  return {
    ctx,
    store,
    mailer,
    payments,
    advance(ms: number) {
      now = new Date(now.getTime() + ms);
    },
  };
}

/** The secret after "#" in the last sign-in email. */
export function linkSecretFrom(mailer: MemoryMailer): string {
  const text = mailer.sent.at(-1)?.text ?? "";
  const match = /\/admin\/login\/verify#([A-Za-z0-9_-]+)/.exec(text);
  if (!match) throw new Error("no sign-in link in the last email");
  return match[1];
}

/** The ticket token after "#" in an email text. */
export function ticketTokenFrom(text: string): string {
  const match = /\/tickets\/open#([A-Za-z0-9_.-]+)/.exec(text);
  if (!match) throw new Error("no ticket link in the email");
  return match[1];
}

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
