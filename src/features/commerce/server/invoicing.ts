import type { Order } from "@/types/commerce";

/**
 * Invoicing for business buyers (decision B7): a Belgian provider with Peppol
 * (Billit is the intended one) makes the legal B2B invoices and credit notes.
 * Behind this interface, so another provider or the accountant can take over.
 *
 * Consumers get our own numbered receipt instead (document-service.ts): that
 * is a payment receipt, NOT a Peppol e-invoice, and is never presented as one.
 */
export interface InvoiceProvider {
  readonly name: "billit";
  /** False until the account and the business details exist: requests then wait in the admin area. */
  readonly configured: boolean;
  requestInvoice(order: Order): Promise<InvoiceRequestResult>;
  requestCreditNote(order: Order, amountCents: number): Promise<InvoiceRequestResult>;
}

export type InvoiceRequestResult = { status: "issued"; externalId: string } | { status: "awaiting-provider" };

/**
 * The Billit connection, switched off on purpose: no account yet (B7: "activate
 * only once the business details and the account exist"). Every request waits
 * as "awaiting-provider" and shows up in /admin/orders, so nothing is lost and
 * the invoices can be made by hand (or sent once the integration is built).
 * Nothing here talks to Billit or pretends to send a Peppol document.
 */
export class PendingBillitProvider implements InvoiceProvider {
  readonly name = "billit";
  readonly configured = false;

  async requestInvoice(): Promise<InvoiceRequestResult> {
    return { status: "awaiting-provider" };
  }

  async requestCreditNote(): Promise<InvoiceRequestResult> {
    return { status: "awaiting-provider" };
  }
}
