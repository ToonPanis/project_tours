import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";

/**
 * Players have no account. Joining a game gives the phone a long random secret
 * in an httpOnly cookie (JavaScript in the page can't read it). The server only
 * stores a hash of it, so even a leaked database can't be used to act as a player.
 */

/** Games are kept 7 days (D29); the cookie lives as long. */
export const GAME_LIFETIME_DAYS = 7;

/** One cookie per game, so a phone can be in two games (e.g. a test game and a real one). */
export function playerCookieName(code: string): string {
  return `hp_${code}`;
}

export function playerCookieOptions() {
  return {
    httpOnly: true,
    // Over plain http on the LAN during development, a Secure cookie would never be sent.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: GAME_LIFETIME_DAYS * 24 * 60 * 60,
  };
}

export function newPlayerToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function newId(): string {
  return randomUUID();
}

/** Letters and digits that can't be mixed up when read aloud or typed (no 0/O, 1/I/L). */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const GAME_CODE_LENGTH = 6;

export function newGameCode(): string {
  return Array.from({ length: GAME_CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

export function isGameCode(value: string): boolean {
  return value.length === GAME_CODE_LENGTH && [...value].every((char) => CODE_ALPHABET.includes(char));
}

/** A secure random number in [0, 1), like Math.random but unpredictable (card offers, routes). */
export function secureRandom(): number {
  return randomInt(2 ** 47) / 2 ** 47;
}
