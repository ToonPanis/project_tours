import { EMAIL_MAX_ATTEMPTS, EMAIL_OUTBOX_RETENTION_MS, EMAIL_RETRY_DELAYS_MS } from "../config";
import type { CommerceContext } from "./context";
import { MailerError, type EmailMessage } from "./mailer";

/**
 * The email outbox. Every email is first saved with an id that says what it is
 * for (e.g. "login:<link hash>"), then sent. This gives:
 * - idempotency: queueing the same id twice sends one email (a retried request,
 *   or later a duplicate Stripe webhook, can't send a confirmation twice);
 * - retries: an email the provider refused stays pending and is tried again
 *   later with growing pauses, then marked failed;
 * - privacy: once sent (or given up) the text is removed from the database.
 */

export async function queueEmail(ctx: CommerceContext, id: string, message: EmailMessage): Promise<"queued" | "duplicate"> {
  const now = ctx.now();
  return ctx.store.enqueueEmail(
    {
      id,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html ?? null,
      unsubscribeUrl: message.unsubscribeUrl ?? null,
      status: "pending",
      attempts: 0,
      nextAttemptAt: now.toISOString(),
      lastError: null,
      createdAt: now.toISOString(),
      sentAt: null,
    },
    new Date(now.getTime() + EMAIL_OUTBOX_RETENTION_MS),
  );
}

/** While one sender is busy with an email, others leave it alone this long (then it's due again, e.g. after a crash). */
const SEND_LEASE_MS = 2 * 60 * 1000;

export interface DeliveryReport {
  sent: number;
  retrying: number;
  failed: number;
}

/**
 * Sends the emails that are due. Called right after queueing (after the
 * response has gone out), and by the outbox cron job as a safety net.
 */
export async function deliverDueEmails(ctx: CommerceContext, limit = 20): Promise<DeliveryReport> {
  const report: DeliveryReport = { sent: 0, retrying: 0, failed: 0 };
  for (const email of await ctx.store.listDueEmails(ctx.now(), limit)) {
    if (email.text === null) continue;
    // Another sender got it first: skip it.
    const leaseUntil = new Date(ctx.now().getTime() + SEND_LEASE_MS);
    if (!(await ctx.store.claimEmail(email.id, email.attempts, ctx.now(), leaseUntil))) continue;
    const attempts = email.attempts + 1;
    try {
      await ctx.mailer.send({ to: email.to, subject: email.subject, text: email.text, html: email.html ?? null, unsubscribeUrl: email.unsubscribeUrl ?? null });
      await ctx.store.updateEmail(email.id, { status: "sent", attempts, sentAt: ctx.now().toISOString(), text: null, html: null, lastError: null });
      report.sent += 1;
    } catch (error) {
      const code = error instanceof MailerError ? error.code : "unexpected";
      if (attempts >= EMAIL_MAX_ATTEMPTS) {
        await ctx.store.updateEmail(email.id, { status: "failed", attempts, lastError: code, text: null, html: null });
        report.failed += 1;
      } else {
        const delay = EMAIL_RETRY_DELAYS_MS[attempts - 1];
        const nextAttemptAt = new Date(ctx.now().getTime() + delay).toISOString();
        await ctx.store.updateEmail(email.id, { attempts, lastError: code, nextAttemptAt });
        report.retrying += 1;
      }
    }
  }
  return report;
}
