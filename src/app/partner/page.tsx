import { BarList, ColumnChart, StatTile } from "@/features/commerce/admin/charts";
import { PARTNER_ATTRIBUTION_DAYS, PARTNER_SALES_ROWS } from "@/features/commerce/config";
import { partnerLink } from "@/features/commerce/logic/partners";
import { PartnerFilters } from "@/features/commerce/partner/PartnerFilters";
import { PartnerSignOutButton } from "@/features/commerce/partner/PartnerSignOutButton";
import { getCommerceContext } from "@/features/commerce/server/context";
import { pageBaseUrl } from "@/features/commerce/server/page-base-url";
import { requirePartner } from "@/features/commerce/server/partner-access";
import { buildPartnerDashboard } from "@/features/commerce/server/partner-report-service";
import { getTranslator } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import type { CommissionRule } from "@/types/commerce";

/** "15 % of …", "€2,50 per ticket": the partner's rule in their language. */
function ruleText(rule: CommissionRule, t: Translator, money: (cents: number) => string): string {
  if (rule.kind === "percent-net") {
    return t("partner.rules.percent-net", { percent: new Intl.NumberFormat(t.locale, { maximumFractionDigits: 2 }).format(rule.basisPoints / 100) });
  }
  if (rule.kind === "none") return t("partner.rules.none");
  return t(`partner.rules.${rule.kind}`, { amount: money(rule.cents) });
}

/**
 * /partner: the partner portal (brief 3.2 and 3.4). Only the signed-in
 * partner's own figures: the partner id comes from the session (requirePartner),
 * never from the address. No buyer is ever identifiable here.
 */
