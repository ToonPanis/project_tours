"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/client";
import { postCommerce } from "./commerce-errors";

/**
 * /unsubscribe#<token>: one button. Opening the link alone changes nothing
 * (mail scanners open links); pressing the button does.
 */
export function UnsubscribeButton() {
  const t = useT();
  const [state, setState] = useState<"idle" | "busy" | "done" | "invalid">("idle");

  async function unsubscribe() {
    const token = window.location.hash.slice(1);
    if (!token) {
      setState("invalid");
      return;
    }
    setState("busy");
    const result = await postCommerce("/api/unsubscribe", { token });
    setState(result.ok ? "done" : "invalid");
  }

  return (
    <div className="flex flex-col gap-4">
      {state !== "done" && (
        <Button onClick={unsubscribe} disabled={state === "busy"} fullWidth>
          {state === "busy" ? t("feedback.unsubscribe.busy") : t("feedback.unsubscribe.button")}
        </Button>
      )}
      <p
        role="status"
        className={
          state === "done"
            ? "rounded-sm border border-emerald-400/50 bg-emerald-950/40 p-3"
            : state === "invalid"
              ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3"
              : "sr-only"
        }
      >
        {state === "done" ? t("feedback.unsubscribe.done") : state === "invalid" ? t("feedback.unsubscribe.invalid") : ""}
      </p>
    </div>
  );
}
