"use client";

/**
 * Feedback for an admin form. Always mounted (empty when there's nothing to
 * say), so screen readers announce a new message (CLAUDE.md, accessibility).
 */
export function AdminStatus({ message, tone }: { message: string | null; tone: "error" | "success" }) {
  const look = tone === "error" ? "border-red-400/50 bg-red-950/40" : "border-emerald-400/50 bg-emerald-950/40";
  return (
    <p role="status" className={message ? `rounded-sm border ${look} p-3 text-parchment` : "sr-only"}>
      {message ?? ""}
    </p>
  );
}
