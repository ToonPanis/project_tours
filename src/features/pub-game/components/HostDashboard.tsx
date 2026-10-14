"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import { createPlayerLinkRequest } from "../client/api";
import type { PubGameTexts } from "@/data/walks/hidden-pubs/game/content/types";
import { PubGameTextsProvider } from "../client/texts-context";
import { usePubGame } from "../client/usePubGame";
import type { PlayerView } from "../logic/player-view";
import { allTeams } from "../logic/view-helpers";
import { EvidenceReview } from "./EvidenceReview";
import { FormError } from "./FormError";
import { TextField } from "./TextField";

interface HostDashboardProps {
  code: string;
  initialView: PlayerView;
  initialVersion: number;
  /** Task titles for the evidence review, in the host's language. */
  texts: PubGameTexts;
}

/**
 * The organiser's overview (D33): every team's progress, evidence to review
 * (the review screen itself comes in stage 8), adding a late player, ending the game.
 * Shows only cafés completed, never where a team is (no positions are ever sent).
 */
export function HostDashboard({ texts, ...props }: HostDashboardProps) {
  return (
    <PubGameTextsProvider texts={texts}>
      <Dashboard {...props} />
    </PubGameTextsProvider>
  );
}

function Dashboard({ code, initialView, initialVersion }: Omit<HostDashboardProps, "texts">) {
  const t = useT();
  const game = usePubGame(code, initialView, initialVersion);
  const { view, act, busy } = game;
  const teams = allTeams(view);
  const pending = view.evidence.filter((item) => item.status === "pending").length;
  const totalCafes = view.team.route.length;

  const [newName, setNewName] = useState("");
  const [newTeamId, setNewTeamId] = useState(teams[0]?.id ?? "");
  const [added, setAdded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [link, setLink] = useState<{ name: string; url: string } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  async function makeLink(playerId: string, name: string) {
    const result = await createPlayerLinkRequest(code, playerId);
    setLinkCopied(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setLink({ name, url: `${window.location.origin}${result.data.path}` });
  }

  async function shareLink(url: string, name: string) {
    if (navigator.share) {
      try {
        await navigator.share({ title: t("pubgame.host.playerLinkFor", { name }), url });
        return;
      } catch {
        // Cancelled or not allowed: copy instead.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
    } catch {
      setLinkCopied(false);
    }
  }

  async function addPlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    const failure = await act({ type: "ADD_PLAYER", name, teamId: newTeamId });
    setError(failure);
    if (!failure) {
      setAdded(name);
      setNewName("");
    }
  }

  async function endGame() {
    setConfirmEnd(false);
    setError(await act({ type: "END_GAME" }));
  }

  return (
    <PlayScreen
      eyebrow={t("pubgame.host.eyebrow", { code })}
      title={t("pubgame.host.title")}
      screenId="pub-game-host"
      actions={
        <>
          <FormError error={error} />
          {view.phase !== "finished" && (
            <Button variant="danger" onClick={() => setConfirmEnd(true)} disabled={busy} fullWidth>
              {t("pubgame.host.endGame")}
            </Button>
          )}
          <Link href={`/games/${code}`} className="min-h-11 py-3 text-center text-gold underline-offset-4 hover:underline">
            {t("pubgame.menu.game")}
          </Link>
        </>
      }
    >
      <p role="status" className="rounded-sm border border-gold/40 bg-ink/30 p-4">
        {pending > 0 ? t.plural("pubgame.host.pendingEvidence", pending) : t("pubgame.host.noPendingEvidence")}
      </p>

      <EvidenceReview game={game} />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-parchment">{t("pubgame.host.teams")}</h2>
        <ul className="flex flex-col gap-3">
          {teams.map((team) => (
            <li key={team.id} className="rounded-sm border border-parchment/15 bg-umber/60 p-4">
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-display text-xl font-semibold">{team.name}</span>
                <span className="text-sm text-parchment/75">
                  {team.finishedAt
                    ? t("pubgame.host.teamFinished")
                    : t("pubgame.host.progress", { done: team.cafesCompleted, total: totalCafes })}
                </span>
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {view.players
                  .filter((player) => player.teamId === team.id)
                  .map((player) => (
                    <li key={player.id}>
                      {/* Tap a name for that player's personal link (late arrival, new phone). */}
                      <button
                        type="button"
                        onClick={() => makeLink(player.id, player.name)}
                        aria-label={t("pubgame.host.playerLinkFor", { name: player.name })}
                        className="min-h-11 rounded-full bg-ink/50 px-3 text-sm hover:bg-gold/20 focus-visible:outline-2 focus-visible:outline-gold"
                      >
                        {player.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {link && (
        <section className="flex flex-col gap-3 rounded-sm border border-gold/60 bg-ink/40 p-4">
          <h2 className="font-display text-2xl font-semibold text-parchment">
            {t("pubgame.host.playerLinkFor", { name: link.name })}
          </h2>
          <p className="text-sm text-parchment/80">{t("pubgame.host.playerLinkHelp", { name: link.name })}</p>
          <p className="break-all rounded-sm bg-ink/60 p-3 font-mono text-xs text-parchment/80">{link.url}</p>
          <Button variant="outline" onClick={() => shareLink(link.url, link.name)} fullWidth>
            {t("pubgame.host.shareLink")}
          </Button>
          <p role="status" className={linkCopied ? "text-sm text-gold" : "sr-only"}>
            {linkCopied ? t("pubgame.host.linkCopied") : ""}
          </p>
        </section>
      )}

      {view.phase !== "finished" && (
        <form onSubmit={addPlayer} className="flex flex-col gap-3 rounded-sm border border-parchment/15 p-4">
          <h2 className="font-display text-2xl font-semibold text-parchment">{t("pubgame.host.addPlayer")}</h2>
          <TextField label={t("pubgame.host.addPlayerName")} value={newName} onChange={setNewName} />
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("pubgame.host.addPlayerTeam")}</span>
            <select
              value={newTeamId}
              onChange={(event) => setNewTeamId(event.target.value)}
              className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus:outline-none"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="outline" disabled={busy || newName.trim() === ""} fullWidth>
            {t("pubgame.host.addPlayerSubmit")}
          </Button>
          <p role="status" className={added ? "text-sm text-gold" : "sr-only"}>
            {added ? t("pubgame.host.playerAdded", { name: added }) : ""}
          </p>
        </form>
      )}

      <ConfirmDialog
        open={confirmEnd}
        title={t("pubgame.host.endConfirmTitle")}
        message={t("pubgame.host.endConfirmText")}
        confirmLabel={t("pubgame.host.endConfirm")}
        isDestructive
        onConfirm={endGame}
        onCancel={() => setConfirmEnd(false)}
      />
    </PlayScreen>
  );
}
