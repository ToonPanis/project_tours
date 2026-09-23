/**
 * A short random id, e.g. "m1x2k3-9f8a7b".
 *
 * We don't use `crypto.randomUUID()` because browsers only allow it on HTTPS
 * pages, and the playtest runs over plain http on the local Wi-Fi.
 * These ids only need to be unique within one device, not secure.
 */
export function createId(): string {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${timePart}-${randomPart}`;
}
