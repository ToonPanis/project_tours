import { MongoServerError, type Db, type Document } from "mongodb";
import type {
  AuditEntry,
  BillingDocument,
  CommerceUser,
  CommissionEntry,
  CommissionStatus,
  CorporatePricing,
  Partner,
  PartnerClickDay,
  Review,
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
import { COLLECTIONS, errorLabel } from "../../../../db/mongo-schema.mjs";
import { CommerceStoreUnavailableError, type CommerceStore, type CommissionChange, type CommissionQuery } from "./commerce-store";

/**
 * The commerce data in MongoDB Atlas (collections, validation and indexes:
 * db/mongo-schema.mjs). Same database and same rules as Hidden Pubs'
 * mongo-store.ts: dates are real BSON dates in the database and ISO strings
 * in the app; every value that goes into a filter is checked first.
 */

interface StringIdDocument extends Document {
  _id: string;
}

/** An exact, case-insensitive match for an email address (the address is escaped: no regex tricks). */
function emailMatch(email: string): RegExp {
  return new RegExp(`^${key(email).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
}

/** MongoDB's "this unique key already exists". */
const isDuplicateKey = (error: unknown) => error instanceof MongoServerError && error.code === 11000;

/**
 * Protection against NoSQL injection: only plain, short strings go into a
 * filter. An object such as { "$ne": "" } in place of an email would otherwise
 * match every document. (The services already check their input; this is the
 * last line of defence, right before the query.)
 */
function key(value: unknown, maxLength = 254): string {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) {
    throw new TypeError("A database key must be a short string.");
  }
  return value;
}

const iso = (value: unknown) => (value instanceof Date ? value.toISOString() : null);
const toDate = (value: string) => new Date(value);

function toUser(doc: Document | null): CommerceUser | null {
  if (!doc || typeof doc._id !== "string" || typeof doc.email !== "string" || !Array.isArray(doc.roles)) return null;
  return {
    id: doc._id,
    email: doc.email,
    roles: doc.roles.filter((role: unknown) => role === "ADMIN" || role === "PARTNER"),
    active: doc.active === true,
    createdAt: iso(doc.createdAt) ?? new Date(0).toISOString(),
    lastLoginAt: iso(doc.lastLoginAt),
    // Only partner users have one (admins keep the same shape as before P7).
    ...(typeof doc.partnerId === "string" ? { partnerId: doc.partnerId } : {}),
  };
}

function toProduct(doc: Document | null): Product | null {
  if (!doc || typeof doc._id !== "string" || typeof doc.name !== "string" || typeof doc.walkSlug !== "string") return null;
  return {
    id: doc._id,
    walkSlug: doc.walkSlug,
    name: doc.name,
    unit: "person",
    active: doc.active === true,
    taxCategoryId: typeof doc.taxCategoryId === "string" ? doc.taxCategoryId : null,
    sortOrder: typeof doc.sortOrder === "number" ? doc.sortOrder : 0,
    createdAt: iso(doc.createdAt) ?? new Date(0).toISOString(),
    updatedAt: iso(doc.updatedAt) ?? new Date(0).toISOString(),
  };
}

function toPrice(doc: Document): ProductPrice | null {
  if (typeof doc._id !== "string" || typeof doc.amountCents !== "number") return null;
  return {
    id: doc._id,
    productId: String(doc.productId),
    amountCents: doc.amountCents,
    currency: "EUR",
    validFrom: iso(doc.validFrom) ?? new Date(0).toISOString(),
    createdBy: String(doc.createdBy),
  };
}

function toAudit(doc: Document): AuditEntry {
  return {
    id: String(doc._id),
    actorId: typeof doc.actorId === "string" ? doc.actorId : null,
    actorEmail: typeof doc.actorEmail === "string" ? doc.actorEmail : null,
    action: doc.action,
    target: String(doc.target),
    details: typeof doc.details === "object" && doc.details !== null ? doc.details : {},
    at: iso(doc.at) ?? new Date(0).toISOString(),
  };
}

function toEmail(doc: Document): OutboxEmail {
  return {
    id: String(doc._id),
    to: String(doc.to),
    subject: String(doc.subject),
    text: typeof doc.text === "string" ? doc.text : null,
    // P8 fields only when present (older emails keep their shape).
    ...(typeof doc.html === "string" ? { html: doc.html } : {}),
    ...(typeof doc.unsubscribeUrl === "string" ? { unsubscribeUrl: doc.unsubscribeUrl } : {}),
    status: doc.status,
    attempts: Number(doc.attempts),
    nextAttemptAt: iso(doc.nextAttemptAt) ?? new Date(0).toISOString(),
    lastError: typeof doc.lastError === "string" ? doc.lastError : null,
    createdAt: iso(doc.createdAt) ?? new Date(0).toISOString(),
    sentAt: iso(doc.sentAt),
  };
}

/**
 * P2 records: the date fields at the top level become BSON dates in the
 * database and ISO strings in the app; nested objects (lines, tax) are stored
 * as they are. One pair of helpers per record keeps that in one place.
 */
function datesToDb<T extends object>(record: Partial<T>, dateFields: readonly string[]): Document {
  const doc: Document = { ...record };
  delete doc.id;
  for (const field of dateFields) {
    if (field in doc) doc[field] = doc[field] === null ? null : toDate(doc[field] as string);
  }
  return doc;
}

function datesFromDb<T>(doc: Document | null, dateFields: readonly string[]): T | null {
  if (!doc) return null;
  const record: Document = { ...doc, id: doc._id };
  delete record._id;
  delete record.expiresAt;
  for (const field of dateFields) {
    if (field in record) record[field] = record[field] instanceof Date ? (record[field] as Date).toISOString() : null;
  }
  return record as T;
}

const ORDER_DATES = ["createdAt", "updatedAt", "paidAt", "erasedAt"] as const;
const GRANT_DATES = ["createdAt", "validUntil", "completedAt"] as const;
const REVIEW_DATES = ["createdAt", "moderatedAt"] as const;
const DISCOUNT_DATES = ["validFrom", "validUntil", "createdAt"] as const;
const DOCUMENT_DATES = ["createdAt"] as const;
const TAX_DATES = ["updatedAt"] as const;
const PARTNER_DATES = ["createdAt", "updatedAt"] as const;
/** Top-level dates only; the history lines keep their ISO strings. */
const COMMISSION_DATES = ["orderPaidAt", "createdAt", "updatedAt"] as const;
/** Click counters are kept 3 years (docs/commercial/DATABASE_DESIGN.md). */
const CLICK_RETENTION_MS = 3 * 365 * 24 * 60 * 60 * 1000;
/** The fields of a ledger line that a status change touches. */
interface CommissionStatusDocument {
  _id: string;
  status: CommissionStatus;
  updatedAt: Date;
  payoutReference?: string | null;
  history: CommissionEntry["history"];
}
/** Top-level dates only; the history lines keep their ISO strings. */
const QUOTE_DATES = ["createdAt", "updatedAt"] as const;
/** The fields of a quote document that a status change touches. */
interface QuoteHistoryDocument {
  _id: string;
  status: QuoteStatus;
  updatedAt: Date;
  history: QuoteRequest["history"];
}

/** The key of the corporate price table in com_settings. */
const CORPORATE_PRICING_ID = "corporate-pricing";

/** A stored quote back to the app's shape (the dedupe key and expiry stay in the database). */
function toQuote(doc: Document | null): QuoteRequest | null {
  const quote = datesFromDb<QuoteRequest & { dedupeKey?: string }>(doc, QUOTE_DATES);
  if (!quote) return null;
  delete quote.dedupeKey;
  return quote;
}

/** The app's ISO strings back to BSON dates, only for the date fields that are present. */
function emailChangesToDoc(changes: Partial<Omit<OutboxEmail, "id">>): Document {
  const doc: Document = { ...changes };
  if (changes.nextAttemptAt !== undefined) doc.nextAttemptAt = toDate(changes.nextAttemptAt);
  if (changes.createdAt !== undefined) doc.createdAt = toDate(changes.createdAt);
  if (changes.sentAt !== undefined) doc.sentAt = changes.sentAt === null ? null : toDate(changes.sentAt);
  return doc;
}

export class MongoCommerceStore implements CommerceStore {
  constructor(private readonly db: Db) {}

  /**
   * Runs a database call. A programming error (bad input) is passed on as it is;
   * every database or network error becomes CommerceStoreUnavailableError, whose
   * message says nothing about the connection.
   */
  private async run<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await work();
    } catch (error) {
      if (error instanceof TypeError) throw error;
      // Name and code only (CLAUDE.md: never messages in production logs; they can contain a host name).
      console.error(`[Hidden Antwerp] commerce database call failed: ${errorLabel(error)}`);
      throw new CommerceStoreUnavailableError();
    }
  }

  /** Every commerce collection uses a string `_id` (a hash, an id or a key), not MongoDB's ObjectId. */
  private collection(name: string) {
    return this.db.collection<StringIdDocument>(name);
  }

  findUserByEmail(email: string) {
    return this.run(async () => toUser(await this.collection(COLLECTIONS.users).findOne({ email: key(email) })));
  }

  findUserById(id: string) {
    return this.run(async () => toUser(await this.collection(COLLECTIONS.users).findOne({ _id: key(id, 100) })));
  }

  saveUser(user: CommerceUser) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.users).replaceOne(
        { _id: key(user.id, 100) },
        {
          email: user.email,
          roles: user.roles,
          active: user.active,
          createdAt: toDate(user.createdAt),
          lastLoginAt: user.lastLoginAt ? toDate(user.lastLoginAt) : null,
          partnerId: user.partnerId ?? null,
        },
        { upsert: true },
      );
    });
  }

  saveLoginToken({ tokenHash, userId, expiresAt }: { tokenHash: string; userId: string; expiresAt: Date }) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.loginTokens).insertOne({ _id: key(tokenHash, 100), userId, expiresAt, usedAt: null });
    });
  }

  consumeLoginToken(tokenHash: string, now: Date) {
    return this.run(async () => {
      // One atomic "find unused, unexpired link and mark it used": two requests with
      // the same link can't both get it (the second finds usedAt already set).
      const doc = await this.collection(COLLECTIONS.loginTokens).findOneAndUpdate(
        { _id: key(tokenHash, 100), usedAt: null, expiresAt: { $gt: now } },
        { $set: { usedAt: now } },
      );
      return doc && typeof doc.userId === "string" ? { userId: doc.userId } : null;
    });
  }

  saveSession({ tokenHash, userId, createdAt, expiresAt }: { tokenHash: string; userId: string; createdAt: Date; expiresAt: Date }) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.sessions).insertOne({ _id: key(tokenHash, 100), userId, createdAt, expiresAt });
    });
  }

  findSession(tokenHash: string, now: Date) {
    return this.run(async () => {
      // The TTL job deletes expired sessions about once a minute; until then this filter hides them.
      const doc = await this.collection(COLLECTIONS.sessions).findOne({ _id: key(tokenHash, 100), expiresAt: { $gt: now } });
      return doc && typeof doc.userId === "string" && doc.expiresAt instanceof Date ? { userId: doc.userId, expiresAt: doc.expiresAt } : null;
    });
  }

  deleteSession(tokenHash: string) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.sessions).deleteOne({ _id: key(tokenHash, 100) });
    });
  }

  incrementCounter(counterKey: string, expiresAt: Date) {
    return this.run(async () => {
      // Upsert + $inc in one step: parallel requests each get their own, higher count.
      const doc = await this.collection(COLLECTIONS.rateLimits).findOneAndUpdate(
        { _id: key(counterKey, 200) },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
        { upsert: true, returnDocument: "after" },
      );
      return typeof doc?.count === "number" ? doc.count : 1;
    });
  }

  appendAudit(entry: AuditEntry) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.auditLog).insertOne({
        _id: key(entry.id, 100),
        actorId: entry.actorId,
        actorEmail: entry.actorEmail,
        action: entry.action,
        target: entry.target,
        details: entry.details,
        at: toDate(entry.at),
      });
    });
  }

  listAudit({ skip, limit }: { skip: number; limit: number }) {
    return this.run(async () => {
      const collection = this.collection(COLLECTIONS.auditLog);
      const [docs, total] = await Promise.all([
        collection.find({}).sort({ at: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments({}),
      ]);
      return { entries: docs.map(toAudit), total };
    });
  }

  listProducts() {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.products).find({}).toArray();
      return docs.map(toProduct).filter((product): product is Product => product !== null);
    });
  }

  getProduct(id: string) {
    return this.run(async () => toProduct(await this.collection(COLLECTIONS.products).findOne({ _id: key(id, 100) })));
  }

  private productDoc(product: Product): Document {
    return {
      walkSlug: product.walkSlug,
      name: product.name,
      unit: product.unit,
      active: product.active,
      taxCategoryId: product.taxCategoryId,
      sortOrder: product.sortOrder,
      createdAt: toDate(product.createdAt),
      updatedAt: toDate(product.updatedAt),
    };
  }

  insertProductIfMissing(product: Product) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.products).insertOne({ _id: key(product.id, 100), ...this.productDoc(product) });
        return true;
      } catch (error) {
        if (isDuplicateKey(error)) return false;
        throw error;
      }
    });
  }

  saveProduct(product: Product) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.products).replaceOne({ _id: key(product.id, 100) }, this.productDoc(product));
    });
  }

  listPrices(productId: string) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.prices).find({ productId: key(productId, 100) }).sort({ validFrom: -1 }).toArray();
      return docs.map(toPrice).filter((price): price is ProductPrice => price !== null);
    });
  }

  addPrice(price: ProductPrice) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.prices).insertOne({
        _id: key(price.id, 100),
        productId: key(price.productId, 100),
        amountCents: price.amountCents,
        currency: price.currency,
        validFrom: toDate(price.validFrom),
        createdBy: price.createdBy,
      });
    });
  }

  enqueueEmail(email: OutboxEmail, expiresAt: Date) {
    return this.run(async () => {
      const { id, ...fields } = email;
      try {
        await this.collection(COLLECTIONS.emailOutbox).insertOne({ _id: key(id, 200), ...emailChangesToDoc(fields), expiresAt });
        return "queued" as const;
      } catch (error) {
        if (isDuplicateKey(error)) return "duplicate" as const;
        throw error;
      }
    });
  }

  listDueEmails(now: Date, limit: number) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.emailOutbox)
        .find({ status: "pending", nextAttemptAt: { $lte: now } })
        .sort({ createdAt: 1 })
        .limit(limit)
        .toArray();
      return docs.map(toEmail);
    });
  }

  claimEmail(id: string, attempts: number, now: Date, leaseUntil: Date) {
    return this.run(async () => {
      const result = await this.collection(COLLECTIONS.emailOutbox).updateOne(
        { _id: key(id, 200), status: "pending", attempts, nextAttemptAt: { $lte: now } },
        { $set: { nextAttemptAt: leaseUntil } },
      );
      return result.modifiedCount === 1;
    });
  }

  updateEmail(id: string, changes: Partial<Omit<OutboxEmail, "id">>) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.emailOutbox).updateOne({ _id: key(id, 200) }, { $set: emailChangesToDoc(changes) });
    });
  }

  // ── P2 ───────────────────────────────────────────────────────────────

  getTaxSettings() {
    return this.run(async () => {
      const [doc] = await this.collection(COLLECTIONS.taxSettings).find({}).sort({ version: -1 }).limit(1).toArray();
      const settings = datesFromDb<TaxSettings & { id?: string }>(doc ?? null, TAX_DATES);
      if (!settings) return null;
      delete settings.id;
      return settings as TaxSettings;
    });
  }

  insertTaxSettings(settings: TaxSettings) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.taxSettings).insertOne({ _id: `v${settings.version}`, ...datesToDb(settings, TAX_DATES) });
        return true;
      } catch (error) {
        if (isDuplicateKey(error)) return false;
        throw error;
      }
    });
  }

  insertOrder(order: Order) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.orders).insertOne({ _id: key(order.id, 100), ...datesToDb(order, ORDER_DATES) });
    });
  }

  getOrder(id: string) {
    return this.run(async () => datesFromDb<Order>(await this.collection(COLLECTIONS.orders).findOne({ _id: key(id, 100) }), ORDER_DATES));
  }

  findOrderByPaymentIntent(paymentIntentId: string) {
    return this.run(async () =>
      datesFromDb<Order>(await this.collection(COLLECTIONS.orders).findOne({ "stripe.paymentIntentId": key(paymentIntentId, 255) }), ORDER_DATES),
    );
  }

  transitionOrder(id: string, from: OrderStatus[], changes: Partial<Omit<Order, "id">>) {
    return this.run(async () => {
      // "Change it only if its status is still one of these": the filter and the update are one atomic step.
      const result = await this.collection(COLLECTIONS.orders).updateOne(
        { _id: key(id, 100), status: { $in: from } },
        { $set: datesToDb(changes, ORDER_DATES) },
      );
      return result.modifiedCount === 1;
    });
  }

  updateOrder(id: string, changes: Partial<Omit<Order, "id">>) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.orders).updateOne({ _id: key(id, 100) }, { $set: datesToDb(changes, ORDER_DATES) });
    });
  }

  listOrders({ skip, limit, status }: { skip: number; limit: number; status?: OrderStatus }) {
    return this.run(async () => {
      const filter = status ? { status: key(status, 20) } : {};
      const collection = this.collection(COLLECTIONS.orders);
      const [docs, total] = await Promise.all([
        collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(filter),
      ]);
      return { orders: docs.map((doc) => datesFromDb<Order>(doc, ORDER_DATES) as Order), total };
    });
  }

  recordStripeEvent({ id, type, receivedAt, expiresAt }: { id: string; type: string; receivedAt: Date; expiresAt: Date }) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.stripeEvents).insertOne({ _id: key(id, 255), type, done: false, receivedAt, processedAt: null, expiresAt });
        return "new" as const;
      } catch (error) {
        if (isDuplicateKey(error)) return "duplicate" as const;
        throw error;
      }
    });
  }

  isStripeEventDone(id: string) {
    return this.run(async () => (await this.collection(COLLECTIONS.stripeEvents).findOne({ _id: key(id, 255) }))?.done === true);
  }

  markStripeEventDone(id: string, at: Date) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.stripeEvents).updateOne({ _id: key(id, 255) }, { $set: { done: true, processedAt: at } });
    });
  }

  insertGrantIfMissing(grant: TicketGrant) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.ticketGrants).insertOne({ _id: key(grant.id, 100), ...datesToDb(grant, GRANT_DATES) });
        return grant;
      } catch (error) {
        // The unique index on orderId: this order already has its ticket.
        if (!isDuplicateKey(error)) throw error;
        const existing = await this.collection(COLLECTIONS.ticketGrants).findOne({ orderId: key(grant.orderId, 100) });
        return datesFromDb<TicketGrant>(existing, GRANT_DATES) as TicketGrant;
      }
    });
  }

  getGrant(id: string) {
    return this.run(async () => datesFromDb<TicketGrant>(await this.collection(COLLECTIONS.ticketGrants).findOne({ _id: key(id, 100) }), GRANT_DATES));
  }

  getGrantByOrder(orderId: string) {
    return this.run(async () =>
      datesFromDb<TicketGrant>(await this.collection(COLLECTIONS.ticketGrants).findOne({ orderId: key(orderId, 100) }), GRANT_DATES),
    );
  }

  updateGrant(id: string, changes: Partial<Omit<TicketGrant, "id">>) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.ticketGrants).updateOne({ _id: key(id, 100) }, { $set: datesToDb(changes, GRANT_DATES) });
    });
  }

  claimTicketSeat(grantId: string) {
    return this.run(async () => {
      // "One more phone, only while there's a free seat": $expr compares two fields of the same document.
      const result = await this.collection(COLLECTIONS.ticketGrants).updateOne(
        { _id: key(grantId, 100), status: "active", $expr: { $lt: ["$devicesUsed", "$seats"] } },
        { $inc: { devicesUsed: 1 } },
      );
      return result.modifiedCount === 1;
    });
  }

  saveTicketDevice({ tokenHash, grantId, walkSlug, createdAt, expiresAt }: { tokenHash: string; grantId: string; walkSlug: string; createdAt: Date; expiresAt: Date }) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.ticketDevices).insertOne({ _id: key(tokenHash, 100), grantId, walkSlug, createdAt, expiresAt });
    });
  }

  findTicketDevice(tokenHash: string, now: Date) {
    return this.run(async () => {
      const doc = await this.collection(COLLECTIONS.ticketDevices).findOne({ _id: key(tokenHash, 100), expiresAt: { $gt: now } });
      return doc && typeof doc.grantId === "string" ? { grantId: doc.grantId, walkSlug: String(doc.walkSlug) } : null;
    });
  }

  swapGrantGame(grantId: string, from: string | null, to: string | null) {
    return this.run(async () => {
      if (from !== null) key(from, 100);
      if (to !== null) key(to, 100);
      // "Change it only if it is still `from`": two organisers with the same ticket can't both reserve it.
      const result = await this.collection(COLLECTIONS.ticketGrants).updateOne(
        { _id: key(grantId, 100), status: "active", gameCode: from },
        { $set: { gameCode: to } },
      );
      return result.modifiedCount === 1;
    });
  }

  deleteTicketDevices(grantId: string) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.ticketDevices).deleteMany({ grantId: key(grantId, 100) });
    });
  }

  insertDiscount(discount: Discount) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.discounts).insertOne({ _id: key(discount.id, 100), ...datesToDb(discount, DISCOUNT_DATES) });
        return true;
      } catch (error) {
        if (isDuplicateKey(error)) return false;
        throw error;
      }
    });
  }

  getDiscount(id: string) {
    return this.run(async () => datesFromDb<Discount>(await this.collection(COLLECTIONS.discounts).findOne({ _id: key(id, 100) }), DISCOUNT_DATES));
  }

  getDiscountByCode(code: string) {
    return this.run(async () => datesFromDb<Discount>(await this.collection(COLLECTIONS.discounts).findOne({ code: key(code, 30) }), DISCOUNT_DATES));
  }

  listDiscounts() {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.discounts).find({}).sort({ createdAt: -1 }).limit(500).toArray();
      return docs.map((doc) => datesFromDb<Discount>(doc, DISCOUNT_DATES) as Discount);
    });
  }

  updateDiscount(id: string, changes: Partial<Omit<Discount, "id" | "code" | "redemptions">>) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.discounts).updateOne({ _id: key(id, 100) }, { $set: datesToDb(changes, DISCOUNT_DATES) });
    });
  }

  reserveDiscount(id: string) {
    return this.run(async () => {
      const result = await this.collection(COLLECTIONS.discounts).updateOne(
        {
          _id: key(id, 100),
          active: true,
          $or: [{ maxRedemptions: null }, { $expr: { $lt: ["$redemptions", "$maxRedemptions"] } }],
        },
        { $inc: { redemptions: 1 } },
      );
      return result.modifiedCount === 1;
    });
  }

  releaseDiscount(id: string) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.discounts).updateOne({ _id: key(id, 100), redemptions: { $gt: 0 } }, { $inc: { redemptions: -1 } });
    });
  }

  nextNumber(series: string) {
    return this.run(async () => {
      const doc = await this.collection(COLLECTIONS.counters).findOneAndUpdate(
        { _id: key(series, 100) },
        { $inc: { value: 1 } },
        { upsert: true, returnDocument: "after" },
      );
      return typeof doc?.value === "number" ? doc.value : 1;
    });
  }

  insertDocumentIfMissing(document: BillingDocument) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.documents).insertOne({ _id: key(document.id, 200), ...datesToDb(document, DOCUMENT_DATES) });
        return document;
      } catch (error) {
        if (!isDuplicateKey(error)) throw error;
        const existing = await this.collection(COLLECTIONS.documents).findOne({ _id: key(document.id, 200) });
        return datesFromDb<BillingDocument>(existing, DOCUMENT_DATES) as BillingDocument;
      }
    });
  }

  getDocument(id: string) {
    return this.run(async () => datesFromDb<BillingDocument>(await this.collection(COLLECTIONS.documents).findOne({ _id: key(id, 200) }), DOCUMENT_DATES));
  }

  listDocumentsForOrder(orderId: string) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.documents).find({ orderId: key(orderId, 100) }).sort({ createdAt: 1 }).toArray();
      return docs.map((doc) => datesFromDb<BillingDocument>(doc, DOCUMENT_DATES) as BillingDocument);
    });
  }

  // ── P4 ───────────────────────────────────────────────────────────────

  insertQuote(quote: QuoteRequest, dedupeKey: string, expiresAt: Date) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.quotes).insertOne({ _id: key(quote.id, 100), ...datesToDb(quote, QUOTE_DATES), dedupeKey: key(dedupeKey, 100), expiresAt });
    });
  }

  findQuoteByDedupeKey(dedupeKey: string, since: Date) {
    return this.run(async () => toQuote(await this.collection(COLLECTIONS.quotes).findOne({ dedupeKey: key(dedupeKey, 100), createdAt: { $gt: since } })));
  }

  getQuote(id: string) {
    return this.run(async () => toQuote(await this.collection(COLLECTIONS.quotes).findOne({ _id: key(id, 100) })));
  }

  listQuotes({ skip, limit, status }: { skip: number; limit: number; status?: QuoteStatus }) {
    return this.run(async () => {
      const filter = status ? { status: key(status, 20) } : {};
      const collection = this.collection(COLLECTIONS.quotes);
      const [docs, total] = await Promise.all([
        collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(filter),
      ]);
      return { quotes: docs.map((doc) => toQuote(doc) as QuoteRequest), total };
    });
  }

  transitionQuote(id: string, from: QuoteStatus, entry: QuoteRequest["history"][number]) {
    return this.run(async () => {
      // Status check, new status and the history line in one atomic update.
      // A precisely typed view of the collection, so the driver knows `history` is an array ($push).
      const quotes = this.db.collection<QuoteHistoryDocument>(COLLECTIONS.quotes);
      const result = await quotes.updateOne(
        { _id: key(id, 100), status: key(from, 20) as QuoteStatus },
        { $set: { status: entry.status, updatedAt: toDate(entry.at) }, $push: { history: entry } },
      );
      return result.modifiedCount === 1;
    });
  }

  countQuotes(statuses: QuoteStatus[]) {
    return this.run(async () => this.collection(COLLECTIONS.quotes).countDocuments({ status: { $in: statuses.map((status) => key(status, 20)) } }));
  }

  listPaidOrdersUntil(to: Date, limit: number) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.orders)
        .find({ status: { $in: ["paid", "refunded"] }, paidAt: { $lt: to } })
        .sort({ paidAt: 1 })
        .limit(limit)
        .toArray();
      return docs.map((doc) => datesFromDb<Order>(doc, ORDER_DATES) as Order);
    });
  }

  listDocuments({ skip, limit, status }: { skip: number; limit: number; status?: BillingDocument["status"] }) {
    return this.run(async () => {
      const filter = status ? { status: key(status, 30) } : {};
      const collection = this.collection(COLLECTIONS.documents);
      const [docs, total] = await Promise.all([
        collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(filter),
      ]);
      return { documents: docs.map((doc) => datesFromDb<BillingDocument>(doc, DOCUMENT_DATES) as BillingDocument), total };
    });
  }

  listGrantsWithGame({ skip, limit }: { skip: number; limit: number }) {
    return this.run(async () => {
      // A real game code (a string that isn't a "pending:" reservation).
      const filter = { gameCode: { $type: "string", $not: /^pending:/ } };
      const collection = this.collection(COLLECTIONS.ticketGrants);
      const [docs, total] = await Promise.all([
        collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(filter),
      ]);
      return { grants: docs.map((doc) => datesFromDb<TicketGrant>(doc, GRANT_DATES) as TicketGrant), total };
    });
  }

  getCorporatePricing() {
    return this.run(async () => {
      const doc = await this.collection(COLLECTIONS.settings).findOne({ _id: CORPORATE_PRICING_ID });
      if (!doc || !Array.isArray(doc.tiers)) return null;
      return {
        tiers: doc.tiers,
        pricesIncludeVat: doc.pricesIncludeVat === true,
        updatedAt: iso(doc.updatedAt),
        updatedBy: typeof doc.updatedBy === "string" ? doc.updatedBy : null,
      } as CorporatePricing;
    });
  }

  saveCorporatePricing(pricing: CorporatePricing) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.settings).replaceOne(
        { _id: CORPORATE_PRICING_ID },
        { tiers: pricing.tiers, pricesIncludeVat: pricing.pricesIncludeVat, updatedAt: pricing.updatedAt ? toDate(pricing.updatedAt) : null, updatedBy: pricing.updatedBy },
        { upsert: true },
      );
    });
  }

  insertPartner(partner: Partner) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.partners).insertOne({ _id: key(partner.id, 100), ...datesToDb(partner, PARTNER_DATES) });
        return true;
      } catch (error) {
        // The unique index on code.
        if (isDuplicateKey(error)) return false;
        throw error;
      }
    });
  }

  getPartner(id: string) {
    return this.run(async () => datesFromDb<Partner>(await this.collection(COLLECTIONS.partners).findOne({ _id: key(id, 100) }), PARTNER_DATES));
  }

  getPartnerByCode(code: string) {
    return this.run(async () => datesFromDb<Partner>(await this.collection(COLLECTIONS.partners).findOne({ code: key(code, 30) }), PARTNER_DATES));
  }

  listPartners() {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.partners).find({}).sort({ name: 1 }).toArray();
      return docs.map((doc) => datesFromDb<Partner>(doc, PARTNER_DATES) as Partner);
    });
  }

  updatePartner(id: string, changes: Partial<Omit<Partner, "id" | "code" | "createdAt">>) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.partners).updateOne({ _id: key(id, 100) }, { $set: datesToDb(changes, PARTNER_DATES) });
    });
  }

  listPartnerUsers(partnerId: string) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.users).find({ partnerId: key(partnerId, 100) }).sort({ email: 1 }).toArray();
      return docs.map(toUser).filter((user): user is CommerceUser => user !== null);
    });
  }

  incrementPartnerClicks(partnerId: string, day: string, campaign: string) {
    return this.run(async () => {
      const expiresAt = new Date(Date.parse(`${key(day, 10)}T00:00:00Z`) + CLICK_RETENTION_MS);
      // One atomic upsert: two clicks at the same moment both count.
      await this.collection(COLLECTIONS.partnerClicks).updateOne(
        { _id: `${key(partnerId, 100)}:${day}:${campaign}` },
        { $inc: { clicks: 1 }, $setOnInsert: { partnerId, day, campaign, expiresAt } },
        { upsert: true },
      );
    });
  }

  listPartnerClicks({ partnerId, fromDay, toDay }: { partnerId?: string; fromDay: string; toDay: string }) {
    return this.run(async () => {
      const filter: Document = { day: { $gte: key(fromDay, 10), $lte: key(toDay, 10) } };
      if (partnerId) filter.partnerId = key(partnerId, 100);
      const docs = await this.collection(COLLECTIONS.partnerClicks).find(filter).toArray();
      return docs.map(
        (doc): PartnerClickDay => ({ partnerId: String(doc.partnerId), day: String(doc.day), campaign: String(doc.campaign ?? ""), clicks: Number(doc.clicks) }),
      );
    });
  }

  listPartnerOrders(partnerId: string, from: Date, to: Date, limit: number) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.orders)
        .find({ "partner.partnerId": key(partnerId, 100), status: { $in: ["paid", "refunded"] }, paidAt: { $gte: from, $lt: to } })
        .sort({ paidAt: 1 })
        .limit(limit)
        .toArray();
      return docs.map((doc) => datesFromDb<Order>(doc, ORDER_DATES) as Order);
    });
  }

  insertCommissionIfMissing(entry: CommissionEntry) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.commissions).insertOne({ _id: key(entry.id, 200), ...datesToDb(entry, COMMISSION_DATES) });
        return true;
      } catch (error) {
        // Same id = the same accrual or adjustment, already booked.
        if (isDuplicateKey(error)) return false;
        throw error;
      }
    });
  }

  listCommissionsForOrder(orderId: string) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.commissions).find({ orderId: key(orderId, 100) }).toArray();
      return docs.map((doc) => datesFromDb<CommissionEntry>(doc, COMMISSION_DATES) as CommissionEntry);
    });
  }

  listCommissions(query: CommissionQuery) {
    return this.run(async () => {
      const filter: Document = {};
      if (query.partnerId) filter.partnerId = key(query.partnerId, 100);
      if (query.status) filter.status = key(query.status, 20);
      if (query.orderPaidFrom || query.orderPaidTo) {
        filter.orderPaidAt = {
          ...(query.orderPaidFrom ? { $gte: query.orderPaidFrom } : {}),
          ...(query.orderPaidTo ? { $lt: query.orderPaidTo } : {}),
        };
      }
      const collection = this.collection(COLLECTIONS.commissions);
      const [docs, total] = await Promise.all([
        collection.find(filter).sort({ orderPaidAt: -1, _id: -1 }).skip(query.skip).limit(query.limit).toArray(),
        collection.countDocuments(filter),
      ]);
      return { entries: docs.map((doc) => datesFromDb<CommissionEntry>(doc, COMMISSION_DATES) as CommissionEntry), total };
    });
  }

  transitionCommission(id: string, from: CommissionStatus[], change: CommissionChange) {
    return this.run(async () => {
      const set: Partial<CommissionStatusDocument> = { status: change.status, updatedAt: toDate(change.at) };
      if (change.payoutReference !== undefined) set.payoutReference = change.payoutReference;
      // "Only while it is still one of these" and the change are one atomic step.
      const result = await this.db.collection<CommissionStatusDocument>(COLLECTIONS.commissions).updateOne(
        { _id: key(id, 200), status: { $in: from } },
        { $set: set, $push: { history: { status: change.status, at: change.at, by: change.by } } },
      );
      return result.modifiedCount === 1;
    });
  }

  markGrantCompleted(grantId: string, at: string) {
    return this.run(async () => {
      // Only the first time: "completedAt is missing or null" and the update are one atomic step.
      const result = await this.collection(COLLECTIONS.ticketGrants).updateOne(
        { _id: key(grantId, 100), $or: [{ completedAt: { $exists: false } }, { completedAt: null }] },
        { $set: { completedAt: toDate(at) } },
      );
      return result.modifiedCount === 1;
    });
  }

  getGrantByGameCode(gameCode: string) {
    return this.run(async () =>
      datesFromDb<TicketGrant>(await this.collection(COLLECTIONS.ticketGrants).findOne({ gameCode: key(gameCode, 100) }), GRANT_DATES),
    );
  }

  insertReview(review: Review) {
    return this.run(async () => {
      try {
        await this.collection(COLLECTIONS.reviews).insertOne({ _id: key(review.id, 100), ...datesToDb(review, REVIEW_DATES) });
        return "inserted" as const;
      } catch (error) {
        // The unique index on grantId: this ticket already has its review.
        if (isDuplicateKey(error)) return "duplicate" as const;
        throw error;
      }
    });
  }

  getReview(id: string) {
    return this.run(async () => datesFromDb<Review>(await this.collection(COLLECTIONS.reviews).findOne({ _id: key(id, 100) }), REVIEW_DATES));
  }

  getReviewByGrant(grantId: string) {
    return this.run(async () => datesFromDb<Review>(await this.collection(COLLECTIONS.reviews).findOne({ grantId: key(grantId, 100) }), REVIEW_DATES));
  }

  listReviews({ skip, limit, status }: { skip: number; limit: number; status?: Review["status"] }) {
    return this.run(async () => {
      const filter = status ? { status: key(status, 20) } : {};
      const collection = this.collection(COLLECTIONS.reviews);
      const [docs, total] = await Promise.all([
        collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(filter),
      ]);
      return { reviews: docs.map((doc) => datesFromDb<Review>(doc, REVIEW_DATES) as Review), total };
    });
  }

  updateReview(id: string, changes: Partial<Omit<Review, "id" | "grantId">>) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.reviews).updateOne({ _id: key(id, 100) }, { $set: datesToDb(changes, REVIEW_DATES) });
    });
  }

  deleteReview(id: string) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.reviews).deleteOne({ _id: key(id, 100) });
    });
  }

  addSuppression(emailHash: string, reason: "unsubscribed", at: string) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.suppressions).updateOne(
        { _id: key(emailHash, 100) },
        { $setOnInsert: { reason, at: toDate(at) } },
        { upsert: true },
      );
    });
  }

  isSuppressed(emailHash: string) {
    return this.run(async () => (await this.collection(COLLECTIONS.suppressions).countDocuments({ _id: key(emailHash, 100) }, { limit: 1 })) > 0);
  }

  findOrdersByEmail(email: string) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.orders).find({ email: emailMatch(email) }).sort({ createdAt: -1 }).toArray();
      return docs.map((doc) => datesFromDb<Order>(doc, ORDER_DATES) as Order);
    });
  }

  findQuotesByEmail(email: string) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.quotes).find({ email: emailMatch(email) }).sort({ createdAt: -1 }).toArray();
      return docs.map((doc) => toQuote(doc) as QuoteRequest);
    });
  }

  deleteQuote(id: string) {
    return this.run(async () => {
      await this.collection(COLLECTIONS.quotes).deleteOne({ _id: key(id, 100) });
    });
  }

  listEmailsTo(email: string) {
    return this.run(async () => (await this.collection(COLLECTIONS.emailOutbox).find({ to: emailMatch(email) }).toArray()).map(toEmail));
  }

  deleteEmailsTo(email: string) {
    return this.run(async () => (await this.collection(COLLECTIONS.emailOutbox).deleteMany({ to: emailMatch(email) })).deletedCount);
  }

  anonymiseAuditActor(actorId: string) {
    return this.run(
      async () =>
        (await this.collection(COLLECTIONS.auditLog).updateMany({ actorId: key(actorId, 100), actorEmail: { $ne: null } }, { $set: { actorEmail: null } })).modifiedCount,
    );
  }

  deleteAuditBefore(before: Date) {
    return this.run(async () => (await this.collection(COLLECTIONS.auditLog).deleteMany({ at: { $lt: before } })).deletedCount);
  }

  deleteReviewsBefore(status: Review["status"], before: Date) {
    return this.run(async () => (await this.collection(COLLECTIONS.reviews).deleteMany({ status: key(status, 20), createdAt: { $lt: before } })).deletedCount);
  }

  deleteUnpaidOrdersBefore(before: Date) {
    return this.run(
      async () => (await this.collection(COLLECTIONS.orders).deleteMany({ status: { $in: ["pending", "failed", "canceled"] }, createdAt: { $lt: before } })).deletedCount,
    );
  }

  listOrdersWithPersonalDataBefore(before: Date, limit: number) {
    return this.run(async () => {
      const docs = await this.collection(COLLECTIONS.orders)
        .find({
          status: { $in: ["paid", "refunded"] },
          createdAt: { $lt: before },
          $or: [{ email: { $type: "string" } }, { "customer.name": { $type: "string" } }],
        })
        .limit(limit)
        .toArray();
      return docs.map((doc) => datesFromDb<Order>(doc, ORDER_DATES) as Order);
    });
  }
}
