"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

/** Step 1 of signing in: ask for a link by email. */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setError(null);
    const result = await postJson<{ sent: true }>("/api/admin/auth/login-link", { email });
    setIsSending(false);
    if (result.ok) setSentTo(email.trim());
    else setError(adminErrorMessage(result.error));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">Email address</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
        />
      </label>
      <Button type="submit" disabled={isSending} fullWidth>
        {isSending ? "Sending…" : "Email me a sign-in link"}
      </Button>
      <AdminStatus tone="error" message={error} />
      <AdminStatus
        tone="success"
        message={
          sentTo
            ? `If ${sentTo} is an admin address, a sign-in link is on its way. It works once, for 15 minutes.`
            : null
        }
      />
    </form>
  );
}
