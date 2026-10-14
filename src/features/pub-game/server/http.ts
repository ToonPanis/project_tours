import { NextResponse, type NextRequest } from "next/server";
import type { ServiceResult } from "./game-service";
import { playerCookieName } from "./identity";

/** Requests bigger than this are refused before reading them as JSON. */
const MAX_BODY_BYTES = 10_000;

/**
 * Basic protection for the POST routes:
 * - JSON only: a normal HTML form on another site can't send JSON.
 * - Same origin: when the browser says where the request comes from, it must be this site.
 * Together with the SameSite=Lax cookie this stops other sites from acting as a player.
 */
export function checkPostRequest(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return errorResponse(403, "wrong-origin");
  if (!request.headers.get("content-type")?.includes("application/json")) return errorResponse(415, "json-only");
  return null;
}

/** Same-origin check alone (for file uploads, which aren't JSON). */
export function checkSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  return origin && origin !== request.nextUrl.origin ? errorResponse(403, "wrong-origin") : null;
}

/** The request body as JSON, or null when it's too big or not JSON. */
export async function readJson(request: NextRequest): Promise<unknown | null> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/** The secret from the player's cookie for this game, or null. */
export function playerToken(request: NextRequest, code: string): string | null {
  return request.cookies.get(playerCookieName(code))?.value ?? null;
}

export function errorResponse(status: number, error: string): NextResponse {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

/** A service result as HTTP: the data as JSON, or the error with its status. Never cached. */
export function toResponse<T>(result: ServiceResult<T>): NextResponse {
  if (!result.ok) return errorResponse(result.status, result.error);
  return NextResponse.json(result.data, { headers: { "Cache-Control": "no-store" } });
}
