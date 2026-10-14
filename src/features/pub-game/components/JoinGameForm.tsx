"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { Lobby } from "../logic/api-types";
import { joinGameRequest } from "../client/api";
import { AdultsCheckbox } from "./AdultsCheckbox";
import { Beery } from "./Beery";
import { FormError } from "./FormError";
import { TextField } from "./TextField";

/**
 * Someone opened the join link on their own phone: name, team, 18+.
 * After joining, the server has set this phone's player cookie, and a refresh
 * makes the page show the game instead of this form.
 */
export function JoinGameForm({ code, lobby }: { code: string; lobby: Lobby }) {
  const t = useT();
  const router = useRouter();
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<string | null>(null);
  const [adults, setAdults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adults) return setError("adults-only");
    if (name.trim() === "") return setError("invalid-text");
    if (!teamId) return setError("no-team");

    setSending(true);
    setError(null);
    const result = await joinGameRequest(code, { name, teamId, adultsConfirmed: adults });
    if (result.ok) {
      router.refresh();
      return;
    }
    setError(result.error);
    setSending(false);
  }

  if (!lobby.joiningOpen) {
    return (
      <PlayScreen eyebrow={t("pubgame.join.eyebrow", { code })} title={t("pubgame.join.title")} screenId="pub-game-join">
        <Beery>
          <p>{lobby.phase === "finished" ? t("pubgame.join.finished") : t("pubgame.join.closed")}</p>
        </Beery>
      </PlayScreen>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PlayScreen
        eyebrow={t("pubgame.join.eyebrow", { code })}
        title={t("pubgame.join.title")}
        screenId="pub-game-join"
        actions={
          <>
            <FormError error={error} />
            <Button type="submit" disabled={sending} fullWidth>
              {sending ? t("pubgame.join.joining") : t("pubgame.join.submit")}
            </Button>
          </>
        }
      >
        <TextField label={t("pubgame.join.yourName")} value={name} onChange={setName} autoFocus />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
            {t("pubgame.join.chooseTeam")}
          </legend>
          {lobby.teams.map((team) => {
            const placesLeft = lobby.playersPerTeam - team.playerCount;
            const full = placesLeft <= 0;
            return (
              <button
                key={team.id}
                type="button"
                disabled={full}
                aria-pressed={teamId === team.id}
                onClick={() => setTeamId(team.id)}
                className={`flex min-h-14 items-center justify-between gap-3 rounded-sm border px-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-50 ${
                  teamId === team.id ? "border-gold bg-gold text-ink" : "border-gold/40 text-parchment hover:bg-gold/10"
                }`}
              >
                <span className="font-display text-xl font-semibold">{team.name}</span>
                <span className="text-sm">
                  {full ? t("pubgame.join.full") : t.plural("pubgame.join.placesLeft", placesLeft)}
                </span>
              </button>
            );
          })}
        </fieldset>

        <AdultsCheckbox checked={adults} onChange={setAdults} />
      </PlayScreen>
    </form>
  );
}
