import { describe, expect, test } from "vitest";
import { applyPubGameAction, currentDrawer, teamPlayers } from "@/features/pub-game/logic/apply-action";
import { cardId, parseCard } from "@/features/pub-game/logic/cards";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView } from "@/features/pub-game/logic/player-view";
import { computeScores } from "@/features/pub-game/logic/scoring";
import { MAX_RULES } from "@/features/pub-game/config";
import type { PubGameAction, PubGameEvent, PubGameState, Rank, Sip } from "@/types/pub-game";
import { straightRoute, testAnswerKey, testDefinition } from "./fixtures/pub-game-definition";

const AT = "2026-10-14T18:00:00.000Z";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Applies an action that must succeed; returns the new state and its events. */
function act(state: PubGameState, actorId: string, action: PubGameAction) {
  const result = applyPubGameAction(testDefinition, testAnswerKey, state, actorId, action);
  if (!result.ok) throw new Error(`${action.type} by ${actorId} failed: ${result.error}`);
  return result;
}

/** Applies an action that must fail; returns the error. */
function refused(state: PubGameState, actorId: string, action: PubGameAction) {
  const result = applyPubGameAction(testDefinition, testAnswerKey, state, actorId, action);
  if (result.ok) throw new Error(`${action.type} by ${actorId} should have been refused`);
  return result.error;
}

/**
 * A started game. `teams` gives the player ids per team; the first player of
 * the first team is the host. Every team gets the route in definition order.
 */
function startedGame(teams: string[][], playersPerTeam = 10): PubGameState {
  let state = createPubGame({
    teams: teams.map((_, index) => ({ id: `t${index + 1}`, name: `Team ${index + 1}` })),
    playersPerTeam,
    host: { id: teams[0][0], name: teams[0][0], teamId: "t1" },
  });
  teams.forEach((players, index) => {
    for (const playerId of players) {
      if (playerId === teams[0][0]) continue;
      state = act(state, playerId, { type: "JOIN", playerId, name: playerId, teamId: `t${index + 1}` }).state;
    }
  });
  const routes = Object.fromEntries(teams.map((_, index) => [`t${index + 1}`, straightRoute]));
  return act(state, teams[0][0], { type: "START_GAME", routes, at: AT }).state;
}

function team(state: PubGameState, teamId: string) {
  const found = state.teams.find((candidate) => candidate.id === teamId);
  if (!found) throw new Error(`No team ${teamId}`);
  return found;
}

/** Arrive and finish the drinks: the team is at the card step. */
function toCards(state: PubGameState, actorId: string): PubGameState {
  state = act(state, actorId, { type: "ARRIVE" }).state;
  return act(state, actorId, { type: "DRINKS_DONE" }).state;
}

/**
 * The player whose turn it is draws a card of `rank` (the first one of that
 * rank still in the draw pile): the server offers it among 10 cards, the
 * player taps it.
 */
function draw(state: PubGameState, teamId: string, rank: Rank) {
  const deck = team(state, teamId).deck.drawPile;
  const wanted = deck.find((id) => parseCard(id).rank === rank);
  if (!wanted) throw new Error(`No ${rank} left`);
  const others = deck.filter((id) => id !== wanted).slice(0, Math.min(10, deck.length) - 1);
  const drawer = currentDrawer(state, team(state, teamId));
  if (!drawer) throw new Error("Nobody's turn");

  state = act(state, drawer.id, { type: "OFFER_CARDS", cardIds: [...others, wanted] }).state;
  return act(state, drawer.id, { type: "PICK_CARD", index: others.length });
}

function sipsOf(events: PubGameEvent[]): Sip[] {
  return events.flatMap((event) => (event.type === "drink" ? event.sips : []));
}

/** Cards that ask nothing from the player (or only an optional "who lost?"). */
const SIMPLE_RANKS: Rank[] = ["5", "6", "3", "Q", "K", "A", "4", "7", "9", "10"];

/** Everyone in the team draws a simple card, so the team reaches the pubtask. */
function drawHarmless(state: PubGameState, teamId: string): PubGameState {
  while (team(state, teamId).step === "cards") {
    const pile = team(state, teamId).deck.drawPile;
    const rank = SIMPLE_RANKS.find((candidate) => pile.some((id) => parseCard(id).rank === candidate));
    if (!rank) throw new Error("No simple card left");
    state = draw(state, teamId, rank).state;
    const current = team(state, teamId).currentCard;
    if (current?.followUp === "report-loser") {
      state = act(state, current.playerId, { type: "REPORT_LOSER", playerId: null }).state;
    }
  }
  return state;
}

/** Lets the same team draw again at the same café (for tests that need many draws). */
function drawAgain(state: PubGameState, teamId: string): PubGameState {
  team(state, teamId).step = "cards";
  team(state, teamId).drewThisCafe = [];
  return state;
}

