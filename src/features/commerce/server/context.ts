import { createMongoClient, databaseOf } from "@/features/pub-game/server/mongo";
import { hashToken, newId, newPlayerToken } from "@/features/pub-game/server/identity";
import { parseEmailList } from "../logic/email";
import type { CommerceStore } from "./commerce-store";
import { PendingBillitProvider, type InvoiceProvider } from "./invoicing";
import { BrevoMailer, MemoryMailer, type Mailer } from "./mailer";
import { MemoryCommerceStore } from "./memory-store";
import { MongoCommerceStore } from "./mongo-store";
import { PaymentProviderError, StripeGateway, type PaymentGateway } from "./payment-gateway";

/**
 * Everything a commerce service needs from the outside world, passed in as one
 * object. The routes use `getCommerceContext()`; tests build their own with a
 * memory store, a memory mailer and a fixed clock.
 */
export interface CommerceContext {
  readonly store: CommerceStore;
  readonly mailer: Mailer;
  /** ADMIN_EMAILS: who may sign in as admin. Removing an address takes the role away at once. */
  readonly adminEmails: string[];
  now(): Date;
  newId(): string;
  /** A long random secret (32 bytes) for links and cookies. Only its hash is stored. */
  newSecret(): string;

  // ── P2 ──
  /** Stripe (or a fake in tests). Throws PaymentProviderError("not-configured") when used without keys. */
  readonly payments: PaymentGateway;
  /** B2B invoices (Billit, not connected yet: requests wait). */
  readonly invoices: InvoiceProvider;
  /** Signs ticket links (HMAC). */
  readonly ticketSigningKey: string;
  /**
   * COMMERCE_SALES_ENABLED=true: tickets are sold and the play pages ask for one.
   * Off by default: the site works exactly as before (decision B8: no real sales
   * before the VAT treatment is confirmed).
   */
  readonly salesEnabled: boolean;
}

/** Hashes for secrets and for rate-limit subjects (emails, IP addresses): SHA-256, hex. */
export { hashToken as hashSecret };

// Kept on `globalThis` (like Hidden Pubs' context.ts): Next.js reloads changed modules
// in development, and without this every reload would open new database connections
// or forget the memory store.
const globalForCommerce = globalThis as typeof globalThis & {
  commerceStore?: CommerceStore;
  commerceMailer?: Mailer;
  commercePayments?: PaymentGateway;
};

export function salesEnabled(): boolean {
  return process.env.COMMERCE_SALES_ENABLED === "true";
}

/**
 * Stripe with STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET. A LIVE key is refused
 * while sales are closed: real money can only move after the owner opened sales
 * (and the VAT treatment is confirmed). Without keys every payment call fails
 * with "not-configured" (the pages then say payments are unavailable).
 */
function getPayments(): PaymentGateway {
  if (globalForCommerce.commercePayments) return globalForCommerce.commercePayments;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) throw new PaymentProviderError("not-configured");
  const gateway = new StripeGateway(secretKey, webhookSecret);
  if (gateway.mode === "live" && !salesEnabled()) throw new PaymentProviderError("live-key-while-sales-closed");
  globalForCommerce.commercePayments = gateway;
  return gateway;
}

/**
 * TICKET_SIGNING_SECRET (at least 32 characters) signs ticket links. Required in
 * production; development and tests use a fixed key so links keep working
 * across dev-server restarts (they're worthless outside your own computer).
 */
function getTicketSigningKey(): string {
  const key = process.env.TICKET_SIGNING_SECRET;
  if (key && key.length >= 32) return key;
  if (memoryAllowed()) return "development-only-ticket-signing-key-not-secret";
  throw new Error("Tickets need TICKET_SIGNING_SECRET (at least 32 characters) in production (see .env.example).");
}

/**
 * Memory stores are for development, and for the browser tests' production build
 * (COMMERCE_MEMORY_STORES=true, set in playwright.config.ts only). Never on Vercel:
 * every server instance would have its own memory.
 */
function memoryAllowed(): boolean {
  // P9: never on Vercel, even if the test flag was set there by mistake (data would vanish).
  if (process.env.VERCEL === "1") return false;
  return process.env.NODE_ENV !== "production" || process.env.COMMERCE_MEMORY_STORES === "true";
}

function getStore(): CommerceStore {
  if (globalForCommerce.commerceStore) return globalForCommerce.commerceStore;
  const uri = process.env.MONGODB_URI;
  if (uri) {
    // Its own small client (Hidden Pubs has one too); both use the same settings from mongo.ts.
    globalForCommerce.commerceStore = new MongoCommerceStore(databaseOf(createMongoClient(uri)));
  } else if (memoryAllowed()) {
    globalForCommerce.commerceStore = new MemoryCommerceStore();
  } else {
    throw new Error("The commercial platform needs MONGODB_URI in production (see .env.example).");
  }
  return globalForCommerce.commerceStore;
}

/**
 * Brevo when BREVO_API_KEY and EMAIL_FROM are set. Otherwise, in development,
 * a memory mailer that prints emails in the terminal (your sign-in link appears
 * there). In production without Brevo: an error, because emails would be lost.
 */
function getMailer(): Mailer {
  if (globalForCommerce.commerceMailer) return globalForCommerce.commerceMailer;
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (apiKey && from) {
    globalForCommerce.commerceMailer = new BrevoMailer(apiKey, { email: from, name: "Hidden Antwerp" });
  } else if (memoryAllowed()) {
    globalForCommerce.commerceMailer = new MemoryMailer(process.env.NODE_ENV === "development");
  } else {
    throw new Error("Sending email needs BREVO_API_KEY and EMAIL_FROM in production (see .env.example).");
  }
  return globalForCommerce.commerceMailer;
}

/**
 * The real context for routes and pages. Lazy: the store and mailer are only
 * created when a service uses them, so a page that only checks "is there a
 * session cookie at all?" never needs the database.
 */
export function getCommerceContext(): CommerceContext {
  return {
    get store() {
      return getStore();
    },
    get mailer() {
      return getMailer();
    },
    adminEmails: parseEmailList(process.env.ADMIN_EMAILS),
    now: () => new Date(),
    newId,
    newSecret: newPlayerToken,
    get payments() {
      return getPayments();
    },
    invoices: new PendingBillitProvider(),
    get ticketSigningKey() {
      return getTicketSigningKey();
    },
    salesEnabled: salesEnabled(),
  };
}

/** For the admin start page: which services are configured (never their values). */
export function configurationStatus() {
  return {
    database: process.env.MONGODB_URI ? "mongodb" : "memory",
    email: process.env.BREVO_API_KEY && process.env.EMAIL_FROM ? "brevo" : "memory",
    adminCount: parseEmailList(process.env.ADMIN_EMAILS).length,
    baseUrlSet: Boolean(process.env.APP_BASE_URL),
    stripe: !process.env.STRIPE_SECRET_KEY ? "not-configured" : process.env.STRIPE_SECRET_KEY.startsWith("sk_live_") ? "live" : "test",
    stripeWebhookSet: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    ticketKeySet: (process.env.TICKET_SIGNING_SECRET?.length ?? 0) >= 32,
    salesEnabled: salesEnabled(),
  } as const;
}
