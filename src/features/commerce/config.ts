/**
 * The numbers of the commercial platform's foundation (P1). Changing one here
 * changes it everywhere, and the tests read them from here.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A sign-in link works once, for this long. */
export const LOGIN_LINK_LIFETIME_MS = 15 * MINUTE;

/** An admin stays signed in this long, then signs in again with a new link. */
export const ADMIN_SESSION_LIFETIME_MS = 12 * HOUR;

/**
 * Rate limits: at most `limit` requests per `windowMs`. They stop someone from
 * flooding an inbox with sign-in mails, or from guessing links.
 */
export const RATE_LIMITS = {
  /** Sign-in links per email address. */
  loginPerEmail: { limit: 5, windowMs: 15 * MINUTE },
  /** Sign-in links per network address (any email). */
  loginPerClient: { limit: 20, windowMs: 15 * MINUTE },
  /** Attempts to use a sign-in link per network address. */
  verifyPerClient: { limit: 20, windowMs: 15 * MINUTE },
  /** Payment pages opened per network address (no flood of pending orders). */
  checkoutPerClient: { limit: 20, windowMs: 15 * MINUTE },
  /** Ticket links opened per network address (no guessing). */
  ticketPerClient: { limit: 30, windowMs: 15 * MINUTE },
} as const;

/** Outgoing email: how often to try, and how long to wait after each failure. */
export const EMAIL_RETRY_DELAYS_MS = [1 * MINUTE, 5 * MINUTE, 30 * MINUTE, 2 * HOUR] as const;
/** First try + one per delay above, then the email is marked failed. */
export const EMAIL_MAX_ATTEMPTS = EMAIL_RETRY_DELAYS_MS.length + 1;
/** Sent and failed emails are deleted from the outbox after this (only the record, the text is already gone). */
export const EMAIL_OUTBOX_RETENTION_MS = 90 * DAY;

/** A price must be between 1 cent and €10,000 (a typo like "79500" is refused). */
export const MAX_PRICE_CENTS = 1_000_000;

export const MAX_PRODUCT_NAME_LENGTH = 80;

/** Admin pages show this many audit entries per page. */
export const AUDIT_PAGE_SIZE = 50;

// ─── P2: payments and tickets ───────────────────────────────────────────────

/** Persons per order (a bigger group asks for a quote, P4). */
export const MAX_PERSONS_PER_ORDER = 30;

/** Stripe's smallest card payment in euros is €0.50. */
export const MIN_ORDER_CENTS = 50;

/** The Stripe payment page closes after this (Stripe's minimum is 30 minutes); the order is then canceled. */
export const CHECKOUT_LIFETIME_MS = 30 * MINUTE + 30 * 1000;

/** A ticket can be used this long after buying it. */
export const TICKET_VALIDITY_MS = 365 * DAY;

export const ORDERS_PAGE_SIZE = 25;

/** Tax categories and discount codes: short ids, letters, digits and dashes. */
export const MAX_TAX_CATEGORIES = 10;
export const MAX_OSS_RATES = 200;

/** The 27 EU member states (ISO codes): OSS rates only exist for these. */
export const EU_COUNTRIES = [
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
] as const;
