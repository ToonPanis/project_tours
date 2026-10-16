import type { ReportRange } from "../logic/report-dates";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";

/**
 * The dashboard's date filter: a plain GET form (works without JavaScript; the
 * choice is in the address, so a view can be bookmarked or shared with another admin).
 * Days are Brussels days.
 */
export function DateRangeFilter({ range }: { range: ReportRange }) {
  const exportQuery = new URLSearchParams({ range: range.preset, from: range.firstDay, to: range.lastDay }).toString();
  return (
    <form method="get" className="flex flex-wrap items-end gap-3 text-parchment">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">Period</span>
        <select name="range" defaultValue={range.preset} className={field}>
          <option value="today">Today</option>
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
          <option value="thisMonth">This month</option>
          <option value="lastMonth">Last month</option>
          <option value="thisYear">This year</option>
          <option value="custom">Custom (dates below)</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">From</span>
        <input type="date" name="from" defaultValue={range.firstDay} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">To</span>
        <input type="date" name="to" defaultValue={range.lastDay} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">Per</span>
        <select name="granularity" defaultValue={range.granularity} className={field}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </label>
      <button type="submit" className="min-h-11 rounded-sm bg-gold px-4 font-semibold text-ink">
        Apply
      </button>
      <a href={`/api/admin/reports/orders?${exportQuery}`} className="min-h-11 content-center text-sm text-gold underline underline-offset-4">
        Export orders (CSV)
      </a>
    </form>
  );
}
