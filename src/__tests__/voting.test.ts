import { describe, expect, test } from "vitest";
import {
  findLeadingOptionIds,
  haveAllPlayersVoted,
  pickRandomWinner,
  tallyVotes,
} from "@/features/walk-session/logic/voting";
import type { DrinkRound } from "@/types/drink";
import type { Team } from "@/types/team";

const round: DrinkRound = {
  options: [
    { id: "a", name: "A", category: "beer", alcoholic: true, menuVerification: "to-verify" },
    { id: "b", name: "B", category: "beer", alcoholic: true, menuVerification: "to-verify" },
    { id: "c", name: "C", category: "soft-drink", alcoholic: false, menuVerification: "to-verify" },
  ],
};

const team: Team = {
  id: "t",
  name: "Team",
  players: [
    { id: "tony", name: "Tony" },
    { id: "sarah", name: "Sarah" },
    { id: "tom", name: "Tom" },
    { id: "lisa", name: "Lisa" },
  ],
};

describe("voting", () => {
  test("tallies votes per option, including options with zero votes", () => {
    const tally = tallyVotes(round, [
      { playerId: "tony", drinkOptionId: "a" },
      { playerId: "sarah", drinkOptionId: "c" },
      { playerId: "tom", drinkOptionId: "a" },
      { playerId: "lisa", drinkOptionId: "b" },
    ]);
    expect(tally).toEqual([
      { drinkOptionId: "a", count: 2 },
      { drinkOptionId: "b", count: 1 },
      { drinkOptionId: "c", count: 1 },
    ]);
    expect(findLeadingOptionIds(tally)).toEqual(["a"]);
  });

  test("returns every tied option", () => {
    const tally = tallyVotes(round, [
      { playerId: "tony", drinkOptionId: "a" },
      { playerId: "sarah", drinkOptionId: "c" },
    ]);
    expect(findLeadingOptionIds(tally)).toEqual(["a", "c"]);
  });

  test("the alcohol-free option can win like any other", () => {
    const tally = tallyVotes(round, [
      { playerId: "tony", drinkOptionId: "c" },
      { playerId: "sarah", drinkOptionId: "c" },
      { playerId: "tom", drinkOptionId: "a" },
    ]);
    expect(findLeadingOptionIds(tally)).toEqual(["c"]);
  });

  test("knows when every player has voted", () => {
    const votes = [
      { playerId: "tony", drinkOptionId: "a" },
      { playerId: "sarah", drinkOptionId: "b" },
      { playerId: "tom", drinkOptionId: "c" },
    ];
    expect(haveAllPlayersVoted(team, votes)).toBe(false);
    expect(haveAllPlayersVoted(team, [...votes, { playerId: "lisa", drinkOptionId: "a" }])).toBe(true);
  });

  test("picks a tie winner using the given random function", () => {
    expect(pickRandomWinner(["a", "c"], () => 0)).toBe("a");
    expect(pickRandomWinner(["a", "c"], () => 0.99)).toBe("c");
  });
});
