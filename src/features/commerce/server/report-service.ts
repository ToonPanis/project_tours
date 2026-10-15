import { ledgerTotals } from "../logic/partners";
import { localDayOf, resolveRange, startOfLocalDay, type ReportRange } from "../logic/report-dates";
import { computeSalesReport, ordersToCsv, type SalesReport } from "../logic/reports";
import type { CommerceContext } from "./context";
import { recordAudit, type Actor } from "./support";

/**
 * The admin dashboard (brief phase 4). Figures are computed from the orders
 * each time (no separate counters that could drift). Fine for thousands of
 * orders; beyond MAX_REPORT_ORDERS the page says the figures are incomplete
 * and the computation should move to a MongoDB aggregation.
 */
export const MAX_REPORT_ORDERS = 50_000;

export interface Dashboard {
  range: ReportRange;
  report: SalesReport;
  /** Net revenue today and this calendar month (Brussels time), whatever the chosen range. */
  todayNetCents: number;
  thisMonthNetCents: number;
  /** Quote requests still waiting for a result (NEW, CONTACTED, QUOTED). */
  openQuotes: number;
  /** Hidden Pubs games created from tickets bought in the range. */
  groupsFromTickets: number;
  /** B2B invoices and credit notes waiting for the invoicing provider (Billit not connected). */
  documentsAwaitingProvider: number;
  /** True when more orders exist than were read (figures incomplete). */
  truncated: boolean;
  /** P7: partner commission on the range's orders (ledger lines not reversed, refund adjustments included). */
  commissionsCents: number;
  /** P7: commission per partner in the range, by partner id. */
  commissionsByPartner: Record<string, number>;
}

export async function buildDashboard(
  ctx: CommerceContext,
  query: { range?: unknown; from?: unknown; to?: unknown; granularity?: unknown },
): Promise<Dashboard> {
  const now = ctx.now();
  const range = resolveRange(query, now);
  const today = localDayOf(now);
  const startOfToday = startOfLocalDay(today.year, today.month, today.day);
  const tomorrow = startOfLocalDay(today.year, today.month, today.day + 1);
  const startOfMonth = startOfLocalDay(today.year, today.month, 1);

  // Everything paid up to the later of the range's end and tonight (also for the "today" tiles).
  const until = range.to > tomorrow ? range.to : tomorrow;
  const [orders, openQuotes, grants, awaiting, commissions] = await Promise.all([
    ctx.store.listPaidOrdersUntil(until, MAX_REPORT_ORDERS),
    ctx.store.countQuotes(["NEW", "CONTACTED", "QUOTED"]),
    ctx.store.listGrantsWithGame({ skip: 0, limit: 5000 }),
    ctx.store.listDocuments({ skip: 0, limit: 1, status: "awaiting-provider" }),
    ctx.store.listCommissions({ orderPaidFrom: range.from, orderPaidTo: range.to, skip: 0, limit: MAX_REPORT_ORDERS }),
  ]);
  const commissionsByPartner: Record<string, number> = {};
  for (const entry of commissions.entries) {
    if (entry.status === "reversed") continue;
    commissionsByPartner[entry.partnerId] = (commissionsByPartner[entry.partnerId] ?? 0) + entry.amountCents;
  }

  const day = (from: Date, to: Date) => computeSalesReport(orders, { from, to, granularity: "day" }).totals.netCents;
  return {
    range,
    report: computeSalesReport(orders, range),
    todayNetCents: day(startOfToday, tomorrow),
    thisMonthNetCents: day(startOfMonth, tomorrow),
    openQuotes,
    groupsFromTickets: grants.grants.filter((grant) => {
      const at = Date.parse(grant.createdAt);
      return at >= range.from.getTime() && at < range.to.getTime();
    }).length,
    documentsAwaitingProvider: awaiting.total,
    truncated: orders.length >= MAX_REPORT_ORDERS,
    commissionsCents: ledgerTotals(commissions.entries).earnedCents,
    commissionsByPartner,
  };
}

/** The CSV of the range's paid orders (contains customers' data: admins only, and audited). */
export async function exportOrdersCsv(
  ctx: CommerceContext,
  admin: Actor,
  query: { range?: unknown; from?: unknown; to?: unknown },
): Promise<{ fileName: string; csv: string }> {
  const range = resolveRange(query, ctx.now());
  const orders = await ctx.store.listPaidOrdersUntil(range.to, MAX_REPORT_ORDERS);
  await recordAudit(ctx, admin, "report-exported", "orders-csv", { from: range.firstDay, to: range.lastDay });
  return { fileName: `hidden-antwerp-orders-${range.firstDay}-${range.lastDay}.csv`, csv: ordersToCsv(orders, range) };
}

/** One page of documents for /admin/documents (all, or those waiting for the invoicing provider). */
export async function listDocumentsPage(ctx: CommerceContext, page: number, pageSize: number, status: unknown) {
  const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
  const filter = status === "awaiting-provider" || status === "issued" ? status : undefined;
  const { documents, total } = await ctx.store.listDocuments({ skip: (safePage - 1) * pageSize, limit: pageSize, status: filter });
  return { documents, total, page: safePage, pageCount: Math.max(1, Math.ceil(total / pageSize)), status: filter ?? null };
}

/** One page of Hidden Pubs groups (tickets used for a game) for /admin/groups. */
export async function listGroupsPage(ctx: CommerceContext, page: number, pageSize: number) {
  const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
  const { grants, total } = await ctx.store.listGrantsWithGame({ skip: (safePage - 1) * pageSize, limit: pageSize });
  return { grants, total, page: safePage, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}
