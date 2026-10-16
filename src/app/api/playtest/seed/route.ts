import { NextResponse, type NextRequest } from "next/server";
import { getCommerceContext } from "@/features/commerce/server/context";
import { fakePaymentsAllowed } from "@/features/commerce/server/fake-payment-gateway";
import { seedTestShop } from "@/features/commerce/server/fake-payments";
import { checkPostRequest, readJson, toResponse } from "@/features/pub-game/server/http";

/** BROWSER TESTS ONLY: puts the starter products on sale with the tax settings the test sends. 404 everywhere else. */
export async function POST(request: NextRequest) {
  if (!fakePaymentsAllowed()) return new NextResponse(null, { status: 404 });
  const refused = checkPostRequest(request);
  if (refused) return refused;
  return toResponse(await seedTestShop(getCommerceContext(), await readJson(request)));
}
