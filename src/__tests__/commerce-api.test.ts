import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as loginLinkRoute } from "@/app/api/admin/auth/login-link/route";
import { POST as logoutRoute } from "@/app/api/admin/auth/logout/route";
import { POST as verifyRoute } from "@/app/api/admin/auth/verify/route";
import { POST as priceRoute } from "@/app/api/admin/products/[id]/price/route";
import { POST as productRoute } from "@/app/api/admin/products/[id]/route";
import { ADMIN_SESSION_LIFETIME_MS } from "@/features/commerce/config";
import { STARTER_PRODUCTS } from "@/features/commerce/logic/starter-catalog";
import { ensureStarterCatalog } from "@/features/commerce/server/catalog-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { ADMIN_COOKIE } from "@/features/commerce/server/http";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { ADMIN_EMAIL, linkSecretFrom } from "./fixtures/commerce-context";

/**
 * The admin Route Handlers called directly, like Next.js does, with real
 * Request objects. They use the development memory store and memory mailer
 * (shared by these tests, kept on globalThis like in `next dev`).
 */

// after() only works inside a real Next.js request; here it collects the work so the test can run it.
const afterResponse = vi.hoisted(() => ({ tasks: [] as (() => unknown)[] }));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => unknown) => {
    afterResponse.tasks.push(task);
  },
}));

const ORIGIN = "http://localhost:3000";
let clientNumber = 0;

beforeEach(() => {
  vi.stubEnv("ADMIN_EMAILS", ADMIN_EMAIL);
  afterResponse.tasks.length = 0;
  // A fresh memory store and mailer per test (context.ts keeps them on globalThis), like a restarted dev server.
  const globals = globalThis as { commerceStore?: unknown; commerceMailer?: unknown };
  globals.commerceStore = undefined;
  globals.commerceMailer = undefined;
  // Every test is its own network address, so the shared rate-limit counters don't add up across tests.
  clientNumber += 1;
});

