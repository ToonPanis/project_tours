import { MongoServerError, type Db, type Document } from "mongodb";
import type { AuditEntry, CommerceUser, OutboxEmail, Product, ProductPrice } from "@/types/commerce";
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
    vatRateBasisPoints: typeof doc.vatRateBasisPoints === "number" ? doc.vatRateBasisPoints : null,
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
      vatRateBasisPoints: product.vatRateBasisPoints,
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
}
