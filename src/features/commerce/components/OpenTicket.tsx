"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { commerceErrorKey, postCommerce } from "./commerce-errors";

/** Keys, not texts: translated while rendering, so a language switch shows the new language without opening the ticket again. */
type State = { kind: "opening" } | { kind: "ready"; walkSlug: string } | { kind: "error"; messageKey: MessageKey };

/**
 * /tickets/open#<ticket>: opens the ticket on this phone. The ticket is after
 * "#", so it never reaches a server log; this page sends it once to our API,
 * which gives the phone its own ticket cookie, and removes it from the address bar.
 */
export function OpenTicket() {
  const t = useT();
  const [state, setState] = useState<State>({ kind: "opening" });

  // Once, when the page opens.
  useEffect(() => {
    const token = window.location.hash.slice(1);
    let isCancelled = false;
    async function open() {
      if (!token) {
        setState({ kind: "error", messageKey: "commerce.ticket.missing" });
        return;
      }
      const result = await postCommerce<{ walkSlug: string }>("/api/tickets/activate", { token });
      if (isCancelled) return;
      if (result.ok) {
        window.history.replaceState(null, "", window.location.pathname);
        setState({ kind: "ready", walkSlug: result.data.walkSlug });
      } else {
        setState({ kind: "error", messageKey: commerceErrorKey(result.error) });
      }
    }
    void open();
    return () => {
      isCancelled = true;
    };
  }, []);

  const message =
    state.kind === "opening" ? t("commerce.ticket.opening") : state.kind === "ready" ? t("commerce.ticket.ready") : t(state.messageKey);

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className={state.kind === "error" ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3 text-parchment" : "text-parchment/90"}>
        {message}
      </p>
      {state.kind === "ready" && <ButtonLink href={`/walks/${state.walkSlug}/play`}>{t("commerce.ticket.start")}</ButtonLink>}
    </div>
  );
}
