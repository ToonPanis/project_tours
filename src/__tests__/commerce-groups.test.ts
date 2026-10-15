import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as createGameRoute } from "@/app/api/games/route";
import { GET as lobbyRoute } from "@/app/api/games/[code]/route";
import { POST as joinRoute } from "@/app/api/games/[code]/join/route";
import { updateProduct } from "@/features/commerce/server/catalog-service";
import { startCheckout } from "@/features/commerce/server/checkout-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { handlePaymentEvent } from "@/features/commerce/server/fulfilment-service";
import { revokeTicket } from "@/features/commerce/server/order-admin-service";
import { activateTicket, newGameAccess, reserveTicketForGame, ticketCookieName } from "@/features/commerce/server/ticket-service";
import { signTicketToken } from "@/features/commerce/server/ticket-token";
import { FakePaymentGateway } from "./fixtures/commerce-context";
import { ADMIN, openSales, paidEvent } from "./fixtures/commerce-sales";

/**
 * Hidden Pubs with tickets (P3), through the real routes: the organiser's
 * ticket creates one game with as many places as tickets were bought.
 * Games and commerce data live in the development memory stores.
 */

vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: () => {},
}));

const ORIGIN = "http://localhost:3000";
const WALK = "hidden-pubs";
const globals = globalThis as { commerceStore?: unknown; commerceMailer?: unknown; commercePayments?: unknown };

beforeEach(() => {
  globals.commerceStore = undefined;
  globals.commerceMailer = undefined;
  globals.commercePayments = new FakePaymentGateway();
  vi.stubEnv("COMMERCE_SALES_ENABLED", "true");
});

