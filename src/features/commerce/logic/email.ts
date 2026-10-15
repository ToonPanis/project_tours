/** The longest address the email standards allow. */
const MAX_EMAIL_LENGTH = 254;

/**
 * Something@something.something, without spaces. Deliberately simple: the only
 * real test of an address is whether the email arrives.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * An email address in one fixed form (trimmed, lower case), or null when the
 * value isn't one. Accounts are found by this form, so "Toon@Example.com " and
 * "toon@example.com" are the same person.
 */
export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_SHAPE.test(email) ? email : null;
}

/**
 * The list of admin addresses from the environment (ADMIN_EMAILS, comma
 * separated). Invalid entries are left out.
 */
export function parseEmailList(value: string | undefined): string[] {
  if (!value) return [];
  return [...new Set(value.split(",").map(normalizeEmail).filter((email): email is string => email !== null))];
}
