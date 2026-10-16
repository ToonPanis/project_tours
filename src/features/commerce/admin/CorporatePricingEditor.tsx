"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { CorporatePricing } from "@/types/commerce";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 w-full rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";
const euros = (cents: number | null) => (cents === null ? "" : String(cents / 100).replace(".", ","));

interface Row {
  persons: string;
  selfGuided: string;
  guided: string;
  guidedFrom: boolean;
}

/** The indicative price table shown on /corporate (brief 5.2: editable starting points). Empty = "on request". */
export function CorporatePricingEditor({ pricing }: { pricing: CorporatePricing }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(
    pricing.tiers.map((tier) => ({ persons: String(tier.persons), selfGuided: euros(tier.selfGuidedCents), guided: euros(tier.guidedCents), guidedFrom: tier.guidedFrom })),
  );
  const [includeVat, setIncludeVat] = useState(pricing.pricesIncludeVat);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const update = (index: number, changes: Partial<Row>) => setRows((current) => current.map((row, i) => (i === index ? { ...row, ...changes } : row)));

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const result = await postJson("/api/admin/corporate-pricing", { tiers: rows, pricesIncludeVat: includeVat });
    setIsBusy(false);
    if (result.ok) {
      setSuccess("Saved: /corporate shows the new prices.");
      router.refresh();
    } else {
      setError(adminErrorMessage(result.error));
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-3 rounded-sm border border-parchment/20 p-4 text-parchment">
      <h2 className="font-display text-2xl font-semibold">Price guide on /corporate</h2>
      <p className="text-sm text-parchment/70">
        {pricing.updatedAt ? `Last saved by ${pricing.updatedBy ?? "unknown"}.` : "The starting prices from the brief (not saved yet)."} Amounts in
        euros for the whole group; leave a field empty for &quot;on request&quot;.
      </p>
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-2 gap-2 rounded-sm border border-parchment/15 p-3 sm:grid-cols-[6rem_1fr_1fr_auto_auto] sm:items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-parchment/70">Persons</span>
            <input value={row.persons} onChange={(event) => update(index, { persons: event.target.value })} inputMode="numeric" className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-parchment/70">Self-guided €</span>
            <input value={row.selfGuided} onChange={(event) => update(index, { selfGuided: event.target.value })} inputMode="decimal" className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-parchment/70">With a guide €</span>
            <input value={row.guided} onChange={(event) => update(index, { guided: event.target.value })} inputMode="decimal" className={field} />
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={row.guidedFrom} onChange={(event) => update(index, { guidedFrom: event.target.checked })} /> &quot;from&quot;
          </label>
          <button type="button" onClick={() => setRows((current) => current.filter((_, i) => i !== index))} className="min-h-11 text-sm underline underline-offset-4">
            Remove
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setRows((current) => [...current, { persons: "", selfGuided: "", guided: "", guidedFrom: false }])}>
        Add a line
      </Button>
      <label className="flex min-h-11 items-center gap-2">
        <input type="checkbox" checked={includeVat} onChange={(event) => setIncludeVat(event.target.checked)} />
        These prices include VAT
      </label>
      <Button type="submit" disabled={isBusy}>
        Save price guide
      </Button>
      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />
    </form>
  );
}
