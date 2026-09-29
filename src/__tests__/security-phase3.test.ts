import { describe, expect, test, vi } from "vitest";
import { pathToFileURL } from "node:url";
import { clearSavedWalks, isPlaytestEnabled } from "@/features/walk-session/playtest/PlaytestControls";
import { storageKey } from "@/features/walk-session/storage/session-storage";
import { LOCALE_STORAGE_KEY } from "@/i18n/config";
import { buildContentSecurityPolicy, buildSecurityHeaders, mapStyleOrigin, parseDevAllowedOrigins } from "@/lib/security-headers";
import {
  fetchWithRetry,
  isInsideDirectory,
  readWalkFolderArg,
  retryAfterMs,
  toHttps,
} from "../../scripts/lib/script-utils.mjs";

const production = { isDevelopment: false, mapStyleUrl: "https://tiles.openfreemap.org/styles/liberty" };
const headerValue = (key: string) => buildSecurityHeaders(production).find((header) => header.key === key)?.value;

// L-01: security headers on every page.
describe("security headers", () => {
  test("the safe headers are enforced", () => {
    expect(headerValue("X-Content-Type-Options")).toBe("nosniff");
    expect(headerValue("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headerValue("X-Frame-Options")).toBe("DENY");
    // Location only for this site; no camera or microphone.
    expect(headerValue("Permissions-Policy")).toContain("geolocation=(self)");
    expect(headerValue("Permissions-Policy")).toContain("camera=()");
  });

  test("the Content Security Policy is REPORT-ONLY (it can't blank the map before it's tested on phones)", () => {
    expect(headerValue("Content-Security-Policy")).toBeUndefined();
    expect(headerValue("Content-Security-Policy-Report-Only")).toBeDefined();
  });

  test("the CSP allows what the map needs: its worker, blob: workers and the map host", () => {
    const csp = buildContentSecurityPolicy(production);
    expect(csp).toContain("worker-src 'self' blob:");
    expect(csp).toContain("connect-src 'self' https://tiles.openfreemap.org");
    expect(csp).toContain("img-src 'self' blob: data:");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("unsafe-eval"); // production
  });

  test("a custom map style (NEXT_PUBLIC_MAP_STYLE_URL) is allowed automatically", () => {
    const csp = buildContentSecurityPolicy({ ...production, mapStyleUrl: "https://maps.example.org/style.json" });
    expect(csp).toContain("connect-src 'self' https://maps.example.org");
  });

  test("a relative or mistyped map style URL never breaks the build", () => {
    // A relative style is served by this site ('self'); an invalid one simply adds no host.
    expect(() => buildContentSecurityPolicy({ ...production, mapStyleUrl: "/style.json" })).not.toThrow();
    expect(() => buildContentSecurityPolicy({ ...production, mapStyleUrl: "not a url" })).not.toThrow();
    expect(buildContentSecurityPolicy({ ...production, mapStyleUrl: "not a url" })).toContain("connect-src 'self';");
    expect(mapStyleOrigin("https://tiles.openfreemap.org/styles/liberty")).toBe("https://tiles.openfreemap.org");
  });

  test("map images may also come straight from the map host", () => {
    expect(buildContentSecurityPolicy(production)).toContain("img-src 'self' blob: data: https://tiles.openfreemap.org");
  });

  test("development adds only what React and hot reload need", () => {
    const csp = buildContentSecurityPolicy({ ...production, isDevelopment: true });
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("ws:");
  });
});

// L-02: dev-server origins are exact IPs, never wildcards.
describe("DEV_ALLOWED_ORIGINS", () => {
  test("reads exact addresses and drops wildcards and blanks", () => {
    expect(parseDevAllowedOrigins("192.168.1.23, 192.168.1.24")).toEqual(["192.168.1.23", "192.168.1.24"]);
    expect(parseDevAllowedOrigins("192.168.*.*,10.0.0.5,")).toEqual(["10.0.0.5"]);
    expect(parseDevAllowedOrigins(undefined)).toEqual([]);
  });

  test("a typed scheme or port is removed (Next.js compares host names only)", () => {
    expect(parseDevAllowedOrigins("http://192.168.1.2:3000")).toEqual(["192.168.1.2"]);
    expect(parseDevAllowedOrigins("192.168.1.2:3000")).toEqual(["192.168.1.2"]);
    expect(parseDevAllowedOrigins("fe80::1, [fe80::2]:3000")).toEqual(["[fe80::1]", "[fe80::2]"]);
  });
});

// L-04: playtest tools only where intended, and "clear" only clears saved walks.
describe("playtest tools", () => {
  test.each([
    [{ NODE_ENV: "development" }, true],
    [{ NODE_ENV: "test" }, true],
    [{ NODE_ENV: "production" }, false],
    [{ NODE_ENV: "production", NEXT_PUBLIC_PLAYTEST_TOOLS: "false" }, false],
    [{ NODE_ENV: "production", NEXT_PUBLIC_PLAYTEST_TOOLS: "true" }, true],
  ])("isPlaytestEnabled(%o) = %s", (env, expected) => {
    expect(isPlaytestEnabled(env)).toBe(expected);
  });

  test("'Clear saved walks' removes only saved walks, not the chosen language or other keys", () => {
    window.localStorage.clear();
    window.localStorage.setItem(storageKey("hidden-pubs"), "{}");
    window.localStorage.setItem(storageKey("classics-of-antwerp"), "{}");
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "nl");
    window.localStorage.setItem("something-else", "x");

    clearSavedWalks(window.localStorage);

    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).toBeNull();
    expect(window.localStorage.getItem(storageKey("classics-of-antwerp"))).toBeNull();
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("nl");
    expect(window.localStorage.getItem("something-else")).toBe("x");
  });
});

