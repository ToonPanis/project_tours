import { describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as mediaCleanupRoute } from "@/app/api/cron/media-cleanup/route";
import { POST as createGameRoute } from "@/app/api/games/route";
import { GET as lobbyRoute } from "@/app/api/games/[code]/route";
import { POST as joinRoute } from "@/app/api/games/[code]/join/route";
import { GET as stateRoute } from "@/app/api/games/[code]/state/route";
import { POST as actionsRoute } from "@/app/api/games/[code]/actions/route";
import { playerCookieName } from "@/features/pub-game/server/identity";

/**
 * The Route Handlers called directly, like Next.js does, with real Request
 * objects. They use the development memory store (shared by these tests).
 */

// after() only works inside a real Next.js request; here it collects the work for later.
const afterResponse = vi.hoisted(() => ({ tasks: [] as (() => unknown)[] }));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => unknown) => {
    afterResponse.tasks.push(task);
  },
}));

const ORIGIN = "http://localhost:3000";

function post(path: string, body: unknown, { cookie, origin = ORIGIN, contentType = "application/json" } = {} as {
  cookie?: string;
  origin?: string;
  contentType?: string;
}) {
  const headers: Record<string, string> = { "content-type": contentType, origin };
  if (cookie) headers.cookie = cookie;
  return new NextRequest(`${ORIGIN}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
}

function get(path: string, cookie?: string) {
  return new NextRequest(`${ORIGIN}${path}`, { headers: cookie ? { cookie } : {} });
}

const params = (code: string) => ({ params: Promise.resolve({ code }) });

async function createTestGame() {
  const response = await createGameRoute(
    post("/api/games", {
      walkSlug: "hidden-pubs",
      teamNames: ["Red", "Blue"],
      playersPerTeam: 3,
      hostName: "Host",
      hostTeamIndex: 0,
      adultsConfirmed: true,
    }),
  );
  const body = (await response.json()) as { code: string; playerId: string };
  const cookie = response.cookies.get(playerCookieName(body.code));
  if (!cookie) throw new Error("no cookie");
  return { response, body, cookie, cookieHeader: `${cookie.name}=${cookie.value}` };
}

describe("API routes", () => {
  test("creating a game sets an httpOnly cookie and never puts the secret in the JSON", async () => {
    const { response, body, cookie } = await createTestGame();
    expect(response.status).toBe(201);
    expect(Object.keys(body).sort()).toEqual(["code", "playerId"]);
    expect(cookie).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
    expect(JSON.stringify(body)).not.toContain(cookie.value);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  test("join, poll and act with the cookie; codes work in lower case too", async () => {
    const { body } = await createTestGame();
    const code = body.code.toLowerCase();

    const lobby = await lobbyRoute(get(`/api/games/${code}`), params(code));
    expect(((await lobby.json()) as { teams: unknown[] }).teams).toHaveLength(2);

    const joined = await joinRoute(
      post(`/api/games/${code}/join`, { name: "Bea", teamId: "t2", adultsConfirmed: true }),
      params(code),
    );
    expect(joined.status).toBe(200);
    const beaCookie = joined.cookies.get(playerCookieName(body.code))!;
    const beaHeader = `${beaCookie.name}=${beaCookie.value}`;

    // Joining again from the same phone: same player, no new cookie.
    const again = await joinRoute(
      post(`/api/games/${code}/join`, { name: "Bea", teamId: "t2", adultsConfirmed: true }, { cookie: beaHeader }),
      params(code),
    );
    expect(await again.json()).toEqual(await joined.clone().json());
    expect(again.cookies.get(playerCookieName(body.code))).toBeUndefined();

    const state = await stateRoute(get(`/api/games/${code}/state`, beaHeader), params(code));
    const update = (await state.json()) as { changed: boolean; version: number; view: { me: { name: string } } };
    expect(update.view.me.name).toBe("Bea");

    const unchanged = await stateRoute(get(`/api/games/${code}/state?since=${update.version}`, beaHeader), params(code));
    expect(await unchanged.json()).toEqual({ changed: false, version: update.version });

    const refusal = await actionsRoute(
      post(`/api/games/${code}/actions`, { actionId: "bea-start-1", action: { type: "START_GAME" } }, { cookie: beaHeader }),
      params(code),
    );
    expect(refusal.status).toBe(409);
    expect(await refusal.json()).toEqual({ error: "not-host" });
  });

  test("refuses other sites, non-JSON, players without a cookie and unknown games", async () => {
    const { body, cookieHeader } = await createTestGame();
    const action = { actionId: "action-0001", action: { type: "START_GAME" } };
    const actions = (request: NextRequest) => actionsRoute(request, params(body.code));

    expect((await actions(post("/", action, { cookie: cookieHeader, origin: "https://evil.example" }))).status).toBe(403);
    expect((await actions(post("/", action, { cookie: cookieHeader, contentType: "text/plain" }))).status).toBe(415);
    expect((await actions(post("/", action))).status).toBe(401);
    expect((await stateRoute(get(`/api/games/${body.code}/state`), params(body.code))).status).toBe(401);
    expect((await lobbyRoute(get("/api/games/ZZZZZZ"), params("ZZZZZZ"))).status).toBe(404);

    const tooBig = new NextRequest(`${ORIGIN}/`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: ORIGIN, cookie: cookieHeader },
      body: JSON.stringify({ ...action, padding: "x".repeat(20_000) }),
    });
    expect((await actions(tooBig)).status).toBe(400);

    // The host's cookie works: the game logic answers (team Blue is still empty).
    const response = await actions(post("/", action, { cookie: cookieHeader }));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "empty-team" });
  });
});

describe("cleaning up old photos and videos (D29)", () => {
  test("creating a game doesn't wait for it: the cleanup is scheduled for after the answer", async () => {
    afterResponse.tasks.length = 0;
    await createTestGame();
    expect(afterResponse.tasks).toHaveLength(1);
    await afterResponse.tasks[0]();
  });

  test("the daily job only runs with Vercel's CRON_SECRET", async () => {
    const call = (authorization?: string) =>
      mediaCleanupRoute(new NextRequest(`${ORIGIN}/api/cron/media-cleanup`, { headers: authorization ? { authorization } : {} }));

    vi.stubEnv("CRON_SECRET", "");
    expect((await call("Bearer anything")).status).toBe(503);

    vi.stubEnv("CRON_SECRET", "s3cret-for-tests");
    expect((await call()).status).toBe(401);
    expect((await call("Bearer wrong")).status).toBe(401);
    expect((await call("s3cret-for-tests")).status).toBe(401);
    const ok = await call("Bearer s3cret-for-tests");
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ deleted: expect.any(Number) });
  });
});
