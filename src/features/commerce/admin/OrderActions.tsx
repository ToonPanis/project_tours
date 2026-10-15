"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { adminErrorMessage, formatEuros, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

interface OrderActionsProps {
  orderId: string;
  canRefund: boolean;
  remainingCents: number;
  hasActiveTicket: boolean;
}

type Pending = { kind: "refund"; amount: string; revoke: boolean } | { kind: "revoke" } | { kind: "reset" } | null;

/**
 * What an admin can do with an order. Refunding and revoking can't be undone,
 * so both ask for confirmation first (ConfirmDialog, destructive).
 */
export function OrderActions({ orderId, canRefund, remainingCents, hasActiveTicket }: OrderActionsProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [revoke, setRevoke] = useState(true);
  const [pending, setPending] = useState<Pending>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const base = `/api/admin/orders/${encodeURIComponent(orderId)}`;

  async function run(url: string, body: unknown, done: string) {
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const result = await postJson(url, body);
    setIsBusy(false);
    if (result.ok) {
      setSuccess(done);
      router.refresh();
    } else {
      setError(adminErrorMessage(result.error));
    }
  }

  function askRefund(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending({ kind: "refund", amount, revoke });
  }

  async function confirm() {
    const action = pending;
    setPending(null);
    if (action?.kind === "refund") {
      await run(`${base}/refund`, { amount: action.amount, revokeTicket: action.revoke }, "Refund requested at Stripe. The order updates when Stripe confirms it (usually within seconds).");
      setAmount("");
    } else if (action?.kind === "revoke") {
      await run(`${base}/revoke-ticket`, {}, "Ticket revoked.");
    } else if (action?.kind === "reset") {
      await run(`${base}/reset-devices`, {}, "All seats are free again: the group can open the link again.");
    }
  }

  return (
    <div className="flex flex-col gap-4 text-parchment">
      {canRefund && (
        <form onSubmit={askRefund} className="flex flex-col gap-3 rounded-sm border border-parchment/20 p-4">
          <h2 className="font-display text-2xl font-semibold">Refund</h2>
          <label className="flex max-w-56 flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">{`Amount (empty = all, ${formatEuros(remainingCents)})`}</span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              className="min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 focus:border-gold focus:outline-none"
            />
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" checked={revoke} onChange={(event) => setRevoke(event.target.checked)} />
            Also revoke the ticket now (a full refund always revokes it)
          </label>
          <Button type="submit" variant="outline" disabled={isBusy}>
            Refund…
          </Button>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" disabled={isBusy} onClick={() => run(`${base}/resend`, {}, "Confirmation queued again.")}>
          Resend confirmation
        </Button>
        {hasActiveTicket && (
          <>
            <Button variant="outline" disabled={isBusy} onClick={() => setPending({ kind: "reset" })}>
              Free all seats…
            </Button>
            <Button variant="outline" disabled={isBusy} onClick={() => setPending({ kind: "revoke" })}>
              Revoke ticket…
            </Button>
          </>
        )}
      </div>

      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />

      <ConfirmDialog
        open={pending !== null}
        isDestructive={pending?.kind !== "reset"}
        title={pending?.kind === "refund" ? "Refund this order?" : pending?.kind === "revoke" ? "Revoke the ticket?" : "Free all seats?"}
        message={
          pending?.kind === "refund"
            ? `Stripe refunds ${pending.amount ? `€ ${pending.amount}` : formatEuros(remainingCents)} to the buyer. This can't be undone.`
            : pending?.kind === "revoke"
              ? "The ticket link and every phone that opened it stop working. This can't be undone."
              : "Every phone loses the ticket; the group opens the link again."
        }
        confirmLabel={pending?.kind === "refund" ? "Refund" : pending?.kind === "revoke" ? "Revoke" : "Free seats"}
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
