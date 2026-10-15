import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextRequest } from "next/server";
import { GET as exportRoute } from "@/app/api/admin/reports/orders/route";
import { BarList, ColumnChart, niceMax } from "@/features/commerce/admin/charts";
import { autoGranularity, bucketKey, bucketsOf, dayKey, localDayOf, parseDayKey, resolveRange, startOfLocalDay } from "@/features/commerce/logic/report-dates";
import { computeSalesReport, ordersToCsv } from "@/features/commerce/logic/reports";
import { buildDashboard, exportOrdersCsv, listDocumentsPage, listGroupsPage } from "@/features/commerce/server/report-service";
import type { Order } from "@/types/commerce";
import { testCommerceContext } from "./fixtures/commerce-context";
import { ADMIN } from "./fixtures/commerce-sales";

const HOUR = 60 * 60 * 1000;

function order(overrides: Partial<Order> & { paidAt: string | null }): Order {
  return {
    id: `o-${Math.random().toString(36).slice(2, 8)}`,
    status: "paid",
    lines: [{ productId: "classics-of-antwerp", productName: "Classics", walkSlug: "classics-of-antwerp", quantity: 2, unitPriceCents: 1000, totalCents: 2000 }],
    subtotalCents: 2000,
    discount: null,
    totalCents: 2000,
    currency: "EUR",
    locale: "nl",
    buyerTokenHash: "h",
    email: "a@example.com",
    customer: { type: "consumer", name: null, businessName: null, vatNumber: null, country: "BE" },
    taxBasis: { settingsVersion: 1, regime: "vat-registered", homeCountry: "BE", categoryId: "x", homeRateBasisPoints: 2100, ossEnabled: false, ossRates: [], exemptionNote: null },
    tax: { rateBasisPoints: 2100, country: "BE", oss: false, netCents: 1653, vatCents: 347, note: null },
    stripe: { checkoutSessionId: "cs", paymentIntentId: "pi" },
    refundedCents: 0,
    createdAt: overrides.paidAt ?? "2026-10-01T10:00:00.000Z",
    updatedAt: overrides.paidAt ?? "2026-10-01T10:00:00.000Z",
    ...overrides,
  };
}

