import type { CommerceContext } from "@/features/commerce/server/context";
import { ensureStarterCatalog, updateProduct } from "@/features/commerce/server/catalog-service";
import { updateTaxSettings } from "@/features/commerce/server/tax-service";
import { STARTER_PRODUCTS } from "@/features/commerce/logic/starter-catalog";
import type { CheckoutPaidEvent } from "@/features/commerce/server/payment-gateway";
import type { TaxSettings } from "@/types/commerce";
import { ADMIN_EMAIL } from "./commerce-context";

export const ADMIN = { id: "admin-1", email: ADMIN_EMAIL };
/** A guide walk from the starter catalogue (Classics), used for the sale tests. */
export const SOLD = STARTER_PRODUCTS[0];

/** Test tax settings: VAT-registered, one category at a rate chosen for the test (not a real decision). */
export const TEST_TAX: Record<string, unknown> = {
  regime: "vat-registered",
  homeCountry: "BE",
  categories: [{ id: "experience", label: "Experiences", rateBasisPoints: 2100 }],
  ossEnabled: true,
  ossRates: [{ country: "NL", categoryId: "experience", rateBasisPoints: 2100 - 200 }],
  exemptionNote: "",
  confirmedByAccountant: true,
};

/** Puts the Classics product on sale with confirmed test tax settings. */
export async function openSales(ctx: CommerceContext, tax: Record<string, unknown> = TEST_TAX): Promise<TaxSettings> {
  await ensureStarterCatalog(ctx);
  const settings = await updateTaxSettings(ctx, ADMIN, tax);
  if (!settings.ok) throw new Error(settings.error);
  const categoryId = settings.data.categories[0]?.id ?? null;
  const updated = await updateProduct(ctx, ADMIN, SOLD.id, { taxCategoryId: categoryId, active: true });
  if (!updated.ok) throw new Error(updated.error);
  return settings.data;
}

let eventCounter = 0;

/** The webhook event Stripe sends after a successful payment of this checkout. */
export function paidEvent(
  order: { id: string; totalCents: number; sessionId: string },
  customer: Partial<CheckoutPaidEvent["customer"]> = {},
  overrides: Partial<CheckoutPaidEvent> = {},
): CheckoutPaidEvent {
  eventCounter += 1;
  return {
    id: `evt_test_${eventCounter}`,
    type: "checkout.completed",
    sessionId: order.sessionId,
    orderId: order.id,
    paymentStatus: "paid",
    amountTotal: order.totalCents,
    currency: "eur",
    paymentIntentId: `pi_test_${order.id}`,
    customer: { email: "buyer@example.com", name: "Buyer", businessName: null, country: "BE", vatNumber: null, ...customer },
    ...overrides,
  };
}

export function nextEventId(): string {
  eventCounter += 1;
  return `evt_test_${eventCounter}`;
}
