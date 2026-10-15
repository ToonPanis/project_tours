import type { NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { checkReviewLink } from "@/features/commerce/server/review-service";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";

/** POST /api/reviews/check: is this review link genuine, and already used? Body: { token } (from after "#"). */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;
  return toResponse(await checkReviewLink(getCommerceContext(), await readJson(request)));
}
