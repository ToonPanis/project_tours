import type { PubGameAction, PubGameDefinition, PubGameState } from "@/types/pub-game";
import { MAX_NAME_LENGTH, MAX_RULE_LENGTH } from "../config";
import { pickOffer } from "./cards";
import { drawRoute } from "./route";

/**
 * What a phone may send to POST /api/games/[code]/actions. It's a smaller,
 * safer version of `PubGameAction`: everything the server must decide (random
 * routes, the cards on offer, ids, times) is NOT part of it, so a phone can't
 * choose its own cards or route.
 */
export type ClientAction =
  | { type: "ADD_PLAYER"; name: string; teamId: string }
  | { type: "START_GAME" }
  | { type: "END_GAME" }
  | { type: "ARRIVE" }
  | { type: "DRINKS_DONE" }
  | { type: "DRAW_CARDS" }
  | { type: "PICK_CARD"; index: number }
  | { type: "GIVE_SIP"; targetId: string }
  | { type: "CHOOSE_BUDDY"; buddyId: string }
  | { type: "WRITE_RULE"; text: string }
  | { type: "REPORT_LOSER"; playerId: string | null }
  | { type: "REPORT_DRINK"; playerId: string }
  | { type: "ANSWER"; questionId: string; optionId: string }
  | { type: "SKIP_TASK"; taskId: string }
  | { type: "REVIEW_EVIDENCE"; submissionId: string; approve: boolean; reason?: string }
  | { type: "CONTINUE" };

/** Ids and short values from a phone: letters, digits, "-", "_", ":" only. */
const ID_PATTERN = /^[A-Za-z0-9_:-]{1,64}$/;

/** An action id: the phone makes a new random one per tap, so retries can be recognised. */
export function isValidActionId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(value);
}

function isId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function isText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.length <= maxLength * 2;
}

/**
 * Checks the JSON a phone sent and returns a typed action, or null when it
 * isn't a valid action. Never trust a request body: anything can be sent.
 * (Length limits are checked again, after trimming, by the game logic.)
 */
export function parseClientAction(body: unknown): ClientAction | null {
  if (typeof body !== "object" || body === null) return null;
  const input = body as Record<string, unknown>;

  switch (input.type) {
    case "START_GAME":
    case "END_GAME":
    case "ARRIVE":
    case "DRINKS_DONE":
    case "DRAW_CARDS":
    case "CONTINUE":
      return { type: input.type };
    case "ADD_PLAYER":
      return isText(input.name, MAX_NAME_LENGTH) && isId(input.teamId)
        ? { type: "ADD_PLAYER", name: input.name, teamId: input.teamId }
        : null;
    case "PICK_CARD":
      return Number.isInteger(input.index) ? { type: "PICK_CARD", index: input.index as number } : null;
    case "GIVE_SIP":
      return isId(input.targetId) ? { type: "GIVE_SIP", targetId: input.targetId } : null;
    case "CHOOSE_BUDDY":
      return isId(input.buddyId) ? { type: "CHOOSE_BUDDY", buddyId: input.buddyId } : null;
    case "WRITE_RULE":
      return isText(input.text, MAX_RULE_LENGTH) ? { type: "WRITE_RULE", text: input.text } : null;
    case "REPORT_LOSER":
      return input.playerId === null || isId(input.playerId)
        ? { type: "REPORT_LOSER", playerId: input.playerId }
        : null;
    case "REPORT_DRINK":
      return isId(input.playerId) ? { type: "REPORT_DRINK", playerId: input.playerId } : null;
    case "ANSWER":
      return isId(input.questionId) && isId(input.optionId)
        ? { type: "ANSWER", questionId: input.questionId, optionId: input.optionId }
        : null;
    case "SKIP_TASK":
      return isId(input.taskId) ? { type: "SKIP_TASK", taskId: input.taskId } : null;
    case "REVIEW_EVIDENCE": {
      if (!isId(input.submissionId) || typeof input.approve !== "boolean") return null;
      if (input.reason !== undefined && !isText(input.reason, MAX_RULE_LENGTH)) return null;
      return {
        type: "REVIEW_EVIDENCE",
        submissionId: input.submissionId,
        approve: input.approve,
        ...(typeof input.reason === "string" ? { reason: input.reason } : {}),
      };
    }
    default:
      return null;
  }
}

/** What the server adds to a phone's action: secure random numbers, new ids, the time. */
export interface ServerInput {
  random: () => number;
  newId: () => string;
  now: string;
}

/**
 * Turns a phone's action into a game action by adding what only the server
 * may decide. Returns null when the server can't fill it in (e.g. DRAW_CARDS
 * for a player who isn't in the game: the game logic reports the real error).
 */
export function toGameAction(
  clientAction: ClientAction,
  definition: PubGameDefinition,
  state: PubGameState,
  actorId: string,
  server: ServerInput,
): PubGameAction | null {
  switch (clientAction.type) {
    case "ADD_PLAYER":
      return { ...clientAction, playerId: server.newId() };
    case "START_GAME":
      // A random route per team (D5).
      return {
        type: "START_GAME",
        routes: Object.fromEntries(state.teams.map((team) => [team.id, drawRoute(definition.route, server.random)])),
        at: server.now,
      };
    case "END_GAME":
    case "CONTINUE":
      return { type: clientAction.type, at: server.now };
    case "DRAW_CARDS": {
      const teamId = state.players.find((player) => player.id === actorId)?.teamId;
      const team = state.teams.find((candidate) => candidate.id === teamId);
      if (!team) return null;
      return { type: "OFFER_CARDS", cardIds: pickOffer(team.deck.drawPile, server.random) };
    }
    case "WRITE_RULE":
      return { ...clientAction, ruleId: server.newId() };
    default:
      return clientAction;
  }
}