// ─── Setting up ─────────────────────────────────────────────────────────────

describe("creating and joining a game", () => {
  test("a single team plays for individual points, several teams for team points", () => {
    expect(startedGame([["host"]]).scoringMode).toBe("player");
    expect(startedGame([["host"], ["b"]]).scoringMode).toBe("team");
  });

  test.each([
    ["no teams", { teams: [], playersPerTeam: 2 }],
    ["11 teams", { teams: Array.from({ length: 11 }, (_, i) => ({ id: `t${i}`, name: `T${i}` })), playersPerTeam: 2 }],
    ["0 players per team", { teams: [{ id: "t1", name: "A" }], playersPerTeam: 0 }],
    ["11 players per team", { teams: [{ id: "t1", name: "A" }], playersPerTeam: 11 }],
    ["an empty team name", { teams: [{ id: "t1", name: "   " }], playersPerTeam: 2 }],
  ])("refuses %s", (_name, settings) => {
    expect(() => createPubGame({ ...settings, host: { id: "h", name: "Host", teamId: "t1" } })).toThrow();
  });

  test("10 teams of 10 players can join; an 11th player in a team is refused", () => {
    const teams = Array.from({ length: 10 }, (_, t) => Array.from({ length: 10 }, (_, p) => `p${t}-${p}`));
    const state = startedGame(teams);
    expect(state.players).toHaveLength(100);
    expect(refused(state, "late", { type: "JOIN", playerId: "late", name: "Late", teamId: "t1" })).toBe("team-full");
  });

  test("names must be unique in the game (ignoring case) and not empty", () => {
    const state = createPubGame({
      teams: [{ id: "t1", name: "A" }, { id: "t2", name: "B" }],
      playersPerTeam: 4,
      host: { id: "h", name: "Toon", teamId: "t1" },
    });
    expect(refused(state, "x", { type: "JOIN", playerId: "x", name: " toon ", teamId: "t2" })).toBe("name-taken");
    expect(refused(state, "x", { type: "JOIN", playerId: "x", name: "  ", teamId: "t2" })).toBe("invalid-text");
    expect(refused(state, "x", { type: "JOIN", playerId: "x", name: "Ann", teamId: "t9" })).toBe("unknown-team");
    // A player can only join as themselves.
    expect(refused(state, "y", { type: "JOIN", playerId: "x", name: "Ann", teamId: "t2" })).toBe("not-a-player");
  });

  test("joining is open until the first card is drawn; after that only the host can add someone", () => {
    let state = startedGame([["h", "b"], ["c"]]);
    state = act(state, "late", { type: "JOIN", playerId: "late", name: "Late", teamId: "t2" }).state;

    state = toCards(state, "h");
    state = draw(state, "t1", "5").state;
    expect(refused(state, "later", { type: "JOIN", playerId: "later", name: "Later", teamId: "t2" })).toBe(
      "joining-closed",
    );
    expect(refused(state, "c", { type: "ADD_PLAYER", playerId: "later", name: "Later", teamId: "t2" })).toBe("not-host");
    state = act(state, "h", { type: "ADD_PLAYER", playerId: "later", name: "Later", teamId: "t2" }).state;
    expect(teamPlayers(state, "t2").map((player) => player.id)).toEqual(["c", "late", "later"]);
  });

  test("only the host starts, every team needs a player, every route must follow the rules", () => {
    let state = createPubGame({
      teams: [{ id: "t1", name: "A" }, { id: "t2", name: "B" }],
      playersPerTeam: 4,
      host: { id: "h", name: "Host", teamId: "t1" },
    });
    const routes = { t1: straightRoute, t2: straightRoute };
    expect(refused(state, "h", { type: "START_GAME", routes, at: AT })).toBe("empty-team");

    state = act(state, "b", { type: "JOIN", playerId: "b", name: "B", teamId: "t2" }).state;
    expect(refused(state, "b", { type: "START_GAME", routes, at: AT })).toBe("not-host");
    const broken = { t1: straightRoute, t2: [...straightRoute].reverse() };
    expect(refused(state, "h", { type: "START_GAME", routes: broken, at: AT })).toBe("invalid-route");

    state = act(state, "h", { type: "START_GAME", routes, at: AT }).state;
    expect(state.phase).toBe("playing");
    expect(refused(state, "h", { type: "START_GAME", routes, at: AT })).toBe("game-already-started");
  });

  test("a team of 5 or more plays with 2 decks, a smaller team with 1", () => {
    const state = startedGame([["h", "a", "b", "c", "d"], ["e", "f", "g", "i"]]);
    expect(team(state, "t1").deck.drawPile).toHaveLength(104);
    expect(team(state, "t2").deck.drawPile).toHaveLength(52);
  });

  test("the logic never changes the state it's given", () => {
    const state = startedGame([["h", "b"], ["c"]]);
    const before = JSON.stringify(state);
    act(state, "h", { type: "ARRIVE" });
    refused(state, "h", { type: "DRINKS_DONE" });
    expect(JSON.stringify(state)).toBe(before);
  });
});

