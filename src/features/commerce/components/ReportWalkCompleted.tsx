"use client";

import { useEffect } from "react";

/**
 * Rendered on the completion screen of a walk played with a ticket (P8,
 * decision B9). Tells the server once "this walk is finished"; the ticket
 * cookie says which ticket. Nothing else is sent: no location, no progress,
 * no time spent. Shows nothing, and the screen never waits for it.
 */
export function ReportWalkCompleted({ walkSlug }: { walkSlug: string }) {
  useEffect(() => {
    void fetch("/api/tickets/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ walkSlug }),
      keepalive: true,
    }).catch(() => {
      // Offline: the server counts only the first report anyway; nothing to show.
    });
  }, [walkSlug]);
  return null;
}
