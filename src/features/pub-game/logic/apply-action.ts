import type {
  AnswerKey,
  PubGameAction,
  PubGameCafe,
  PubGameDefinition,
  PubGameError,
  PubGameEvent,
  PubGamePlayer,
  PubGameResult,
  PubGameState,
  PubGameTeam,
  Rank,
  TeamRoles,
} from "@/types/pub-game";
import { CARDS_PER_OFFER, MAX_RULE_LENGTH, MAX_RULES } from "../config";
import { buildDeck, deckCountFor, followUpFor, parseCard, refillIfNeeded } from "./cards";
import { cleanName } from "./create-game";
import { isValidRoute } from "./route";
import { emptyQuestionProgress, pointsForAttempt, WRONG_ATTEMPTS_BEFORE_REVEAL } from "./scoring";
import { resolveSips } from "./sips";

/** The card ranks that hand out a power (holder until someone else draws the rank). */
const ROLE_OF_RANK: Partial<Record<Rank, keyof TeamRoles>> = {
  Q: "questionBitch",
  K: "thumbKing",
  A: "beunaas",
};

/**
 * All rules of Hidden Pubs 2.0 in one pure function:
 * (cafés, answers, state, who, action) → new state + events, or an error.
 *
 * - It never changes `state`: it works on a copy (`structuredClone`).
 * - It checks WHO may do what: `actorId` is the player whose phone sent the
 *   action (the server knows this from the player's cookie).
 * - It never reads the clock or random numbers: times, routes and card offers
 *   are decided by the server and arrive inside the action.
 * - The answer key is a separate argument, so correct answers are never part
 *   of the state that phones receive.
 */
