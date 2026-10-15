"use client";

import { useLinkStatus } from "next/link";

/**
 * A faint layer over a link while the page it opens is still on its way.
 * Our pages are rendered per request (they read the language cookie), so on a
 * slow connection a tap can take a moment: this shows the tap was seen.
 *
 * Always rendered (only its opacity changes), so nothing on the page moves.
 * Must be placed inside a <Link> (that's where useLinkStatus gets its state)
 * whose nearest positioned ancestor is the area to cover.
 */
export function LinkPendingHint({ className = "bg-current" }: { className?: string }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-sm transition-opacity duration-300 ${className} ${
        pending ? "opacity-15 motion-safe:animate-pulse" : "opacity-0"
      }`}
    />
  );
}