// ─── The café steps ─────────────────────────────────────────────────────────

describe("café steps", () => {
  test("arrival → drinks → cards → pubtask → fun fact → next café", () => {
    let state = startedGame([["h", "b"], ["c"]]);
    expect(team(state, "t1").step).toBe("travelling");
    expect(refused(state, "h", { type: "DRINKS_DONE" })).toBe("wrong-step");

    state = toCards(state, "b");
    expect(team(state, "t1").step).toBe("cards");
    // The other team is still travelling.
    expect(team(state, "t2").step).toBe("travelling");

    state = drawHarmless(state, "t1");
    expect(team(state, "t1").step).toBe("pubtask");

    state = act(state, "h", { type: "ANSWER", questionId: "q1", optionId: testAnswerKey.q1 }).state;
    expect(team(state, "t1").step).toBe("fun-fact");

    const result = act(state, "b", { type: "CONTINUE", at: AT });
    expect(team(result.state, "t1")).toMatchObject({ cafeIndex: 1, step: "travelling", drewThisCafe: [], currentCard: null });
    expect(result.events).toContainEqual({ type: "next-cafe", teamId: "t1", cafeId: straightRoute[1] });
  });

  test("players draw in joining order; the first player moves one place each café", () => {
    let state = startedGame([["h", "b", "c"], ["d"]]);
    state = toCards(state, "h");
    const order: string[] = [];
    while (team(state, "t1").step === "cards") {
      order.push(currentDrawer(state, team(state, "t1"))!.id);
      state = draw(state, "t1", "5").state;
    }
    expect(order).toEqual(["h", "b", "c"]);

    state = act(state, "h", { type: "ANSWER", questionId: "q1", optionId: testAnswerKey.q1 }).state;
    state = toCards(act(state, "h", { type: "CONTINUE", at: AT }).state, "h");
    expect(currentDrawer(state, team(state, "t1"))!.id).toBe("b");
  });

  test("a drawn card leaves the deck; offers must come from the draw pile", () => {
    let state = toCards(startedGame([["h", "b"], ["c"]]), "h");
    const { state: after, events } = draw(state, "t1", "5");
    const drawn = events.find((event) => event.type === "card-drawn");
    if (drawn?.type !== "card-drawn") throw new Error("no card drawn");
    expect(team(after, "t1").deck.drawPile).not.toContain(drawn.cardId);
    expect(team(after, "t1").deck.drawn).toEqual([drawn.cardId]);
    expect(team(after, "t1").deck.drawPile).toHaveLength(51);

    state = after;
    const pile = team(state, "t1").deck.drawPile;
    expect(refused(state, "b", { type: "OFFER_CARDS", cardIds: pile.slice(0, 9) })).toBe("invalid-offer");
    expect(refused(state, "b", { type: "OFFER_CARDS", cardIds: [drawn.cardId, ...pile.slice(0, 9)] })).toBe(
      "invalid-offer",
    );
    expect(refused(state, "b", { type: "OFFER_CARDS", cardIds: [pile[0], ...pile.slice(0, 9)] })).toBe(
      "invalid-offer",
    );
    expect(refused(state, "b", { type: "PICK_CARD", index: 0 })).toBe("no-offer");

    state = act(state, "b", { type: "OFFER_CARDS", cardIds: pile.slice(0, 10) }).state;
    expect(refused(state, "b", { type: "OFFER_CARDS", cardIds: pile.slice(0, 10) })).toBe("card-pending");
    expect(refused(state, "b", { type: "PICK_CARD", index: 10 })).toBe("invalid-offer");
  });

  test("the drawn cards are shuffled back in when fewer than 10 are left", () => {
    let state = toCards(startedGame([["h"]]), "h");
    // Leave exactly 10 cards in the pile, then draw one.
    const t1 = team(state, "t1");
    t1.deck = { drawPile: t1.deck.drawPile.slice(0, 10), drawn: t1.deck.drawPile.slice(10) };
    state = draw(state, "t1", parseCard(t1.deck.drawPile[0]).rank).state;
    expect(team(state, "t1").deck.drawPile).toHaveLength(52);
    expect(team(state, "t1").deck.drawn).toEqual([]);
  });

  test("a café without questions or tasks goes straight to the fun fact after the cards", () => {
    let state = startedGame([["h"]]);
    const t1 = team(state, "t1");
    t1.cafeIndex = straightRoute.indexOf("cafe-6");
    state = drawHarmless(toCards(state, "h"), "t1");
    expect(team(state, "t1").step).toBe("fun-fact");
  });

  test("players of another team can't act for this team", () => {
    let state = toCards(startedGame([["h", "b"], ["c"]]), "h");
    state = draw(state, "t1", "5").state;
    // c's own team is still travelling.
    expect(refused(state, "c", { type: "PICK_CARD", index: 0 })).toBe("wrong-step");
    expect(refused(state, "stranger", { type: "ARRIVE" })).toBe("not-a-player");
  });
});

