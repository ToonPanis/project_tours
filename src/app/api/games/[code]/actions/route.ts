import { after, type NextRequest } from "next/server";
import { getCommerceContext, salesEnabled } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { recordGameFinished } from "@/features/commerce/server/follow-up-service";
import { siteBaseUrl } from "@/features/commerce/server/http";
import { getGameContext } from "@/features/pub-game/server/context";
import { performAction } from "@/features/pub-game/server/game-service";
import { checkPostRequest, playerToken, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/games/[code]/actions: everything a player does during the game.
 * Body: { actionId, action } (see ClientAction). Answer: { version, view }.
 * Refused actions answer 409 with the reason, e.g. { error: "not-your-turn" }.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/games/[code]/actions">) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const code = (await ctx.params).code.toUpperCase();
  const body = await readJson(request);
  const result = await performAction(getGameContext(), code, playerToken(request, code), body);
  // P8: the host ended a game made with a ticket → that ticket's walk is finished
  // (the follow-up email, if the buyer asked for it). After the answer; only with sales open.
  if (result.ok && salesEnabled() && isEndGame(body)) {
    const baseUrl = siteBaseUrl(request);
    if (baseUrl) {
      after(async () => {
        try {
          await recordGameFinished(getCommerceContext(), code, baseUrl);
          await deliverDueEmails(getCommerceContext());
        } catch (error) {
          console.error(`[Hidden Antwerp] game end not recorded for the follow-up: ${error instanceof Error ? error.name : "unknown"}`);
        }
      });
    }
  }
  return toResponse(result);
}

function isEndGame(body: unknown): boolean {
  if (typeof body !== "object" || body === null || !("action" in body)) return false;
  const action = body.action;
  return typeof action === "object" && action !== null && "type" in action && action.type === "END_GAME";
}
