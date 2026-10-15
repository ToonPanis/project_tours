import type { PubGamePlayer, PubGameState, PubGameTeam } from "@/types/pub-game";
import { MAX_NAME_LENGTH, MAX_PLAYERS_PER_TEAM, MAX_TEAMS } from "../config";
import { buildDeck, deckCountFor } from "./cards";

export interface CreatePubGameInput {
  teams: { id: string; name: string }[];
  playersPerTeam: number;
  /** The organiser: host of the game and a player in one of the teams (D33). */
  host: { id: string; name: string; teamId: string };
}

/** Trims a name and checks its length. Null when it's empty or too long. */
export function cleanName(name: string): string | null {
  const trimmed = name.trim().replace(/\s+/g, " ");
  return trimmed.length >= 1 && trimmed.length <= MAX_NAME_LENGTH ? trimmed : null;
}

/**
 * A new game in the lobby. Throws on invalid settings: the server checks the
 * organiser's form before calling this, so an error here is a programming error.
 */
export function createPubGame(input: CreatePubGameInput): PubGameState {
  const { teams, playersPerTeam, host } = input;

  if (teams.length < 1 || teams.length > MAX_TEAMS) throw new Error(`1–${MAX_TEAMS} teams`);
  if (!Number.isInteger(playersPerTeam) || playersPerTeam < 1 || playersPerTeam > MAX_PLAYERS_PER_TEAM) {
    throw new Error(`1–${MAX_PLAYERS_PER_TEAM} players per team`);
  }
  const teamNames = teams.map((team) => cleanName(team.name));
  if (teamNames.some((name) => name === null)) throw new Error("Invalid team name");
  if (new Set(teams.map((team) => team.id)).size !== teams.length) throw new Error("Duplicate team id");

  const hostName = cleanName(host.name);
  if (!hostName) throw new Error("Invalid host name");
  if (!teams.some((team) => team.id === host.teamId)) throw new Error("Host team does not exist");

  const hostPlayer: PubGamePlayer = { id: host.id, name: hostName, teamId: host.teamId, isHost: true };

  return {
    phase: "lobby",
    // A single team plays for individual points (D25).
    scoringMode: teams.length === 1 ? "player" : "team",
    playersPerTeam,
    teams: teams.map((team, index): PubGameTeam => ({
      id: team.id,
      name: teamNames[index] as string,
      route: [],
      cafeIndex: 0,
      step: "travelling",
      deck: buildDeck(deckCountFor(1)),
      drewThisCafe: [],
      offer: null,
      currentCard: null,
      roles: { questionBitch: null, thumbKing: null, beunaas: null },
      rules: [],
      doneTaskIds: [],
      finishedAt: null,
    })),
    players: [hostPlayer],
    buddies: [],
    answers: {},
    evidence: [],
    firstCardDrawn: false,
    startedAt: null,
    finishedAt: null,
  };
}
