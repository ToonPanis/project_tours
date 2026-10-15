"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import { createGameRequest } from "../client/api";
import { MAX_PLAYERS_PER_TEAM, MAX_TEAMS } from "../config";
import { AdultsCheckbox } from "./AdultsCheckbox";
import { Beery } from "./Beery";
import { FormError } from "./FormError";
import { NumberPicker } from "./NumberPicker";
import { TextField } from "./TextField";

/**
 * The organiser sets up a game: teams, team size, team names, their own name
 * and team. The server creates the game and puts the organiser's player cookie
 * on this phone; then we go to the game's own page (/games/CODE).
 * `ticketSeats` (P3): the persons on the organiser's ticket, shown as the game's places.
 */
export function CreateGameForm({ walkSlug, ticketSeats = null }: { walkSlug: string; ticketSeats?: number | null }) {
  const t = useT();
  const router = useRouter();
  const [teamCount, setTeamCount] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(4);
  // Empty = the default name ("Team 3"), so changing the number of teams never loses typed names.
  const [teamNames, setTeamNames] = useState<string[]>(Array(MAX_TEAMS).fill(""));
  const [hostName, setHostName] = useState("");
  const [hostTeamIndex, setHostTeamIndex] = useState(0);
  const [adults, setAdults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const nameOf = (index: number) => teamNames[index].trim() || t("pubgame.create.defaultTeamName", { number: index + 1 });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adults) {
      setError("adults-only");
      return;
    }
    setSending(true);
    setError(null);
    const result = await createGameRequest({
      walkSlug,
      teamNames: Array.from({ length: teamCount }, (_, index) => nameOf(index)),
      playersPerTeam,
      hostName,
      hostTeamIndex: Math.min(hostTeamIndex, teamCount - 1),
      adultsConfirmed: adults,
    });
    if (result.ok) {
      router.push(`/games/${result.data.code}`);
      return;
    }
    setError(result.status === 400 && hostName.trim() === "" ? "invalid-text" : result.error);
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PlayScreen
        eyebrow={t("pubgame.create.eyebrow")}
        title={t("pubgame.create.title")}
        screenId="pub-game-create"
        actions={
          <>
            <FormError error={error} />
            <Button type="submit" disabled={sending} fullWidth>
              {sending ? t("pubgame.create.creating") : t("pubgame.create.submit")}
            </Button>
          </>
        }
      >
        <Beery>
          <p className="text-sm">{t("pubgame.create.hostNote")}</p>
        </Beery>
        {ticketSeats !== null && (
          <p className="rounded-sm border border-gold/40 bg-ink/30 p-3 text-parchment">
            {t("pubgame.create.ticketSeats", { players: t.plural("commerce.persons", ticketSeats) })}
          </p>
        )}

        <NumberPicker
          label={t("pubgame.create.teamCount")}
          value={teamCount}
          min={1}
          max={MAX_TEAMS}
          onChange={setTeamCount}
        />
        <NumberPicker
          label={t("pubgame.create.playersPerTeam")}
          value={playersPerTeam}
          min={1}
          max={MAX_PLAYERS_PER_TEAM}
          onChange={setPlayersPerTeam}
        />

        {Array.from({ length: teamCount }, (_, index) => (
          <TextField
            key={index}
            label={t("pubgame.create.teamName", { number: index + 1 })}
            value={teamNames[index]}
            placeholder={t("pubgame.create.defaultTeamName", { number: index + 1 })}
            onChange={(value) => setTeamNames((current) => current.map((name, i) => (i === index ? value : name)))}
          />
        ))}

        <TextField label={t("pubgame.create.yourName")} value={hostName} onChange={setHostName} />

        {teamCount > 1 && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("pubgame.create.yourTeam")}</span>
            <select
              value={Math.min(hostTeamIndex, teamCount - 1)}
              onChange={(event) => setHostTeamIndex(Number(event.target.value))}
              className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus:outline-none"
            >
              {Array.from({ length: teamCount }, (_, index) => (
                <option key={index} value={index}>
                  {nameOf(index)}
                </option>
              ))}
            </select>
          </label>
        )}

        <AdultsCheckbox checked={adults} onChange={setAdults} />
      </PlayScreen>
    </form>
  );
}
