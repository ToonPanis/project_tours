"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import { shareOrCopy } from "../client/share";
import type { PubGameHandle } from "../client/usePubGame";
import type { QrCode } from "../logic/qr";
import { allTeams } from "../logic/view-helpers";
import { Beery } from "./Beery";
import { FormError } from "./FormError";
import { QrCodeImage } from "./QrCodeImage";

interface LobbyScreenProps {
  code: string;
  /**
   * The full join link (built on the server from the request's host) and its QR code.
   * Null only if the page was rendered after the start; the link is then rebuilt here.
   */
  invite: { joinUrl: string; qrCode: QrCode } | null;
  game: PubGameHandle;
}

/** Before the start: invite the others, see who joined; the host starts the game. */
export function LobbyScreen({ code, invite, game }: LobbyScreenProps) {
  const t = useT();
  const { view, act, busy } = game;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinUrl = invite?.joinUrl ?? `${typeof window === "undefined" ? "" : window.location.origin}/games/${code}`;
  const teams = allTeams(view);
  const everyTeamHasPlayers = teams.every((team) => view.players.some((player) => player.teamId === team.id));

  async function share() {
    const result = await shareOrCopy({ title: t("pubgame.lobby.shareText"), url: joinUrl }, joinUrl);
    if (result !== "shared") setCopied(result === "copied");
  }

  async function start() {
    setError(await act({ type: "START_GAME" }));
  }

  return (
    <PlayScreen
      eyebrow={t("pubgame.lobby.eyebrow", { code })}
      title={t("pubgame.lobby.title")}
      screenId="pub-game-lobby"
      actions={
        view.me.isHost ? (
          <>
            <FormError error={error} />
            {!everyTeamHasPlayers && <p className="text-sm text-parchment/75">{t("pubgame.lobby.startHint")}</p>}
            <Button onClick={start} disabled={busy || !everyTeamHasPlayers} fullWidth>
              {t("pubgame.lobby.start")}
            </Button>
          </>
        ) : (
          <Beery>
            <p>{t("pubgame.lobby.waitingForHost")}</p>
          </Beery>
        )
      }
    >
      <section className="flex flex-col gap-3 rounded-sm border border-gold/40 bg-ink/30 p-4">
        <h2 className="font-display text-2xl font-semibold text-parchment">{t("pubgame.lobby.inviteTitle")}</h2>
        <p>{t("pubgame.lobby.inviteText")}</p>
        {invite && <QrCodeImage code={invite.qrCode} label={t("pubgame.lobby.qrLabel", { code })} />}
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("pubgame.lobby.code")}</span>
          <span className="font-mono text-3xl font-semibold tracking-[0.3em] text-parchment">{code}</span>
        </p>
        <Button variant="outline" onClick={share} fullWidth>
          {t("pubgame.lobby.share")}
        </Button>
        <p role="status" className={copied ? "text-sm text-gold" : "sr-only"}>
          {copied ? t("pubgame.lobby.copied") : ""}
        </p>
      </section>

      <ul className="flex flex-col gap-3">
        {teams.map((team) => {
          const players = view.players.filter((player) => player.teamId === team.id);
          return (
            <li key={team.id} className="rounded-sm border border-parchment/15 bg-umber/60 p-4">
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-display text-xl font-semibold text-parchment">{team.name}</span>
                <span className="text-sm text-parchment/70">{t.plural("pubgame.lobby.players", players.length)}</span>
              </p>
              {players.length === 0 ? (
                <p className="mt-1 text-sm italic text-parchment/60">{t("pubgame.lobby.emptyTeam")}</p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {players.map((player) => (
                    <li key={player.id} className="rounded-full bg-ink/50 px-3 py-1 text-sm">
                      {player.name}
                      {player.id === view.me.id && <span className="text-gold"> · {t("pubgame.lobby.you")}</span>}
                      {player.isHost && <span className="text-gold"> · {t("pubgame.lobby.host")}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </PlayScreen>
  );
}
