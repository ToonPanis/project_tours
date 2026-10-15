"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/client";
import { postCommerce } from "../components/commerce-errors";
import { partnerErrorKey } from "./partner-api";

/**
 * Step 2: the link from the email opens this page with the secret after "#"
 * (never sent to a server by the browser). It is only used when the partner
 * presses the button, so a mail scanner opening the link can't use it up.
 */
export function PartnerVerifyLogin() {
  const t = useT();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    const token = window.location.hash.slice(1);
    if (!token) {
      setError(t(partnerErrorKey("invalid-link")));
      return;
    }
    setIsSigningIn(true);
    setError(null);
    const result = await postCommerce<{ signedIn: true }>("/api/partner/auth/verify", { token });
    if (result.ok) {
      window.history.replaceState(null, "", window.location.pathname);
      router.replace("/partner");
      router.refresh();
    } else {
      setIsSigningIn(false);
      setError(t(partnerErrorKey(result.error)));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={signIn} disabled={isSigningIn} fullWidth>
        {isSigningIn ? t("partner.login.verifying") : t("partner.login.verifyButton")}
      </Button>
      <p role="status" className={error ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3 text-parchment" : "sr-only"}>
        {error ?? ""}
      </p>
    </div>
  );
}
