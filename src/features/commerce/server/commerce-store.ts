import type {
  AuditEntry,
  BillingDocument,
  CommerceUser,
  CorporatePricing,
  QuoteRequest,
  QuoteStatus,
  Discount,
  Order,
  OrderStatus,
  OutboxEmail,
  Product,
  ProductPrice,
  TaxSettings,
  TicketGrant,
} from "@/types/commerce";

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

  // ── Tax settings (P2, versioned) ─────────────────────────────────────
  /** The newest saved version, or null when nothing was ever saved. */
  getTaxSettings(): Promise<TaxSettings | null>;
  /** Saves a new version. False when that version number already exists (someone saved at the same time). */
  insertTaxSettings(settings: TaxSettings): Promise<boolean>;

  // ── Orders ───────────────────────────────────────────────────────────
  insertOrder(order: Order): Promise<void>;
  getOrder(id: string): Promise<Order | null>;
  findOrderByPaymentIntent(paymentIntentId: string): Promise<Order | null>;
  /**
   * Changes an order only while its status is one of `from` (atomic). This is
   * how an order becomes "paid" exactly once, however many webhooks arrive.
   */
  transitionOrder(id: string, from: OrderStatus[], changes: Partial<Omit<Order, "id">>): Promise<boolean>;
  updateOrder(id: string, changes: Partial<Omit<Order, "id">>): Promise<void>;
  /** Newest first, optionally only one status. */
  listOrders(query: { skip: number; limit: number; status?: OrderStatus }): Promise<{ orders: Order[]; total: number }>;

  // ── Stripe events (webhook idempotency) ──────────────────────────────
  /** "new" the first time an event id is seen, "duplicate" after that. */
  recordStripeEvent(event: { id: string; type: string; receivedAt: Date; expiresAt: Date }): Promise<"new" | "duplicate">;
  /** Whether an earlier delivery of this event was processed to the end. */
  isStripeEventDone(id: string): Promise<boolean>;
  markStripeEventDone(id: string, at: Date): Promise<void>;

  // ── Tickets ──────────────────────────────────────────────────────────
  /** One ticket per order: inserted only if the order has none yet. Returns the order's ticket. */
  insertGrantIfMissing(grant: TicketGrant): Promise<TicketGrant>;
  getGrant(id: string): Promise<TicketGrant | null>;
  getGrantByOrder(orderId: string): Promise<TicketGrant | null>;
  updateGrant(id: string, changes: Partial<Omit<TicketGrant, "id">>): Promise<void>;
  /** Takes one seat for a new phone (atomic: never more phones than seats). False when the ticket is full or not active. */
  claimTicketSeat(grantId: string): Promise<boolean>;
  saveTicketDevice(device: { tokenHash: string; grantId: string; walkSlug: string; createdAt: Date; expiresAt: Date }): Promise<void>;
  /** The phone's ticket, or null when unknown or expired. */
  findTicketDevice(tokenHash: string, now: Date): Promise<{ grantId: string; walkSlug: string } | null>;
  /** Forgets every phone of a ticket (admin "reset phones"). */
  deleteTicketDevices(grantId: string): Promise<void>;
  /**
   * Hidden Pubs (P3): sets the ticket's game code from `from` to `to`, only if it
   * is still `from` and the ticket is active (atomic). Used to reserve an unused
   * ticket (null → "pending:…"), then to confirm (→ code) or give it back (→ null).
   */
  swapGrantGame(grantId: string, from: string | null, to: string | null): Promise<boolean>;

  // ── Discounts ────────────────────────────────────────────────────────
  /** False when the code already exists. */
  insertDiscount(discount: Discount): Promise<boolean>;
  getDiscount(id: string): Promise<Discount | null>;
  getDiscountByCode(code: string): Promise<Discount | null>;
  listDiscounts(): Promise<Discount[]>;
  updateDiscount(id: string, changes: Partial<Omit<Discount, "id" | "code" | "redemptions">>): Promise<void>;
  /** Counts one use, only while the code is active and not used up (atomic). */
  reserveDiscount(id: string): Promise<boolean>;
  /** Gives a use back (the payment page expired or failed). */
  releaseDiscount(id: string): Promise<void>;

  // ── Receipts, invoices, credit notes ─────────────────────────────────
  /** The next number of a series, e.g. "receipt-2026" → 1, 2, 3… (atomic). */
  nextNumber(series: string): Promise<number>;
  /** Inserts the document unless one with its id exists. Returns the stored document. */
  insertDocumentIfMissing(document: BillingDocument): Promise<BillingDocument>;
  getDocument(id: string): Promise<BillingDocument | null>;
  listDocumentsForOrder(orderId: string): Promise<BillingDocument[]>;

  // ── Corporate quote requests (P4) ────────────────────────────────────
  /** `dedupeKey`: a hash of company, email, date and activity (recognises the same request sent again). */
  insertQuote(quote: QuoteRequest, dedupeKey: string, expiresAt: Date): Promise<void>;
  /** A request with this key that came in after `since`, if any. */
  findQuoteByDedupeKey(dedupeKey: string, since: Date): Promise<QuoteRequest | null>;
  getQuote(id: string): Promise<QuoteRequest | null>;
  listQuotes(query: { skip: number; limit: number; status?: QuoteStatus }): Promise<{ quotes: QuoteRequest[]; total: number }>;
  /** Moves a request to a new status only while it is still `from` (atomic), adding the history line. */
  transitionQuote(id: string, from: QuoteStatus, entry: QuoteRequest["history"][number]): Promise<boolean>;

  // ── Settings ─────────────────────────────────────────────────────────
  /** The corporate price table, or null when an admin never saved one (the defaults are used). */
  getCorporatePricing(): Promise<CorporatePricing | null>;
  saveCorporatePricing(pricing: CorporatePricing): Promise<void>;
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
