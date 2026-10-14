import type { NextRequest } from "next/server";
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
  return toResponse(await performAction(getGameContext(), code, playerToken(request, code), await readJson(request)));
}
