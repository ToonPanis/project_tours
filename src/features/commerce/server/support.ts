import type { AuditAction, AuditEntry } from "@/types/commerce";
import { isWithinLimit, rateLimitKey, windowStart, type RateLimitRule } from "../logic/rate-limit";
import type { CommerceContext } from "./context";

/** Who did something: a signed-in admin, or null for the system itself. */
export interface Actor {
  id: string;
  email: string;
}

/** Writes one line to the audit log. `details` must never contain secrets or customers' data. */
export async function recordAudit(
  ctx: CommerceContext,
  actor: Actor | null,
  action: AuditAction,
  target: string,
  details: AuditEntry["details"] = {},
): Promise<void> {
  await ctx.store.appendAudit({
    id: ctx.newId(),
    actorId: actor?.id ?? null,
    actorEmail: actor?.email ?? null,
    action,
    target,
    details,
    at: ctx.now().toISOString(),
  });
}

/**
 * Counts this request against a rate limit and says whether it may go on.
 * `subjectHash` must already be hashed: no raw email or IP address is stored.
 */
export async function allowRequest(ctx: CommerceContext, scope: string, subjectHash: string, rule: RateLimitRule): Promise<boolean> {
  const start = windowStart(ctx.now(), rule.windowMs);
  const count = await ctx.store.incrementCounter(rateLimitKey(scope, subjectHash, start), new Date(start.getTime() + rule.windowMs));
  return isWithinLimit(count, rule);
}
