import type { ReactNode } from "react";

type BadgeTone = "gold" | "muted" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  gold: "border-gold-deep/40 bg-gold/20 text-gold-deep",
  muted: "border-sepia/30 bg-parchment-dark/60 text-sepia",
  // Dark text on a light tint: readable on both parchment and white.
  success: "border-emerald-800/30 bg-emerald-100 text-emerald-900",
  warning: "border-amber-800/30 bg-amber-100 text-amber-900",
  danger: "border-red-800/30 bg-red-100 text-red-900",
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