describe("Brussels dates", () => {
  test("local midnight is 22:00 UTC in summer and 23:00 UTC in winter", () => {
    expect(startOfLocalDay(2026, 7, 1).toISOString()).toBe("2026-06-30T22:00:00.000Z");
    expect(startOfLocalDay(2026, 1, 15).toISOString()).toBe("2026-01-14T23:00:00.000Z");
  });

  test("around the clock change (25 October 2026, 3:00 → 2:00): days stay whole", () => {
    const sat = startOfLocalDay(2026, 10, 24);
    const sun = startOfLocalDay(2026, 10, 25);
    const mon = startOfLocalDay(2026, 10, 26);
    expect(sun.getTime() - sat.getTime()).toBe(24 * HOUR);
    // The Sunday of the change has 25 hours.
    expect(mon.getTime() - sun.getTime()).toBe(25 * HOUR);
    expect(localDayOf(new Date("2026-10-25T22:59:00.000Z"))).toEqual({ year: 2026, month: 10, day: 25 });
    expect(localDayOf(new Date("2026-10-25T23:00:00.000Z"))).toEqual({ year: 2026, month: 10, day: 26 });
  });

  test("days and months overflow like a calendar (day 0 = last day of the previous month)", () => {
    expect(startOfLocalDay(2026, 3, 0)).toEqual(startOfLocalDay(2026, 2, 28));
    expect(startOfLocalDay(2026, 13, 1)).toEqual(startOfLocalDay(2027, 1, 1));
  });

  test("date fields: only real days", () => {
    expect(parseDayKey("2026-02-28")).toEqual({ year: 2026, month: 2, day: 28 });
    for (const bad of ["2026-02-30", "16/10/2026", "", 42, null]) expect(parseDayKey(bad)).toBeNull();
    expect(dayKey({ year: 2026, month: 3, day: 7 })).toBe("2026-03-07");
  });

  const NOW = new Date("2026-10-16T09:00:00.000Z");

  test.each([
    ["today", "2026-10-16", "2026-10-16"],
    ["last7", "2026-10-10", "2026-10-16"],
    ["last30", "2026-09-17", "2026-10-16"],
    ["thisMonth", "2026-10-01", "2026-10-16"],
    ["lastMonth", "2026-09-01", "2026-09-30"],
    ["thisYear", "2026-01-01", "2026-10-16"],
    ["nonsense", "2026-09-17", "2026-10-16"],
  ])("the range %s runs from %s to %s", (preset, first, last) => {
    const range = resolveRange({ range: preset }, NOW);
    expect([range.firstDay, range.lastDay]).toEqual([first, last]);
  });

  test("a custom range: inclusive days; invalid or too long falls back to the last 30 days", () => {
    expect(resolveRange({ range: "custom", from: "2026-08-01", to: "2026-08-31" }, NOW)).toMatchObject({ preset: "custom", firstDay: "2026-08-01", lastDay: "2026-08-31", granularity: "day" });
    expect(resolveRange({ range: "custom", from: "2026-08-31", to: "2026-08-01" }, NOW).preset).toBe("last30");
    expect(resolveRange({ range: "custom", from: "2020-01-01", to: "2026-08-01" }, NOW).preset).toBe("last30");
    expect(resolveRange({ range: "thisYear", granularity: "month" }, NOW).granularity).toBe("month");
  });

  test("granularity: days up to two months, then weeks, then months", () => {
    expect(autoGranularity(startOfLocalDay(2026, 1, 1), startOfLocalDay(2026, 2, 28))).toBe("day");
    expect(autoGranularity(startOfLocalDay(2026, 1, 1), startOfLocalDay(2026, 6, 1))).toBe("week");
    expect(autoGranularity(startOfLocalDay(2026, 1, 1), startOfLocalDay(2027, 1, 1))).toBe("month");
  });

  test("buckets: weeks start on Monday, every bucket of the range exists, also empty ones", () => {
    expect(bucketKey(new Date("2026-10-16T09:00:00.000Z"), "week")).toBe("2026-10-12");
    expect(bucketKey(new Date("2026-10-31T23:30:00.000Z"), "month")).toBe("2026-11");
    const october = { from: startOfLocalDay(2026, 10, 1), to: startOfLocalDay(2026, 11, 1) };
    expect(bucketsOf({ ...october, granularity: "day" })).toHaveLength(31);
    expect(bucketsOf({ ...october, granularity: "month" })).toEqual(["2026-10"]);
    expect(bucketsOf({ ...october, granularity: "week" })[0]).toBe("2026-09-28");
  });
});

