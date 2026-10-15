import type { AuditEntry, CommerceUser, OutboxEmail, Product, ProductPrice } from "@/types/commerce";
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
}
