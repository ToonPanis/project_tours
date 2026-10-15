import type { NextRequest, NextResponse } from "next/server";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";
import { adminFromRequest } from "./admin-access";
import { getCommerceContext, type CommerceContext } from "./context";
import type { ServiceResult } from "./result";
import type { Actor } from "./support";

/**
 * The shared shape of every admin POST route: same-origin JSON only, a signed-in
 * admin (else 401), then the service. Keeps each route file to the one line
 * that differs, so no route can forget a check.
 */
export async function adminPost<T>(
  request: NextRequest,
  run: (ctx: CommerceContext, admin: Actor, body: unknown) => Promise<ServiceResult<T>>,
): Promise<NextResponse> {
  const refused = checkPostRequest(request);
  if (refused) return refused;
  const admin = await adminFromRequest(request);
  if (!admin) return errorResponse(401, "sign-in-required");
  return toResponse(await run(getCommerceContext(), admin, await readJson(request)));
}
