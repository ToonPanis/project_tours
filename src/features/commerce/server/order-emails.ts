import { isLocale, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { BillingDocument, Order, TicketGrant } from "@/types/commerce";
import type { CommerceContext } from "./context";
import { queueEmail } from "./email-service";
import { renderEmail, type EmailContent } from "./email-templates";
import type { EmailMessage } from "./mailer";

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

/**
 * Payment confirmation + access to the walk (brief 7.1, templates 1 and 2: one
 * email, the ticket link IS the access) + for groups how to invite the others
 * (template 3). HTML and text from the same content (email-templates.ts).
 */
export function confirmationEmail(order: Order, grant: TicketGrant, document: BillingDocument, link: string): Pick<EmailMessage, "subject" | "text" | "html"> {
  const locale = localeOf(order);
  const t = createTranslator(locale);
  const line = order.lines[0];
  const tax = order.tax;
  const summary = [
    t("commerce.email.confirmation.line", { product: line.productName, persons: t.plural("commerce.persons", line.quantity) }),
    t("commerce.email.confirmation.total", { amount: formatEuros(order.totalCents, locale) }),
  ];
  if (tax && tax.vatCents > 0) {
    summary.push(t("commerce.email.confirmation.vat", { rate: formatRate(tax.rateBasisPoints, locale), vat: formatEuros(tax.vatCents, locale) }));
  }
  // The legal mention of an exemption is the accountant's text, shown as given.
  if (tax?.note) summary.push(tax.note);
  summary.push(
    document.kind === "receipt" && document.number
      ? t("commerce.email.confirmation.receipt", { number: document.number })
      : t("commerce.email.confirmation.invoice"),
  );
  const content: EmailContent = {
    subject: t("commerce.email.confirmation.subject", { product: line.productName }),
    greeting: t("commerce.email.confirmation.greeting"),
    paragraphs: [
      t("commerce.email.confirmation.thanks"),
      summary.join("\n"),
      t("commerce.email.confirmation.linkIntro", { seats: t.plural("commerce.persons", grant.seats) }),
    ],
    button: { label: t("commerce.email.confirmation.button"), url: link },
    after: [
      ...(grant.seats > 1 ? [t("commerce.email.confirmation.group")] : []),
      t("commerce.email.confirmation.validUntil", { date: formatDay(grant.validUntil, locale) }),
    ],
    signoff: [t("commerce.email.confirmation.signoff"), "Hidden Antwerp"],
  };
  return renderEmail(content);
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
  await queueEmail(ctx, `order-paid:${order.id}${idSuffix}`, { to: order.email, ...confirmationEmail(order, grant, document, link) });
}

export async function queueRefundEmail(ctx: CommerceContext, order: Order, amountCents: number, refundedTotalCents: number, ticketRevoked: boolean) {
  if (!order.email) return;
  const locale = localeOf(order);
  const t = createTranslator(locale);
  const body = [t("commerce.email.refund.body", { amount: formatEuros(amountCents, locale), product: order.lines[0].productName })];
  if (ticketRevoked) body.push(t("commerce.email.refund.ticketRevoked"));
  await queueEmail(ctx, `order-refunded:${order.id}:${refundedTotalCents}`, {
    to: order.email,
    ...renderEmail({
      subject: t("commerce.email.refund.subject"),
      greeting: t("commerce.email.confirmation.greeting"),
      paragraphs: [body.join("\n"), t("commerce.email.refund.bankTime")],
      signoff: ["Hidden Antwerp"],
    }),
  });
}

/**
 * Template 4 (brief 7.1): "your invoice is ready". Used once the invoicing
 * provider (Billit, P6) has made a business invoice; until then business
 * invoices wait in /admin/documents. Built and tested now so P6 only connects it.
 */
export function invoiceReadyEmail(order: Order, invoiceNumber: string, invoiceUrl: string): Pick<EmailMessage, "subject" | "text" | "html"> {
  const t = createTranslator(localeOf(order));
  return renderEmail({
    subject: t("commerce.email.invoice.subject"),
    greeting: t("commerce.email.confirmation.greeting"),
    paragraphs: [t("commerce.email.invoice.body", { number: invoiceNumber, product: order.lines[0].productName })],
    button: { label: t("commerce.email.invoice.button"), url: invoiceUrl },
    signoff: ["Hidden Antwerp"],
  });
}
