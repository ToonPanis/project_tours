/**
 * Hidden Antwerp in MongoDB: the collections, their validation and their indexes.
 * The single source for `npm run db:setup`, `npm run db:check` and the database tests.
 * (Plain JavaScript so the scripts can use it without a build step.)
 *
 * Hidden Pubs (`pub_*`): four collections, one per kind of record. Everything of one
 * game is found by its code, and everything disappears 7 days after the game was
 * created (D29): every document carries the game's `expiresAt`, and a TTL index on it
 * lets MongoDB delete it by itself (the TTL job runs about once a minute, so the
 * app also checks `expiresAt` when it reads a game).
 *
 * Commercial platform (`com_*`, docs/commercial/DATABASE_DESIGN.md): admin accounts,
 * sign-in links, sessions, rate limits, the audit log, the product catalogue and the
 * email outbox, orders, tickets, quotes, and (P7) partners, their click counters and
 * the commission ledger. Short-lived records (links, sessions, counters, sent emails)
 * have a TTL index too; the audit log, the catalogue and financial records are kept.
 */

/** @typedef {import("mongodb").Db} Db */

export const COLLECTIONS = {
  /** One document per game: `_id` = the game code, the whole game state, and `version`. */
  games: "pub_games",
  /** Every accepted action. Unique (gameCode, actionId): a double tap or a retry is saved once. */
  actions: "pub_game_actions",
  /** What happened, for the popups on every phone ("events since version X"). */
  events: "pub_game_events",
  /** Which phone is which player: only a SHA-256 hash of the cookie secret. */
  players: "pub_game_players",

  /** Admins (later partners). `_id` = user id; unique email. */
  users: "com_users",
  /** One-time sign-in links: `_id` = SHA-256 hash of the link's secret. */
  loginTokens: "com_login_tokens",
  /** Signed-in admins: `_id` = SHA-256 hash of the session cookie's secret. */
  sessions: "com_sessions",
  /** Rate-limit counters: `_id` = "<scope>:<hashed subject>:<window start>". */
  rateLimits: "com_rate_limits",
  /** Who changed what (append only). */
  auditLog: "com_audit_log",
  /** What can be sold. `_id` = product id. */
  products: "com_products",
  /** Price history: a change adds a price, never overwrites one. */
  prices: "com_prices",
  /** Emails to send. `_id` = idempotency key: the same id is sent once. */
  emailOutbox: "com_email_outbox",

  /** Tax settings, one document per saved version (unique `version`). */
  taxSettings: "com_tax_settings",
  /** Orders: `_id` = order id. Kept (accounting); no TTL. */
  orders: "com_orders",
  /** Stripe webhook events seen: `_id` = Stripe event id (a second delivery is recognised). */
  stripeEvents: "com_stripe_events",
  /** Tickets: one per paid order (unique `orderId`). */
  ticketGrants: "com_ticket_grants",
  /** Phones that opened a ticket: `_id` = SHA-256 hash of the phone's cookie secret. */
  ticketDevices: "com_ticket_devices",
  /** Discount codes (unique `code`). */
  discounts: "com_discounts",
  /** Number series for receipts and credit notes: `_id` = series, `value` = last number used. */
  counters: "com_counters",
  /** Receipts, invoices and credit notes: `_id` = e.g. "receipt:<orderId>". */
  documents: "com_documents",

  /** Corporate quote requests (P4), deleted after 2 years (TTL). */
  quotes: "com_quote_requests",
  /** Small settings documents by key, e.g. "corporate-pricing". */
  settings: "com_settings",

  /** Partners (P7): hotels, cafés, tourism, companies. `_id` = partner id; unique code. */
  partners: "com_partners",
  /** Clicks on partner links per day and campaign: `_id` = "<partnerId>:<day>:<campaign>". No IP, no visitor id. Kept 3 years (TTL). */
  partnerClicks: "com_partner_clicks",
  /** The commission ledger: `_id` = "accrual:<orderId>" or "adjustment:<orderId>:<refunded>". Never deleted. */
  commissions: "com_commission_ledger",

  /** Reviews (P8): one per ticket (unique grantId); moderated before anything is shown. */
  reviews: "com_reviews",
  /** Addresses that unsubscribed from non-transactional mail: `_id` = SHA-256 of the address (never the address). */
  suppressions: "com_suppressions",
};