// L-39 / SEC-07: the data scripts validate their input and survive flaky networks.
describe("data script helpers", () => {
  test("the walk folder argument must be a plain folder name", () => {
    expect(readWalkFolderArg("hidden-pubs", "usage")).toBe("hidden-pubs");
    expect(() => readWalkFolderArg(undefined, "usage")).toThrow(/Usage/);
    expect(() => readWalkFolderArg("../../etc", "usage")).toThrow(/Invalid walk folder/);
    expect(() => readWalkFolderArg("Hidden Pubs", "usage")).toThrow(/Invalid walk folder/);
  });

  test("image paths can't escape public/images/", () => {
    const images = pathToFileURL("/repo/public/images/");
    const publicDir = pathToFileURL("/repo/public/");
    expect(isInsideDirectory(new URL("images/classics/a.jpg", publicDir), images)).toBe(true);
    expect(isInsideDirectory(new URL("../../outside.jpg", publicDir), images)).toBe(false);
    expect(isInsideDirectory(new URL("favicon.ico", publicDir), images)).toBe(false);
  });

  test("known hosts are upgraded to https; other links stay as they are", () => {
    expect(toHttps("http://creativecommons.org/publicdomain/zero/1.0/deed.en")).toBe(
      "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
    );
    expect(toHttps("http://unknown.example.com/page")).toBe("http://unknown.example.com/page");
    expect(toHttps(null)).toBeNull();
  });

  test("retries a busy server (429, 5xx) and network errors, then succeeds", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 429 }))
      .mockRejectedValueOnce(new TypeError("network down"))
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    const response = await fetchWithRetry("https://x", {}, { retries: 3, fetchImpl, wait: async () => {} });
    expect(await response.text()).toBe("ok");
    expect(fetchImpl).toHaveBeenCalledTimes(4);
  });

  test("a rate limit waits as the server asks (Retry-After), and unread bodies are released", async () => {
    const waits: number[] = [];
    const cancel = vi.fn(async () => {});
    const limited = new Response("slow down", { status: 429, headers: { "Retry-After": "7" } });
    Object.defineProperty(limited, "body", { value: { cancel } });
    const fetchImpl = vi.fn().mockResolvedValueOnce(limited).mockResolvedValueOnce(new Response("ok"));
    await fetchWithRetry("https://x", {}, { fetchImpl, wait: async (ms: number) => void waits.push(ms) });
    expect(waits).toEqual([7_000]);
    expect(cancel).toHaveBeenCalled();
  });

  test("without Retry-After, a rate limit rests 15 s (not 2 s) before retrying", async () => {
    const waits: number[] = [];
    const fetchImpl = vi.fn().mockResolvedValueOnce(new Response("", { status: 429 })).mockResolvedValueOnce(new Response("ok"));
    await fetchWithRetry("https://x", {}, { fetchImpl, wait: async (ms: number) => void waits.push(ms) });
    expect(waits).toEqual([15_000]);
    expect(retryAfterMs(new Response("", { headers: { "Retry-After": "600" } }))).toBe(60_000); // capped
  });

  test("encoded or backslash tricks in image paths are refused", () => {
    const images = pathToFileURL("/repo/public/images/");
    const publicDir = pathToFileURL("/repo/public/");
    for (const trick of ["images\\..\\..\\x.jpg", "%2e%2e/x.jpg", "images/%2e%2e/%2e%2e/x.jpg", "images"]) {
      expect(isInsideDirectory(new URL(trick, publicDir), images), trick).toBe(false);
    }
    // A link with a port or credentials is left alone (https on that port may not exist).
    expect(toHttps("http://creativecommons.org:8080/licenses/by/4.0/")).toBe("http://creativecommons.org:8080/licenses/by/4.0/");
    expect(toHttps("http://user@creativecommons.org/x")).toBe("http://user@creativecommons.org/x");
    // The default port 80 is dropped, not carried over to https.
    expect(toHttps("http://creativecommons.org:80/x?a=1#b")).toBe("https://creativecommons.org/x?a=1#b");
  });

  test("a real error (404) fails at once, and endless trouble gives up", async () => {
    const notFound = vi.fn().mockResolvedValue(new Response("", { status: 404 }));
    await expect(fetchWithRetry("https://x", {}, { fetchImpl: notFound, wait: async () => {} })).rejects.toThrow(/404/);
    expect(notFound).toHaveBeenCalledTimes(1);

    const alwaysBusy = vi.fn().mockResolvedValue(new Response("", { status: 503 }));
    await expect(
      fetchWithRetry("https://x", {}, { retries: 2, fetchImpl: alwaysBusy, wait: async () => {} }),
    ).rejects.toThrow(/Gave up after 3 attempts/);
  });
});
