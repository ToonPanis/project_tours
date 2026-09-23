import type { Difficulty } from "@/types/walk";
import {
  formatDifficulty,
  formatDistance,
  formatDuration,
} from "../utils/format-walk";

interface WalkStatsProps {
  durationInMinutes: number;
  distanceInMeters: number;
  difficulty: Difficulty;
  locationCount: number;
}

/** Key facts about a walk, as an accessible description list. */
export function WalkStats({
  durationInMinutes,
  distanceInMeters,
  difficulty,
  locationCount,
}: WalkStatsProps) {
  const stats = [
    { label: "Duration", value: formatDuration(durationInMinutes) },
    { label: "Distance", value: formatDistance(distanceInMeters) },
    { label: "Difficulty", value: formatDifficulty(difficulty) },
    { label: "Stops", value: String(locationCount) },
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
