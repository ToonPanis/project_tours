import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { approveOldCommissions, changeCommissionStatus } from "@/features/commerce/server/commission-service";
import { fail } from "@/features/commerce/server/result";

/**
 * POST /api/admin/commissions: moves ledger lines one step.
 * Body: { action: "change", ids, to: "approved" | "payable" | "paid", payoutReference? }
 *    or { action: "approve-old", partnerId? } (pending lines older than 14 days).
 * No money is sent: "paid" records a transfer the owner made (brief 3.5).
 */
export async function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) => {
    const action = typeof body === "object" && body !== null && "action" in body ? body.action : null;
    if (action === "change") return changeCommissionStatus(ctx, admin, body);
    if (action === "approve-old") return approveOldCommissions(ctx, admin, body);
    return Promise.resolve(fail(400, "invalid-action"));
  });
}
