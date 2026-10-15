import type { Translator } from "@/i18n/translate";
import type { PartnerDashboard } from "../server/partner-report-service";
import { NO_CAMPAIGN } from "../server/partner-report-service";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus:outline-none";
const labelText = "text-xs font-semibold uppercase tracking-wider text-gold";
const PRESETS = ["today", "last7", "last30", "thisMonth", "lastMonth", "thisYear", "custom"] as const;

/**
 * The portal's filters (brief 3.4: date, product, campaign): a plain GET form,
 * so it works without JavaScript and a view can be bookmarked. Server Component.
 */
export function PartnerFilters({ dashboard, t }: { dashboard: PartnerDashboard; t: Translator }) {
  const { range, filters, products, campaigns } = dashboard;
  return (
    <form method="get" className="flex flex-col gap-3 rounded-sm border border-parchment/20 p-4 text-parchment">
      <h2 className="font-display text-xl font-semibold">{t("partner.filters.title")}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("partner.filters.period")}</span>
          <select name="range" defaultValue={range.preset} className={field}>
            {PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {t(`partner.filters.${preset}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("partner.filters.per")}</span>
          <select name="granularity" defaultValue={range.granularity} className={field}>
            <option value="day">{t("partner.filters.day")}</option>
            <option value="week">{t("partner.filters.week")}</option>
            <option value="month">{t("partner.filters.month")}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("partner.filters.from")}</span>
          <input type="date" name="from" defaultValue={range.firstDay} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("partner.filters.to")}</span>
          <input type="date" name="to" defaultValue={range.lastDay} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("partner.filters.product")}</span>
          <select name="product" defaultValue={filters.product ?? ""} className={field}>
            <option value="">{t("partner.filters.allProducts")}</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelText}>{t("partner.filters.campaign")}</span>
          <select name="campaign" defaultValue={filters.campaign ?? ""} className={field}>
            <option value="">{t("partner.filters.allCampaigns")}</option>
            <option value={NO_CAMPAIGN}>{t("partner.filters.noCampaign")}</option>
            {campaigns.map((campaign) => (
              <option key={campaign} value={campaign}>
                {campaign}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className="min-h-11 self-start rounded-sm bg-gold px-4 font-semibold text-ink">
        {t("partner.filters.apply")}
      </button>
    </form>
  );
}