export function applyPubGameAction(
  definition: PubGameDefinition,
  answerKey: AnswerKey,
  state: PubGameState,
  actorId: string,
  action: PubGameAction,
): PubGameResult {
  const next = structuredClone(state);
  const events: PubGameEvent[] = [];
  const fail = (error: PubGameError): PubGameResult => ({ ok: false, error });
  const done = (): PubGameResult => ({ ok: true, state: next, events });

  // Evidence can still be reviewed after the end ("proof after the game").
  if (next.phase === "finished" && action.type !== "REVIEW_EVIDENCE") return fail("game-finished");

  // ─── Joining (the new player is the actor) ────────────────────────────────
  if (action.type === "JOIN" || action.type === "ADD_PLAYER") {
    if (action.type === "JOIN") {
      if (action.playerId !== actorId) return fail("not-a-player");
      // Free joining closes once the first card of the game is drawn (D34).
      if (next.phase === "playing" && next.firstCardDrawn) return fail("joining-closed");
    } else if (!isHost(next, actorId)) {
      return fail("not-host");
    }

    const team = next.teams.find((candidate) => candidate.id === action.teamId);
    if (!team) return fail("unknown-team");
    if (next.players.some((player) => player.id === action.playerId)) return fail("duplicate-player");
    const name = cleanName(action.name);
    if (!name) return fail("invalid-text");
    if (next.players.some((player) => player.name.toLowerCase() === name.toLowerCase())) return fail("name-taken");
    if (teamPlayers(next, team.id).length >= next.playersPerTeam) return fail("team-full");

    next.players.push({ id: action.playerId, name, teamId: team.id, isHost: false });
    // Before the first card, the deck still matches the team size (2 decks from 5 players).
    if (!next.firstCardDrawn) team.deck = buildDeck(deckCountFor(teamPlayers(next, team.id).length));
    events.push({ type: "player-joined", playerId: action.playerId });
    return done();
  }

  const actor = next.players.find((player) => player.id === actorId);
  if (!actor) return fail("not-a-player");

  // ─── Host actions ─────────────────────────────────────────────────────────
  if (action.type === "START_GAME") {
    if (!actor.isHost) return fail("not-host");
    if (next.phase !== "lobby") return fail("game-already-started");

    for (const team of next.teams) {
      const playerCount = teamPlayers(next, team.id).length;
      if (playerCount === 0) return fail("empty-team");
      const route = action.routes[team.id];
      if (!route || !isValidRoute(definition.route, route)) return fail("invalid-route");
      team.route = [...route];
      team.deck = buildDeck(deckCountFor(playerCount));
    }
    next.phase = "playing";
    next.startedAt = action.at;
    events.push({ type: "game-started" });
    return done();
  }

  if (action.type === "END_GAME") {
    if (!actor.isHost) return fail("not-host");
    finishGame(action.at);
    return done();
  }

  if (action.type === "REVIEW_EVIDENCE") {
    if (!actor.isHost) return fail("not-host");
    const submission = next.evidence.find((candidate) => candidate.id === action.submissionId);
    if (!submission) return fail("unknown-submission");
    if (submission.status !== "pending") return fail("already-reviewed");

    if (action.approve) {
      submission.status = "approved";
    } else {
      submission.status = "rejected";
      submission.rejectionReason = action.reason?.trim().slice(0, MAX_RULE_LENGTH) || null;
    }
    events.push({
      type: "evidence-reviewed",
      submissionId: submission.id,
      teamId: submission.teamId,
      approved: action.approve,
    });
    return done();
  }

  if (next.phase !== "playing") return fail("game-not-started");

  // ─── Team actions: any player of the team may tap ─────────────────────────
  const team = next.teams.find((candidate) => candidate.id === actor.teamId);
  if (!team) return fail("unknown-team");
  if (team.finishedAt) return fail("game-finished");
  const cafe = currentCafe(definition, team);

  switch (action.type) {
    case "ARRIVE": {
      if (team.step !== "travelling") return fail("wrong-step");
      team.step = "drinks";
      return done();
    }

    case "DRINKS_DONE": {
      if (team.step !== "drinks") return fail("wrong-step");
      team.step = "cards";
      return done();
    }

    // ─── Drunken Bastard ────────────────────────────────────────────────────
    case "OFFER_CARDS": {
      if (team.step !== "cards") return fail("wrong-step");
      if (team.offer || team.currentCard?.followUp) return fail("card-pending");
      const drawer = currentDrawer(next, team);
      if (!drawer) return fail("wrong-step");

      const expected = Math.min(CARDS_PER_OFFER, team.deck.drawPile.length);
      const unique = new Set(action.cardIds);
      const valid =
        action.cardIds.length === expected &&
        unique.size === expected &&
        action.cardIds.every((id) => team.deck.drawPile.includes(id));
      if (!valid) return fail("invalid-offer");

      team.offer = { playerId: drawer.id, cardIds: [...action.cardIds] };
      return done();
    }

    case "PICK_CARD": {
      if (team.step !== "cards") return fail("wrong-step");
      if (!team.offer) return fail("no-offer");
      const cardId = team.offer.cardIds[action.index];
      if (!Number.isInteger(action.index) || cardId === undefined) return fail("invalid-offer");

      const drawerId = team.offer.playerId;
      const card = parseCard(cardId);
      team.offer = null;
      team.deck = refillIfNeeded({
        drawPile: team.deck.drawPile.filter((id) => id !== cardId),
        drawn: [...team.deck.drawn, cardId],
      });
      team.drewThisCafe.push(drawerId);
      next.firstCardDrawn = true;
      events.push({ type: "card-drawn", teamId: team.id, playerId: drawerId, cardId });

      const role = ROLE_OF_RANK[card.rank];
      if (role && team.roles[role] !== drawerId) {
        events.push({
          type: "role-changed",
          teamId: team.id,
          role,
          playerId: drawerId,
          previousPlayerId: team.roles[role],
        });
        team.roles[role] = drawerId;
      }
      // "3 for me": the player drinks (after a new ace, so a Beunaas drinks double).
      if (card.rank === "3") events.push({ type: "drink", teamId: team.id, sips: resolveSips(next, drawerId) });

      let followUp = followUpFor(card.rank);
      // Nobody to choose: a team of one has no one to hand a sip to, a game of one has no buddy.
      if (followUp === "choose-target" && teamPlayers(next, team.id).length < 2) followUp = null;
      if (followUp === "choose-buddy" && next.players.length < 2) followUp = null;

      team.currentCard = { playerId: drawerId, cardId, followUp };
      finishCardsIfDone(team);
      return done();
    }

    case "GIVE_SIP": {
      const current = team.currentCard;
      if (current?.followUp !== "choose-target") return fail("wrong-step");
      const target = next.players.find((player) => player.id === action.targetId);
      if (!target || target.teamId !== team.id || target.id === current.playerId) return fail("invalid-target");

      events.push({ type: "drink", teamId: team.id, sips: resolveSips(next, target.id) });
      current.followUp = null;
      finishCardsIfDone(team);
      return done();
    }

    case "CHOOSE_BUDDY": {
      const current = team.currentCard;
      if (current?.followUp !== "choose-buddy") return fail("wrong-step");
      const buddy = next.players.find((player) => player.id === action.buddyId);
      // Any player of the game, also from another team.
      if (!buddy || buddy.id === current.playerId) return fail("invalid-target");

      // One buddy per player: links of either player end (D14).
      const pair: [string, string] = [current.playerId, buddy.id];
      const endedPairs = next.buddies.filter(([a, b]) => pair.includes(a) || pair.includes(b));
      next.buddies = [...next.buddies.filter((existing) => !endedPairs.includes(existing)), pair];
      events.push({ type: "buddies-linked", playerIds: pair, endedPairs });

      current.followUp = null;
      finishCardsIfDone(team);
      return done();
    }

    case "WRITE_RULE": {
      const current = team.currentCard;
      if (current?.followUp !== "write-rule") return fail("wrong-step");
      const text = action.text.trim().replace(/\s+/g, " ");
      if (text.length < 1 || text.length > MAX_RULE_LENGTH) return fail("invalid-text");

      const rule = { id: action.ruleId, text, playerId: current.playerId };
      // A 5th rule pushes out the oldest (D13).
      const dropped = team.rules.length >= MAX_RULES ? team.rules[0] : null;
      team.rules = [...team.rules.filter((existing) => existing !== dropped), rule];
      events.push({ type: "rule-added", teamId: team.id, rule, droppedRuleId: dropped?.id ?? null });

      current.followUp = null;
      finishCardsIfDone(team);
      return done();
    }

    case "REPORT_LOSER": {
      const current = team.currentCard;
      if (current?.followUp !== "report-loser") return fail("wrong-step");
      if (action.playerId !== null) {
        const loser = next.players.find((player) => player.id === action.playerId);
        if (!loser || loser.teamId !== team.id) return fail("invalid-target");
        events.push({ type: "drink", teamId: team.id, sips: resolveSips(next, loser.id) });
      }
      current.followUp = null;
      finishCardsIfDone(team);
      return done();
    }

    case "REPORT_DRINK": {
      // Any time: Question Bitch, Thumb King or a rule caught someone (D15).
      const drinker = next.players.find((player) => player.id === action.playerId);
      if (!drinker || drinker.teamId !== team.id) return fail("invalid-target");
      events.push({ type: "drink", teamId: team.id, sips: resolveSips(next, drinker.id) });
      return done();
    }

    // ─── Pubtask ────────────────────────────────────────────────────────────
    case "ANSWER": {
      if (team.step !== "pubtask") return fail("wrong-step");
      const question = cafe.questions.find((candidate) => candidate.id === action.questionId);
      if (!question) return fail("unknown-question");

      const scorerId = next.scoringMode === "player" ? actor.id : team.id;
      const scorerAnswers = (next.answers[scorerId] ??= {});
      const progress = (scorerAnswers[question.id] ??= emptyQuestionProgress());
      if (progress.status !== "open") return fail("already-answered");
      if (!question.optionIds.includes(action.optionId) || progress.wrongOptionIds.includes(action.optionId)) {
        return fail("invalid-option");
      }

      const correctOptionId = answerKey[question.id];
      if (!correctOptionId) throw new Error(`No answer for question "${question.id}"`);

      if (action.optionId === correctOptionId) {
        progress.status = "correct";
        progress.points = pointsForAttempt(progress.wrongOptionIds.length);
        progress.correctOptionId = correctOptionId;
      } else {
        progress.wrongOptionIds.push(action.optionId);
        // After 3 wrong answers the answer is shown: 0 points.
        if (progress.wrongOptionIds.length >= WRONG_ATTEMPTS_BEFORE_REVEAL) {
          progress.status = "revealed";
          progress.correctOptionId = correctOptionId;
        }
      }
      events.push({
        type: "answered",
        scorerId,
        questionId: question.id,
        correct: progress.status === "correct",
        points: progress.points,
        finished: progress.status !== "open",
      });
      finishTasksIfDone(team, cafe);
      return done();
    }

    // ─── Photo and video tasks ──────────────────────────────────────────────
    case "SUBMIT_EVIDENCE": {
      const located = findTask(definition, action.taskId);
      if (!located) return fail("unknown-task");
      const { task, cafeId } = located;

      const previous = next.evidence.filter((item) => item.teamId === team.id && item.taskId === task.id);
      const isRetry = previous.length > 0 && previous.every((item) => item.status === "rejected");
      if (isRetry) {
        // A rejected task can be submitted again later, from any step (D26).
        if (team.route.indexOf(cafeId) > team.cafeIndex) return fail("unknown-task");
      } else {
        if (team.doneTaskIds.includes(task.id)) return fail("task-done");
        if (cafeId !== cafe.id || !isTaskStep(team, task.presentedAs)) return fail("wrong-step");
      }

      const participants = [...new Set(action.participantIds)];
      const allInTeam = participants.every((id) => teamPlayers(next, team.id).some((player) => player.id === id));
      if (participants.length === 0 || !allInTeam) return fail("invalid-target");
      if (next.evidence.some((item) => item.id === action.submissionId)) return fail("unknown-submission");

      next.evidence.push({
        id: action.submissionId,
        taskId: task.id,
        teamId: team.id,
        submittedBy: actor.id,
        participantIds: participants,
        mediaId: action.mediaId,
        submittedAt: action.at,
        status: "pending",
        rejectionReason: null,
      });
      if (!team.doneTaskIds.includes(task.id)) team.doneTaskIds.push(task.id);
      events.push({ type: "evidence-submitted", submissionId: action.submissionId, teamId: team.id });
      finishTasksIfDone(team, cafe);
      return done();
    }

    case "SKIP_TASK": {
      const task = cafe.tasks.find((candidate) => candidate.id === action.taskId);
      if (!task) return fail("unknown-task");
      if (team.doneTaskIds.includes(task.id)) return fail("task-done");
      if (!isTaskStep(team, task.presentedAs)) return fail("wrong-step");
      team.doneTaskIds.push(task.id);
      finishTasksIfDone(team, cafe);
      return done();
    }

    case "CONTINUE": {
      if (team.step === "bonus") {
        // Bonus tasks are optional: continuing skips the ones not submitted.
        for (const task of cafe.tasks) {
          if (task.presentedAs === "bonus" && !team.doneTaskIds.includes(task.id)) team.doneTaskIds.push(task.id);
        }
        team.step = "fun-fact";
        return done();
      }
      if (team.step !== "fun-fact") return fail("wrong-step");

      if (team.cafeIndex === team.route.length - 1) {
        team.finishedAt = action.at;
        events.push({ type: "team-finished", teamId: team.id });
        // The game ends when every team has finished Den Engel (D7).
        if (next.teams.every((candidate) => candidate.finishedAt)) finishGame(action.at);
        return done();
      }

      team.cafeIndex += 1;
      team.step = "travelling";
      team.drewThisCafe = [];
      team.offer = null;
      team.currentCard = null;
      events.push({ type: "next-cafe", teamId: team.id, cafeId: team.route[team.cafeIndex] });
      return done();
    }

    default:
      return fail("wrong-step");
  }

  // ─── Helpers that change `next` ───────────────────────────────────────────

  function finishGame(at: string) {
    next.phase = "finished";
    next.finishedAt = at;
    events.push({ type: "game-finished" });
  }

  /** Every player drew and the last card needs nothing more: on to the pubtask. */
  function finishCardsIfDone(target: PubGameTeam) {
    if (target.step !== "cards" || target.currentCard?.followUp) return;
    if (currentDrawer(next, target) !== null) return;
    target.step = "pubtask";
    finishTasksIfDone(target, cafe);
  }

  /** Pubtask finished → bonus (or the fun fact); bonus tasks all done → fun fact. */
  function finishTasksIfDone(target: PubGameTeam, targetCafe: PubGameCafe) {
    const tasksDone = (kind: "pubtask" | "bonus") =>
      targetCafe.tasks.filter((task) => task.presentedAs === kind).every((task) => target.doneTaskIds.includes(task.id));

    if (target.step === "pubtask") {
      const scorerIds =
        next.scoringMode === "player" ? teamPlayers(next, target.id).map((player) => player.id) : [target.id];
      const questionsDone = targetCafe.questions.every((question) =>
        scorerIds.every((scorerId) => {
          const status = next.answers[scorerId]?.[question.id]?.status;
          return status === "correct" || status === "revealed";
        }),
      );
      if (!questionsDone || !tasksDone("pubtask")) return;
      target.step = targetCafe.tasks.some((task) => task.presentedAs === "bonus") ? "bonus" : "fun-fact";
    }
    if (target.step === "bonus" && tasksDone("bonus")) target.step = "fun-fact";
  }
}

