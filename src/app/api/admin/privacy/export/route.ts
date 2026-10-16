import type { NextRequest } from "next/server";
import { adminPost } from "@/features/commerce/server/admin-route";
import { exportPersonalData } from "@/features/commerce/server/privacy-service";

/** POST /api/admin/privacy/export: everything about one address as JSON (access/portability request). Audited. */
export async function POST(request: NextRequest) {
  return adminPost(request, (ctx, admin, body) =>
    exportPersonalData(ctx, admin, typeof body === "object" && body !== null && "email" in body ? body.email : null),
  );
}
