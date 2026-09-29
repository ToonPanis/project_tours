/**
 * Small helpers shared by the data scripts (generate-walking-routes, download-commons-images).
 * Kept free of side effects so they can be unit-tested.
 */

/** Who is calling: public APIs (OSRM, Wikimedia) ask for a way to contact the author. */
export const USER_AGENT_CONTACT = "+https://github.com/ToonPanis/project_tours";

/** A walk folder name from the command line: only lowercase letters, digits and dashes. */
export function readWalkFolderArg(value, usage) {
  if (!value) throw new Error(`Usage: ${usage}`);
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Invalid walk folder "${value}": use a folder name from src/data/walks (e.g. hidden-pubs).`);
  }
  return value;
}

/** True when `target` (a file: URL) lies inside `directory` (a file: URL ending in "/"). */
export function isInsideDirectory(target, directory) {
  return target.href.startsWith(directory.href) && target.href !== directory.href;
}

/** Hosts known to serve the same pages over https: links to them are upgraded. */
const HTTPS_HOSTS = new Set(["creativecommons.org", "hdl.handle.net", "commons.wikimedia.org", "upload.wikimedia.org"]);

/** Upgrades an http:// link to https:// for hosts known to support it; other links are returned unchanged. */
export function toHttps(url) {
  if (typeof url !== "string" || !url.startsWith("http://")) return url;
  try {
    const parsed = new URL(url);
    // An explicit port (e.g. :80) or credentials: leave it alone, https on that port may not exist.
    if (!HTTPS_HOSTS.has(parsed.hostname) || parsed.port !== "" || parsed.username !== "") return url;
    // Rebuilt from the parsed parts: `host` leaves out the default port 80 ("http://x:80/" → "https://x/").
    return `https://${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}

const defaultWait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/** Longest wait we accept from a server's Retry-After header. */
const MAX_RETRY_AFTER_MS = 60_000;

/** The server's Retry-After (seconds or a date) in milliseconds, capped; null if absent or unreadable. */
export function retryAfterMs(response, now = Date.now()) {
  const header = response.headers?.get?.("retry-after");
  if (!header) return null;
  const seconds = Number(header);
  const milliseconds = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - now;
  return Number.isFinite(milliseconds) ? Math.min(Math.max(milliseconds, 0), MAX_RETRY_AFTER_MS) : null;
}

/**
 * fetch with a timeout and a few retries for temporary problems: "too many requests"
 * (429), server errors (5xx) and network errors/timeouts. Other errors (e.g. 404) fail
 * at once. Returns an OK response or throws.
 *
 * Waits between attempts: the server's Retry-After if it sends one; otherwise
 * 15 s, 30 s, … after a 429 (rate limit: give the server real rest) and 2 s, 4 s, …
 * after other temporary errors.
 */
export async function fetchWithRetry(
  url,
  init = {},
  { retries = 3, timeoutMs = 20_000, fetchImpl = fetch, wait = defaultWait } = {},
) {
  let lastError;
  let nextWaitMs = 0;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await wait(nextWaitMs);
    let response;
    try {
      response = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    } catch (error) {
      lastError = error; // network error or timeout: try again
      nextWaitMs = 2_000 * 2 ** attempt;
      continue;
    }
    if (response.ok) return response;
    // We won't read this body: release it, so the connection is freed right away.
    await response.body?.cancel().catch(() => {});
    lastError = new Error(`${response.status} ${response.statusText} for ${url}`);
    const isTemporary = response.status === 429 || response.status >= 500;
    if (!isTemporary) throw lastError;
    nextWaitMs = retryAfterMs(response) ?? (response.status === 429 ? 15_000 * (attempt + 1) : 2_000 * 2 ** attempt);
  }
  throw new Error(`Gave up after ${retries + 1} attempts: ${lastError?.message ?? lastError}`);
}
