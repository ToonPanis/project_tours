import { cookies, headers } from "next/headers";
import { getGameContext } from "./context";
import { getGameUpdate, getLobby } from "./game-service";
import { playerCookieName } from "./identity";

/**
 * What the /games/[code] pages need, read on the server: the lobby, and the
 * player's view when this phone's cookie belongs to the game.
 */
export async function loadGamePage(rawCode: string) {
  const code = rawCode.toUpperCase();
  const ctx = getGameContext();
  const lobby = await getLobby(ctx, code);
  if (!lobby.ok) return null;

  const token = (await cookies()).get(playerCookieName(code))?.value ?? null;
  const update = await getGameUpdate(ctx, code, token, null);
  const player = update.ok && update.data.changed ? { view: update.data.view, version: update.data.version } : null;
  return { code, lobby: lobby.data, player };
}

/** The full join link for the QR code and the share button, from the request's own address. */
export async function joinUrlFor(code: string): Promise<string> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}/games/${code}`;
}