describe("sales figures", () => {
  const range = { from: startOfLocalDay(2026, 10, 1), to: startOfLocalDay(2026, 11, 1), granularity: "day" as const };

  test("gross, refunds, net, VAT after refunds and excluding VAT always add up", () => {
    const report = computeSalesReport(
      [
        order({ paidAt: "2026-10-02T10:00:00.000Z" }),
        order({ paidAt: "2026-10-03T10:00:00.000Z", refundedCents: 1000 }),
        order({ paidAt: "2026-10-04T10:00:00.000Z", status: "refunded", refundedCents: 2000 }),
      ],
      range,
    );
    expect(report.totals).toMatchObject({ grossCents: 6000, refundsCents: 3000, netCents: 3000, orders: 3, averageOrderCents: 2000 });
    // VAT goes back in proportion: 347 + round(347 × 1000/2000) + 0.
    expect(report.totals.vatCents).toBe(347 + 174);
    expect(report.totals.exVatCents + report.totals.vatCents).toBe(report.totals.netCents);
    // A fully refunded order sells no tickets; a partly refunded one still does.
    expect(report.totals.tickets).toBe(4);
  });

  test("only orders paid inside the range count; unpaid ones never", () => {
    const report = computeSalesReport(
      [
        order({ paidAt: "2026-09-30T21:59:00.000Z" }), // 23:59 on 30 September in Brussels
        order({ paidAt: "2026-09-30T22:00:00.000Z" }), // 00:00 on 1 October in Brussels
        order({ paidAt: null, status: "pending" }),
        order({ paidAt: null, status: "canceled" }),
        order({ paidAt: "2026-10-31T23:00:00.000Z" }), // 1 November
      ],
      range,
    );
    expect(report.totals.orders).toBe(1);
    expect(report.series[0]).toEqual({ key: "2026-10-01", netCents: 2000, tickets: 2 });
    expect(report.series).toHaveLength(31);
  });

  test("per product and per language, largest first", () => {
    const report = computeSalesReport(
      [
        order({ paidAt: "2026-10-02T10:00:00.000Z" }),
        order({ paidAt: "2026-10-02T11:00:00.000Z", locale: "fr", totalCents: 5000, lines: [{ productId: "hidden-pubs", productName: "Hidden Pubs", walkSlug: "hidden-pubs", quantity: 4, unitPriceCents: 1250, totalCents: 5000 }] }),
      ],
      range,
    );
    expect(report.byProduct.map((product) => [product.productId, product.netCents, product.tickets])).toEqual([
      ["hidden-pubs", 5000, 4],
      ["classics-of-antwerp", 2000, 2],
    ]);
    expect(report.byLanguage.map((language) => language.locale)).toEqual(["fr", "nl"]);
  });

  test("new vs returning customers: returning = paid before the range (email in any case)", () => {
    const report = computeSalesReport(
      [
        order({ paidAt: "2026-08-01T10:00:00.000Z", email: "Back@Example.com" }),
        order({ paidAt: "2026-10-05T10:00:00.000Z", email: "back@example.com" }),
        order({ paidAt: "2026-10-06T10:00:00.000Z", email: "new@example.com" }),
        order({ paidAt: "2026-10-07T10:00:00.000Z", email: "new@example.com" }),
      ],
      range,
    );
    expect(report.customers).toEqual({ total: 2, new: 1, returning: 1 });
  });

  test("an empty period: zeros and no average", () => {
    expect(computeSalesReport([], range).totals).toMatchObject({ grossCents: 0, orders: 0, averageOrderCents: null });
  });

  test("CSV: one line per paid order of the range, values quoted, formulas neutralised", () => {
    const csv = ordersToCsv(
      [
        order({ paidAt: "2026-10-02T10:00:00.000Z", customer: { type: "business", name: null, businessName: '=HYPERLINK("x"), "Brewery"', vatNumber: "BE0123", country: "BE" } }),
        order({ paidAt: "2026-11-02T10:00:00.000Z" }),
        order({ paidAt: null, status: "pending" }),
      ],
      range,
    );
    const lines = csv.trim().split("\n");
    expect(lines[0].startsWith("order_id,paid_at,status,product,persons,gross_eur")).toBe(true);
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("20.00");
    expect(lines[1]).toContain(`"'=HYPERLINK(""x""), ""Brewery"""`);
  });
});

