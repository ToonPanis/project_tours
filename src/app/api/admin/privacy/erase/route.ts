import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { erasePersonalData } from "@/features/commerce/server/privacy-service";

/** POST /api/admin/privacy/erase: an erasure request. Body: { email, confirm }. Audited (by the address's hash). */
export async function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) => erasePersonalData(ctx, admin, body));
}