// ─── Drunken Bastard: the 13 cards ──────────────────────────────────────────

describe("the 13 cards", () => {
  function atCards(teams: string[][] = [["h", "b", "c"], ["d", "e"]]) {
    return toCards(startedGame(teams), teams[0][0]);
  }

  test("2: the player hands a sip to someone in the team", () => {
    const { state } = draw(atCards(), "t1", "2");
    expect(team(state, "t1").currentCard?.followUp).toBe("choose-target");
    // Not yourself, not another team.
    expect(refused(state, "h", { type: "GIVE_SIP", targetId: "h" })).toBe("invalid-target");
    expect(refused(state, "h", { type: "GIVE_SIP", targetId: "d" })).toBe("invalid-target");
    // The next player can't draw before the sip is handed out.
    const pile = team(state, "t1").deck.drawPile.slice(0, 10);
    expect(refused(state, "b", { type: "OFFER_CARDS", cardIds: pile })).toBe("card-pending");

    const result = act(state, "h", { type: "GIVE_SIP", targetId: "c" });
    expect(sipsOf(result.events)).toEqual([{ playerId: "c", sips: 1, because: "card" }]);
    expect(team(result.state, "t1").currentCard?.followUp).toBeNull();
  });

  test("2 in a team of one: nobody to hand a sip to", () => {
    const { state } = draw(atCards([["h"], ["d"]]), "t1", "2");
    expect(team(state, "t1").currentCard?.followUp).toBeNull();
  });

  test("3: the player drinks", () => {
    const { events } = draw(atCards(), "t1", "3");
    expect(sipsOf(events)).toEqual([{ playerId: "h", sips: 1, because: "card" }]);
  });

  test.each(["4", "7", "9", "10"] as Rank[])("%s: optionally report who lost", (rank) => {
    const { state } = draw(atCards(), "t1", rank);
    expect(team(state, "t1").currentCard?.followUp).toBe("report-loser");
    expect(refused(state, "h", { type: "REPORT_LOSER", playerId: "d" })).toBe("invalid-target");

    const reported = act(state, "b", { type: "REPORT_LOSER", playerId: "c" });
    expect(sipsOf(reported.events)).toEqual([{ playerId: "c", sips: 1, because: "card" }]);

    const skipped = act(state, "b", { type: "REPORT_LOSER", playerId: null });
    expect(sipsOf(skipped.events)).toEqual([]);
    expect(team(skipped.state, "t1").currentCard?.followUp).toBeNull();
  });

  test.each(["5", "6"] as Rank[])("%s: only an instruction, nothing to choose", (rank) => {
    const { state, events } = draw(atCards(), "t1", rank);
    expect(team(state, "t1").currentCard).toMatchObject({ playerId: "h", followUp: null });
    expect(sipsOf(events)).toEqual([]);
  });

  test("8: a buddy from another team; everyone gets the news", () => {
    let { state } = draw(atCards(), "t1", "8");
    expect(team(state, "t1").currentCard?.followUp).toBe("choose-buddy");
    expect(refused(state, "h", { type: "CHOOSE_BUDDY", buddyId: "h" })).toBe("invalid-target");

    const linked = act(state, "h", { type: "CHOOSE_BUDDY", buddyId: "d" });
    expect(linked.events).toContainEqual({ type: "buddies-linked", playerIds: ["h", "d"], endedPairs: [] });
    state = linked.state;
    expect(state.buddies).toEqual([["h", "d"]]);

    // When h drinks, d drinks along (and the other way round).
    const sip = act(state, "b", { type: "REPORT_DRINK", playerId: "h" });
    expect(sipsOf(sip.events)).toEqual([
      { playerId: "h", sips: 1, because: "card" },
      { playerId: "d", sips: 1, because: "buddy" },
    ]);
  });

  test("8: one buddy each; a new 8 replaces the old links, and buddies never chain", () => {
    let state = atCards();
    state = act(draw(state, "t1", "8").state, "h", { type: "CHOOSE_BUDDY", buddyId: "d" }).state;
    // b draws an 8 and picks h: the h–d link ends.
    const relinked = act(draw(state, "t1", "8").state, "b", { type: "CHOOSE_BUDDY", buddyId: "h" });
    expect(relinked.events).toContainEqual({ type: "buddies-linked", playerIds: ["b", "h"], endedPairs: [["h", "d"]] });
    state = relinked.state;
    expect(state.buddies).toEqual([["b", "h"]]);

    // c picks d: b–h and c–d are separate pairs. When h drinks, only b drinks along.
    state = act(draw(state, "t1", "8").state, "c", { type: "CHOOSE_BUDDY", buddyId: "d" }).state;
    expect(state.buddies).toEqual([
      ["b", "h"],
      ["c", "d"],
    ]);
    const sip = act(state, "h", { type: "REPORT_DRINK", playerId: "h" });
    expect(sipsOf(sip.events).map((item) => item.playerId)).toEqual(["h", "b"]);
  });

  test("J: rules stay; the 5th rule pushes out the oldest", () => {
    // Five players: two decks, so there are enough jacks for a 5th rule.
    let state = atCards([["h", "b", "c", "e", "f"], ["d"]]);
    const ruleTexts: string[] = [];
    for (let index = 1; index <= MAX_RULES + 1; index++) {
      state = draw(state, "t1", "J").state;
      expect(refused(state, "h", { type: "WRITE_RULE", ruleId: `r${index}`, text: "   " })).toBe("invalid-text");
      const text = `Rule number ${index}`;
      ruleTexts.push(text);
      const result = act(state, "h", { type: "WRITE_RULE", ruleId: `r${index}`, text });
      if (index > MAX_RULES) {
        expect(result.events).toContainEqual(expect.objectContaining({ type: "rule-added", droppedRuleId: "r1" }));
      }
      state = result.state;
    }
    expect(team(state, "t1").rules.map((rule) => rule.text)).toEqual(ruleTexts.slice(1));
    expect(team(state, "t2").rules).toEqual([]);
  });

  test.each([
    ["Q", "questionBitch"],
    ["K", "thumbKing"],
    ["A", "beunaas"],
  ] as const)("%s: the power goes to the player and moves on with the next %s", (rank, role) => {
    let state = atCards();
    const first = draw(state, "t1", rank);
    expect(team(first.state, "t1").roles[role]).toBe("h");
    expect(first.events).toContainEqual({ type: "role-changed", teamId: "t1", role, playerId: "h", previousPlayerId: null });

    state = draw(first.state, "t1", rank).state;
    expect(team(state, "t1").roles[role]).toBe("b");
    // Powers are per team (D12).
    expect(team(state, "t2").roles[role]).toBeNull();
  });

  test("A: the Beunaas drinks double, and so does their buddy", () => {
    let state = atCards();
    state = act(draw(state, "t1", "8").state, "h", { type: "CHOOSE_BUDDY", buddyId: "d" }).state;
    state = draw(state, "t1", "A").state; // b is the Beunaas
    state = draw(state, "t1", "8").state; // c picks b
    state = act(state, "c", { type: "CHOOSE_BUDDY", buddyId: "b" }).state;

    const sip = act(state, "h", { type: "REPORT_DRINK", playerId: "b" });
    expect(sipsOf(sip.events)).toEqual([
      { playerId: "b", sips: 2, because: "card" },
      { playerId: "c", sips: 2, because: "buddy" },
    ]);
    // The buddy of a Beunaas who drinks for themselves: the buddy's own sip counts double.
    const buddyDrinks = act(state, "h", { type: "REPORT_DRINK", playerId: "c" });
    expect(sipsOf(buddyDrinks.events)).toEqual([
      { playerId: "c", sips: 1, because: "card" },
      { playerId: "b", sips: 2, because: "buddy" },
    ]);
  });

  test("3 drawn by the Beunaas: 2 sips", () => {
    let state = atCards([["h"], ["d"]]);
    state = drawAgain(draw(state, "t1", "A").state, "t1");
    expect(sipsOf(draw(state, "t1", "3").events)).toEqual([{ playerId: "h", sips: 2, because: "card" }]);
  });

  test("REPORT_DRINK only for players of your own team", () => {
    const state = atCards();
    expect(refused(state, "h", { type: "REPORT_DRINK", playerId: "d" })).toBe("invalid-target");
  });
});

