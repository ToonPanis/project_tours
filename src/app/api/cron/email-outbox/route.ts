import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { applyRetention } from "@/features/commerce/server/privacy-service";

/**
 * GET /api/cron/email-outbox: the commerce platform's daily maintenance.
 * 1. Sends emails that are still waiting (a provider error earlier). Every new
 *    email already starts a delivery round right away; this is the safety net.
 * 2. P9: applies the retention periods (privacy-service.ts, RETENTION in config.ts).
 * One cron for both: Vercel's Hobby plan allows two cron jobs (media cleanup is the other).
 * Same protection as /api/cron/media-cleanup: "Authorization: Bearer <CRON_SECRET>".
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "not-configured" }, { status: 503 });
  if (!sameSecret(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const ctx = getCommerceContext();
    const report = await deliverDueEmails(ctx, 100);
    const retention = await applyRetention(ctx);
    return NextResponse.json({ ...report, retention }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(`[Hidden Antwerp] email outbox failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return NextResponse.json({ error: "outbox-failed" }, { status: 500 });
  }
}

/** Compares in constant time (hashes first, so different lengths don't leak either). */
function sameSecret(given: string, expected: string): boolean {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(given), hash(expected));
}