// ─── Read-only helpers (also used by the server and the screens) ────────────

export function isHost(state: PubGameState, playerId: string): boolean {
  return state.players.some((player) => player.id === playerId && player.isHost);
}

/** The players of a team, in joining order. */
export function teamPlayers(state: PubGameState, teamId: string): PubGamePlayer[] {
  return state.players.filter((player) => player.teamId === teamId);
}

export function currentCafe(definition: PubGameDefinition, team: PubGameTeam): PubGameCafe {
  const cafeId = team.route[team.cafeIndex];
  const cafe = definition.cafes.find((candidate) => candidate.id === cafeId);
  if (!cafe) throw new Error(`Unknown café "${cafeId}"`);
  return cafe;
}

/**
 * Whose turn it is to draw at the current café, or null when everyone drew.
 * Players draw in joining order; the first player moves one place per café (D17).
 */
export function currentDrawer(state: PubGameState, team: PubGameTeam): PubGamePlayer | null {
  const players = teamPlayers(state, team.id);
  if (players.length === 0) return null;
  const start = team.cafeIndex % players.length;
  const order = [...players.slice(start), ...players.slice(0, start)];
  return order.find((player) => !team.drewThisCafe.includes(player.id)) ?? null;
}

function isTaskStep(team: PubGameTeam, presentedAs: "pubtask" | "bonus"): boolean {
  return team.step === presentedAs;
}

function findTask(definition: PubGameDefinition, taskId: string) {
  for (const cafe of definition.cafes) {
    const task = cafe.tasks.find((candidate) => candidate.id === taskId);
    if (task) return { task, cafeId: cafe.id };
  }
  return null;
}
