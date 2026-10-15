import type { CommissionEntry, CommissionStatus, Order } from "@/types/commerce";
import { PARTNER_SALES_ROWS } from "../config";
import { ledgerTotals, normalizeCampaign, type LedgerTotals } from "../logic/partners";
import { bucketKey, bucketsOf, resolveRange, type ReportRange } from "../logic/report-dates";
import { amountsOf } from "../logic/reports";
import type { CommerceContext } from "./context";

/**
 * The partner portal's figures (brief 3.4), for ONE partner: the caller passes
 * the partner id from the session (partner-access.ts), never from the request.
 *
 * - visitors = clicks on the partner link in the period (per link, so the
 *   product filter doesn't apply to them);
 * - sales = paid orders that came through the link, by payment date;
 * - revenue excl. VAT = net excl. VAT after refunds (as on the admin dashboard);
 * - commission in the period = ledger lines of those orders (not reversed);
 * - outstanding / paid = the whole ledger, whatever the period.
 * No customer data is ever shown: no names, emails or order ids.
 */

const MAX_ORDERS = 50_000;
/** The campaign filter's value for "links without a campaign". */
export const NO_CAMPAIGN = "-";

export interface PartnerSaleRow {
  key: string;
  paidAt: string;
  productName: string;
  persons: number;
  exVatCents: number;
  commissionCents: number;
  /** The status of the order's commission ("reversed" when it was refunded before payout). Null without commission. */
  status: CommissionStatus | null;
  refunded: boolean;
}

export interface PartnerDashboard {
  range: ReportRange;
  filters: { product: string | null; campaign: string | null };
  products: { id: string; name: string }[];
  campaigns: string[];
  clicks: number;
  sales: number;
  /** Sales ÷ visitors, or null without visitors. */
  conversion: number | null;
  revenueExVatCents: number;
  commissionCents: number;
  series: { key: string; revenueExVatCents: number; commissionCents: number }[];
  rows: PartnerSaleRow[];
  /** The whole ledger (all periods). */
  ledger: LedgerTotals;
  truncated: boolean;
}

export async function buildPartnerDashboard(
  ctx: CommerceContext,
  partnerId: string,
  query: { range?: unknown; from?: unknown; to?: unknown; granularity?: unknown; product?: unknown; campaign?: unknown },
): Promise<PartnerDashboard> {
  const range = resolveRange(query, ctx.now());
  const [orders, clickRows, periodLedger, allLedger] = await Promise.all([
    ctx.store.listPartnerOrders(partnerId, range.from, range.to, MAX_ORDERS),
    ctx.store.listPartnerClicks({ partnerId, fromDay: range.firstDay, toDay: range.lastDay }),
    ctx.store.listCommissions({ partnerId, orderPaidFrom: range.from, orderPaidTo: range.to, skip: 0, limit: MAX_ORDERS }),
    ctx.store.listCommissions({ partnerId, skip: 0, limit: MAX_ORDERS }),
  ]);

  // Filter options come from what exists in the period (never from other partners).
  const products = new Map<string, string>();
  for (const order of orders) products.set(order.lines[0].productId, order.lines[0].productName);
  const campaigns = new Set<string>();
  for (const row of clickRows) if (row.campaign) campaigns.add(row.campaign);
  for (const order of orders) if (order.partner?.campaign) campaigns.add(order.partner.campaign);

  const product = typeof query.product === "string" && products.has(query.product) ? query.product : null;
  const campaign = query.campaign === NO_CAMPAIGN ? NO_CAMPAIGN : normalizeCampaign(query.campaign);
  const campaignMatches = (value: string | null | undefined) =>
    campaign === null || (campaign === NO_CAMPAIGN ? !value : value === campaign);

  const selected = orders.filter((order) => (!product || order.lines[0].productId === product) && campaignMatches(order.partner?.campaign));
  const selectedIds = new Set(selected.map((order) => order.id));
  const entries = periodLedger.entries.filter((entry) => selectedIds.has(entry.orderId));
  const clicks = clickRows.filter((row) => campaignMatches(row.campaign)).reduce((sum, row) => sum + row.clicks, 0);

  const series = new Map(bucketsOf(range).map((key) => [key, { key, revenueExVatCents: 0, commissionCents: 0 }]));
  let revenueExVatCents = 0;
  for (const order of selected) {
    const exVat = amountsOf(order).exVatCents;
    revenueExVatCents += exVat;
    const bucket = series.get(bucketKey(new Date(order.paidAt as string), range.granularity));
    if (bucket) bucket.revenueExVatCents += exVat;
  }
  const live = entries.filter((entry) => entry.status !== "reversed");
  for (const entry of live) {
    const bucket = series.get(bucketKey(new Date(entry.orderPaidAt), range.granularity));
    if (bucket) bucket.commissionCents += entry.amountCents;
  }

  return {
    range,
    filters: { product, campaign },
    products: [...products].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)),
    campaigns: [...campaigns].sort(),
    clicks,
    sales: selected.length,
    conversion: clicks > 0 ? selected.length / clicks : null,
    revenueExVatCents,
    commissionCents: live.reduce((sum, entry) => sum + entry.amountCents, 0),
    series: [...series.values()],
    rows: saleRows(selected, entries),
    ledger: ledgerTotals(allLedger.entries),
    truncated: orders.length >= MAX_ORDERS,
  };
}

/** One row per sale, newest first, without anything that identifies the buyer. */
function saleRows(orders: Order[], entries: CommissionEntry[]): PartnerSaleRow[] {
  return [...orders]
    .sort((a, b) => (b.paidAt as string).localeCompare(a.paidAt as string))
    .slice(0, PARTNER_SALES_ROWS)
    .map((order, index) => {
      const own = entries.filter((entry) => entry.orderId === order.id);
      const accrual = own.find((entry) => entry.kind === "accrual");
      const live = own.filter((entry) => entry.status !== "reversed");
      const amounts = amountsOf(order);
      return {
        key: `${order.paidAt}-${index}`,
        paidAt: order.paidAt as string,
        productName: order.lines[0].productName,
        persons: order.lines.reduce((sum, line) => sum + line.quantity, 0),
        exVatCents: amounts.exVatCents,
        commissionCents: live.reduce((sum, entry) => sum + entry.amountCents, 0),
        status: accrual?.status ?? null,
        refunded: amounts.refundsCents > 0,
      };
    });
}
