/**
 * The commercial platform (docs/commercial/): admin accounts, the product
 * catalogue, the audit log and outgoing email.
 *
 * Plain data (no classes, dates as ISO strings), like the Hidden Pubs types:
 * the same objects go into MongoDB, the memory store and the admin pages.
 * Money is always a whole number of euro cents, never a decimal.
 */

/** What a signed-in user may do. Partners get their own roles later (P7). */
export type CommerceRole = "ADMIN";

export interface CommerceUser {
  id: string;
  /** Lower case, trimmed (see normalizeEmail). */
  email: string;
  roles: CommerceRole[];
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

/**
 * Something that can be sold. Linked to a walk by its slug: the walk's content
 * stays in src/data/walks, only the commercial side lives here.
 */
export interface Product {
  /** Stable id, e.g. "classics-of-antwerp". */
  id: string;
  walkSlug: string;
  /** The name in the catalogue (e.g. "17 Gates" for the Poortjes walk, decision B2). */
  name: string;
  /** Decision B3: every product is sold per person. */
  unit: "person";
  /** Only active products can be bought (from P2). */
  active: boolean;
  /**
   * VAT rate in basis points (2100 = 21 %). Null until the accountant has decided
   * (decision B8): a product without a rate can't be activated.
   */
  vatRateBasisPoints: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * One price of a product, from `validFrom` on. A change adds a new price
 * instead of overwriting the old one, so past prices stay known (orders keep
 * their own copy from P2 on).
 */
export interface ProductPrice {
  id: string;
  productId: string;
  /** What the customer pays per person, VAT included. */
  amountCents: number;
  currency: "EUR";
  validFrom: string;
  /** The admin who set it ("system" for the starter catalogue). */
  createdBy: string;
}

/** A product with its price today, as the admin pages show it. */
export interface CatalogEntry {
  product: Product;
  currentPrice: ProductPrice | null;
}

export type AuditAction =
  | "login"
  | "logout"
  | "catalog-seeded"
  | "product-updated"
  | "price-set";

/** Who changed what and when. Never contains secrets (tokens, keys) or customers' data. */
export interface AuditEntry {
  id: string;
  /** Null for the system itself (e.g. the starter catalogue). */
  actorId: string | null;
  actorEmail: string | null;
  action: AuditAction;
  /** What was changed, e.g. "product:hidden-pubs". */
  target: string;
  details: Record<string, string | number | boolean | null>;
  at: string;
}

/**
 * An email waiting to be sent, or already sent. The id makes it idempotent:
 * queueing the same id twice sends one email. After sending (or giving up) the
 * text is removed, so a sign-in link doesn't stay in the database.
 */
export interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  /** Null once sent or given up. */
  text: string | null;
  status: "pending" | "sent" | "failed";
  attempts: number;
  nextAttemptAt: string;
  /** A short error code (e.g. "brevo-401"), never a message from the provider. */
  lastError: string | null;
  createdAt: string;
  sentAt: string | null;
}