function post(path: string, body: unknown, cookie?: string) {
  const headers: Record<string, string> = { "content-type": "application/json", origin: ORIGIN };
  if (cookie) headers.cookie = cookie;
  return new NextRequest(`${ORIGIN}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
}

const gameSettings = { walkSlug: WALK, teamNames: ["Red", "Blue"], playersPerTeam: 10, hostName: "Organiser", hostTeamIndex: 0, adultsConfirmed: true };

/** Hidden Pubs on sale, `persons` tickets bought and paid, the ticket opened on the organiser's phone. Returns its cookie. */
async function organiserWithTicket(persons: number) {
  const ctx = getCommerceContext();
  await openSales(ctx);
  const updated = await updateProduct(ctx, ADMIN, WALK, { taxCategoryId: "experience", active: true });
  if (!updated.ok) throw new Error(updated.error);
  const started = await startCheckout(ctx, { walkSlug: WALK, quantity: persons }, ORIGIN);
  if (!started.ok) throw new Error(started.error);
  const order = (await ctx.store.getOrder(started.data.orderId))!;
  await handlePaymentEvent(ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId: order.stripe.checkoutSessionId! }), ORIGIN);
  const grant = (await ctx.store.getGrantByOrder(order.id))!;
  const opened = await activateTicket(ctx, { token: signTicketToken(grant.id, ctx.ticketSigningKey) }, () => undefined);
  if (!opened.ok || !opened.data.deviceSecret) throw new Error("ticket not opened");
  return { grant, order, cookie: `${ticketCookieName(WALK)}=${opened.data.deviceSecret}` };
}

async function lobby(code: string) {
  return (await (await lobbyRoute(new NextRequest(`${ORIGIN}/api/games/${code}`), { params: Promise.resolve({ code }) })).json()) as {
    seats: { taken: number; limit: number } | null;
  };
}

describe("creating a Hidden Pubs game with sales open", () => {
  test("without a ticket on this phone: refused (403 ticket-required)", async () => {
    await organiserWithTicket(4);
    const response = await createGameRoute(post("/api/games", gameSettings));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "ticket-required" });
  });

  test.each([2, 4, 6, 10])("a ticket for %i persons: the game gets that many places, and they fill exactly", async (persons) => {
    const { cookie, grant } = await organiserWithTicket(persons);
    const created = await createGameRoute(post("/api/games", gameSettings, cookie));
    expect(created.status).toBe(201);
    const { code } = (await created.json()) as { code: string };
    expect(await lobby(code)).toMatchObject({ seats: { taken: 1, limit: persons } });
    expect((await getCommerceContext().store.getGrant(grant.id))?.gameCode).toBe(code);

    for (let i = 1; i < persons; i++) {
      const joined = await joinRoute(post(`/api/games/${code}/join`, { name: `Player ${i}`, teamId: "t2", adultsConfirmed: true }), { params: Promise.resolve({ code }) });
      expect(joined.status).toBe(200);
    }
    const extra = await joinRoute(post(`/api/games/${code}/join`, { name: "Extra", teamId: "t2", adultsConfirmed: true }), { params: Promise.resolve({ code }) });
    expect(extra.status).toBe(409);
    expect(await extra.json()).toEqual({ error: "game-full" });
  });

  test("one ticket, one game: a second game with the same ticket is refused, and the page can send the organiser back", async () => {
    const { cookie, grant } = await organiserWithTicket(3);
    const first = await createGameRoute(post("/api/games", gameSettings, cookie));
    const { code } = (await first.json()) as { code: string };
    const second = await createGameRoute(post("/api/games", gameSettings, cookie));
    expect(second.status).toBe(409);
    expect(await second.json()).toEqual({ error: "ticket-used" });
    const access = await newGameAccess(getCommerceContext(), WALK, cookie.split("=")[1]);
    expect(access).toEqual({ status: "used", gameCode: code });
    expect((await getCommerceContext().store.getGrant(grant.id))?.gameCode).toBe(code);
  });

  test("two games created with the same ticket at the same moment: exactly one", async () => {
    const { cookie } = await organiserWithTicket(3);
    const responses = await Promise.all([createGameRoute(post("/api/games", gameSettings, cookie)), createGameRoute(post("/api/games", gameSettings, cookie))]);
    expect(responses.map((response) => response.status).sort()).toEqual([201, 409]);
  });

  test("a form mistake gives the ticket back: it can still be used", async () => {
    const { cookie, grant } = await organiserWithTicket(3);
    const wrong = await createGameRoute(post("/api/games", { ...gameSettings, adultsConfirmed: false }, cookie));
    expect(wrong.status).toBe(400);
    expect((await getCommerceContext().store.getGrant(grant.id))?.gameCode).toBeNull();
    expect((await createGameRoute(post("/api/games", gameSettings, cookie))).status).toBe(201);
  });

  test("a reservation left by a crashed request is taken over after 2 minutes, not before", async () => {
    const { cookie, grant } = await organiserWithTicket(3);
    const ctx = getCommerceContext();
    const stuck = await reserveTicketForGame(ctx, grant.id, null);
    expect(stuck).toMatch(/^pending:/);
    expect(await newGameAccess(ctx, WALK, cookie.split("=")[1])).toEqual({ status: "used", gameCode: null });
    // Two minutes later (the reservation's time is in the past):
    await ctx.store.swapGrantGame(grant.id, stuck, `pending:${Date.now() - 3 * 60 * 1000}:old`);
    expect(await newGameAccess(ctx, WALK, cookie.split("=")[1])).toMatchObject({ status: "ready", seats: 3 });
    expect((await createGameRoute(post("/api/games", gameSettings, cookie))).status).toBe(201);
  });

  test("a revoked (refunded) ticket can't create a game", async () => {
    const { cookie, order } = await organiserWithTicket(3);
    await revokeTicket(getCommerceContext(), ADMIN, order.id);
    expect((await createGameRoute(post("/api/games", gameSettings, cookie))).status).toBe(403);
  });
});

describe("with sales closed", () => {
  test("games are created exactly as before: no ticket, no limit", async () => {
    vi.stubEnv("COMMERCE_SALES_ENABLED", "");
    const created = await createGameRoute(post("/api/games", gameSettings));
    expect(created.status).toBe(201);
    const { code } = (await created.json()) as { code: string };
    expect(await lobby(code)).toMatchObject({ seats: null });
  });
});