export default async function PartnerPortalPage({ searchParams }: PageProps<"/partner">) {
  const actor = await requirePartner();
  const [t, query, baseUrl] = await Promise.all([getTranslator(), searchParams, pageBaseUrl()]);
  const { partner } = actor;
  const dashboard = await buildPartnerDashboard(getCommerceContext(), partner.id, query);
  const { range, ledger } = dashboard;

  const moneyFormat = new Intl.NumberFormat(`${t.locale}-BE`, { style: "currency", currency: "EUR" });
  const money = (cents: number) => moneyFormat.format(cents / 100);
  const compact = (cents: number) =>
    new Intl.NumberFormat(`${t.locale}-BE`, { style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 1 }).format(cents / 100);
  const day = (iso: string) => new Intl.DateTimeFormat(t.locale, { dateStyle: "medium", timeZone: "Europe/Brussels" }).format(new Date(iso));
  const shortDay = (key: string) => (key.length === 7 ? key : key.slice(5).split("-").reverse().join("/"));
  const percent = (value: number) => new Intl.NumberFormat(t.locale, { style: "percent", maximumFractionDigits: 1 }).format(value);
  const unit = t(`partner.chart.units.${range.granularity}`);
  const link = partnerLink(baseUrl, partner.code);

  return (
    <section className="flex flex-col gap-8 text-parchment">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-display text-4xl font-semibold">{partner.name}</h1>
          <p className="text-parchment/80">{t("partner.portal.title")}</p>
          <p className="text-sm text-parchment/70">{t("partner.portal.signedInAs", { email: actor.email })}</p>
        </div>
        <PartnerSignOutButton />
      </div>

      <div className="flex flex-col gap-3 rounded-sm border border-parchment/20 p-4">
        <h2 className="font-display text-2xl font-semibold">{t("partner.portal.linkTitle")}</h2>
        <p className="text-parchment/80">{t("partner.portal.linkIntro", { days: PARTNER_ATTRIBUTION_DAYS })}</p>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("partner.portal.linkLabel")}</span>
          <input readOnly value={link} className="min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment" />
        </label>
        <p className="text-sm text-parchment/70">{t("partner.portal.campaignHint", { example: `${link}&c=lobby` })}</p>
        <a href="/api/partner/qr" className="min-h-11 content-center text-gold underline underline-offset-4">
          {t("partner.portal.downloadQr")}
        </a>
        <p>{t("partner.portal.rule", { rule: ruleText(partner.commission, t, money) })}</p>
        <p className="text-sm text-parchment/70">{t("partner.portal.ruleNote")}</p>
      </div>

      <PartnerFilters dashboard={dashboard} t={t} />

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">{t("partner.stats.title", { from: day(range.from.toISOString()), to: day(new Date(range.to.getTime() - 1).toISOString()) })}</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatTile label={t("partner.stats.visitors")} value={String(dashboard.clicks)} note={t("partner.stats.visitorsNote")} />
          <StatTile label={t("partner.stats.sales")} value={String(dashboard.sales)} />
          <StatTile
            label={t("partner.stats.conversion")}
            value={dashboard.conversion === null ? "–" : percent(dashboard.conversion)}
            note={t("partner.stats.conversionNote")}
          />
          <StatTile label={t("partner.stats.revenue")} value={money(dashboard.revenueExVatCents)} />
          <StatTile label={t("partner.stats.commission")} value={money(dashboard.commissionCents)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile
            label={t("partner.stats.outstanding")}
            value={money(ledger.outstandingCents)}
            note={`${t("partner.stats.outstandingNote")} ${t("partner.stats.pendingNote", { amount: money(ledger.pendingCents) })}`}
          />
          <StatTile label={t("partner.stats.paid")} value={money(ledger.paidCents)} note={t("partner.stats.paidNote")} />
        </div>
      </div>

      <ColumnChart
        title={t("partner.chart.revenue", { unit })}
        points={dashboard.series.map((bucket) => ({ key: bucket.key, label: shortDay(bucket.key), value: bucket.revenueExVatCents, display: money(bucket.revenueExVatCents) }))}
        formatAxis={compact}
        tableLabel={t("partner.chart.table")}
      />
      <BarList
        title={t("partner.chart.commission", { unit })}
        emptyLabel={t("partner.chart.empty")}
        points={dashboard.series
          .filter((bucket) => bucket.commissionCents !== 0)
          .map((bucket) => ({ key: bucket.key, label: shortDay(bucket.key), value: bucket.commissionCents, display: money(bucket.commissionCents) }))}
      />

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">{t("partner.sales.title")}</h2>
        {dashboard.rows.length === 0 ? (
          <p className="text-parchment/70">{t("partner.sales.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-parchment/20 text-left text-parchment/70">
                  <th scope="col" className="py-2 pr-3 font-normal">{t("partner.sales.date")}</th>
                  <th scope="col" className="py-2 pr-3 font-normal">{t("partner.sales.product")}</th>
                  <th scope="col" className="py-2 pr-3 text-right font-normal">{t("partner.sales.persons")}</th>
                  <th scope="col" className="py-2 pr-3 text-right font-normal">{t("partner.sales.revenue")}</th>
                  <th scope="col" className="py-2 pr-3 text-right font-normal">{t("partner.sales.commission")}</th>
                  <th scope="col" className="py-2 font-normal">{t("partner.sales.status")}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.rows.map((row) => (
                  <tr key={row.key} className="border-b border-parchment/10">
                    <td className="py-1 pr-3 tabular-nums">{day(row.paidAt)}</td>
                    <td className="py-1 pr-3">{row.productName}</td>
                    <td className="py-1 pr-3 text-right tabular-nums">{row.persons}</td>
                    <td className="py-1 pr-3 text-right tabular-nums">{money(row.exVatCents)}</td>
                    <td className="py-1 pr-3 text-right tabular-nums">{money(row.commissionCents)}</td>
                    <td className="py-1">
                      {row.status ? t(`partner.status.${row.status}`) : t("partner.status.none")}
                      {row.refunded && <span className="block text-xs text-parchment/60">{t("partner.sales.refunded")}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {dashboard.rows.length >= PARTNER_SALES_ROWS && <p className="text-sm text-parchment/70">{t("partner.sales.limited", { count: PARTNER_SALES_ROWS })}</p>}
      </div>

      <div className="flex flex-col gap-2 rounded-sm border border-parchment/20 p-4">
        <h2 className="font-display text-2xl font-semibold">{t("partner.how.title")}</h2>
        <ul className="list-disc space-y-1 pl-5 text-parchment/85">
          <li>{t("partner.how.attribution", { days: PARTNER_ATTRIBUTION_DAYS })}</li>
          <li>{t("partner.how.paidOnly")}</li>
          <li>{t("partner.how.refunds")}</li>
          <li>{t("partner.how.statuses")}</li>
          <li>{t("partner.how.privacy")}</li>
        </ul>
      </div>
    </section>
  );
}
