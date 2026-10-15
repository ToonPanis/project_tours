"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import { claimPlayerLinkRequest } from "../client/api";
import { Beery } from "./Beery";

/**
 * Opened from a host's personal link (/games/CODE/claim#secret). The secret is
 * after "#", so only this page's JavaScript sees it: it sends it once, gets
 * the player cookie, removes the secret from the address bar and opens the game.
 */
export function ClaimPlayerLink({ code }: { code: string }) {
  const t = useT();
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const token = window.location.hash.slice(1);
    // Out of the address bar (and the browser history) right away.
    window.history.replaceState(null, "", window.location.pathname);
    // No secret in the link: handled like a refused link.
    const request = token ? claimPlayerLinkRequest(code, token) : Promise.resolve({ ok: false as const });
    void request.then((result) => {
      if (result.ok) router.replace(`/games/${code}`);
      else setFailed(true);
    });
  }, [code, router]);

  return (
    <PlayScreen title={t("pubgame.claim.title")} screenId="pub-game-claim">
      <Beery>
        <p role="status">{failed ? t("pubgame.claim.invalid") : ""}</p>
      </Beery>
    </PlayScreen>
  );
}
