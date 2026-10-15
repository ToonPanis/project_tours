import type { NextRequest } from "next/server";
import { adminFromRequest } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { exportOrdersCsv } from "@/features/commerce/server/report-service";
import { errorResponse } from "@/features/pub-game/server/http";

/**
 * GET /api/admin/reports/orders?range=…&from=…&to=…: the paid orders of the
 * range as a CSV file (for the accountant). Admins only; every export is in the
 * audit log because the file contains customers' data.
 */
export async function GET(request: NextRequest) {
  const admin = await adminFromRequest(request);
  if (!admin) return errorResponse(401, "sign-in-required");

  const params = request.nextUrl.searchParams;
  const { fileName, csv } = await exportOrdersCsv(getCommerceContext(), admin, {
    range: params.get("range") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });
  // The byte-order mark makes Excel read the file as UTF-8 (names with accents, Cyrillic).
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
