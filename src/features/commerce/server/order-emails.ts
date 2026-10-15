import { isLocale, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { BillingDocument, Order, TicketGrant } from "@/types/commerce";
import type { CommerceContext } from "./context";
import { queueEmail } from "./email-service";

/**
 * The buyer's emails, in the buyer's language (the language of the site when
 * they ordered). Queued in the outbox with an id per order, so a repeated
 * webhook never sends a second confirmation.
 */

function formatEuros(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(`${locale}-BE`, { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatRate(basisPoints: number, locale: Locale): string {
  return new Intl.NumberFormat(`${locale}-BE`, { style: "percent", maximumFractionDigits: 2 }).format(basisPoints / 10_000);
}

function formatDay(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(`${locale}-BE`, { dateStyle: "long", timeZone: "Europe/Brussels" }).format(new Date(iso));
}

const localeOf = (order: Order): Locale => (isLocale(order.locale) ? order.locale : "en");

export function confirmationText(order: Order, grant: TicketGrant, document: BillingDocument, link: string): { subject: string; text: string } {
  const locale = localeOf(order);
  const t = createTranslator(locale);
  const line = order.lines[0];
  const tax = order.tax;
  const lines = [
    t("commerce.email.confirmation.greeting"),
    "",
    t("commerce.email.confirmation.thanks"),
    "",
    t("commerce.email.confirmation.line", { product: line.productName, persons: t.plural("commerce.persons", line.quantity) }),
    t("commerce.email.confirmation.total", { amount: formatEuros(order.totalCents, locale) }),
  ];
  if (tax && tax.vatCents > 0) {
    lines.push(t("commerce.email.confirmation.vat", { rate: formatRate(tax.rateBasisPoints, locale), vat: formatEuros(tax.vatCents, locale) }));
  }
  // The legal mention of an exemption is the accountant's text, shown as given.
  if (tax?.note) lines.push(tax.note);
  lines.push(
    document.kind === "receipt" && document.number
      ? t("commerce.email.confirmation.receipt", { number: document.number })
      : t("commerce.email.confirmation.invoice"),
    "",
    t("commerce.email.confirmation.linkIntro", { seats: t.plural("commerce.persons", grant.seats) }),
    link,
    "",
    t("commerce.email.confirmation.validUntil", { date: formatDay(grant.validUntil, locale) }),
    "",
    t("commerce.email.confirmation.signoff"),
    "Hidden Antwerp",
  );
  return { subject: t("commerce.email.confirmation.subject", { product: line.productName }), text: lines.join("\n") };
}

export async function queueOrderConfirmation(
  ctx: CommerceContext,
  order: Order,
  grant: TicketGrant,
  document: BillingDocument,
  link: string,
  idSuffix = "",
): Promise<void> {
  if (!order.email) return;
  await queueEmail(ctx, `order-paid:${order.id}${idSuffix}`, { to: order.email, ...confirmationText(order, grant, document, link) });
}

export async function queueRefundEmail(ctx: CommerceContext, order: Order, amountCents: number, refundedTotalCents: number, ticketRevoked: boolean) {
  if (!order.email) return;
  const locale = localeOf(order);
  const t = createTranslator(locale);
  const lines = [
    t("commerce.email.confirmation.greeting"),
    "",
    t("commerce.email.refund.body", { amount: formatEuros(amountCents, locale), product: order.lines[0].productName }),
  ];
  if (ticketRevoked) lines.push(t("commerce.email.refund.ticketRevoked"));
  lines.push(t("commerce.email.refund.bankTime"), "", "Hidden Antwerp");
  await queueEmail(ctx, `order-refunded:${order.id}:${refundedTotalCents}`, {
    to: order.email,
    subject: t("commerce.email.refund.subject"),
    text: lines.join("\n"),
  });
}