const text = (maxLength) => ({ bsonType: "string", minLength: 1, maxLength });
const whole = { bsonType: ["int", "long"], minimum: 0 };
const date = { bsonType: "date" };
const optionalDate = { bsonType: ["date", "null"] };
const optionalText = (maxLength) => ({ bsonType: ["string", "null"], maxLength });

/** The shape MongoDB itself checks on every insert and update ($jsonSchema validation). */
const VALIDATORS = {
  [COLLECTIONS.games]: {
    required: ["_id", "walkSlug", "state", "version", "createdAt", "expiresAt"],
    properties: {
      _id: text(40),
      walkSlug: text(100),
      state: { bsonType: "object" },
      version: whole,
      createdAt: date,
      expiresAt: date,
      // Optional (P3): the number of tickets bought, the organiser included.
      seatLimit: { bsonType: ["int", "long"], minimum: 1, maximum: 1000 },
    },
  },
  [COLLECTIONS.actions]: {
    required: ["gameCode", "actionId", "playerId", "action", "version", "createdAt", "expiresAt"],
    properties: {
      gameCode: text(40),
      actionId: text(100),
      playerId: text(100),
      action: { bsonType: "object" },
      version: whole,
      createdAt: date,
      expiresAt: date,
    },
  },
  [COLLECTIONS.events]: {
    required: ["gameCode", "version", "position", "event", "expiresAt"],
    properties: {
      gameCode: text(40),
      version: whole,
      position: whole,
      event: { bsonType: "object" },
      expiresAt: date,
    },
  },
  [COLLECTIONS.players]: {
    required: ["gameCode", "tokenHash", "playerId", "expiresAt"],
    properties: {
      gameCode: text(40),
      tokenHash: text(100),
      playerId: text(100),
      expiresAt: date,
    },
  },

  [COLLECTIONS.users]: {
    required: ["_id", "email", "roles", "active", "createdAt"],
    properties: {
      _id: text(100),
      email: text(254),
      roles: { bsonType: "array", items: { enum: ["ADMIN", "PARTNER"] } },
      active: { bsonType: "bool" },
      createdAt: date,
      lastLoginAt: optionalDate,
      // P7: the partner a PARTNER user belongs to.
      partnerId: optionalText(100),
    },
  },
  [COLLECTIONS.loginTokens]: {
    required: ["_id", "userId", "expiresAt"],
    properties: { _id: text(100), userId: text(100), expiresAt: date, usedAt: optionalDate },
  },
  [COLLECTIONS.sessions]: {
    required: ["_id", "userId", "createdAt", "expiresAt"],
    properties: { _id: text(100), userId: text(100), createdAt: date, expiresAt: date },
  },
  [COLLECTIONS.rateLimits]: {
    required: ["_id", "count", "expiresAt"],
    properties: { _id: text(200), count: whole, expiresAt: date },
  },
  [COLLECTIONS.auditLog]: {
    required: ["_id", "action", "target", "details", "at"],
    properties: {
      _id: text(100),
      actorId: optionalText(100),
      actorEmail: optionalText(254),
      action: text(50),
      target: text(200),
      details: { bsonType: "object" },
      at: date,
    },
  },
  [COLLECTIONS.products]: {
    required: ["_id", "walkSlug", "name", "unit", "active", "taxCategoryId", "sortOrder", "createdAt", "updatedAt"],
    properties: {
      _id: text(100),
      walkSlug: text(100),
      name: text(80),
      unit: { enum: ["person"] },
      active: { bsonType: "bool" },
      taxCategoryId: optionalText(30),
      sortOrder: whole,
      createdAt: date,
      updatedAt: date,
    },
  },
  [COLLECTIONS.prices]: {
    required: ["_id", "productId", "amountCents", "currency", "validFrom", "createdBy"],
    properties: {
      _id: text(100),
      productId: text(100),
      amountCents: { bsonType: ["int", "long"], minimum: 1, maximum: 1000000 },
      currency: { enum: ["EUR"] },
      validFrom: date,
      createdBy: text(254),
    },
  },
  [COLLECTIONS.emailOutbox]: {
    required: ["_id", "to", "subject", "status", "attempts", "nextAttemptAt", "createdAt", "expiresAt"],
    properties: {
      _id: text(200),
      to: text(254),
      subject: text(200),
      text: optionalText(20000),
      // P8: the HTML version and the unsubscribe link (follow-up mails).
      html: optionalText(100000),
      unsubscribeUrl: optionalText(500),
      status: { enum: ["pending", "sent", "failed"] },
      attempts: whole,
      nextAttemptAt: date,
      lastError: optionalText(100),
      createdAt: date,
      sentAt: optionalDate,
      expiresAt: date,
    },
  },

  [COLLECTIONS.taxSettings]: {
    required: ["_id", "version", "regime", "homeCountry", "categories", "ossEnabled", "ossRates", "confirmedByAccountant", "updatedAt"],
    properties: {
      _id: text(40),
      version: whole,
      regime: { enum: ["not-configured", "exempt", "vat-registered"] },
      homeCountry: text(2),
      categories: { bsonType: "array", maxItems: 10 },
      ossEnabled: { bsonType: "bool" },
      ossRates: { bsonType: "array", maxItems: 200 },
      exemptionNote: optionalText(300),
      confirmedByAccountant: { bsonType: "bool" },
      updatedAt: date,
      updatedBy: optionalText(254),
    },
  },
  [COLLECTIONS.orders]: {
    required: ["_id", "status", "lines", "subtotalCents", "totalCents", "currency", "locale", "buyerTokenHash", "taxBasis", "stripe", "refundedCents", "createdAt", "updatedAt"],
    properties: {
      _id: text(100),
      status: { enum: ["pending", "paid", "failed", "canceled", "refunded"] },
      lines: { bsonType: "array", minItems: 1, maxItems: 10 },
      subtotalCents: whole,
      discount: { bsonType: ["object", "null"] },
      totalCents: whole,
      currency: { enum: ["EUR"] },
      locale: text(10),
      buyerTokenHash: text(100),
      email: optionalText(254),
      customer: { bsonType: ["object", "null"] },
      taxBasis: { bsonType: "object" },
      tax: { bsonType: ["object", "null"] },
      stripe: { bsonType: "object" },
      refundedCents: whole,
      createdAt: date,
      updatedAt: date,
      paidAt: optionalDate,
      // P7: the referring partner and its commission rule at the time.
      partner: { bsonType: ["object", "null"] },
      // P8: consent for the one email after the walk (time + sentence version).
      followUp: { bsonType: ["object", "null"] },
      // P9: when the buyer's email and name were removed (erasure or retention).
      erasedAt: optionalDate,
    },
  },
  [COLLECTIONS.stripeEvents]: {
    required: ["_id", "type", "done", "receivedAt", "expiresAt"],
    properties: { _id: text(255), type: text(100), done: { bsonType: "bool" }, receivedAt: date, processedAt: optionalDate, expiresAt: date },
  },
  [COLLECTIONS.ticketGrants]: {
    required: ["_id", "orderId", "productId", "walkSlug", "seats", "devicesUsed", "status", "createdAt", "validUntil"],
    properties: {
      _id: text(100),
      orderId: text(100),
      productId: text(100),
      walkSlug: text(100),
      seats: { bsonType: ["int", "long"], minimum: 1, maximum: 1000 },
      devicesUsed: whole,
      status: { enum: ["active", "revoked"] },
      createdAt: date,
      validUntil: date,
      // Hidden Pubs (P3): the game this ticket was used for.
      gameCode: optionalText(100),
      // P8: when the walk was finished with this ticket (first time only).
      completedAt: optionalDate,
    },
  },
  [COLLECTIONS.ticketDevices]: {
    required: ["_id", "grantId", "walkSlug", "createdAt", "expiresAt"],
    properties: { _id: text(100), grantId: text(100), walkSlug: text(100), createdAt: date, expiresAt: date },
  },
  [COLLECTIONS.discounts]: {
    required: ["_id", "code", "kind", "value", "productIds", "redemptions", "active", "createdAt", "createdBy"],
    properties: {
      _id: text(100),
      code: text(30),
      kind: { enum: ["percent", "fixed"] },
      value: { bsonType: ["int", "long"], minimum: 1, maximum: 1000000 },
      productIds: { bsonType: "array", items: { bsonType: "string" } },
      validFrom: optionalDate,
      validUntil: optionalDate,
      maxRedemptions: { bsonType: ["int", "long", "null"], minimum: 1 },
      redemptions: whole,
      active: { bsonType: "bool" },
      createdAt: date,
      createdBy: text(254),
      // P8: admin | batch | review, the batch, the order a review reward belongs to.
      source: { enum: ["admin", "batch", "review"] },
      batchId: optionalText(100),
      forOrderId: optionalText(100),
    },
  },
  [COLLECTIONS.counters]: {
    required: ["_id", "value"],
    properties: { _id: text(100), value: whole },
  },
  [COLLECTIONS.documents]: {
    required: ["_id", "kind", "orderId", "provider", "status", "amountCents", "createdAt"],
    properties: {
      _id: text(200),
      number: optionalText(40),
      kind: { enum: ["receipt", "invoice", "credit-note"] },
      orderId: text(100),
      provider: { enum: ["internal", "billit"] },
      status: { enum: ["issued", "awaiting-provider"] },
      amountCents: whole,
      createdAt: date,
    },
  },

  [COLLECTIONS.quotes]: {
    required: ["_id", "status", "company", "contactName", "email", "participants", "activity", "language", "formula", "history", "dedupeKey", "createdAt", "updatedAt", "expiresAt"],
    properties: {
      _id: text(100),
      status: { enum: ["NEW", "CONTACTED", "QUOTED", "ACCEPTED", "DECLINED", "COMPLETED", "CANCELLED"] },
      company: text(120),
      contactName: text(80),
      email: text(254),
      phone: optionalText(25),
      preferredDate: optionalText(10),
      participants: { bsonType: ["int", "long"], minimum: 2, maximum: 1000 },
      activity: text(40),
      language: text(5),
      formula: { enum: ["self-guided", "guided", "unsure"] },
      wishes: optionalText(2000),
      history: { bsonType: "array", maxItems: 100 },
      dedupeKey: text(100),
      createdAt: date,
      updatedAt: date,
      expiresAt: date,
    },
  },
  [COLLECTIONS.settings]: {
    required: ["_id"],
    properties: { _id: text(100) },
  },

  [COLLECTIONS.partners]: {
    required: ["_id", "code", "name", "type", "active", "commission", "createdAt", "updatedAt"],
    properties: {
      _id: text(100),
      code: text(30),
      name: text(80),
      type: { enum: ["HOTEL_PARTNER", "HORECA_PARTNER", "TOURISM_PARTNER", "CORPORATE_PARTNER"] },
      active: { bsonType: "bool" },
      commission: { bsonType: "object", required: ["kind"], properties: { kind: { enum: ["percent-net", "fixed-per-ticket", "fixed-per-booking", "none"] } } },
      createdAt: date,
      updatedAt: date,
    },
  },
  [COLLECTIONS.partnerClicks]: {
    required: ["_id", "partnerId", "day", "campaign", "clicks", "expiresAt"],
    properties: {
      _id: text(200),
      partnerId: text(100),
      day: text(10),
      campaign: { bsonType: "string", maxLength: 40 },
      clicks: whole,
      expiresAt: date,
    },
  },
  [COLLECTIONS.commissions]: {
    required: ["_id", "partnerId", "orderId", "kind", "amountCents", "basisCents", "rule", "status", "productId", "orderPaidAt", "createdAt", "updatedAt", "history"],
    properties: {
      _id: text(200),
      partnerId: text(100),
      orderId: text(100),
      kind: { enum: ["accrual", "adjustment"] },
      // Signed: an adjustment after a refund is negative.
      amountCents: { bsonType: ["int", "long"] },
      basisCents: whole,
      rule: { bsonType: "object" },
      status: { enum: ["pending", "approved", "payable", "paid", "reversed"] },
      productId: text(100),
      campaign: optionalText(40),
      orderPaidAt: date,
      createdAt: date,
      updatedAt: date,
      payoutReference: optionalText(100),
      history: { bsonType: "array", maxItems: 50 },
    },
  },

  [COLLECTIONS.reviews]: {
    required: ["_id", "grantId", "orderId", "walkSlug", "productId", "rating", "locale", "status", "incentivised", "createdAt"],
    properties: {
      _id: text(100),
      grantId: text(100),
      orderId: text(100),
      walkSlug: text(100),
      productId: text(100),
      rating: { bsonType: ["int", "long"], minimum: 1, maximum: 5 },
      text: optionalText(1000),
      displayName: optionalText(40),
      mayPublish: { bsonType: "bool" },
      locale: text(5),
      status: { enum: ["pending", "approved", "rejected"] },
      incentivised: { bsonType: "bool" },
      rewardDiscountId: optionalText(100),
      createdAt: date,
      moderatedAt: optionalDate,
      moderatedBy: optionalText(254),
    },
  },
  [COLLECTIONS.suppressions]: {
    required: ["_id", "reason", "at"],
    properties: { _id: text(100), reason: { enum: ["unsubscribed"] }, at: date },
  },
};

