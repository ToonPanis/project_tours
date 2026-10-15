import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A ticket link is signed instead of stored: "<ticket id>.<signature>", where
 * the signature is an HMAC-SHA256 of the id with a server-only key
 * (TICKET_SIGNING_SECRET). Nobody can make one without the key, and the server
 * can always make the same link again (to show it after payment, or to resend
 * the email) without keeping a secret in the database. A ticket is withdrawn
 * by revoking it in the database; changing the key withdraws every link.
 */

const ID_SHAPE = /^[A-Za-z0-9-]{8,100}$/;

function signatureOf(grantId: string, key: string): string {
  return createHmac("sha256", key).update(`ticket:${grantId}`).digest("base64url");
}

export function signTicketToken(grantId: string, key: string): string {
  return `${grantId}.${signatureOf(grantId, key)}`;
}

/** The ticket id when the token is genuine, otherwise null. */
export function verifyTicketToken(token: unknown, key: string): string | null {
  if (typeof token !== "string" || token.length > 200) return null;
  const [grantId, signature, ...rest] = token.split(".");
  if (rest.length > 0 || !grantId || !signature || !ID_SHAPE.test(grantId)) return null;
  const expected = Buffer.from(signatureOf(grantId, key));
  const given = Buffer.from(signature);
  // Constant time: how long the comparison takes says nothing about how close a guess was.
  return given.length === expected.length && timingSafeEqual(given, expected) ? grantId : null;
}
