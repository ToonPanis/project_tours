/**
 * Small charts for the admin dashboard, as plain SVG/HTML from the server (no
 * chart library). Rules from the data-visualisation guide:
 * - one series per chart, so no legend: the heading says what is plotted;
 * - one colour, validated for this dark surface (#b8862b: lightness band,
 *   chroma and ≥ 3:1 contrast on the admin's ink background);
 * - thin bars (≤ 24 px) with a 4 px rounded end, square at the baseline, a 2 px
 *   gap between neighbours; recessive hairline grid; text in text colours;
 * - every bar has a tooltip (hover/focus) and the numbers are in a table too.
 */

const SERIES_COLOR = "#b8862b";
const GRID_COLOR = "rgba(243, 234, 216, 0.15)";
/** Axis text: the muted text colour (parchment at 70 %), set as a real SVG fill. */
const AXIS_TEXT_COLOR = "rgba(243, 234, 216, 0.7)";
const AXIS_FONT_SIZE = 13;

export interface ChartPoint {
  key: string;
  /** Short label under the bar (shown for some bars only when there are many). */
  label: string;
  value: number;
  /** The value as text (e.g. "€ 1.234,00"), for tooltips and the table. */
  display: string;
}

/** A "nice" axis maximum: 1, 2 or 5 × a power of ten, at least the largest value. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 5, 10]) if (step * power >= value) return step * power;
  return 10 * power;
}

/** A bar path: square at the baseline, 4 px rounded at the data end (top). */
function columnPath(x: number, y: number, width: number, height: number): string {
  const radius = Math.min(4, width / 2, height);
  if (height <= 0) return "";
  return [
    `M${x},${y + height}`,
    `V${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `H${x + width - radius}`,
    `Q${x + width},${y} ${x + width},${y + radius}`,
    `V${y + height}`,
    "Z",
  ].join(" ");
}

/** Values over time (revenue per day/week/month). */
export function ColumnChart({
  title,
  points,
  formatAxis,
}: {
  title: string;
  points: ChartPoint[];
  /** Compact axis labels, e.g. "€1K". */
  formatAxis: (value: number) => string;
}) {
  // A narrow coordinate system: on a 390 px phone the text keeps about its real size
  // (a wide viewBox shrinks everything, labels included, when scaled down).
  const width = 420;
  const height = 220;
  const margin = { top: 12, right: 6, bottom: 30, left: 52 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const max = niceMax(Math.max(0, ...points.map((point) => point.value)));
  const slot = plotWidth / Math.max(1, points.length);
  // ≤ 24 px, and always a 2 px gap to the neighbour.
  const barWidth = Math.max(1, Math.min(24, slot - 2));
  // About five labels under the bars, so they never touch at this width.
  const labelEvery = Math.max(1, Math.ceil(points.length / 5));
  const ticks = [0, max / 2, max];

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="font-display text-xl font-semibold text-parchment">{title}</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={title}>
        {ticks.map((tick) => {
          const y = margin.top + plotHeight - (tick / max) * plotHeight;
          return (
            <g key={tick}>
              <line x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke={GRID_COLOR} strokeWidth={1} />
              <text x={margin.left - 6} y={y + 4} textAnchor="end" fill={AXIS_TEXT_COLOR} fontSize={AXIS_FONT_SIZE}>
                {formatAxis(tick)}
              </text>
            </g>
          );
        })}
        {points.map((point, index) => {
          const barHeight = (point.value / max) * plotHeight;
          const x = margin.left + index * slot + (slot - barWidth) / 2;
          const y = margin.top + plotHeight - barHeight;
          return (
            <g key={point.key}>
              {/* The hover/focus target is the whole slot, bigger than the bar. */}
              <rect x={margin.left + index * slot} y={margin.top} width={slot} height={plotHeight} fill="transparent" tabIndex={0} aria-label={`${point.label}: ${point.display}`}>
                <title>{`${point.label}: ${point.display}`}</title>
              </rect>
              {barHeight > 0 && <path d={columnPath(x, y, barWidth, barHeight)} fill={SERIES_COLOR} pointerEvents="none" />}
              {index % labelEvery === 0 && (
                <text x={margin.left + index * slot + slot / 2} y={height - 9} textAnchor="middle" fill={AXIS_TEXT_COLOR} fontSize={AXIS_FONT_SIZE}>
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <DataTable points={points} />
    </figure>
  );
}

/** Values per category (revenue per product or language), largest first. */
export function BarList({ title, points }: { title: string; points: ChartPoint[] }) {
  const max = Math.max(0, ...points.map((point) => point.value));
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="font-display text-xl font-semibold text-parchment">{title}</figcaption>
      {points.length === 0 ? (
        <p className="text-sm text-parchment/70">No sales in this period.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {points.map((point) => (
            <li key={point.key} className="grid grid-cols-[minmax(6rem,10rem)_1fr_auto] items-center gap-3 text-sm" title={`${point.label}: ${point.display}`}>
              <span className="truncate text-parchment">{point.label}</span>
              <span className="h-4" aria-hidden="true">
                {/* Rounded at the data end only; the label carries the value (text in text colour). */}
                <span
                  className="block h-full rounded-r-[4px]"
                  style={{ width: `${max > 0 ? Math.max(1, (point.value / max) * 100) : 0}%`, backgroundColor: SERIES_COLOR }}
                />
              </span>
              <span className="tabular-nums text-parchment/85">{point.display}</span>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}

/** The same numbers as a table (screen readers, exact values, printing). */
function DataTable({ points }: { points: ChartPoint[] }) {
  return (
    <details className="text-sm text-parchment/80">
      <summary className="min-h-11 cursor-pointer content-center">Show as a table</summary>
      <table className="mt-2 w-full border-collapse">
        <tbody>
          {points.map((point) => (
            <tr key={point.key} className="border-b border-parchment/10">
              <th scope="row" className="py-1 pr-4 text-left font-normal">
                {point.label}
              </th>
              <td className="py-1 text-right tabular-nums">{point.display}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

export function StatTile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-sm border border-parchment/15 bg-ink/30 p-4">
      <span className="text-sm text-parchment/70">{label}</span>
      <span className="text-2xl font-semibold tabular-nums text-parchment">{value}</span>
      {note && <span className="text-xs text-parchment/60">{note}</span>}
    </div>
  );
}
