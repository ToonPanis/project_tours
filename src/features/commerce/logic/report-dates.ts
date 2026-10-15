/**
 * Dates for the sales reports, in Antwerp's own time (Europe/Brussels): "today"
 * and "this month" start at local midnight, also around the switch to and from
 * summer time. Everything is computed with Intl (no date library).
 */

export const REPORT_TIME_ZONE = "Europe/Brussels";
const DAY_MS = 24 * 60 * 60 * 1000;

export type Granularity = "day" | "week" | "month";
export type RangePreset = "today" | "last7" | "last30" | "thisMonth" | "lastMonth" | "thisYear" | "custom";

/** A local calendar day. */
export interface LocalDay {
  year: number;
  month: number; // 1–12
  day: number;
}

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: REPORT_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function localParts(instant: Date) {
  const parts = Object.fromEntries(partsFormatter.formatToParts(instant).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

/** How far Brussels is ahead of UTC at that instant, in ms (1 h in winter, 2 h in summer). */
function offsetAt(instant: Date): number {
  const local = localParts(instant);
  const asIfUtc = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
  return asIfUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** The local calendar day an instant falls on. */
export function localDayOf(instant: Date): LocalDay {
  const { year, month, day } = localParts(instant);
  return { year, month, day };
}

/** The instant local midnight starts that day (months and days may overflow: day 32 = next month). */
export function startOfLocalDay(year: number, month: number, day: number): Date {
  const guess = Date.UTC(year, month - 1, day);
  const first = guess - offsetAt(new Date(guess));
  // Once more at the result: on the day the clocks change the first guess can be an hour off.
  return new Date(guess - offsetAt(new Date(first)));
}

/** "2026-10-16" for that local day. */
export function dayKey(day: LocalDay): string {
  return `${day.year}-${String(day.month).padStart(2, "0")}-${String(day.day).padStart(2, "0")}`;
}

/** Parses "2026-10-16" (from a date field), or null. */
export function parseDayKey(value: unknown): LocalDay | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return { year, month, day };
}

export interface ReportRange {
  preset: RangePreset;
  /** Inclusive start (local midnight). */
  from: Date;
  /** Exclusive end (local midnight after the last day). */
  to: Date;
  /** The first and last local day, for the date fields and the CSV file name. */
  firstDay: string;
  lastDay: string;
  granularity: Granularity;
}

/** Days, weeks or months: about 7–60 bars, whatever the range. */
export function autoGranularity(from: Date, to: Date): Granularity {
  const days = Math.round((to.getTime() - from.getTime()) / DAY_MS);
  return days <= 62 ? "day" : days <= 200 ? "week" : "month";
}

/** At most this long a custom range (keeps the report quick and the chart readable). */
export const MAX_RANGE_DAYS = 3 * 366;

/**
 * The range from the dashboard's query (?range=last30, or ?range=custom&from=…&to=…),
 * falling back to the last 30 days. `granularity` from the query or automatic.
 */
export function resolveRange(query: { range?: unknown; from?: unknown; to?: unknown; granularity?: unknown }, now: Date): ReportRange {
  const today = localDayOf(now);
  const startOf = (day: LocalDay) => startOfLocalDay(day.year, day.month, day.day);
  const tomorrow = startOfLocalDay(today.year, today.month, today.day + 1);

  let preset: RangePreset = "last30";
  let from: Date;
  let to = tomorrow;
  switch (query.range) {
    case "today":
      preset = "today";
      from = startOf(today);
      break;
    case "last7":
      preset = "last7";
      from = startOfLocalDay(today.year, today.month, today.day - 6);
      break;
    case "thisMonth":
      preset = "thisMonth";
      from = startOfLocalDay(today.year, today.month, 1);
      break;
    case "lastMonth":
      preset = "lastMonth";
      from = startOfLocalDay(today.year, today.month - 1, 1);
      to = startOfLocalDay(today.year, today.month, 1);
      break;
    case "thisYear":
      preset = "thisYear";
      from = startOfLocalDay(today.year, 1, 1);
      break;
    case "custom": {
      const first = parseDayKey(query.from);
      const last = parseDayKey(query.to);
      if (first && last && dayKey(first) <= dayKey(last)) {
        const start = startOf(first);
        const end = startOfLocalDay(last.year, last.month, last.day + 1);
        if ((end.getTime() - start.getTime()) / DAY_MS <= MAX_RANGE_DAYS) {
          preset = "custom";
          from = start;
          to = end;
          break;
        }
      }
      from = startOfLocalDay(today.year, today.month, today.day - 29);
      break;
    }
    default:
      from = startOfLocalDay(today.year, today.month, today.day - 29);
  }

  const granularity: Granularity =
    query.granularity === "day" || query.granularity === "week" || query.granularity === "month" ? query.granularity : autoGranularity(from, to);
  return {
    preset,
    from,
    to,
    firstDay: dayKey(localDayOf(from)),
    lastDay: dayKey(localDayOf(new Date(to.getTime() - 1))),
    granularity,
  };
}

/** The bucket an instant belongs to: "2026-10-16" (day), the Monday of its week, or "2026-10" (month). */
export function bucketKey(instant: Date, granularity: Granularity): string {
  const day = localDayOf(instant);
  if (granularity === "month") return `${day.year}-${String(day.month).padStart(2, "0")}`;
  if (granularity === "day") return dayKey(day);
  // ISO weeks start on Monday.
  const weekday = (new Date(Date.UTC(day.year, day.month - 1, day.day)).getUTCDay() + 6) % 7;
  const monday = new Date(Date.UTC(day.year, day.month - 1, day.day - weekday));
  return dayKey({ year: monday.getUTCFullYear(), month: monday.getUTCMonth() + 1, day: monday.getUTCDate() });
}

/** Every bucket of the range in order, also the empty ones (a chart without gaps in time). */
export function bucketsOf(range: Pick<ReportRange, "from" | "to" | "granularity">): string[] {
  const keys: string[] = [];
  const first = localDayOf(range.from);
  for (let offset = 0; ; offset++) {
    const start = startOfLocalDay(first.year, first.month, first.day + offset);
    if (start >= range.to) break;
    const key = bucketKey(start, range.granularity);
    if (keys.at(-1) !== key) keys.push(key);
  }
  return keys;
}
