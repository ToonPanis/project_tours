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
   * Which tax category of the tax settings applies (decision B8: the rates
   * themselves are only set in /admin/tax, never in code). Null until chosen:
   * a product without a category can't go on sale.
   */
  taxCategoryId: string | null;
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
  | "price-set"
  | "tax-settings-updated"
  | "discount-created"
  | "discount-updated"
  | "refund-requested"
  | "ticket-revoked"
  | "ticket-devices-reset"
  | "order-email-resent";

// ─── Tax (decision B8) ──────────────────────────────────────────────────────

/**
 * - "not-configured": nothing decided yet; nothing can be sold.
 * - "exempt": no VAT is charged (e.g. the small-business exemption); receipts show `exemptionNote`.
 * - "vat-registered": VAT per category, optionally the destination country's rate (OSS).
 */
export type TaxRegime = "not-configured" | "exempt" | "vat-registered";

/** A kind of product with one VAT rate at home, e.g. "Guided experiences" at a rate the accountant chose. */
export interface TaxCategory {
  /** Short stable id, e.g. "experience". Products point to it. */
  id: string;
  label: string;
  /** Basis points: 2100 = 21 %. Any value from 0 to 10000 (no rate is built in). */
  rateBasisPoints: number;
}

/** The destination country's rate for one category, used when OSS applies. */
export interface OssRate {
  /** ISO 3166-1 alpha-2, e.g. "NL". */
  country: string;
  categoryId: string;
  rateBasisPoints: number;
}

/**
 * The tax settings, managed by an admin only. Every save is a new version;
 * orders copy what applied to them. Changing anything withdraws the
 * accountant's confirmation until it is given again.
 */
export interface TaxSettings {
  /** 0 = never saved (the defaults below). */
  version: number;
  regime: TaxRegime;
  /** Where the business is established, e.g. "BE". */
  homeCountry: string;
  categories: TaxCategory[];
  /** One-Stop Shop: charge the buyer's EU country's rate (only if the accountant says so). */
  ossEnabled: boolean;
  ossRates: OssRate[];
  /** Printed on receipts when the regime is "exempt" (the legal mention the accountant gives). */
  exemptionNote: string | null;
  /** Ticket sales stay closed until this is true. */
  confirmedByAccountant: boolean;
  updatedAt: string;
  updatedBy: string | null;
}

/** What the tax settings said for one order, copied into the order when it's created. */
export interface OrderTaxBasis {
  settingsVersion: number;
  regime: TaxRegime;
  homeCountry: string;
  categoryId: string | null;
  homeRateBasisPoints: number;
  ossEnabled: boolean;
  /** The OSS rates of this order's category only. */
  ossRates: { country: string; rateBasisPoints: number }[];
  exemptionNote: string | null;
}

/** The VAT actually applied, worked out when the payment arrives (the buyer's country is known then). */
export interface AppliedTax {
  rateBasisPoints: number;
  /** The buyer's country from the payment page, if given. */
  country: string | null;
  /** True when the destination country's rate was used (OSS). */
  oss: boolean;
  netCents: number;
  vatCents: number;
  note: string | null;
}

// ─── Orders and tickets (P2) ────────────────────────────────────────────────

/**
 * pending → paid (payment confirmed by the Stripe webhook, never by the success page)
 * pending → failed / canceled (payment failed, or the payment page expired)
 * paid → refunded (fully refunded; a partial refund keeps "paid" with `refundedCents`)
 */
export type OrderStatus = "pending" | "paid" | "failed" | "canceled" | "refunded";

export interface OrderLine {
  productId: string;
  productName: string;
  walkSlug: string;
  /** Number of persons (decision B3: everything is per person). */
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface OrderCustomer {
  type: "consumer" | "business";
  name: string | null;
  businessName: string | null;
  /** As typed on the payment page (Stripe checks the format, not that it exists). */
  vatNumber: string | null;
  country: string | null;
}

export interface Order {
  id: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotalCents: number;
  discount: { discountId: string; code: string; amountCents: number } | null;
  /** What the buyer pays, VAT included. The only amount sent to Stripe. */
  totalCents: number;
  currency: "EUR";
  /** The buyer's language: emails and the payment page use it. */
  locale: string;
  /** Hash of the secret in the buyer's browser cookie (shows the order on the success page). */
  buyerTokenHash: string;
  /** From the payment page; null until paid. */
  email: string | null;
  customer: OrderCustomer | null;
  taxBasis: OrderTaxBasis;
  tax: AppliedTax | null;
  stripe: { checkoutSessionId: string | null; paymentIntentId: string | null };
  refundedCents: number;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

/**
 * A ticket: the right of `seats` persons to play one walk. Its link is signed
 * (HMAC), not stored; each phone that opens it uses one seat.
 */
export interface TicketGrant {
  id: string;
  orderId: string;
  productId: string;
  walkSlug: string;
  seats: number;
  devicesUsed: number;
  status: "active" | "revoked";
  createdAt: string;
  validUntil: string;
}

export interface Discount {
  id: string;
  /** Upper case, letters/digits/dashes. */
  code: string;
  kind: "percent" | "fixed";
  /** Percent: 1–100. Fixed: cents off the order. */
  value: number;
  /** Empty = every product. */
  productIds: string[];
  validFrom: string | null;
  validUntil: string | null;
  /** Null = no limit. */
  maxRedemptions: number | null;
  /** Reserved when the payment page opens, given back when it expires or fails. */
  redemptions: number;
  active: boolean;
  createdAt: string;
  createdBy: string;
}

/**
 * A receipt (consumers), an invoice (businesses) or a credit note. B2B
 * invoices are made by the invoicing provider (Billit, decision B7); until it
 * is connected they wait as "awaiting-provider".
 */
export interface BillingDocument {
  id: string;
  /** Our number for receipts and credit notes (e.g. "R2026-000001"); null while waiting for the provider. */
  number: string | null;
  kind: "receipt" | "invoice" | "credit-note";
  orderId: string;
  provider: "internal" | "billit";
  status: "issued" | "awaiting-provider";
  /** Positive for receipts and invoices, the refunded amount for credit notes. */
  amountCents: number;
  createdAt: string;
}

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
