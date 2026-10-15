import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getGameContext } from "@/features/pub-game/server/context";
import { deleteExpiredMedia } from "@/features/pub-game/server/game-service";

/**
 * GET /api/cron/media-cleanup: deletes the Hidden Pubs photos and videos older
 * than 7 days (privacy, D29). MongoDB deletes old games by itself; the Blob
 * store doesn't, so Vercel Cron calls this once a day (vercel.json).
 *
 * Vercel sends "Authorization: Bearer <CRON_SECRET>" (an environment variable
 * set in the Vercel project). Without CRON_SECRET this route refuses every
 * request, so nobody else can trigger it.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "not-configured" }, { status: 503 });
  if (!sameSecret(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await deleteExpiredMedia(getGameContext());
    return NextResponse.json({ deleted }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Logged by name only (CLAUDE.md: never messages in production logs).
    console.error(`[Hidden Pubs] media cleanup failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return NextResponse.json({ error: "cleanup-failed" }, { status: 500 });
  }
}

/** Compares in constant time (hashes first, so different lengths don't leak either). */
function sameSecret(given: string, expected: string): boolean {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(given), hash(expected));
}
