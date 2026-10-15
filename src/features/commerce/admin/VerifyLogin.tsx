"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

/**
 * Step 2 of signing in: the link from the email opens this page with the
 * secret after "#". That part of a URL never reaches a server, so it can't
 * end up in a log. The secret is only read and sent when the admin presses the
 * button, so a mail scanner that opens the link can't use it up.
 */
export function VerifyLogin() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    const token = window.location.hash.slice(1);
    if (!token) {
      setError(adminErrorMessage("invalid-link"));
      return;
    }
    setIsSigningIn(true);
    setError(null);
    const result = await postJson<{ email: string }>("/api/admin/auth/verify", { token });
    if (result.ok) {
      // Used up: remove it from the address bar and the browser history.
      window.history.replaceState(null, "", window.location.pathname);
      // The session cookie is set; load the admin area on the server.
      router.replace("/admin");
      router.refresh();
    } else {
      setIsSigningIn(false);
      setError(adminErrorMessage(result.error));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={signIn} disabled={isSigningIn} fullWidth>
        {isSigningIn ? "Signing in…" : "Sign in"}
      </Button>
      <AdminStatus tone="error" message={error} />
    </div>
  );
}
