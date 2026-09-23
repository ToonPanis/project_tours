import { Badge } from "@/components/ui/Badge";
import type { UpcomingWalk } from "@/types/walk";

interface UpcomingWalkCardProps {
  walk: UpcomingWalk;
}

/** A muted, non-clickable card for walks that are not playable yet. */
export function UpcomingWalkCard({ walk }: UpcomingWalkCardProps) {
  return (
    <article className="flex w-full flex-col gap-2 rounded-sm border border-dashed border-sepia/35 bg-parchment-dark/40 p-5">
      <div>
        <Badge tone="muted">Coming soon</Badge>
      </div>
      <h3 className="font-display text-xl font-semibold text-umber">{walk.title}</h3>
      <p className="text-sm leading-relaxed text-sepia">{walk.shortDescription}</p>
    </article>
  );
}
