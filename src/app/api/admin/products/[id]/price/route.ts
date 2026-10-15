import type { NextRequest } from "next/server";
import { adminFromRequest } from "@/features/commerce/server/admin-access";
import { setPrice } from "@/features/commerce/server/catalog-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/admin/products/[id]/price: a new price per person from now on (admins only).
 * Body: { amount: "14,95" } (euros as typed). Answer: the product with its new price.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/products/[id]/price">) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const admin = await adminFromRequest(request);
  if (!admin) return errorResponse(401, "sign-in-required");

  const { id } = await ctx.params;
  return toResponse(await setPrice(getCommerceContext(), admin, id, await readJson(request)));
}
