"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJson } from "./admin-api";

export function SignOutButton() {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);

  async function signOut() {
    setIsBusy(true);
    await postJson("/api/admin/auth/logout", {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={isBusy} className="min-h-11 text-sm text-parchment/70 underline underline-offset-4">
      Sign out
    </button>
  );
}
