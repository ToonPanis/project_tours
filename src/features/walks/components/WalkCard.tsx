import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { WalkSummary } from "@/types/walk";
import { formatDistance, formatDuration, formatPrice } from "../utils/format-walk";
import { WalkCover } from "./WalkCover";

interface WalkCardProps {
  walk: WalkSummary;
  /** Heading level, so the card fits the page's heading outline. */
  headingLevel?: "h2" | "h3";
}

export function WalkCard({ walk, headingLevel: Heading = "h3" }: WalkCardProps) {
  const walkUrl = `/walks/${walk.slug}`;

  return (
    // `relative` + the link's `after:absolute` makes the whole card clickable,
    // while screen readers still get one clear link (the title).
    <article className="group relative flex w-full flex-col overflow-hidden rounded-sm border border-gold-deep/25 bg-parchment shadow-sm transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-gold">
      <div className="relative aspect-[16/9]">
        <WalkCover image={walk.coverImage} sizes="(min-width: 640px) 50vw, 100vw" />
        <p className="absolute bottom-5 left-6 font-display text-sm uppercase tracking-[0.2em] text-gold">
          {walk.city}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{walk.locationCount} stops</Badge>
          {walk.contentStatus === "placeholder" && <Badge tone="muted">Preview content</Badge>}
        </div>

        <Heading className="font-display text-2xl font-semibold leading-tight text-ink">
          <Link
            href={walkUrl}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {walk.title}
          </Link>
        </Heading>

        <p className="text-sm italic text-gold-deep">{walk.tagline}</p>
        <p className="text-sm leading-relaxed text-sepia">{walk.shortDescription}</p>

        <div className="mt-auto flex items-end justify-between border-t border-gold-deep/20 pt-3 text-sm">
          <p className="text-sepia">
            {formatDuration(walk.durationInMinutes)} · {formatDistance(walk.distanceInMeters)}
          </p>
          <p className="font-display text-xl font-semibold text-ink">
            {formatPrice(walk.price)}
            <span className="sr-only"> per team</span>
          </p>
        </div>
      </div>
    </article>
  );
}
