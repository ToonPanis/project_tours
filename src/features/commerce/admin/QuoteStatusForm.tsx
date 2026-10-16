"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { QuoteStatus } from "@/types/commerce";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

/** Moves a quote request to one of its allowed next statuses, with an optional internal note. */
export function QuoteStatusForm({ quoteId, next }: { quoteId: string; next: QuoteStatus[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<QuoteStatus | "">(next[0] ?? "");
  const [note, setNote] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (next.length === 0) return <p className="text-parchment/70">This request is closed: no further status.</p>;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    const result = await postJson(`/api/admin/quotes/${encodeURIComponent(quoteId)}`, { status, note });
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    setNote("");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-3 rounded-sm border border-parchment/20 p-4 text-parchment">
      <h2 className="font-display text-2xl font-semibold">Change status</h2>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">New status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as QuoteStatus)}
          className="min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
        >
          {next.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">Internal note (optional, never sent to the company)</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={1000}
          rows={3}
          className="rounded-sm border border-parchment/30 bg-ink/40 px-3 py-2 focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
        />
      </label>
      <Button type="submit" disabled={isBusy || status === ""}>
        Save status
      </Button>
      <AdminStatus tone="error" message={error} />
    </form>
  );
}
