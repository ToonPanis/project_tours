/**
 * Fixed-window rate limiting: time is cut into windows (e.g. 15 minutes) and
 * every request counts in the window it falls in. One counter per window and
 * subject; when the window is over, its counter is simply forgotten.
 */

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

/** The start of the window `now` falls in. */
export function windowStart(now: Date, windowMs: number): Date {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

/**
 * The counter's key: what is limited, for whom, in which window.
 * `subject` must already be a hash (never a raw email or IP address).
 */
export function rateLimitKey(scope: string, subject: string, start: Date): string {
  return `${scope}:${subject}:${start.getTime()}`;
}

/** After counting this request: is it still allowed? */
export function isWithinLimit(countAfterThisRequest: number, rule: RateLimitRule): boolean {
  return countAfterThisRequest <= rule.limit;
}
