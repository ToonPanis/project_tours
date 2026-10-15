import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { deliverDueEmails } from "@/features/commerce/server/email-service";

/**
 * GET /api/cron/email-outbox: sends emails that are still waiting (a provider
 * error earlier). Every new email already starts a delivery round right away;
 * this daily Vercel Cron call (vercel.json) is the safety net.
 * Same protection as /api/cron/media-cleanup: "Authorization: Bearer <CRON_SECRET>".
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "not-configured" }, { status: 503 });
  if (!sameSecret(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const report = await deliverDueEmails(getCommerceContext(), 100);
    return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
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