/** TTL: delete a document as soon as its `expiresAt` has passed. */
const expiry = { key: { expiresAt: 1 }, name: "expiresAt_ttl", expireAfterSeconds: 0 };

/** @type {Record<string, import("mongodb").IndexDescription[]>} */
export const INDEXES = {
  [COLLECTIONS.games]: [expiry],
  [COLLECTIONS.actions]: [{ key: { gameCode: 1, actionId: 1 }, name: "gameCode_actionId", unique: true }, expiry],
  [COLLECTIONS.events]: [
    { key: { gameCode: 1, version: 1, position: 1 }, name: "gameCode_version_position", unique: true },
    expiry,
  ],
  [COLLECTIONS.players]: [{ key: { gameCode: 1, tokenHash: 1 }, name: "gameCode_tokenHash", unique: true }, expiry],

  [COLLECTIONS.users]: [
    { key: { email: 1 }, name: "email_unique", unique: true },
    // P7: the users of one partner.
    { key: { partnerId: 1 }, name: "partnerId", partialFilterExpression: { partnerId: { $type: "string" } } },
  ],
  [COLLECTIONS.loginTokens]: [expiry],
  [COLLECTIONS.sessions]: [expiry],
  [COLLECTIONS.rateLimits]: [expiry],
  [COLLECTIONS.auditLog]: [{ key: { at: -1 }, name: "at_desc" }],
  [COLLECTIONS.products]: [],
  [COLLECTIONS.prices]: [{ key: { productId: 1, validFrom: -1 }, name: "productId_validFrom" }],
  [COLLECTIONS.emailOutbox]: [{ key: { status: 1, nextAttemptAt: 1 }, name: "status_nextAttemptAt" }, expiry],

  [COLLECTIONS.taxSettings]: [{ key: { version: -1 }, name: "version_unique", unique: true }],
  [COLLECTIONS.orders]: [
    { key: { createdAt: -1 }, name: "createdAt_desc" },
    { key: { status: 1, createdAt: -1 }, name: "status_createdAt" },
    // P9: a person's orders, for access and erasure requests.
    { key: { email: 1 }, name: "email", partialFilterExpression: { email: { $type: "string" } } },
    // P5: the dashboard reads paid orders by payment date.
    { key: { status: 1, paidAt: 1 }, name: "status_paidAt" },
    // P7: one partner's orders by payment date.
    {
      key: { "partner.partnerId": 1, paidAt: 1 },
      name: "partnerId_paidAt",
      partialFilterExpression: { "partner.partnerId": { $type: "string" } },
    },
    {
      key: { "stripe.paymentIntentId": 1 },
      name: "paymentIntentId",
      partialFilterExpression: { "stripe.paymentIntentId": { $type: "string" } },
    },
  ],
  [COLLECTIONS.stripeEvents]: [expiry],
  [COLLECTIONS.ticketGrants]: [
    { key: { orderId: 1 }, name: "orderId_unique", unique: true },
    { key: { gameCode: 1, createdAt: -1 }, name: "gameCode_createdAt" },
  ],
  [COLLECTIONS.ticketDevices]: [{ key: { grantId: 1 }, name: "grantId" }, expiry],
  [COLLECTIONS.discounts]: [{ key: { code: 1 }, name: "code_unique", unique: true }],
  [COLLECTIONS.counters]: [],
  [COLLECTIONS.documents]: [
    { key: { orderId: 1 }, name: "orderId" },
    { key: { status: 1, createdAt: -1 }, name: "status_createdAt" },
  ],
  [COLLECTIONS.quotes]: [
    { key: { status: 1, createdAt: -1 }, name: "status_createdAt" },
    { key: { createdAt: -1 }, name: "createdAt_desc" },
    { key: { dedupeKey: 1, createdAt: -1 }, name: "dedupeKey_createdAt" },
    // P9: a person's requests (access and erasure).
    { key: { email: 1 }, name: "email" },
    expiry,
  ],
  [COLLECTIONS.settings]: [],
  [COLLECTIONS.partners]: [{ key: { code: 1 }, name: "code_unique", unique: true }],
  [COLLECTIONS.partnerClicks]: [{ key: { partnerId: 1, day: 1 }, name: "partnerId_day" }, expiry],
  [COLLECTIONS.commissions]: [
    { key: { orderId: 1 }, name: "orderId" },
    { key: { partnerId: 1, orderPaidAt: -1 }, name: "partnerId_orderPaidAt" },
    { key: { status: 1, orderPaidAt: -1 }, name: "status_orderPaidAt" },
    { key: { orderPaidAt: -1 }, name: "orderPaidAt_desc" },
  ],
  [COLLECTIONS.reviews]: [
    { key: { grantId: 1 }, name: "grantId_unique", unique: true },
    { key: { status: 1, createdAt: -1 }, name: "status_createdAt" },
    { key: { createdAt: -1 }, name: "createdAt_desc" },
  ],
  [COLLECTIONS.suppressions]: [],
};

