"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";
const labelText = "text-xs font-semibold uppercase tracking-wider text-gold";

interface Lookup {
  email: string;
  orders: { id: string; status: string; createdAt: string; erased: boolean }[];
  quotes: number;
  reviews: number;
  emails: number;
  account: { roles: string[]; active: boolean } | null;
  unsubscribed: boolean;
}

/**
 * Access and erasure requests (GDPR) by email address. Everything goes by POST:
 * the address is never put in a URL (URLs end up in logs).
 */
export function PrivacyRequests() {
  const [email, setEmail] = useState("");
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [confirm, setConfirm] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function find(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const result = await postJson<Lookup>("/api/admin/privacy/lookup", { email });
    setIsBusy(false);
    if (result.ok) setLookup(result.data);
    else setError(adminErrorMessage(result.error));
  }

  async function exportData() {
    if (!lookup) return;
    setIsBusy(true);
    const result = await postJson<{ fileName: string; json: string }>("/api/admin/privacy/export", { email: lookup.email });
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    // A download made in the browser from the answer: the file never sits on the server.
    const url = URL.createObjectURL(new Blob([result.data.json], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = result.data.fileName;
    link.click();
    URL.revokeObjectURL(url);
    setSuccess("The export was downloaded. Send it to the person over a safe channel, then delete your copy.");
  }

  async function erase() {
    if (!lookup) return;
    setIsBusy(true);
    setError(null);
    const result = await postJson<{ ordersPseudonymised: number; quotesDeleted: number; reviewsDeleted: number; emailsDeleted: number; partnerUserErased: boolean }>(
      "/api/admin/privacy/erase",
      { email: lookup.email, confirm },
    );
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    const report = result.data;
    setSuccess(
      `Erased: ${report.ordersPseudonymised} order(s) without email/name (amounts kept for the accounts), ${report.quotesDeleted} quote request(s), ${report.reviewsDeleted} review(s), ${report.emailsDeleted} email record(s)${report.partnerUserErased ? ", the partner user" : ""}. The address's hash stays on the unsubscribe list.`,
    );
    setLookup(null);
    setConfirm("");
  }

  return (
    <div className="flex flex-col gap-4 text-parchment">
      <form onSubmit={find} className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-64 flex-1 flex-col gap-1">
          <span className={labelText}>Email address of the person</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className={field} />
        </label>
        <Button type="submit" disabled={isBusy}>
          Find
        </Button>
      </form>
      {lookup && (
        <div className="flex flex-col gap-3 rounded-sm border border-parchment/20 p-4">
          <h2 className="font-display text-2xl font-semibold">{`Stored about ${lookup.email}`}</h2>
          <ul className="list-inside list-disc text-sm text-parchment/85">
            <li>{`Orders: ${lookup.orders.length}${lookup.orders.some((order) => order.erased) ? " (some already erased)" : ""}`}</li>
            <li>{`Quote requests: ${lookup.quotes}`}</li>
            <li>{`Reviews: ${lookup.reviews}`}</li>
            <li>{`Email records: ${lookup.emails}`}</li>
            <li>{`Account: ${lookup.account ? `${lookup.account.roles.join(", ")}${lookup.account.active ? "" : " (inactive)"}` : "none"}`}</li>
            <li>{`Unsubscribed from follow-ups: ${lookup.unsubscribed ? "yes" : "no"}`}</li>
          </ul>
          <Button variant="outline" disabled={isBusy} onClick={exportData}>
            Export everything (JSON)
          </Button>
          <div className="flex flex-col gap-2 rounded-sm border border-red-400/40 p-3">
            <p className="text-sm">
              Erase: quote requests, reviews and email records are deleted; orders keep amounts, VAT, country and business details (accounting) but lose the email and name. This can&apos;t be undone.
            </p>
            <label className="flex flex-col gap-1">
              <span className={labelText}>Type the address again to confirm</span>
              <input type="email" value={confirm} onChange={(event) => setConfirm(event.target.value)} className={field} />
            </label>
            <Button variant="outline" disabled={isBusy || confirm.trim().toLowerCase() !== lookup.email} onClick={erase}>
              Erase this person&apos;s data
            </Button>
          </div>
        </div>
      )}
      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />
    </div>
  );
}