describe("charts", () => {
  test("nice axis maxima: 1, 2 or 5 times a power of ten", () => {
    expect([0, 3, 18, 230, 999, 1000, 4100].map(niceMax)).toEqual([1, 5, 20, 500, 1000, 1000, 5000]);
  });

  test("a column chart has its title, a tooltip per bar and the same numbers as a table", () => {
    const points = [
      { key: "a", label: "01/10", value: 2000, display: "€ 20,00" },
      { key: "b", label: "02/10", value: 0, display: "€ 0,00" },
    ];
    const { container } = render(<ColumnChart title="Net revenue per day" points={points} formatAxis={String} />);
    expect(screen.getByRole("img", { name: "Net revenue per day" })).toBeDefined();
    expect([...container.querySelectorAll("title")].map((title) => title.textContent)).toEqual(["01/10: € 20,00", "02/10: € 0,00"]);
    // A zero bar draws nothing (no sliver); the table still has it.
    expect(container.querySelectorAll("path")).toHaveLength(1);
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  test("a bar list shows its values as text; empty says so", () => {
    render(<BarList title="Per product" points={[{ key: "p", label: "Classics", value: 1, display: "€ 1,00" }]} />);
    expect(screen.getByText("€ 1,00")).toBeDefined();
    render(<BarList title="Per language" points={[]} />);
    expect(screen.getByText("No sales in this period.")).toBeDefined();
  });
});

describe("dashboard and export", () => {
  async function withOrders() {
    const setup = testCommerceContext();
    // "Now" in the fixture is 2026-10-16 09:00 UTC.
    for (const paidAt of ["2026-10-16T08:00:00.000Z", "2026-10-02T10:00:00.000Z", "2026-09-10T10:00:00.000Z"]) {
      await setup.store.insertOrder(order({ paidAt }));
    }
    return setup;
  }

  test("today, this month and the chosen period", async () => {
    const setup = await withOrders();
    const dashboard = await buildDashboard(setup.ctx, { range: "last30" });
    expect(dashboard.todayNetCents).toBe(2000);
    expect(dashboard.thisMonthNetCents).toBe(4000);
    // The last 30 days start on 17 September: the order of 10 September is outside.
    expect(dashboard.report.totals.orders).toBe(2);
    expect(dashboard).toMatchObject({ openQuotes: 0, groupsFromTickets: 0, documentsAwaitingProvider: 0, truncated: false });
    // "Last month" still gets the "today" tiles right.
    const lastMonth = await buildDashboard(setup.ctx, { range: "lastMonth" });
    expect(lastMonth.report.totals.orders).toBe(1);
    expect(lastMonth.todayNetCents).toBe(2000);
  });

  test("an export is recorded in the audit log", async () => {
    const setup = await withOrders();
    const { fileName, csv } = await exportOrdersCsv(setup.ctx, ADMIN, { range: "thisMonth" });
    expect(fileName).toBe("hidden-antwerp-orders-2026-10-01-2026-10-16.csv");
    expect(csv.trim().split("\n")).toHaveLength(3);
    const [entry] = (await setup.store.listAudit({ skip: 0, limit: 1 })).entries;
    expect(entry).toMatchObject({ action: "report-exported", details: { from: "2026-10-01", to: "2026-10-16" } });
  });

  test("the export route needs an admin session", async () => {
    const response = await exportRoute(new NextRequest("http://localhost:3000/api/admin/reports/orders?range=thisMonth"));
    expect(response.status).toBe(401);
  });

  test("documents and groups pages: filters and pages", async () => {
    const setup = testCommerceContext();
    await setup.store.insertDocumentIfMissing({ id: "d1", number: null, kind: "invoice", orderId: "o1", provider: "billit", status: "awaiting-provider", amountCents: 100, createdAt: "2026-10-01T10:00:00.000Z" });
    await setup.store.insertDocumentIfMissing({ id: "d2", number: "R2026-000001", kind: "receipt", orderId: "o2", provider: "internal", status: "issued", amountCents: 100, createdAt: "2026-10-02T10:00:00.000Z" });
    expect((await listDocumentsPage(setup.ctx, 1, 10, "awaiting-provider")).documents.map((document) => document.id)).toEqual(["d1"]);
    expect(await listDocumentsPage(setup.ctx, 0, 1, "nonsense")).toMatchObject({ total: 2, page: 1, pageCount: 2, status: null });
    await setup.store.insertGrantIfMissing({ id: "g1", orderId: "o3", productId: "hidden-pubs", walkSlug: "hidden-pubs", seats: 4, devicesUsed: 1, status: "active", createdAt: "2026-10-03T10:00:00.000Z", validUntil: "2027-10-03T10:00:00.000Z", gameCode: "ABCDEF" });
    await setup.store.insertGrantIfMissing({ id: "g2", orderId: "o4", productId: "hidden-pubs", walkSlug: "hidden-pubs", seats: 2, devicesUsed: 0, status: "active", createdAt: "2026-10-04T10:00:00.000Z", validUntil: "2027-10-04T10:00:00.000Z", gameCode: "pending:1:x" });
    expect((await listGroupsPage(setup.ctx, 1, 10)).grants.map((grant) => grant.gameCode)).toEqual(["ABCDEF"]);
  });
});
