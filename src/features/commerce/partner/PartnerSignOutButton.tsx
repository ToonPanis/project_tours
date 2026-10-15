"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/i18n/client";
import { postCommerce } from "../components/commerce-errors";

export function PartnerSignOutButton() {
  const t = useT();
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);

  async function signOut() {
    setIsBusy(true);
    await postCommerce("/api/partner/auth/logout", {});
    router.replace("/partner/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={isBusy} className="min-h-11 text-sm text-parchment/70 underline underline-offset-4">
      {t("partner.portal.signOut")}
    </button>
  );
}
