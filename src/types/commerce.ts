/**
 * The commercial platform (docs/commercial/): admin accounts, the product
 * catalogue, the audit log and outgoing email.
 *
 * Plain data (no classes, dates as ISO strings), like the Hidden Pubs types:
 * the same objects go into MongoDB, the memory store and the admin pages.
 * Money is always a whole number of euro cents, never a decimal.
 */

/** What a signed-in user may do: run the admin area, or see one partner's own figures (P7). */
export type CommerceRole = "ADMIN" | "PARTNER";

export interface CommerceUser {
  id: string;
  /** Lower case, trimmed (see normalizeEmail). */
  email: string;
  roles: CommerceRole[];
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  /** PARTNER users only: the one partner whose figures they may see. */
  partnerId?: string | null;
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
  | "order-email-resent"
  | "quote-status-changed"
  | "corporate-pricing-updated"
  | "report-exported"
  | "partner-created"
  | "partner-updated"
  | "partner-user-invited"
  | "partner-user-deactivated"
  | "commission-status-changed"
  | "review-moderated"
  | "review-deleted"
  | "discount-batch-created";

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
  /**
   * P7: the partner whose link brought the buyer (last click within the
   * attribution window), copied when the order was created, with the commission
   * rule of that moment. Missing on orders from before P7.
   */
  partner?: OrderPartner | null;
  /**
   * P8: the buyer's choice on the buy box: may we send ONE email after the walk
   * (a feedback question and a discount code)? Recorded with the time and the
   * version of the sentence they agreed to. Missing on orders from before P8.
   */
  followUp?: { consent: boolean; at: string; textVersion: string } | null;
}

/** The referral of one order (see Order.partner). */
export interface OrderPartner {
  partnerId: string;
  code: string;
  /** The `c=` of the link, e.g. "summer-flyer"; null without one. */
  campaign: string | null;
  /** When the partner link was opened. */
  clickedAt: string;
  rule: CommissionRule;
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
  /**
   * Hidden Pubs (P3): the game this ticket was used for (one ticket, one game;
   * its seats become the game's places). "pending:…" for a moment while the
   * game is being created. Null for walks and unused tickets.
   */
  gameCode: string | null;
  /**
   * P8: when the walk was finished with this ticket (the completion screen of a
   * guide walk, or the host ending the Hidden Pubs game). Only the first time;
   * no location, no progress. Missing/null until then.
   */
  completedAt?: string | null;
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
  /**
   * P8: where the code comes from: typed by an admin, one of a batch of unique
   * codes, or a personal reward for a review. Missing = "admin" (older codes).
   */
  source?: "admin" | "batch" | "review";
  /** The batch it belongs to ("batch" codes). */
  batchId?: string | null;
  /** A review reward: the order whose ticket earned it (the code is switched off if that order is refunded in full). */
  forOrderId?: string | null;
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
  /** P8: the HTML version (null once sent or given up, like the text; missing on older emails). */
  html?: string | null;
  /** P8: the List-Unsubscribe link of a non-transactional email. */
  unsubscribeUrl?: string | null;
  status: "pending" | "sent" | "failed";
  attempts: number;
  nextAttemptAt: string;
  /** A short error code (e.g. "brevo-401"), never a message from the provider. */
  lastError: string | null;
  createdAt: string;
  sentAt: string | null;
}

// ─── Corporate quote requests (P4) ──────────────────────────────────────────

/** NEW → CONTACTED → QUOTED → ACCEPTED → COMPLETED; DECLINED and CANCELLED end a request. */
export type QuoteStatus = "NEW" | "CONTACTED" | "QUOTED" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED";

export type QuoteActivity =
  | "team-building"
  | "hidden-pubs-team-challenge"
  | "alcohol-free-city-challenge"
  | "private-walk"
  | "company-outing"
  | "international-group"
  | "something-else";

export type QuoteFormula = "self-guided" | "guided" | "unsure";

/**
 * A company's request for a quote, from /corporate. Only what's needed to make
 * an offer (no address, no job title): data minimisation (brief 5.3).
 */
export interface QuoteRequest {
  id: string;
  status: QuoteStatus;
  company: string;
  contactName: string;
  email: string;
  phone: string | null;
  /** "2026-12-05", or null when the company is flexible. */
  preferredDate: string | null;
  participants: number;
  activity: QuoteActivity;
  /** One of the site's 8 languages (also the language of the confirmation email). */
  language: string;
  formula: QuoteFormula;
  wishes: string | null;
  /** Every status change, with who made it and an optional internal note. */
  history: { status: QuoteStatus; at: string; by: string | null; note: string | null }[];
  createdAt: string;
  updatedAt: string;
}

