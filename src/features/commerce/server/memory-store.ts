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
import type { CommerceStore } from "./commerce-store";

/**
 * Everything in memory: for development and tests only. It's lost when the
 * server stops, and on Vercel every server instance would have its own copy,
 * so production refuses it (see context.ts).
 *
 * Objects are copied in and out (structuredClone), so a caller changing a
 * returned object can't change the stored one by accident: the same behaviour
 * as a real database.
 */
export class MemoryCommerceStore implements CommerceStore {
  private users = new Map<string, CommerceUser>();
  private loginTokens = new Map<string, { userId: string; expiresAt: Date; used: boolean }>();
  private sessions = new Map<string, { userId: string; expiresAt: Date }>();
  private counters = new Map<string, { count: number; expiresAt: Date }>();
  private audit: AuditEntry[] = [];
  private products = new Map<string, Product>();
  private prices: ProductPrice[] = [];
  private outbox = new Map<string, OutboxEmail>();
  private taxVersions: TaxSettings[] = [];
  private orders = new Map<string, Order>();
  private stripeEvents = new Map<string, { done: boolean }>();
  private grants = new Map<string, TicketGrant>();
  private devices = new Map<string, { grantId: string; walkSlug: string; expiresAt: Date }>();
  private discounts = new Map<string, Discount>();
  private numbers = new Map<string, number>();
  private documents = new Map<string, BillingDocument>();
  private quotes = new Map<string, { quote: QuoteRequest; dedupeKey: string }>();
  private corporatePricing: CorporatePricing | null = null;

  async findUserByEmail(email: string) {
    const user = [...this.users.values()].find((candidate) => candidate.email === email);
    return user ? structuredClone(user) : null;
  }

  async findUserById(id: string) {
    const user = this.users.get(id);
    return user ? structuredClone(user) : null;
  }

  async saveUser(user: CommerceUser) {
    this.users.set(user.id, structuredClone(user));
  }

  async saveLoginToken({ tokenHash, userId, expiresAt }: { tokenHash: string; userId: string; expiresAt: Date }) {
    this.loginTokens.set(tokenHash, { userId, expiresAt, used: false });
  }

  async consumeLoginToken(tokenHash: string, now: Date) {
    const token = this.loginTokens.get(tokenHash);
    if (!token || token.used || token.expiresAt <= now) return null;
    // JavaScript runs this synchronously, so no other request can use it in between.
    token.used = true;
    return { userId: token.userId };
  }

  async saveSession({ tokenHash, userId, expiresAt }: { tokenHash: string; userId: string; createdAt: Date; expiresAt: Date }) {
    this.sessions.set(tokenHash, { userId, expiresAt });
  }

  async findSession(tokenHash: string, now: Date) {
    const session = this.sessions.get(tokenHash);
    return session && session.expiresAt > now ? { ...session } : null;
  }

  async deleteSession(tokenHash: string) {
    this.sessions.delete(tokenHash);
  }

  async incrementCounter(key: string, expiresAt: Date) {
    const counter = this.counters.get(key) ?? { count: 0, expiresAt };
    counter.count += 1;
    this.counters.set(key, counter);
    return counter.count;
  }

  async appendAudit(entry: AuditEntry) {
    this.audit.push(structuredClone(entry));
  }

  async listAudit({ skip, limit }: { skip: number; limit: number }) {
    // Reversed first, so entries with the same time also come newest first (the sort keeps their order).
    const newestFirst = [...this.audit].reverse().sort((a, b) => b.at.localeCompare(a.at));
    return { entries: structuredClone(newestFirst.slice(skip, skip + limit)), total: this.audit.length };
  }

  async listProducts() {
    return structuredClone([...this.products.values()]);
  }

  async getProduct(id: string) {
    const product = this.products.get(id);
    return product ? structuredClone(product) : null;
  }

  async insertProductIfMissing(product: Product) {
    if (this.products.has(product.id)) return false;
    this.products.set(product.id, structuredClone(product));
    return true;
  }

  async saveProduct(product: Product) {
    this.products.set(product.id, structuredClone(product));
  }

  async listPrices(productId: string) {
    return structuredClone(this.prices.filter((price) => price.productId === productId));
  }

  async addPrice(price: ProductPrice) {
    this.prices.push(structuredClone(price));
  }

