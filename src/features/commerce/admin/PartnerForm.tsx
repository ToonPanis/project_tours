"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { CommissionRule, Partner, PartnerType } from "@/types/commerce";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";
const labelText = "text-xs font-semibold uppercase tracking-wider text-gold";

const TYPES: [PartnerType, string][] = [
  ["HOTEL_PARTNER", "Hotel"],
  ["HORECA_PARTNER", "Café / restaurant"],
  ["TOURISM_PARTNER", "Tourism (office, guide, agency)"],
  ["CORPORATE_PARTNER", "Company"],
];

const KINDS: [CommissionRule["kind"], string][] = [
  ["percent-net", "Percentage of the net price excl. VAT"],
  ["fixed-per-ticket", "Fixed amount per ticket (person)"],
  ["fixed-per-booking", "Fixed amount per booking"],
  ["none", "No commission (statistics only)"],
];

/** The rule as the form shows it: "15" for 15 %, "2,50" for €2.50. */
function ruleValue(rule: CommissionRule): string {
  if (rule.kind === "percent-net") return String(rule.basisPoints / 100).replace(".", ",");
  if (rule.kind === "none") return "";
  return (rule.cents / 100).toFixed(2).replace(".", ",");
}

/**
 * Create a partner (with its code) or edit one (the code never changes: it is
 * printed on QR codes). A new commission rule only counts for new orders.
 */
export function PartnerForm({ partner }: { partner?: Partner }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState(partner?.name ?? "");
  const [type, setType] = useState<PartnerType>(partner?.type ?? "HOTEL_PARTNER");
  const [kind, setKind] = useState<CommissionRule["kind"]>(partner?.commission.kind ?? "percent-net");
  const [value, setValue] = useState(partner ? ruleValue(partner.commission) : "");
  const [active, setActive] = useState(partner?.active ?? true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const body = { code, name, type, active, commission: { kind, value } };
    const result = await postJson<Partner>(partner ? `/api/admin/partners/${partner.id}` : "/api/admin/partners", body);
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    if (partner) {
      setSuccess("Saved. A new commission rule applies to orders from now on.");
      router.refresh();
    } else {
      router.push(`/admin/partners/${result.data.id}`);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4 rounded-sm border border-parchment/20 p-4 text-parchment">
      <h2 className="font-display text-2xl font-semibold">{partner ? "Partner details" : "New partner"}</h2>
      {!partner && (
        <label className="flex flex-col gap-1">
          <span className={labelText}>Code (in the link and QR code, can&apos;t be changed later)</span>
          <input value={code} onChange={(event) => setCode(event.target.value)} maxLength={30} required placeholder="HOTELJULIEN" className={`${field} uppercase`} />
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className={labelText}>Name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className={labelText}>Kind of partner</span>
        <select value={type} onChange={(event) => setType(event.target.value as PartnerType)} className={field}>
          {TYPES.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-1">
        <legend className={labelText}>Commission</legend>
        {KINDS.map(([id, label]) => (
          <label key={id} className="flex min-h-11 items-center gap-2">
            <input type="radio" name="commission-kind" checked={kind === id} onChange={() => setKind(id)} /> {label}
          </label>
        ))}
      </fieldset>
      {kind !== "none" && (
        <label className="flex max-w-56 flex-col gap-1">
          <span className={labelText}>{kind === "percent-net" ? "Percent (e.g. 15 or 12,5)" : "Amount in € (e.g. 2,50)"}</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" required className={field} />
        </label>
      )}
      {partner && (
        <label className="flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active (its link counts and its users can sign in)
        </label>
      )}
      <Button type="submit" disabled={isBusy}>
        {partner ? "Save" : "Create partner"}
      </Button>
      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />
    </form>
  );
}
