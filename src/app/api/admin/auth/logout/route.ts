import { NextResponse, type NextRequest } from "next/server";
import { signOut } from "@/features/commerce/server/auth-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { ADMIN_COOKIE } from "@/features/commerce/server/http";
import { checkPostRequest } from "@/features/pub-game/server/http";

/** POST /api/admin/auth/logout: ends the session in the database and removes the cookie. */
export async function POST(request: NextRequest) {
  const refused = checkPostRequest(request);
  if (refused) return refused;

  await signOut(getCommerceContext(), request.cookies.get(ADMIN_COOKIE)?.value);
  const response = NextResponse.json({ signedOut: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