  async enqueueEmail(email: OutboxEmail) {
    if (this.outbox.has(email.id)) return "duplicate" as const;
    this.outbox.set(email.id, structuredClone(email));
    return "queued" as const;
  }

  async listDueEmails(now: Date, limit: number) {
    return structuredClone(
      [...this.outbox.values()]
        .filter((email) => email.status === "pending" && Date.parse(email.nextAttemptAt) <= now.getTime())
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(0, limit),
    );
  }

  async claimEmail(id: string, attempts: number, now: Date, leaseUntil: Date) {
    const email = this.outbox.get(id);
    if (!email || email.status !== "pending" || email.attempts !== attempts || Date.parse(email.nextAttemptAt) > now.getTime()) {
      return false;
    }
    email.nextAttemptAt = leaseUntil.toISOString();
    return true;
  }

  async updateEmail(id: string, changes: Partial<Omit<OutboxEmail, "id">>) {
    const email = this.outbox.get(id);
    if (email) this.outbox.set(id, { ...email, ...structuredClone(changes) });
  }

  async getTaxSettings() {
    const newest = this.taxVersions.at(-1);
    return newest ? structuredClone(newest) : null;
  }

  async insertTaxSettings(settings: TaxSettings) {
    if (this.taxVersions.some((existing) => existing.version === settings.version)) return false;
    this.taxVersions.push(structuredClone(settings));
    this.taxVersions.sort((a, b) => a.version - b.version);
    return true;
  }

  async insertOrder(order: Order) {
    this.orders.set(order.id, structuredClone(order));
  }

  async getOrder(id: string) {
    const order = this.orders.get(id);
    return order ? structuredClone(order) : null;
  }

  async findOrderByPaymentIntent(paymentIntentId: string) {
    const order = [...this.orders.values()].find((candidate) => candidate.stripe.paymentIntentId === paymentIntentId);
    return order ? structuredClone(order) : null;
  }

  async transitionOrder(id: string, from: OrderStatus[], changes: Partial<Omit<Order, "id">>) {
    const order = this.orders.get(id);
    if (!order || !from.includes(order.status)) return false;
    this.orders.set(id, { ...order, ...structuredClone(changes) });
    return true;
  }

  async updateOrder(id: string, changes: Partial<Omit<Order, "id">>) {
    const order = this.orders.get(id);
    if (order) this.orders.set(id, { ...order, ...structuredClone(changes) });
  }

  async listOrders({ skip, limit, status }: { skip: number; limit: number; status?: OrderStatus }) {
    const matching = [...this.orders.values()]
      .filter((order) => !status || order.status === status)
      .reverse()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { orders: structuredClone(matching.slice(skip, skip + limit)), total: matching.length };
  }

  async recordStripeEvent({ id }: { id: string; type: string; receivedAt: Date; expiresAt: Date }) {
    if (this.stripeEvents.has(id)) return "duplicate" as const;
    this.stripeEvents.set(id, { done: false });
    return "new" as const;
  }

  async isStripeEventDone(id: string) {
    return this.stripeEvents.get(id)?.done === true;
  }

  async markStripeEventDone(id: string) {
    this.stripeEvents.set(id, { done: true });
  }

  async insertGrantIfMissing(grant: TicketGrant) {
    const existing = [...this.grants.values()].find((candidate) => candidate.orderId === grant.orderId);
    if (existing) return structuredClone(existing);
    this.grants.set(grant.id, structuredClone(grant));
    return structuredClone(grant);
  }

  async getGrant(id: string) {
    const grant = this.grants.get(id);
    return grant ? structuredClone(grant) : null;
  }

  async getGrantByOrder(orderId: string) {
    const grant = [...this.grants.values()].find((candidate) => candidate.orderId === orderId);
    return grant ? structuredClone(grant) : null;
  }

  async updateGrant(id: string, changes: Partial<Omit<TicketGrant, "id">>) {
    const grant = this.grants.get(id);
    if (grant) this.grants.set(id, { ...grant, ...structuredClone(changes) });
  }

  async claimTicketSeat(grantId: string) {
    const grant = this.grants.get(grantId);
    if (!grant || grant.status !== "active" || grant.devicesUsed >= grant.seats) return false;
    grant.devicesUsed += 1;
    return true;
  }

  async saveTicketDevice({ tokenHash, grantId, walkSlug, expiresAt }: { tokenHash: string; grantId: string; walkSlug: string; createdAt: Date; expiresAt: Date }) {
    this.devices.set(tokenHash, { grantId, walkSlug, expiresAt });
  }

