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
  /** Quote requests per network address (P4: no spam floods). */
  quotePerClient: { limit: 5, windowMs: 60 * MINUTE },
  /** Counted partner-link clicks per network address (P7: one visitor can't inflate a partner's figures). */
  partnerClicksPerClient: { limit: 20, windowMs: 60 * MINUTE },
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

// ─── P4: corporate quote requests ───────────────────────────────────────────

/** A real person needs a few seconds to fill in the form; a bot sends at once. */
export const QUOTE_MIN_FILL_MS = 3000;
/** The same company, email, date and activity again within this time is the same request (no second one). */
export const QUOTE_DUPLICATE_WINDOW_MS = DAY;
/** Requests are deleted this long after they came in (GDPR: only kept while useful; to confirm, B-list). */
export const QUOTE_RETENTION_MS = 2 * 365 * DAY;
export const QUOTES_PAGE_SIZE = 25;
export const MAX_QUOTE_PARTICIPANTS = 1000;

/** The 27 EU member states (ISO codes): OSS rates only exist for these. */
export const EU_COUNTRIES = [
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
] as const;

// ─── P7: partners and commissions ───────────────────────────────────────────

/**
 * Attribution (docs/commercial/PHASE_7_REPORT.md, "Attribution rules"): a partner
 * link is remembered this long in a first-party cookie; a newer partner link
 * replaces it (last click wins). Only orders started within the window count.
 * One year: the owner's decision of 2026-10-17 (was 30 days).
 */
export const PARTNER_ATTRIBUTION_DAYS = 365;
export const PARTNER_ATTRIBUTION_MS = PARTNER_ATTRIBUTION_DAYS * DAY;
/** The same visitor opening the same partner link again within this time is one click. */
export const PARTNER_CLICK_REPEAT_MS = 30 * MINUTE;
/** A partner stays signed in to the portal this long (it only shows the partner's own figures). */
export const PARTNER_SESSION_LIFETIME_MS = 7 * DAY;
/** The "approve everything older than …" button: older than the 14-day withdrawal period. */
export const COMMISSION_APPROVAL_AGE_DAYS = 14;
export const MAX_PARTNER_NAME_LENGTH = 80;
/** A commission can never be more than this per order or ticket (a typo like "50000" is refused). */
export const MAX_FIXED_COMMISSION_CENTS = 100_000;
export const PARTNERS_PAGE_SIZE = 50;
export const COMMISSIONS_PAGE_SIZE = 50;
/** Rows in the partner's own sales list (the totals always cover the whole period). */
export const PARTNER_SALES_ROWS = 200;

// ─── P8: follow-up email, reviews, unique codes ─────────────────────────────

/**
 * The sentence the buyer ticks on the buy box (its text is in commerce.json,
 * key commerce.buy.followUpConsent). Change the version whenever that sentence
 * changes: every order records the version it was given for.
 */
export const FOLLOW_UP_CONSENT_VERSION = "follow-up-2026-10-v1";

/**
 * The reward for a review (decision B11, proposed): a personal code, one use,
 * for any review whatever its rating. `enabled: false` = only the question.
 */
export const REVIEW_REWARD = { enabled: true, percent: 10, validDays: 183 } as const;
export const MAX_REVIEW_TEXT_LENGTH = 1000;
export const MAX_REVIEW_NAME_LENGTH = 40;
export const REVIEWS_PAGE_SIZE = 25;
/** Reviews sent per network address (no flooding with fake tokens). */
export const REVIEW_RATE_LIMIT = { limit: 10, windowMs: 60 * MINUTE } as const;
/** A batch of unique codes: at most this many at once. */
export const MAX_BATCH_CODES = 500;

// ─── P9: retention periods ──────────────────────────────────────────────────

/**
 * How long records are kept before the daily maintenance deletes or
 * pseudonymises them (docs/commercial/SECURITY_AUDIT.md). ⚖️ The accounting
 * period (10 years in Belgium) and the audit-log period are to be confirmed
 * with the accountant / lawyer; change them here.
 */
export const RETENTION = {
  /** Who changed what: security evidence for 2 years. */
  auditLogDays: 2 * 365,
  /** Rejected reviews: kept a year (in case of questions), then deleted. */
  rejectedReviewDays: 365,
  /** Orders that were never paid hold no email; deleted after a year. */
  unpaidOrderDays: 365,
  /** Paid orders: the email and name are removed after the accounting period; the amounts stay. */
  orderPersonalDataDays: 10 * 365 + 3,
} as const;