// ─── Pubtasks and scoring ───────────────────────────────────────────────────

describe("pubtasks", () => {
  function atPubtask(cafeId: string, teams: string[][] = [["h", "b"], ["c"]]) {
    let state = startedGame(teams);
    team(state, "t1").cafeIndex = straightRoute.indexOf(cafeId);
    state = drawHarmless(toCards(state, teams[0][0]), "t1");
    expect(team(state, "t1").step).toBe("pubtask");
    return state;
  }

  test.each([
    [0, 100],
    [1, 80],
    [2, 60],
  ])("correct after %i wrong answers: %i points", (wrong, points) => {
    let state = atPubtask("cafe-2");
    const wrongOptions = ["a", "b", "c"].slice(0, wrong);
    for (const optionId of wrongOptions) state = act(state, "h", { type: "ANSWER", questionId: "q2", optionId }).state;
    const result = act(state, "b", { type: "ANSWER", questionId: "q2", optionId: testAnswerKey.q2 });
    expect(result.state.answers.t1.q2).toMatchObject({ status: "correct", points, correctOptionId: "d" });
    expect(computeScores(testDefinition, result.state).find((score) => score.scorerId === "t1")?.total).toBe(points);
  });

  test("3 wrong answers: the answer is shown, 0 points", () => {
    let state = atPubtask("cafe-2");
    for (const optionId of ["a", "b"]) state = act(state, "h", { type: "ANSWER", questionId: "q2", optionId }).state;
    // Before the reveal, the correct option is not in the state.
    expect(state.answers.t1.q2.correctOptionId).toBeNull();
    const result = act(state, "h", { type: "ANSWER", questionId: "q2", optionId: "c" });
    expect(result.state.answers.t1.q2).toMatchObject({ status: "revealed", points: 0, correctOptionId: "d" });
    expect(team(result.state, "t1").step).toBe("fun-fact");
  });

  test("with 3 options the 3rd attempt is the last option left and earns 60 (D19)", () => {
    let state = atPubtask("cafe-1");
    for (const optionId of ["a", "c"]) state = act(state, "h", { type: "ANSWER", questionId: "q1", optionId }).state;
    state = act(state, "h", { type: "ANSWER", questionId: "q1", optionId: "b" }).state;
    expect(state.answers.t1.q1.points).toBe(60);
  });

  test("no double points: a finished question and a wrong option can't be answered again", () => {
    let state = atPubtask("cafe-2");
    state = act(state, "h", { type: "ANSWER", questionId: "q2", optionId: "a" }).state;
    expect(refused(state, "b", { type: "ANSWER", questionId: "q2", optionId: "a" })).toBe("invalid-option");
    expect(refused(state, "b", { type: "ANSWER", questionId: "q2", optionId: "z" })).toBe("invalid-option");
    expect(refused(state, "b", { type: "ANSWER", questionId: "q1", optionId: "a" })).toBe("unknown-question");
    state = act(state, "h", { type: "ANSWER", questionId: "q2", optionId: "d" }).state;
    expect(refused(state, "b", { type: "ANSWER", questionId: "q2", optionId: "d" })).toBe("wrong-step");
  });

  test("two questions: scored separately, the café ends after both", () => {
    let state = atPubtask("cafe-3");
    state = act(state, "h", { type: "ANSWER", questionId: "q3a", optionId: testAnswerKey.q3a }).state;
    expect(team(state, "t1").step).toBe("pubtask");
    state = act(state, "b", { type: "ANSWER", questionId: "q3b", optionId: "a" }).state;
    state = act(state, "b", { type: "ANSWER", questionId: "q3b", optionId: testAnswerKey.q3b }).state;
    expect(team(state, "t1").step).toBe("fun-fact");
    expect(computeScores(testDefinition, state).find((score) => score.scorerId === "t1")?.total).toBe(180);
  });

  test("single team: every player answers alone; the café ends when everyone has", () => {
    let state = atPubtask("cafe-1", [["h", "b"]]);
    state = act(state, "h", { type: "ANSWER", questionId: "q1", optionId: testAnswerKey.q1 }).state;
    expect(team(state, "t1").step).toBe("pubtask");
    state = act(state, "b", { type: "ANSWER", questionId: "q1", optionId: "a" }).state;
    state = act(state, "b", { type: "ANSWER", questionId: "q1", optionId: testAnswerKey.q1 }).state;
    expect(team(state, "t1").step).toBe("fun-fact");

    const scores = computeScores(testDefinition, state);
    expect(scores.map((score) => [score.scorerId, score.total])).toEqual([
      ["h", 100],
      ["b", 80],
    ]);
  });

  test("hints, answers and other teams' routes never reach another phone", () => {
    let state = atPubtask("cafe-2");
    state = act(state, "h", { type: "ANSWER", questionId: "q2", optionId: "a" }).state;
    const otherTeam = toPlayerView(testDefinition, state, "c");
    expect(otherTeam.answers).toEqual({});
    expect(JSON.stringify(otherTeam.otherTeams)).not.toContain("cafe-");

    const ownTeam = toPlayerView(testDefinition, state, "b");
    expect(ownTeam.answers.q2).toMatchObject({ wrongOptionIds: ["a"], correctOptionId: null });
  });
});

