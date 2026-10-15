"use client";

import type { ReactNode } from "react";
import { useT } from "@/i18n/client";

interface BeeryProps {
  /** What Beery says, in a speech bubble next to him. */
  children?: ReactNode;
  size?: "small" | "large";
}

/**
 * Beery, the host of Hidden Pubs: a cheerful beer mug drawn in SVG with the
 * theme's colours (so he fits the tavern theme without an image download).
 * His gentle wobble stops for people who prefer reduced motion.
 */
export function Beery({ children, size = "small" }: BeeryProps) {
  const t = useT();
  const sizeClass = size === "large" ? "h-28 w-28" : "h-16 w-16";

  return (
    <div className="flex items-end gap-3">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={t("pubgame.beery.portrait")}
        className={`${sizeClass} shrink-0 motion-safe:animate-[beery-wobble_3s_ease-in-out_infinite]`}
      >
        {/* Handle */}
        <path d="M70 38 h8 a12 12 0 0 1 0 24 h-8" fill="none" stroke="var(--color-gold)" strokeWidth="7" />
        {/* Glass with beer */}
        <rect x="18" y="26" width="54" height="64" rx="8" fill="var(--color-gold)" />
        <rect x="24" y="34" width="42" height="50" rx="5" fill="var(--color-gold-deep)" opacity="0.35" />
        {/* Foam */}
        <path
          d="M14 30 q4 -14 16 -10 q6 -12 18 -6 q10 -10 20 0 q12 -2 10 14 q-2 6 -10 5 H22 q-9 1 -8 -3z"
          fill="var(--color-parchment)"
        />
        {/* Face */}
        <circle cx="35" cy="52" r="4.5" fill="var(--color-ink)" />
        <circle cx="55" cy="52" r="4.5" fill="var(--color-ink)" />
        <circle cx="36.5" cy="50.5" r="1.5" fill="var(--color-parchment)" />
        <circle cx="56.5" cy="50.5" r="1.5" fill="var(--color-parchment)" />
        <path d="M33 64 q12 12 24 0" fill="none" stroke="var(--color-ink)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="28" cy="62" r="3.5" fill="#c4553b" opacity="0.55" />
        <circle cx="62" cy="62" r="3.5" fill="#c4553b" opacity="0.55" />
      </svg>

      {children && (
        <div className="relative rounded-sm border border-gold/40 bg-umber px-4 py-3 text-parchment shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
