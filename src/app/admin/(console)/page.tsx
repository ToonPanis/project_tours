import Link from "next/link";
import { BarList, ColumnChart, StatTile } from "@/features/commerce/admin/charts";
import { DateRangeFilter } from "@/features/commerce/admin/DateRangeFilter";
import { localeNames, isLocale } from "@/i18n/config";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { configurationStatus, getCommerceContext } from "@/features/commerce/server/context";
import { buildDashboard } from "@/features/commerce/server/report-service";

const euros = (cents: number) => new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(cents / 100);
const compactEuros = (cents: number) =>
  new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 1 }).format(cents / 100);
const bucketLabel = (key: string) => (key.length === 7 ? key : key.slice(5).split("-").reverse().join("/"));

/**
 * /admin: the commercial dashboard (brief phase 4) for the chosen period, then
 * this server's configuration. All figures come from the orders (see logic/reports.ts).
 */
export default async function AdminHomePage({ searchParams }: PageProps<"/admin">) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const dashboard = await buildDashboard(getCommerceContext(), query);
  const { report, range } = dashboard;
  const { totals } = report;
  const status = configurationStatus();

  const rows: [string, string, boolean][] = [
    ["Database", status.database === "mongodb" ? "MongoDB Atlas" : "Memory (development only: lost on restart)", status.database === "mongodb"],
    ["Email", status.email === "brevo" ? "Brevo" : "Memory (development: emails appear in the terminal)", status.email === "brevo"],
    ["Admin addresses (ADMIN_EMAILS)", String(status.adminCount), status.adminCount > 0],
    ["Site address for links (APP_BASE_URL)", status.baseUrlSet ? "Set" : "Not set (required in production)", status.baseUrlSet],
    [
      "Stripe",
      status.stripe === "not-configured" ? "Not configured (STRIPE_SECRET_KEY)" : status.stripe === "live" ? "LIVE keys" : "Test mode",
      status.stripe !== "not-configured",
    ],
    ["Stripe webhook secret", status.stripeWebhookSet ? "Set" : "Not set (STRIPE_WEBHOOK_SECRET)", status.stripeWebhookSet],
    ["Ticket signing key", status.ticketKeySet ? "Set" : "Not set (TICKET_SIGNING_SECRET, required in production)", status.ticketKeySet],
    ["Ticket sales (COMMERCE_SALES_ENABLED)", status.salesEnabled ? "OPEN" : "Closed: the site works as before", true],
  ];

  return (
    <section className="flex flex-col gap-8 text-parchment">
      <div>
        <h1 className="font-display text-4xl font-semibold">Dashboard</h1>
        <p className="text-parchment/80">{`Signed in as ${admin.email} · ${range.firstDay} to ${range.lastDay} (Brussels time)`}</p>
      </div>

      <DateRangeFilter range={range} />
      {dashboard.truncated && (
        <p role="status" className="text-yellow-300">
          There are more orders than the dashboard reads at once: these figures are incomplete.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Revenue today" value={euros(dashboard.todayNetCents)} note="after refunds, VAT included" />
        <StatTile label="Revenue this month" value={euros(dashboard.thisMonthNetCents)} note="after refunds, VAT included" />
        <StatTile label="Tickets sold" value={String(totals.tickets)} note="persons, in this period" />
        <StatTile label="Average order" value={totals.averageOrderCents === null ? "–" : euros(totals.averageOrderCents)} note={`${totals.orders} orders`} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">Revenue in this period</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
          {(
            [
              ["Gross (paid, VAT included)", euros(totals.grossCents)],
              ["Refunds", euros(totals.refundsCents)],
              ["Net (after refunds, VAT included)", euros(totals.netCents)],
              ["VAT (after refunds)", euros(totals.vatCents)],
              ["Net excluding VAT", euros(totals.exVatCents)],
              ["Partner commissions", "– (partners come in phase P7)"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-parchment/70">{label}</dt>
              <dd className="tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-parchment/60">
          Orders count on the day they were paid; refunds count with their order. The VAT of a refunded part goes back in proportion.
        </p>
      </div>

      <ColumnChart
        title={`Net revenue per ${range.granularity}`}
        formatAxis={compactEuros}
        points={report.series.map((point) => ({ key: point.key, label: bucketLabel(point.key), value: point.netCents, display: `${euros(point.netCents)} · ${point.tickets} tickets` }))}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BarList
          title="Per product"
          points={report.byProduct.map((product) => ({
            key: product.productId,
            label: product.productName,
            value: product.netCents,
            display: `${euros(product.netCents)} · ${product.tickets} tickets`,
          }))}
        />
        <BarList
          title="Per language of the buyer"
          points={report.byLanguage.map((language) => ({
            key: language.locale,
            label: isLocale(language.locale) ? localeNames[language.locale].nativeName : language.locale,
            value: language.netCents,
            display: euros(language.netCents),
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Customers" value={String(report.customers.total)} note="different email addresses" />
        <StatTile label="New / returning" value={`${report.customers.new} / ${report.customers.returning}`} note="returning = bought before this period" />
        <StatTile label="Hidden Pubs groups" value={String(dashboard.groupsFromTickets)} note="games from tickets bought in this period" />
        <StatTile label="Open quote requests" value={String(dashboard.openQuotes)} note="new, contacted or quoted" />
      </div>

      {dashboard.documentsAwaitingProvider > 0 && (
        <p className="text-yellow-300">
          <Link href="/admin/documents?status=awaiting-provider" className="underline underline-offset-4">
            {`${dashboard.documentsAwaitingProvider} business invoice(s) or credit note(s) wait for the invoicing provider`}
          </Link>{" "}
          (Billit isn&apos;t connected yet: make them by hand).
        </p>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">Not measured yet</h2>
        <ul className="list-inside list-disc text-sm text-parchment/80">
          <li>Completed walks and started vs completed: walks only save progress on the phone; needs decision B9 (a privacy-safe &quot;walk completed&quot; signal).</li>
          <li>Average rating: reviews come in phase P8.</li>
          <li>Conversion from visit to purchase: the site has no analytics (by design); needs a privacy decision.</li>
          <li>Revenue per partner: partners come in phase P7.</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">This server</h2>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
          {rows.map(([label, value, good]) => (
            <div key={label} className="contents">
              <dt className="text-parchment/70">{label}</dt>
              <dd className={good ? "text-parchment" : "text-yellow-300"}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