// ─── Photo and video tasks ──────────────────────────────────────────────────

describe("evidence", () => {
  function atCafe5(teams: string[][] = [["h", "b", "c"], ["d"]]) {
    const state = startedGame(teams);
    team(state, "t1").cafeIndex = straightRoute.indexOf("cafe-5");
    return drawHarmless(toCards(state, teams[0][0]), "t1");
  }

  const submit = (taskId: string, submissionId: string, participantIds: string[]): PubGameAction => ({
    type: "SUBMIT_EVIDENCE",
    submissionId,
    taskId,
    mediaId: `media-${submissionId}`,
    participantIds,
    at: AT,
  });

  test("a pubtask photo task is part of the pubtask; the bonus comes after", () => {
    let state = atCafe5();
    expect(refused(state, "b", submit("bonus-5", "s0", ["b"]))).toBe("wrong-step");
    state = act(state, "h", { type: "ANSWER", questionId: "q5", optionId: testAnswerKey.q5 }).state;
    expect(team(state, "t1").step).toBe("pubtask");
    state = act(state, "b", submit("photo-5", "s1", ["b"])).state;
    expect(team(state, "t1").step).toBe("bonus");
    expect(refused(state, "b", submit("photo-5", "s2", ["b"]))).toBe("task-done");
  });

  test("points only after the host approves; rejected evidence can be sent again", () => {
    let state = atCafe5();
    state = act(state, "h", { type: "ANSWER", questionId: "q5", optionId: testAnswerKey.q5 }).state;
    state = act(state, "b", submit("photo-5", "s1", ["b"])).state;
    const t1Score = (current: PubGameState) =>
      computeScores(testDefinition, current).find((score) => score.scorerId === "t1")!.bonusPoints;
    expect(t1Score(state)).toBe(0);

    expect(refused(state, "b", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: true })).toBe("not-host");
    state = act(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: false, reason: "Blurry" }).state;
    expect(state.evidence[0]).toMatchObject({ status: "rejected", rejectionReason: "Blurry" });
    expect(refused(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: true })).toBe("already-reviewed");

    // Later, in the bonus step, the team sends a better photo.
    state = act(state, "c", submit("photo-5", "s2", ["c"])).state;
    state = act(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s2", approve: true }).state;
    expect(t1Score(state)).toBe(100);
  });

  test("per-player bonus: points for every player who took part (Barok)", () => {
    let state = startedGame([["h", "b", "c"], ["d"]]);
    team(state, "t1").cafeIndex = straightRoute.indexOf("cafe-4");
    state = drawHarmless(toCards(state, "h"), "t1");
    state = act(state, "h", { type: "ANSWER", questionId: "q4", optionId: testAnswerKey.q4 }).state;
    expect(team(state, "t1").step).toBe("bonus");

    expect(refused(state, "h", submit("bonus-4", "s1", []))).toBe("invalid-target");
    expect(refused(state, "h", submit("bonus-4", "s1", ["h", "d"]))).toBe("invalid-target");
    state = act(state, "h", submit("bonus-4", "s1", ["h", "b", "c", "c"])).state;
    expect(team(state, "t1").step).toBe("fun-fact");
    state = act(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: true }).state;
    expect(computeScores(testDefinition, state).find((score) => score.scorerId === "t1")).toMatchObject({
      questionPoints: 100,
      bonusPoints: 300,
      total: 400,
    });
  });

  test("bonus tasks are optional: continue skips them", () => {
    let state = atCafe5();
    state = act(state, "h", { type: "ANSWER", questionId: "q5", optionId: testAnswerKey.q5 }).state;
    state = act(state, "h", { type: "SKIP_TASK", taskId: "photo-5" }).state;
    expect(team(state, "t1").step).toBe("bonus");
    state = act(state, "h", { type: "CONTINUE", at: AT }).state;
    expect(team(state, "t1").step).toBe("fun-fact");
    expect(refused(state, "h", submit("bonus-5", "s1", ["h"]))).toBe("task-done");
  });

  test("single team: bonus points go to the players who took part", () => {
    let state = startedGame([["h", "b", "c"]]);
    team(state, "t1").cafeIndex = straightRoute.indexOf("cafe-4");
    state = drawHarmless(toCards(state, "h"), "t1");
    for (const player of ["h", "b", "c"]) {
      state = act(state, player, { type: "ANSWER", questionId: "q4", optionId: testAnswerKey.q4 }).state;
    }
    state = act(state, "h", submit("bonus-4", "s1", ["h", "b"])).state;
    state = act(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: true }).state;
    expect(computeScores(testDefinition, state).map((score) => [score.scorerId, score.bonusPoints])).toEqual([
      ["h", 100],
      ["b", 100],
      ["c", 0],
    ]);
  });

  test("other teams only see evidence once the game is over; the host always", () => {
    let state = atCafe5();
    state = act(state, "h", { type: "ANSWER", questionId: "q5", optionId: testAnswerKey.q5 }).state;
    state = act(state, "b", submit("photo-5", "s1", ["b"])).state;
    expect(toPlayerView(testDefinition, state, "d").evidence).toEqual([]);
    expect(toPlayerView(testDefinition, state, "h").evidence).toHaveLength(1);

    state = act(state, "h", { type: "END_GAME", at: AT }).state;
    expect(toPlayerView(testDefinition, state, "d").evidence).toHaveLength(1);
    // Evidence can still be reviewed after the end.
    state = act(state, "h", { type: "REVIEW_EVIDENCE", submissionId: "s1", approve: true }).state;
    expect(state.evidence[0].status).toBe("approved");
  });
});