function post(path: string, body: unknown, options: { cookie?: string; origin?: string; contentType?: string } = {}) {
  const headers: Record<string, string> = {
    "content-type": options.contentType ?? "application/json",
    origin: options.origin ?? ORIGIN,
    "x-forwarded-for": `198.51.100.${clientNumber}`,
  };
  if (options.cookie) headers.cookie = options.cookie;
  return new NextRequest(`${ORIGIN}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
}

const params = (id: string) => ({ params: Promise.resolve({ id }) });

async function runAfterResponse() {
  for (const task of afterResponse.tasks.splice(0)) await task();
}

/** Signs in through the real routes and returns the Cookie header for the session. */
async function signIn(): Promise<string> {
  expect((await loginLinkRoute(post("/api/admin/auth/login-link", { email: ADMIN_EMAIL }))).status).toBe(200);
  await runAfterResponse();
  const token = linkSecretFrom(getCommerceContext().mailer as MemoryMailer);
  const response = await verifyRoute(post("/api/admin/auth/verify", { token }));
  expect(response.status).toBe(200);
  const cookie = response.cookies.get(ADMIN_COOKIE);
  if (!cookie) throw new Error("no session cookie");
  return `${cookie.name}=${cookie.value}`;
}

describe("sign-in routes", () => {
  test("the link email goes out after the answer, with a link to this site (development: the request's origin)", async () => {
    const mailer = getCommerceContext().mailer as MemoryMailer;
    const before = mailer.sent.length;
    const response = await loginLinkRoute(post("/api/admin/auth/login-link", { email: ADMIN_EMAIL }));
    expect(await response.json()).toEqual({ sent: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mailer.sent.length).toBe(before);
    await runAfterResponse();
    expect(mailer.sent.at(-1)?.text).toContain(`${ORIGIN}/admin/login/verify#`);
  });

  test("APP_BASE_URL wins over the request's own address (a forged Host can't redirect the link)", async () => {
    vi.stubEnv("APP_BASE_URL", "https://hiddenantwerp.example/");
    await loginLinkRoute(post("/api/admin/auth/login-link", { email: ADMIN_EMAIL }));
    await runAfterResponse();
    expect((getCommerceContext().mailer as MemoryMailer).sent.at(-1)?.text).toContain("https://hiddenantwerp.example/admin/login/verify#");
  });

  test("production without APP_BASE_URL refuses to send links", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("APP_BASE_URL", "");
    vi.stubEnv("COMMERCE_MEMORY_STORES", "true");
    const response = await loginLinkRoute(post("/api/admin/auth/login-link", { email: ADMIN_EMAIL }));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "not-configured" });
  });

  test("other sites and non-JSON bodies are refused, like the Hidden Pubs routes", async () => {
    expect((await loginLinkRoute(post("/api/admin/auth/login-link", { email: ADMIN_EMAIL }, { origin: "https://evil.example" }))).status).toBe(403);
    expect((await verifyRoute(post("/api/admin/auth/verify", { token: "x" }, { contentType: "text/plain" }))).status).toBe(415);
    expect((await logoutRoute(post("/api/admin/auth/logout", {}, { origin: "https://evil.example" }))).status).toBe(403);
  });

  test("the session cookie is httpOnly, SameSite=Strict and lasts as long as the session", async () => {
    await loginLinkRoute(post("/api/admin/auth/login-link", { email: ADMIN_EMAIL }));
    await runAfterResponse();
    const token = linkSecretFrom(getCommerceContext().mailer as MemoryMailer);
    const response = await verifyRoute(post("/api/admin/auth/verify", { token }));
    expect(await response.json()).toEqual({ email: ADMIN_EMAIL });
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${ADMIN_COOKIE}=`);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Strict/i);
    expect(setCookie).toContain(`Max-Age=${ADMIN_SESSION_LIFETIME_MS / 1000}`);
    // The secret is only in the cookie, never in the JSON body.
    expect(JSON.stringify(await verifyRoute(post("/api/admin/auth/verify", { token })).then((r) => r.json()))).not.toContain(token);
  });

  test("a used or made-up link answers 400 without a cookie", async () => {
    const response = await verifyRoute(post("/api/admin/auth/verify", { token: "made-up-token-made-up-token-made-up-1234" }));
    expect(response.status).toBe(400);
    expect(response.cookies.get(ADMIN_COOKIE)).toBeUndefined();
  });

  test("signing out removes the cookie and ends the session", async () => {
    const cookie = await signIn();
    const response = await logoutRoute(post("/api/admin/auth/logout", {}, { cookie }));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toMatch(new RegExp(`${ADMIN_COOKIE}=;`));
    // The old cookie doesn't work anymore.
    expect((await productRoute(post(`/api/admin/products/${STARTER_PRODUCTS[0].id}`, { name: "x" }, { cookie }), params(STARTER_PRODUCTS[0].id))).status).toBe(401);
  });
});

describe("product routes", () => {
  const id = STARTER_PRODUCTS[0].id;

  test("without a session: 401, nothing changes", async () => {
    await ensureStarterCatalog(getCommerceContext());
    const before = await getCommerceContext().store.getProduct(id);
    expect((await productRoute(post(`/api/admin/products/${id}`, { name: "Hacked" }), params(id))).status).toBe(401);
    expect((await priceRoute(post(`/api/admin/products/${id}/price`, { amount: "0,01" }), params(id))).status).toBe(401);
    expect((await productRoute(post(`/api/admin/products/${id}`, { name: "Hacked" }, { cookie: `${ADMIN_COOKIE}=forged` }), params(id))).status).toBe(401);
    expect(await getCommerceContext().store.getProduct(id)).toEqual(before);
  });

  test("an admin changes a product and its price", async () => {
    await ensureStarterCatalog(getCommerceContext());
    const cookie = await signIn();
    const renamed = await productRoute(post(`/api/admin/products/${id}`, { name: "Classics", vatRateBasisPoints: 2100 }, { cookie }), params(id));
    expect(renamed.status).toBe(200);
    expect(await renamed.json()).toMatchObject({ id, name: "Classics", vatRateBasisPoints: 2100 });

    const priced = await priceRoute(post(`/api/admin/products/${id}/price`, { amount: "8,50" }, { cookie }), params(id));
    expect(priced.status).toBe(200);
    expect(await priced.json()).toMatchObject({ currentPrice: { amountCents: 850, createdBy: ADMIN_EMAIL } });
  });

  test("invalid input and unknown products get their error code", async () => {
    await ensureStarterCatalog(getCommerceContext());
    const cookie = await signIn();
    const bad = await priceRoute(post(`/api/admin/products/${id}/price`, { amount: "lots" }, { cookie }), params(id));
    expect(bad.status).toBe(400);
    expect(await bad.json()).toEqual({ error: "invalid-amount" });
    expect((await productRoute(post("/api/admin/products/nope", { name: "x" }, { cookie }), params("nope"))).status).toBe(404);
  });
});