/** One line of the indicative price table on /corporate (editable in the admin, brief 5.2). */
export interface CorporatePriceTier {
  persons: number;
  selfGuidedCents: number | null;
  guidedCents: number | null;
  /** "From €999": the guided price is a starting price. */
  guidedFrom: boolean;
}

export interface CorporatePricing {
  tiers: CorporatePriceTier[];
  /** Whether the amounts include VAT (shown next to the table). */
  pricesIncludeVat: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}

// ─── Partners and commissions (P7) ──────────────────────────────────────────

export type PartnerType = "HOTEL_PARTNER" | "HORECA_PARTNER" | "TOURISM_PARTNER" | "CORPORATE_PARTNER";

/**
 * How a partner earns, always on what was really paid (brief 3.3):
 * - "percent-net": basis points of the order's net amount excluding VAT (1500 = 15 %);
 * - "fixed-per-ticket": cents per person on the order;
 * - "fixed-per-booking": cents per order;
 * - "none": statistics only.
 */
export type CommissionRule =
  | { kind: "percent-net"; basisPoints: number }
  | { kind: "fixed-per-ticket"; cents: number }
  | { kind: "fixed-per-booking"; cents: number }
  | { kind: "none" };

/** A hotel, café, tourism office or company that refers customers. */
export interface Partner {
  id: string;
  /** Upper case letters, digits and dashes, unique: the `?ref=` of the partner's link. Never changes. */
  code: string;
  name: string;
  type: PartnerType;
  /** Inactive: its link no longer attributes anything, its users can't sign in. Past figures stay. */
  active: boolean;
  /** The rule for NEW orders; every order keeps a copy of the rule it was made with. */
  commission: CommissionRule;
  createdAt: string;
  updatedAt: string;
}

/** Clicks on a partner link per Brussels day and campaign (no IP address, no visitor id). */
export interface PartnerClickDay {
  partnerId: string;
  /** "2026-10-16". */
  day: string;
  /** "" without a campaign. */
  campaign: string;
  clicks: number;
}

/**
 * pending (order paid; can still be refunded) → approved (checked by an admin)
 * → payable (ready to be paid, e.g. the partner's invoice is in) → paid (the
 * admin recorded the bank transfer). "reversed": cancelled before it was paid
 * (the order was refunded in full). Nothing is ever deleted.
 */
export type CommissionStatus = "pending" | "approved" | "payable" | "paid" | "reversed";

/**
 * One line of the commission ledger. An order gets an "accrual" when it is
 * paid; a refund adds an "adjustment" (negative) for what the partner no
 * longer earns, or reverses the accrual when nothing was paid out yet.
 */
export interface CommissionEntry {
  /** "accrual:<orderId>" or "adjustment:<orderId>:<refunded total>": fixed ids, so nothing is booked twice. */
  id: string;
  partnerId: string;
  orderId: string;
  kind: "accrual" | "adjustment";
  /** Signed: an adjustment is negative. */
  amountCents: number;
  /** The amount the commission was computed on (net excl. VAT, after refunds for an adjustment). */
  basisCents: number;
  rule: CommissionRule;
  status: CommissionStatus;
  /** The order's product and campaign, for the partner's filters. */
  productId: string;
  campaign: string | null;
  /** When the order was paid (reports count by this date). */
  orderPaidAt: string;
  createdAt: string;
  updatedAt: string;
  /** The admin's reference of the bank transfer, once paid. */
  payoutReference: string | null;
  history: { status: CommissionStatus; at: string; by: string | null }[];
}

// ─── Reviews (P8) ───────────────────────────────────────────────────────────

/**
 * A verified review: only possible with a real ticket (the link in the
 * follow-up email is signed for that ticket), one per ticket. Shown nowhere
 * until an admin approves it; "incentivised" says it earned a discount code
 * (EU rules: rewarded reviews must be disclosed, the reward may not depend on
 * the rating).
 */
export interface Review {
  id: string;
  grantId: string;
  orderId: string;
  walkSlug: string;
  productId: string;
  /** 1–5. */
  rating: number;
  text: string | null;
  /** How the customer wants to be named if it is published ("Anna, Ghent"); null = anonymous. */
  displayName: string | null;
  /** The customer agreed that the review (and the name above) may be shown on the website. */
  mayPublish: boolean;
  locale: string;
  status: "pending" | "approved" | "rejected";
  incentivised: boolean;
  rewardDiscountId: string | null;
  createdAt: string;
  moderatedAt: string | null;
  moderatedBy: string | null;
}
