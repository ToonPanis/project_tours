import { MongoServerError, type Db, type Document } from "mongodb";
import type {
  AuditEntry,
  BillingDocument,
  CommerceUser,
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
import { CommerceStoreUnavailableError, type CommerceStore } from "./commerce-store";

/**
 * The commerce data in MongoDB Atlas (collections, validation and indexes:
 * db/mongo-schema.mjs). Same database and same rules as Hidden Pubs'
 * mongo-store.ts: dates are real BSON dates in the database and ISO strings
 * in the app; every value that goes into a filter is checked first.
 */

interface StringIdDocument extends Document {
  _id: string;
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
    roles: doc.roles.filter((role: unknown) => role === "ADMIN"),
    active: doc.active === true,
    createdAt: iso(doc.createdAt) ?? new Date(0).toISOString(),
    lastLoginAt: iso(doc.lastLoginAt),
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

const ORDER_DATES = ["createdAt", "updatedAt", "paidAt"] as const;
const GRANT_DATES = ["createdAt", "validUntil"] as const;
const DISCOUNT_DATES = ["validFrom", "validUntil", "createdAt"] as const;
const DOCUMENT_DATES = ["createdAt"] as const;
const TAX_DATES = ["updatedAt"] as const;

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
}
