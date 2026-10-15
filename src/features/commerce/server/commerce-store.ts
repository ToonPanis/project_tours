import type { AuditEntry, CommerceUser, OutboxEmail, Product, ProductPrice } from "@/types/commerce";

/**
 * Where the commercial data is saved. Two implementations, like Hidden Pubs'
 * GameStore: `MemoryCommerceStore` (development and tests) and
 * `MongoCommerceStore` (production). The same contract tests run against both
 * (src/__tests__/commerce-store.test.ts), so they behave the same.
 *
 * Secrets are never stored: login tokens and sessions are saved as SHA-256
 * hashes, and the hash is what the store looks them up by.
 */
export interface CommerceStore {
  // ── Users ────────────────────────────────────────────────────────────
  findUserByEmail(email: string): Promise<CommerceUser | null>;
  findUserById(id: string): Promise<CommerceUser | null>;
  /** Inserts the user, or replaces the one with the same id. */
  saveUser(user: CommerceUser): Promise<void>;

  // ── Sign-in links (one use each) ─────────────────────────────────────
  saveLoginToken(token: { tokenHash: string; userId: string; expiresAt: Date }): Promise<void>;
  /**
   * Uses a sign-in link: returns its user once, and null for every later try,
   * for an expired link and for an unknown one. Atomic: two requests with the
   * same link at the same moment can't both succeed.
   */
  consumeLoginToken(tokenHash: string, now: Date): Promise<{ userId: string } | null>;

  // ── Sessions ─────────────────────────────────────────────────────────
  saveSession(session: { tokenHash: string; userId: string; createdAt: Date; expiresAt: Date }): Promise<void>;
  /** The session, or null when it doesn't exist or has expired. */
  findSession(tokenHash: string, now: Date): Promise<{ userId: string; expiresAt: Date } | null>;
  deleteSession(tokenHash: string): Promise<void>;

  // ── Rate limits ──────────────────────────────────────────────────────
  /** Adds one to the counter `key` (created at 0) and returns the new count. Forgotten after `expiresAt`. */
  incrementCounter(key: string, expiresAt: Date): Promise<number>;

  // ── Audit log (append only) ──────────────────────────────────────────
  appendAudit(entry: AuditEntry): Promise<void>;
  /** Newest first. */
  listAudit(page: { skip: number; limit: number }): Promise<{ entries: AuditEntry[]; total: number }>;

  // ── Catalogue ────────────────────────────────────────────────────────
  listProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  /** Inserts the product only if no product has its id. True when it was inserted. */
  insertProductIfMissing(product: Product): Promise<boolean>;
  /** Replaces an existing product (by id). */
  saveProduct(product: Product): Promise<void>;
  listPrices(productId: string): Promise<ProductPrice[]>;
  addPrice(price: ProductPrice): Promise<void>;

  // ── Email outbox ─────────────────────────────────────────────────────
  /** "duplicate" when an email with this id was already queued (it is not queued again). */
  enqueueEmail(email: OutboxEmail, expiresAt: Date): Promise<"queued" | "duplicate">;
  /** Pending emails whose next attempt is due, oldest first. */
  listDueEmails(now: Date, limit: number): Promise<OutboxEmail[]>;
  /**
   * Claims a due email for sending, so two senders running at the same time
   * (right after queueing, and the cron job) can't both send it. Atomic: only
   * succeeds while the email is still pending, due and at `attempts` tries; it
   * then pushes `nextAttemptAt` to `leaseUntil`, hiding it from other senders.
   */
  claimEmail(id: string, attempts: number, now: Date, leaseUntil: Date): Promise<boolean>;
  updateEmail(id: string, changes: Partial<Omit<OutboxEmail, "id">>): Promise<void>;
}

/**
 * Thrown when the database can't be reached. Its message is fixed, so nothing
 * about the connection (host, user) can end up in a log or a response.
 */
export class CommerceStoreUnavailableError extends Error {
  constructor() {
    super("The commerce database is not available.");
    this.name = "CommerceStoreUnavailableError";
  }
}
