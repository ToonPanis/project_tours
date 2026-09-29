import type { Translator } from "@/i18n/translate";
import type { Difficulty, DurationRange } from "@/types/walk";
import {
  formatDifficulty,
  formatDistance,
  formatDurationRange,
} from "../utils/format-walk";

interface WalkStatsProps {
  estimatedDuration: DurationRange;
  distanceInMeters: number | null;
  difficulty: Difficulty;
  locationCount: number;
  t: Translator;
}

/** Key facts about a walk, as an accessible description list. */
export function WalkStats({
  estimatedDuration,
  distanceInMeters,
  difficulty,
  locationCount,
  t,
}: WalkStatsProps) {
  const stats = [
    { label: t("walks.stats.duration"), value: formatDurationRange(estimatedDuration, t) },
    { label: t("walks.stats.distance"), value: formatDistance(distanceInMeters, t) },
    { label: t("walks.stats.difficulty"), value: formatDifficulty(difficulty, t) },
    { label: t("walks.stats.stops"), value: new Intl.NumberFormat(t.locale).format(locationCount) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="text-xs uppercase tracking-wider text-sepia/80">{stat.label}</dt>
          <dd className="font-display text-lg font-semibold text-ink">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
