interface WalkHighlightsProps {
  highlights: string[];
}

/** "What to expect" list. */
export function WalkHighlights({ highlights }: WalkHighlightsProps) {
  return (
    <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {highlights.map((highlight) => (
        <li key={highlight} className="flex items-center gap-3 text-sepia">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-deep" />
          {highlight}
        </li>
      ))}
    </ul>
  );
}
