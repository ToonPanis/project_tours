"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CommissionEntry, CommissionStatus } from "@/types/commerce";
import { adminErrorMessage, formatEuros, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus:outline-none";

const STATUS_LABEL: Record<CommissionStatus, string> = {
  pending: "Pending (being checked)",
  approved: "Approved",
  payable: "Payable",
  paid: "Paid",
  reversed: "Reversed",
};

/** The step each button takes, and which lines it applies to. */
const STEPS: { to: "approved" | "payable" | "paid"; from: CommissionStatus; label: string }[] = [
  { to: "approved", from: "pending", label: "Approve selected" },
  { to: "payable", from: "approved", label: "Mark selected payable" },
  { to: "paid", from: "payable", label: "Mark selected paid" },
];

/**
 * The commission ledger of one partner (or all): select lines and move them one
 * step. "Paid" asks for the reference of the bank transfer you made yourself:
 * the app never sends money (brief 3.5).
 */
export function CommissionLedger({
  entries,
  partnerId,
  showPartner,
  partnerNames,
}: {
  entries: CommissionEntry[];
  partnerId?: string;
  showPartner?: boolean;
  partnerNames?: Record<string, string>;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [reference, setReference] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function run(body: Record<string, unknown>, done: (data: { changed: number; skipped?: number }) => string) {
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const result = await postJson<{ changed: number; skipped?: number }>("/api/admin/commissions", body);
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    setSuccess(done(result.data));
    setSelected([]);
    router.refresh();
  }

  function step(to: "approved" | "payable" | "paid", from: CommissionStatus) {
    const ids = entries.filter((entry) => selected.includes(entry.id) && entry.status === from).map((entry) => entry.id);
    void run({ action: "change", to, ids, payoutReference: to === "paid" ? reference : undefined }, ({ changed, skipped }) =>
      `${changed} line(s) moved to "${STATUS_LABEL[to]}"${skipped ? `, ${skipped} skipped (changed meanwhile)` : ""}.`,
    );
  }

  const toggle = (id: string, on: boolean) => setSelected((ids) => (on ? [...ids, id] : ids.filter((other) => other !== id)));

  return (
    <div className="flex flex-col gap-3 text-parchment">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={isBusy}
          onClick={() => run({ action: "approve-old", partnerId }, ({ changed }) => `${changed} pending line(s) older than 14 days approved.`)}
        >
          Approve all pending older than 14 days
        </Button>
      </div>
      {entries.length === 0 ? (
        <p className="text-parchment/70">No commission lines.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-parchment/20 text-left text-parchment/70">
                <th scope="col" className="py-2 pr-2 font-normal">
                  <span className="sr-only">Select</span>
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">Paid on</th>
                {showPartner && <th scope="col" className="py-2 pr-3 font-normal">Partner</th>}
                <th scope="col" className="py-2 pr-3 font-normal">Order</th>
                <th scope="col" className="py-2 pr-3 text-right font-normal">Basis excl. VAT</th>
                <th scope="col" className="py-2 pr-3 text-right font-normal">Commission</th>
                <th scope="col" className="py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-parchment/10">
                  <td className="py-1 pr-2">
                    <input
                      type="checkbox"
                      aria-label={`Select ${entry.id}`}
                      disabled={entry.status === "paid" || entry.status === "reversed"}
                      checked={selected.includes(entry.id)}
                      onChange={(event) => toggle(entry.id, event.target.checked)}
                      className="size-5"
                    />
                  </td>
                  <td className="py-1 pr-3 tabular-nums">{entry.orderPaidAt.slice(0, 10)}</td>
                  {showPartner && <td className="py-1 pr-3">{partnerNames?.[entry.partnerId] ?? entry.partnerId}</td>}
                  <td className="py-1 pr-3">
                    <Link href={`/admin/orders/${entry.orderId}`} className="underline underline-offset-4">
                      {entry.kind === "adjustment" ? "refund adjustment" : "order"}
                    </Link>
                  </td>
                  <td className="py-1 pr-3 text-right tabular-nums">{formatEuros(entry.basisCents)}</td>
                  <td className="py-1 pr-3 text-right tabular-nums">{formatEuros(entry.amountCents)}</td>
                  <td className="py-1">
                    {STATUS_LABEL[entry.status]}
                    {entry.payoutReference ? <span className="block text-xs text-parchment/60">{entry.payoutReference}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {entries.length > 0 && (
        <div className="flex flex-col gap-2 rounded-sm border border-parchment/15 p-3">
          <p className="text-sm text-parchment/80">{`${selected.length} selected. Each button only moves the selected lines that are in the step before.`}</p>
          <div className="flex flex-wrap gap-2">
            {STEPS.slice(0, 2).map(({ to, from, label }) => (
              <Button key={to} variant="outline" disabled={isBusy || selected.length === 0} onClick={() => step(to, from)}>
                {label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">Bank transfer reference</span>
              <input value={reference} onChange={(event) => setReference(event.target.value)} maxLength={100} className={field} />
            </label>
            <Button variant="outline" disabled={isBusy || selected.length === 0} onClick={() => step("paid", "payable")}>
              {STEPS[2].label}
            </Button>
          </div>
        </div>
      )}
      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />
    </div>
  );
}
