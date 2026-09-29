"use client";

import { useT } from "@/i18n/client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { createId } from "@/lib/create-id";
import type { Team } from "@/types/team";
import type { TeamSize } from "@/types/walk";
import { PlayScreen } from "./PlayScreen";

interface TeamSetupProps {
  teamSize: TeamSize;
  onComplete: (team: Team) => void;
}

/** Two steps: pick the number of players, then enter their names. */
export function TeamSetup({ teamSize, onComplete }: TeamSetupProps) {
  const t = useT();
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [teamName, setTeamName] = useState("");

  const countOptions = Array.from(
    { length: teamSize.maxPlayers - teamSize.minPlayers + 1 },
    (_, index) => teamSize.minPlayers + index,
  );

  function choosePlayerCount(count: number) {
    setPlayerCount(count);
    setNames(Array.from({ length: count }, (_, index) => t("game.team.player", { number: index + 1 })));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const players = names.map((name, index) => ({
      id: `player-${index + 1}`,
      // An emptied field falls back to the default name.
      name: name.trim() || t("game.team.player", { number: index + 1 }),
    }));
    onComplete({ id: createId(), name: teamName.trim(), players });
  }

  if (playerCount === null) {
    return (
      <PlayScreen eyebrow={t("game.team.eyebrow")} title={t("game.team.howMany")}>
        <p>{t("game.team.onePhone")}</p>
        <div className="grid grid-cols-3 gap-3">
          {countOptions.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => choosePlayerCount(count)}
              className="flex aspect-square items-center justify-center rounded-sm border border-gold/50 font-display text-4xl font-semibold text-gold transition-colors hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-gold"
            >
              {count}
            </button>
          ))}
        </div>
      </PlayScreen>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PlayScreen
        eyebrow={t("game.team.eyebrow")}
        title={playerCount === 1 ? t("game.team.yourName") : t("game.team.whoIsPlaying")}
        actions={
          <>
            <Button type="submit" fullWidth>
              {t("game.team.startAdventure")}
            </Button>
            <Button variant="outline" onClick={() => setPlayerCount(null)} fullWidth>
              {t("common.back")}
            </Button>
          </>
        }
      >
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            {t("game.team.teamName")}
          </span>
          <input
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder={t("game.team.teamNamePlaceholder")}
            maxLength={30}
            autoComplete="off"
            className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment placeholder:text-parchment/35 focus:border-gold focus:outline-none"
          />
        </label>

        {names.map((name, index) => (
          <label key={index} className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              {t("game.team.player", { number: index + 1 })}
            </span>
            <input
              value={name}
              onChange={(event) =>
                setNames((current) =>
                  current.map((existing, i) => (i === index ? event.target.value : existing)),
                )
              }
              onFocus={(event) => event.target.select()}
              maxLength={20}
              autoComplete="off"
              className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus:outline-none"
            />
          </label>
        ))}
      </PlayScreen>
    </form>
  );
}