  async findTicketDevice(tokenHash: string, now: Date) {
    const device = this.devices.get(tokenHash);
    return device && device.expiresAt > now ? { grantId: device.grantId, walkSlug: device.walkSlug } : null;
  }

  async swapGrantGame(grantId: string, from: string | null, to: string | null) {
    const grant = this.grants.get(grantId);
    // A ticket from before P3 has no gameCode at all: the same as null.
    if (!grant || grant.status !== "active" || (grant.gameCode ?? null) !== from) return false;
    grant.gameCode = to;
    return true;
  }

  async deleteTicketDevices(grantId: string) {
    for (const [hash, device] of this.devices) if (device.grantId === grantId) this.devices.delete(hash);
  }

  async insertDiscount(discount: Discount) {
    if ([...this.discounts.values()].some((existing) => existing.code === discount.code)) return false;
    this.discounts.set(discount.id, structuredClone(discount));
    return true;
  }

  async getDiscount(id: string) {
    const discount = this.discounts.get(id);
    return discount ? structuredClone(discount) : null;
  }

  async getDiscountByCode(code: string) {
    const discount = [...this.discounts.values()].find((candidate) => candidate.code === code);
    return discount ? structuredClone(discount) : null;
  }

  async listDiscounts() {
    return structuredClone([...this.discounts.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  async updateDiscount(id: string, changes: Partial<Omit<Discount, "id" | "code" | "redemptions">>) {
    const discount = this.discounts.get(id);
    if (discount) this.discounts.set(id, { ...discount, ...structuredClone(changes) });
  }

  async reserveDiscount(id: string) {
    const discount = this.discounts.get(id);
    if (!discount || !discount.active) return false;
    if (discount.maxRedemptions !== null && discount.redemptions >= discount.maxRedemptions) return false;
    discount.redemptions += 1;
    return true;
  }

  async releaseDiscount(id: string) {
    const discount = this.discounts.get(id);
    if (discount && discount.redemptions > 0) discount.redemptions -= 1;
  }

  async nextNumber(series: string) {
    const next = (this.numbers.get(series) ?? 0) + 1;
    this.numbers.set(series, next);
    return next;
  }

  async insertDocumentIfMissing(document: BillingDocument) {
    const existing = this.documents.get(document.id);
    if (existing) return structuredClone(existing);
    this.documents.set(document.id, structuredClone(document));
    return structuredClone(document);
  }

  async getDocument(id: string) {
    const document = this.documents.get(id);
    return document ? structuredClone(document) : null;
  }

  async listDocumentsForOrder(orderId: string) {
    return structuredClone([...this.documents.values()].filter((document) => document.orderId === orderId));
  }

  async insertQuote(quote: QuoteRequest, dedupeKey: string) {
    this.quotes.set(quote.id, { quote: structuredClone(quote), dedupeKey });
  }

  async findQuoteByDedupeKey(dedupeKey: string, since: Date) {
    const found = [...this.quotes.values()].find(
      (entry) => entry.dedupeKey === dedupeKey && Date.parse(entry.quote.createdAt) > since.getTime(),
    );
    return found ? structuredClone(found.quote) : null;
  }

  async getQuote(id: string) {
    const entry = this.quotes.get(id);
    return entry ? structuredClone(entry.quote) : null;
  }

  async listQuotes({ skip, limit, status }: { skip: number; limit: number; status?: QuoteStatus }) {
    const matching = [...this.quotes.values()]
      .map((entry) => entry.quote)
      .filter((quote) => !status || quote.status === status)
      .reverse()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { quotes: structuredClone(matching.slice(skip, skip + limit)), total: matching.length };
  }

  async transitionQuote(id: string, from: QuoteStatus, entry: QuoteRequest["history"][number]) {
    const stored = this.quotes.get(id);
    if (!stored || stored.quote.status !== from) return false;
    stored.quote = { ...stored.quote, status: entry.status, updatedAt: entry.at, history: [...stored.quote.history, structuredClone(entry)] };
    return true;
  }

  async getCorporatePricing() {
    return this.corporatePricing ? structuredClone(this.corporatePricing) : null;
  }

  async saveCorporatePricing(pricing: CorporatePricing) {
    this.corporatePricing = structuredClone(pricing);
  }
}
