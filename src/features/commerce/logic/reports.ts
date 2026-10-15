import type { Order } from "@/types/commerce";
import { bucketKey, bucketsOf, type ReportRange } from "./report-dates";

/**
 * The sales figures of the admin dashboard (brief 4.1–4.2), computed from the
 * orders themselves: no separate statistics are stored, so they can't drift.
 *
 * Counting rules (also shown on the dashboard):
 * - an order counts in the period it was PAID (paidAt), in euro cents;
 * - "gross" = what was paid, VAT included; "refunds" = what was given back
 *   (counted with the order's payment date, not the refund date);
 * - "net" = gross − refunds; "excluding VAT" = net minus the VAT left after
 *   refunds (the VAT of a refunded part goes back in proportion);
 * - tickets = persons on orders that were not refunded in full.
 */

export interface MoneyTotals {
  grossCents: number;
  refundsCents: number;
  netCents: number;
  vatCents: number;
  exVatCents: number;
  orders: number;
  tickets: number;
}

export interface SalesReport {
  totals: MoneyTotals & { averageOrderCents: number | null };
  /** Net revenue (VAT included, after refunds) and tickets per bucket, every bucket of the range. */
  series: { key: string; netCents: number; tickets: number }[];
  byProduct: (MoneyTotals & { productId: string; productName: string })[];
  byLanguage: (MoneyTotals & { locale: string })[];
  customers: { total: number; new: number; returning: number };
}

const emptyTotals = (): MoneyTotals => ({ grossCents: 0, refundsCents: 0, netCents: 0, vatCents: 0, exVatCents: 0, orders: 0, tickets: 0 });

/** One order's share: gross, refunds, and the VAT that's left after refunds. */
function amountsOf(order: Order): MoneyTotals {
  const refunded = Math.min(order.refundedCents, order.totalCents);
  const net = order.totalCents - refunded;
  const vat = order.tax?.vatCents ?? 0;
  const vatLeft = order.totalCents === 0 ? 0 : Math.round((vat * net) / order.totalCents);
  return {
    grossCents: order.totalCents,
    refundsCents: refunded,
    netCents: net,
    vatCents: vatLeft,
    exVatCents: net - vatLeft,
    orders: 1,
    tickets: refunded >= order.totalCents ? 0 : order.lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

function add(into: MoneyTotals, amounts: MoneyTotals): void {
  into.grossCents += amounts.grossCents;
  into.refundsCents += amounts.refundsCents;
  into.netCents += amounts.netCents;
  into.vatCents += amounts.vatCents;
  into.exVatCents += amounts.exVatCents;
  into.orders += amounts.orders;
  into.tickets += amounts.tickets;
}

/** Orders that were paid (now "paid" or "refunded"), with their payment instant. */
function paidOrders(orders: Order[]): (Order & { paidAt: string })[] {
  return orders.filter((order): order is Order & { paidAt: string } => (order.status === "paid" || order.status === "refunded") && order.paidAt !== null);
}

/**
 * The report for a range. `orders` may contain more (e.g. everything up to the
 * range's end): only orders paid inside the range are counted, and the earlier
 * ones tell which customers are returning.
 */
export function computeSalesReport(orders: Order[], range: Pick<ReportRange, "from" | "to" | "granularity">): SalesReport {
  const paid = paidOrders(orders);
  const inRange = paid.filter((order) => {
    const at = Date.parse(order.paidAt);
    return at >= range.from.getTime() && at < range.to.getTime();
  });

  const totals = emptyTotals();
  const series = new Map(bucketsOf(range).map((key) => [key, { key, netCents: 0, tickets: 0 }]));
  const byProduct = new Map<string, MoneyTotals & { productId: string; productName: string }>();
  const byLanguage = new Map<string, MoneyTotals & { locale: string }>();

  for (const order of inRange) {
    const amounts = amountsOf(order);
    add(totals, amounts);
    const bucket = series.get(bucketKey(new Date(order.paidAt), range.granularity));
    if (bucket) {
      bucket.netCents += amounts.netCents;
      bucket.tickets += amounts.tickets;
    }
    const line = order.lines[0];
    const product = byProduct.get(line.productId) ?? { productId: line.productId, productName: line.productName, ...emptyTotals() };
    add(product, amounts);
    byProduct.set(line.productId, product);
    const language = byLanguage.get(order.locale) ?? { locale: order.locale, ...emptyTotals() };
    add(language, amounts);
    byLanguage.set(order.locale, language);
  }

  // New = their first paid order ever falls in this range; returning = they had one before.
  const firstPaid = new Map<string, number>();
  for (const order of paid) {
    if (!order.email) continue;
    const email = order.email.toLowerCase();
    const at = Date.parse(order.paidAt);
    if (!firstPaid.has(email) || at < (firstPaid.get(email) as number)) firstPaid.set(email, at);
  }
  const customersInRange = new Set(inRange.map((order) => order.email?.toLowerCase()).filter((email): email is string => Boolean(email)));
  let newCustomers = 0;
  for (const email of customersInRange) if ((firstPaid.get(email) as number) >= range.from.getTime()) newCustomers += 1;

  const byNet = <T extends MoneyTotals>(a: T, b: T) => b.netCents - a.netCents;
  return {
    totals: { ...totals, averageOrderCents: totals.orders > 0 ? Math.round(totals.grossCents / totals.orders) : null },
    series: [...series.values()],
    byProduct: [...byProduct.values()].sort(byNet),
    byLanguage: [...byLanguage.values()].sort(byNet),
    customers: { total: customersInRange.size, new: newCustomers, returning: customersInRange.size - newCustomers },
  };
}

/** One CSV line per paid order of the range (for the accountant). Quotes values that need it. */
export function ordersToCsv(orders: Order[], range: Pick<ReportRange, "from" | "to">): string {
  const header = [
    "order_id",
    "paid_at",
    "status",
    "product",
    "persons",
    "gross_eur",
    "refunded_eur",
    "vat_rate_percent",
    "vat_after_refunds_eur",
    "ex_vat_after_refunds_eur",
    "oss",
    "country",
    "customer_type",
    "business_name",
    "vat_number",
    "email",
    "discount_code",
    "language",
  ];
  const euros = (cents: number) => (cents / 100).toFixed(2);
  const cell = (value: string | number | boolean | null) => {
    const text = value === null ? "" : String(value);
    // Quoted when needed; a leading = + - @ is neutralised (spreadsheet formula injection).
    const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
    return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const rows = paidOrders(orders)
    .filter((order) => Date.parse(order.paidAt) >= range.from.getTime() && Date.parse(order.paidAt) < range.to.getTime())
    .sort((a, b) => a.paidAt.localeCompare(b.paidAt))
    .map((order) => {
      const amounts = amountsOf(order);
      return [
        order.id,
        order.paidAt,
        order.status,
        order.lines[0].productName,
        order.lines[0].quantity,
        euros(amounts.grossCents),
        euros(amounts.refundsCents),
        order.tax ? order.tax.rateBasisPoints / 100 : null,
        euros(amounts.vatCents),
        euros(amounts.exVatCents),
        order.tax?.oss ?? false,
        order.customer?.country ?? null,
        order.customer?.type ?? null,
        order.customer?.businessName ?? null,
        order.customer?.vatNumber ?? null,
        order.email,
        order.discount?.code ?? null,
        order.locale,
      ]
        .map(cell)
        .join(",");
    });
  return [header.join(","), ...rows].join("\n") + "\n";
}