// ─── A whole game ───────────────────────────────────────────────────────────

describe("a whole game", () => {
  /** Plays every café: everyone draws a 5, answers right first time, skips the tasks. */
  function playAllCafes(state: PubGameState, teamId: string, players: string[]): PubGameState {
    for (let index = 0; index < straightRoute.length; index++) {
      state = drawHarmless(toCards(state, players[0]), teamId);
      const cafe = testDefinition.cafes.find((candidate) => candidate.id === straightRoute[index])!;
      for (const question of cafe.questions) {
        const answerers = state.scoringMode === "player" ? players : [players[0]];
        for (const player of answerers) {
          state = act(state, player, { type: "ANSWER", questionId: question.id, optionId: testAnswerKey[question.id] })
            .state;
        }
      }
      for (const task of cafe.tasks.filter((candidate) => candidate.presentedAs === "pubtask")) {
        state = act(state, players[0], { type: "SKIP_TASK", taskId: task.id }).state;
      }
      if (team(state, teamId).step === "bonus") state = act(state, players[0], { type: "CONTINUE", at: AT }).state;
      expect(team(state, teamId).step).toBe("fun-fact");
      state = act(state, players[0], { type: "CONTINUE", at: AT }).state;
    }
    return state;
  }

  test("two teams play all 12 cafés; the game ends when both are done", () => {
    let state = startedGame([["h", "b"], ["c", "d", "e", "f", "g"]]);
    state = playAllCafes(state, "t1", ["h", "b"]);
    expect(team(state, "t1").finishedAt).toBe(AT);
    expect(state.phase).toBe("playing");
    expect(refused(state, "h", { type: "ARRIVE" })).toBe("game-finished");

    state = playAllCafes(state, "t2", ["c", "d", "e", "f", "g"]);
    expect(state.phase).toBe("finished");
    // 11 cafés with questions, café 3 has two: 12 questions × 100.
    const totals = computeScores(testDefinition, state).map((score) => score.total);
    expect(totals).toEqual([1200, 1200]);
    // The 5-player team drew 5 × 12 = 60 cards from 2 decks.
    expect(team(state, "t2").deck.drawn).toHaveLength(60);
  });

  test("single player game", () => {
    const state = playAllCafes(startedGame([["solo"]]), "t1", ["solo"]);
    expect(state.phase).toBe("finished");
    expect(computeScores(testDefinition, state)).toEqual([
      {
        scorerId: "solo",
        questionPoints: 1200,
        bonusPoints: 0,
        total: 1200,
        firstAttemptCorrect: 12,
        correctAnswers: 12,
        approvedTasks: 0,
      },
    ]);
  });

  test("the host can end the game early; nothing can happen after that except reviews", () => {
    let state = startedGame([["h"], ["b"]]);
    expect(refused(state, "b", { type: "END_GAME", at: AT })).toBe("not-host");
    state = act(state, "h", { type: "END_GAME", at: AT }).state;
    expect(state).toMatchObject({ phase: "finished", finishedAt: AT });
    expect(refused(state, "b", { type: "ARRIVE" })).toBe("game-finished");
  });

  test("the player view hides the face-down cards", () => {
    let state = toCards(startedGame([["h", "b"], ["c"]]), "h");
    const pile = team(state, "t1").deck.drawPile.slice(0, 10);
    state = act(state, "h", { type: "OFFER_CARDS", cardIds: pile }).state;
    const view = toPlayerView(testDefinition, state, "b");
    expect(view.team.offeredCardCount).toBe(10);
    expect(view.team.drawerId).toBe("h");
    expect(JSON.stringify(view)).not.toContain(cardId(1, "hearts", "2"));
    expect(view.team.cardsLeft).toBe(52);
  });
});
