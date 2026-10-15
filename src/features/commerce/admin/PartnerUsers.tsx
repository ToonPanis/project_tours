"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { localeNames, locales, type Locale } from "@/i18n/config";
import type { CommerceUser } from "@/types/commerce";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus:outline-none";
const labelText = "text-xs font-semibold uppercase tracking-wider text-gold";

/**
 * Who may sign in to this partner's portal. Inviting creates the user and
 * emails how to sign in (in the chosen language); removing access works at once.
 */
export function PartnerUsers({ partnerId, users }: { partnerId: string; users: CommerceUser[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [locale, setLocale] = useState<Locale>("nl");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const result = await postJson(`/api/admin/partners/${partnerId}/users`, { action: "invite", email, locale });
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    setSuccess(`${email.trim()} can now sign in; an email with instructions is on its way.`);
    setEmail("");
    router.refresh();
  }

  async function deactivate(user: CommerceUser) {
    setError(null);
    setSuccess(null);
    const result = await postJson(`/api/admin/partners/${partnerId}/users`, { action: "deactivate", userId: user.id });
    if (!result.ok) setError(adminErrorMessage(result.error));
    else setSuccess(`${user.email} no longer has access.`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-parchment/20 p-4 text-parchment">
      <h2 className="font-display text-2xl font-semibold">Portal access</h2>
      {users.length === 0 && <p className="text-parchment/70">Nobody has access yet.</p>}
      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-parchment/15 p-3">
            <span>
              {user.email}
              <span className="block text-sm text-parchment/70">
                {user.active ? "Has access" : "No access"}
                {user.lastLoginAt ? ` · last sign-in ${user.lastLoginAt.slice(0, 10)}` : " · never signed in"}
              </span>
            </span>
            {user.active && (
              <Button variant="outline" onClick={() => deactivate(user)}>
                Remove access
              </Button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={invite} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-1">
            <span className={labelText}>Email address</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelText}>Language of the email</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} className={field}>
              {locales.map((code) => (
                <option key={code} value={code}>
                  {localeNames[code].nativeName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button type="submit" disabled={isBusy}>
          Give access
        </Button>
      </form>
      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />
    </div>
  );
}
