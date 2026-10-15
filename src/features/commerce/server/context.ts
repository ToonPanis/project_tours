import { createMongoClient, databaseOf } from "@/features/pub-game/server/mongo";
import { hashToken, newId, newPlayerToken } from "@/features/pub-game/server/identity";
import { parseEmailList } from "../logic/email";
import type { CommerceStore } from "./commerce-store";
import { BrevoMailer, MemoryMailer, type Mailer } from "./mailer";
import { MemoryCommerceStore } from "./memory-store";
import { MongoCommerceStore } from "./mongo-store";

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
}

/** Hashes for secrets and for rate-limit subjects (emails, IP addresses): SHA-256, hex. */
export { hashToken as hashSecret };

// Kept on `globalThis` (like Hidden Pubs' context.ts): Next.js reloads changed modules
// in development, and without this every reload would open new database connections
// or forget the memory store.
const globalForCommerce = globalThis as typeof globalThis & {
  commerceStore?: CommerceStore;
  commerceMailer?: Mailer;
};

/**
 * Memory stores are for development, and for the browser tests' production build
 * (COMMERCE_MEMORY_STORES=true, set in playwright.config.ts only). Never on Vercel:
 * every server instance would have its own memory.
 */
function memoryAllowed(): boolean {
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
  };
}

/** For the admin start page: which services are configured (never their values). */
export function configurationStatus() {
  return {
    database: process.env.MONGODB_URI ? "mongodb" : "memory",
    email: process.env.BREVO_API_KEY && process.env.EMAIL_FROM ? "brevo" : "memory",
    adminCount: parseEmailList(process.env.ADMIN_EMAILS).length,
    baseUrlSet: Boolean(process.env.APP_BASE_URL),
  } as const;
}
