import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { CommerceContext } from "@/features/commerce/server/context";
import { MemoryMailer, type Mailer } from "@/features/commerce/server/mailer";
import { MemoryCommerceStore } from "@/features/commerce/server/memory-store";

export const ADMIN_EMAIL = "owner@example.com";
export const BASE_URL = "https://hidden-antwerp.example";

/**
 * A commerce context for tests: memory store, memory mailer and a clock the
 * test moves forward itself (`advance`), so "15 minutes later" takes no time.
 */
export function testCommerceContext(options: { mailer?: Mailer; adminEmails?: string[] } = {}) {
  let now = new Date("2026-10-16T09:00:00.000Z");
  const store = new MemoryCommerceStore();
  const mailer = options.mailer ?? new MemoryMailer();
  const ctx: CommerceContext = {
    store,
    mailer,
    adminEmails: options.adminEmails ?? [ADMIN_EMAIL],
    now: () => new Date(now),
    newId: () => randomUUID(),
    newSecret: () => randomBytes(32).toString("base64url"),
  };
  return {
    ctx,
    store,
    mailer,
    advance(ms: number) {
      now = new Date(now.getTime() + ms);
    },
  };
}

/** The secret after "#" in the last sign-in email. */
export function linkSecretFrom(mailer: MemoryMailer): string {
  const text = mailer.sent.at(-1)?.text ?? "";
  const match = /\/admin\/login\/verify#([A-Za-z0-9_-]+)/.exec(text);
  if (!match) throw new Error("no sign-in link in the last email");
  return match[1];
}

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
