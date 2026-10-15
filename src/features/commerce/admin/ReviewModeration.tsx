"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Review } from "@/types/commerce";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

/**
 * One review with its moderation buttons. Words are never edited: approve,
 * reject, or delete (e.g. when the customer asks: GDPR erasure).
 */
export function ReviewModeration({ review, productName }: { review: Review; productName: string }) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "approve" | "reject" | "delete") {
    if (action === "delete" && !window.confirm("Delete this review for good? This can't be undone.")) return;
    setIsBusy(true);
    setError(null);
    const result = await postJson(`/api/admin/reviews/${review.id}`, { action });
    setIsBusy(false);
    if (!result.ok) setError(adminErrorMessage(result.error));
    router.refresh();
  }

  return (
    <article className="flex flex-col gap-2 rounded-sm border border-parchment/15 p-3 text-parchment">
      <p className="font-semibold">
        <span aria-label={`${review.rating} of 5 stars`} className="text-gold">
          {"★".repeat(review.rating)}
          <span className="text-parchment/30">{"★".repeat(5 - review.rating)}</span>
        </span>
        {` · ${productName} · ${review.createdAt.slice(0, 10)} · ${review.status}`}
      </p>
      {review.text ? <p className="whitespace-pre-line">{review.text}</p> : <p className="text-parchment/60">(no text)</p>}
      <p className="text-sm text-parchment/70">
        {`${review.displayName ?? "anonymous"} · language ${review.locale} · ${review.mayPublish ? "may be published" : "NOT for publication"}${review.incentivised ? " · rewarded with a code (disclose if shown)" : ""}`}
      </p>
      <div className="flex flex-wrap gap-2">
        {review.status !== "approved" && (
          <Button variant="outline" disabled={isBusy} onClick={() => act("approve")}>
            Approve
          </Button>
        )}
        {review.status !== "rejected" && (
          <Button variant="outline" disabled={isBusy} onClick={() => act("reject")}>
            Reject
          </Button>
        )}
        <Button variant="outline" disabled={isBusy} onClick={() => act("delete")}>
          Delete
        </Button>
      </div>
      <AdminStatus tone="error" message={error} />
    </article>
  );
}