/**
 * Creates the collections (with validation) and indexes that don't exist yet.
 * Safe to run any number of times: it never deletes or changes data.
 *
 * @param {Db} db
 * @returns {Promise<string[]>} what it did, one line per change (empty = already up to date)
 */
export async function ensureSchema(db) {
  const done = [];
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name));

  for (const [name, schema] of Object.entries(VALIDATORS)) {
    const validator = { $jsonSchema: { bsonType: "object", ...schema } };
    if (!existing.has(name)) {
      await db.createCollection(name, { validator, validationLevel: "strict", validationAction: "error" });
      done.push(`created collection ${name}`);
    } else {
      // Keep the validation up to date. Needs the dbAdmin role; without it, the old rules stay.
      try {
        await db.command({ collMod: name, validator, validationLevel: "strict", validationAction: "error" });
      } catch (error) {
        done.push(`could not update the validation of ${name} (${errorLabel(error)}); the existing rules stay`);
      }
    }
    const indexNames = new Set((await db.collection(name).listIndexes().toArray()).map((index) => index.name));
    const missing = INDEXES[name].filter((index) => !indexNames.has(index.name));
    if (missing.length > 0) {
      await db.collection(name).createIndexes(missing);
      done.push(`created index(es) ${missing.map((index) => index.name).join(", ")} on ${name}`);
    }
  }
  return done;
}

/**
 * What's missing compared with the schema above (read only).
 *
 * @param {Db} db
 * @returns {Promise<string[]>} the problems (empty = everything is there)
 */
export async function checkSchema(db) {
  const problems = [];
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name));
  for (const name of Object.values(COLLECTIONS)) {
    if (!existing.has(name)) {
      problems.push(`collection ${name} is missing`);
      continue;
    }
    const indexNames = new Set((await db.collection(name).listIndexes().toArray()).map((index) => index.name));
    for (const index of INDEXES[name]) {
      if (!indexNames.has(index.name)) problems.push(`index ${index.name} on ${name} is missing`);
    }
  }
  return problems;
}

/**
 * A safe description of a database error: its name and code, never its message
 * (a message could contain a host name or, for a badly formed URI, part of it).
 *
 * @param {unknown} error
 */
export function errorLabel(error) {
  if (!(error instanceof Error)) return "unknown error";
  const code = "code" in error && error.code !== undefined ? ` ${String(error.code)}` : "";
  return `${error.name}${code}`;
}
