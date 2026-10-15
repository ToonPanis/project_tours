import { isLocale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { CorporatePricing, QuoteRequest, QuoteStatus } from "@/types/commerce";
import { QUOTE_DUPLICATE_WINDOW_MS, QUOTE_RETENTION_MS, RATE_LIMITS } from "../config";
import { canMoveTo, defaultCorporatePricing, parseCorporatePricing, parseQuoteInput, QUOTE_STATUSES } from "../logic/quotes";
import { hashSecret, type CommerceContext } from "./context";
import { queueEmail } from "./email-service";
import { renderEmail } from "./email-templates";
import { fail, ok, type ServiceResult } from "./result";
import { allowRequest, recordAudit, type Actor } from "./support";

/**
 * Corporate quote requests (P4, brief 5.4): the form on /corporate → checked
 * on the server → saved → a confirmation for the company and a notice for the
 * admins → handled in /admin/quotes (NEW … COMPLETED).
 */

/**
 * The answer is the same for a saved request, a recognised duplicate and a
 * bot (`received: true`): nobody can probe what happened behind it.
 */
export async function submitQuote(
  ctx: CommerceContext,
  body: unknown,
  clientKey: string,
  baseUrl: string,
): Promise<ServiceResult<{ received: true }>> {
  if (!(await allowRequest(ctx, "quote-client", clientKey, RATE_LIMITS.quotePerClient))) return fail(429, "too-many-requests");

  const now = ctx.now();
  const parsed = parseQuoteInput(body, now);
  if (!parsed.ok) return fail(400, parsed.error);
  // A bot (hidden field filled in, or sent in under 3 seconds): looks accepted, nothing is saved or sent.
  if (parsed.isSpam) return ok({ received: true });
  const input = parsed.value;

  // The same request sent twice (double click, or again the next morning): kept once.
  const dedupeKey = hashSecret([input.email, input.company.toLowerCase(), input.preferredDate ?? "", input.activity].join("|"));
  if (await ctx.store.findQuoteByDedupeKey(dedupeKey, new Date(now.getTime() - QUOTE_DUPLICATE_WINDOW_MS))) return ok({ received: true });

  const quote: QuoteRequest = {
    id: ctx.newId(),
    status: "NEW",
    ...input,
    history: [{ status: "NEW", at: now.toISOString(), by: null, note: null }],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  await ctx.store.insertQuote(quote, dedupeKey, new Date(now.getTime() + QUOTE_RETENTION_MS));
  await queueQuoteEmails(ctx, quote, baseUrl);
  return ok({ received: true });
}

async function queueQuoteEmails(ctx: CommerceContext, quote: QuoteRequest, baseUrl: string) {
  // The company: in the language chosen on the form.
  const t = createTranslator(isLocale(quote.language) ? quote.language : "en");
  await queueEmail(ctx, `quote-received:${quote.id}`, {
    to: quote.email,
    ...renderEmail({
      subject: t("corporate.email.subject"),
      greeting: t("corporate.email.greeting", { name: quote.contactName }),
      paragraphs: [
        `${t("corporate.email.body", { company: quote.company })}\n${t("corporate.email.next")}`,
        [
          t("corporate.email.summary"),
          `${t("corporate.form.participants")}: ${quote.participants}`,
          `${t("corporate.form.date")}: ${quote.preferredDate ?? t("corporate.form.flexible")}`,
          `${t("corporate.form.activity")}: ${t(`corporate.activities.${quote.activity}`)}`,
          `${t("corporate.form.formula")}: ${t(`corporate.formulas.${quote.formula}`)}`,
        ].join("\n"),
      ],
      signoff: [t("corporate.email.signoff"), "Hidden Antwerp"],
    }),
  });
  // The admins (English, like the admin area): what came in, and where to handle it.
  for (const admin of ctx.adminEmails) {
    const lines = [
      `${quote.company} asks for a quote.`,
      `Contact: ${quote.contactName}, ${quote.email}${quote.phone ? `, ${quote.phone}` : ""}`,
      `Persons: ${quote.participants} · Date: ${quote.preferredDate ?? "flexible"} · Activity: ${quote.activity} · Formula: ${quote.formula} · Language: ${quote.language}`,
    ];
    if (quote.wishes) lines.push(`Wishes: ${quote.wishes}`);
    lines.push("", `Handle it in the admin area: ${baseUrl}/admin/quotes/${quote.id}`);
    await queueEmail(ctx, `quote-admin:${quote.id}:${hashSecret(admin).slice(0, 16)}`, {
      to: admin,
      subject: `New quote request: ${quote.company} (${quote.participants} persons)`,
      text: lines.join("\n"),
    });
  }
}

/** One page of requests for /admin/quotes, newest first, optionally one status. */
export async function listQuotesPage(ctx: CommerceContext, page: number, pageSize: number, status: unknown) {
  const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
  const filter = QUOTE_STATUSES.includes(status as QuoteStatus) ? (status as QuoteStatus) : undefined;
  const { quotes, total } = await ctx.store.listQuotes({ skip: (safePage - 1) * pageSize, limit: pageSize, status: filter });
  return { quotes, total, page: safePage, pageCount: Math.max(1, Math.ceil(total / pageSize)), status: filter ?? null };
}

export async function getQuote(ctx: CommerceContext, id: string): Promise<QuoteRequest | null> {
  return id.length > 100 ? null : ctx.store.getQuote(id);
}

/** Body: { status, note? }. Only allowed steps (see logic/quotes.ts); the note is internal. */
export async function changeQuoteStatus(ctx: CommerceContext, admin: Actor, id: string, body: unknown): Promise<ServiceResult<QuoteRequest>> {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const to = input.status as QuoteStatus;
  if (!QUOTE_STATUSES.includes(to)) return fail(400, "invalid-status");
  const note = typeof input.note === "string" && input.note.trim() ? input.note.trim().slice(0, 1000) : null;

  const quote = await getQuote(ctx, id);
  if (!quote) return fail(404, "unknown-quote");
  if (!canMoveTo(quote.status, to)) return fail(409, "status-not-allowed");

  const entry = { status: to, at: ctx.now().toISOString(), by: admin.email, note };
  // Another admin changed it at the same moment: refused, nothing is overwritten.
  if (!(await ctx.store.transitionQuote(id, quote.status, entry))) return fail(409, "changed-meanwhile");
  await recordAudit(ctx, admin, "quote-status-changed", `quote:${id}`, { status: `${quote.status} → ${to}` });
  // P8 (brief 7.1, "bevestiging van zakelijke boeking"): the company hears it's confirmed, in its language, once.
  if (to === "ACCEPTED") await queueBookingConfirmation(ctx, quote);
  return ok({ ...quote, status: to, updatedAt: entry.at, history: [...quote.history, entry] });
}

// ─── The indicative price table on /corporate ───────────────────────────────

export async function getCorporatePricing(ctx: CommerceContext): Promise<CorporatePricing> {
  return (await ctx.store.getCorporatePricing()) ?? defaultCorporatePricing();
}

export async function updateCorporatePricing(ctx: CommerceContext, admin: Actor, body: unknown): Promise<ServiceResult<CorporatePricing>> {
  const parsed = parseCorporatePricing(body);
  if (!parsed.ok) return fail(400, parsed.error);
  const pricing: CorporatePricing = { ...parsed.value, updatedAt: ctx.now().toISOString(), updatedBy: admin.email };
  await ctx.store.saveCorporatePricing(pricing);
  await recordAudit(ctx, admin, "corporate-pricing-updated", "corporate-pricing", {
    tiers: pricing.tiers.map((tier) => `${tier.persons}: ${tier.selfGuidedCents ?? "–"}/${tier.guidedFrom ? "from " : ""}${tier.guidedCents ?? "–"}`).join("; "),
    pricesIncludeVat: pricing.pricesIncludeVat,
  });
  return ok(pricing);
}

async function queueBookingConfirmation(ctx: CommerceContext, quote: QuoteRequest): Promise<void> {
  const t = createTranslator(isLocale(quote.language) ? quote.language : "en");
  await queueEmail(ctx, `quote-accepted:${quote.id}`, {
    to: quote.email,
    ...renderEmail({
      subject: t("corporate.email.accepted.subject"),
      greeting: t("corporate.email.greeting", { name: quote.contactName }),
      paragraphs: [
        t("corporate.email.accepted.body", { company: quote.company }),
        [
          `${t("corporate.form.participants")}: ${quote.participants}`,
          `${t("corporate.form.date")}: ${quote.preferredDate ?? t("corporate.form.flexible")}`,
          `${t("corporate.form.activity")}: ${t(`corporate.activities.${quote.activity}`)}`,
        ].join("\n"),
        t("corporate.email.accepted.next"),
      ],
      signoff: [t("corporate.email.signoff"), "Hidden Antwerp"],
    }),
  });
}
