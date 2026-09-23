import type { WalkLocation } from "@/types/location";

interface LocationPreviewListProps {
  locations: WalkLocation[];
}

/**
 * Route preview for the detail page. Deliberately shows only names and
 * short teasers, not stories or challenges, to avoid spoilers.
 */
export function LocationPreviewList({ locations }: LocationPreviewListProps) {
  const sortedLocations = [...locations].sort((a, b) => a.order - b.order);

  return (
    <ol className="relative space-y-6 border-l border-gold-deep/30 pl-8">
      {sortedLocations.map((location) => (
        <li key={location.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.9rem] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-gold-deep/50 bg-ink font-display text-sm font-semibold text-gold"
          >
            {location.order}
          </span>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            <span className="sr-only">Stop {location.order}: </span>
            {location.name}
          </h3>
          <p className="text-sm text-sepia">{location.description}</p>
        </li>
      ))}
    </ol>
  );
}
