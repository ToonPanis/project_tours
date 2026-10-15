import type { NextRequest } from "next/server";
import { adminFromRequest } from "@/features/commerce/server/admin-access";
import { updateProduct } from "@/features/commerce/server/catalog-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { checkPostRequest, errorResponse, readJson, toResponse } from "@/features/pub-game/server/http";

/**
 * POST /api/admin/products/[id]: changes a product (admins only).
 * Body: any of { name, active, vatRateBasisPoints }. Answer: the product.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/products/[id]">) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  const admin = await adminFromRequest(request);
  if (!admin) return errorResponse(401, "sign-in-required");

  const { id } = await ctx.params;
  return toResponse(await updateProduct(getCommerceContext(), admin, id, await readJson(request)));
}
