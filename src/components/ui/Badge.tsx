import type { ReactNode } from "react";

type BadgeTone = "gold" | "muted";

const toneClasses: Record<BadgeTone, string> = {
  gold: "border-gold-deep/40 bg-gold/20 text-gold-deep",
  muted: "border-sepia/30 bg-parchment-dark/60 text-sepia",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, tone = "gold" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
