import { describe, expect, test } from "vitest";
import { TICKET_VALIDITY_MS } from "@/features/commerce/config";
import { startCheckout } from "@/features/commerce/server/checkout-service";
import { createDiscount, listDiscounts, setDiscountActive } from "@/features/commerce/server/discount-service";
import { deliverDueEmails } from "@/features/commerce/server/email-service";
import { handlePaymentEvent } from "@/features/commerce/server/fulfilment-service";
import type { MemoryMailer } from "@/features/commerce/server/mailer";
import { getOrderDetail, listOrdersPage, resendConfirmation, resetTicketDevices, revokeTicket } from "@/features/commerce/server/order-admin-service";
import { getTaxSettings, updateTaxSettings } from "@/features/commerce/server/tax-service";
import { activateTicket, playAccess, ticketUrl } from "@/features/commerce/server/ticket-service";
import { signTicketToken } from "@/features/commerce/server/ticket-token";
import { BASE_URL, TICKET_KEY, testCommerceContext, ticketTokenFrom } from "./fixtures/commerce-context";
import { ADMIN, openSales, paidEvent, SOLD, TEST_TAX } from "./fixtures/commerce-sales";

type Setup = ReturnType<typeof testCommerceContext>;

/** Buys `quantity` tickets and returns the order and the token from the confirmation email. */
async function ticketFor(setup: Setup, quantity = 2) {
  const started = await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity, locale: "en" }, BASE_URL);
  if (!started.ok) throw new Error(started.error);
  const order = (await setup.store.getOrder(started.data.orderId))!;
  await handlePaymentEvent(setup.ctx, paidEvent({ id: order.id, totalCents: order.totalCents, sessionId: order.stripe.checkoutSessionId! }), BASE_URL);
  await deliverDueEmails(setup.ctx);
  const token = ticketTokenFrom((setup.mailer as MemoryMailer).sent.at(-1)!.text);
  return { order, token };
}

async function salesSetup() {
  const setup = testCommerceContext({ salesEnabled: true });
  await openSales(setup.ctx);
  return setup;
}

/** Opens the ticket on a phone with these cookies (walk → secret); returns the new cookie, if any. */
async function open(setup: Setup, token: string, cookies: Record<string, string> = {}) {
  return activateTicket(setup.ctx, { token }, (walkSlug) => cookies[walkSlug]);
}

describe("opening a ticket on phones", () => {
  test("each phone takes one seat; the same phone again takes none; a full ticket refuses another phone", async () => {
    const setup = await salesSetup();
    const { order, token } = await ticketFor(setup, 2);

    const first = await open(setup, token);
    expect(first.ok && first.data).toMatchObject({ walkSlug: SOLD.walkSlug });
    const firstSecret = first.ok ? first.data.deviceSecret : null;
    expect(firstSecret).toBeTruthy();

    const again = await open(setup, token, { [SOLD.walkSlug]: firstSecret! });
    expect(again.ok && again.data.deviceSecret).toBeNull();

    expect((await open(setup, token)).ok).toBe(true);
    expect(await open(setup, token)).toEqual({ ok: false, status: 409, error: "ticket-full" });
    expect((await setup.store.getGrantByOrder(order.id))?.devicesUsed).toBe(2);
  });

  test("two phones opening the last seat at the same moment: one gets it", async () => {
    const setup = await salesSetup();
    const { token } = await ticketFor(setup, 1);
    const results = await Promise.all([open(setup, token), open(setup, token)]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
  });

  test("made-up, changed or other-key links are refused", async () => {
    const setup = await salesSetup();
    const { token } = await ticketFor(setup);
    expect(await open(setup, `${token}x`)).toEqual({ ok: false, status: 400, error: "invalid-ticket" });
    expect(await open(setup, signTicketToken("00000000-0000-4000-8000-000000000000", TICKET_KEY))).toEqual({ ok: false, status: 400, error: "invalid-ticket" });
    const grantId = token.split(".")[0];
    expect(await open(setup, signTicketToken(grantId, "another-key-another-key-another-key"))).toEqual({ ok: false, status: 400, error: "invalid-ticket" });
    expect(await activateTicket(setup.ctx, {}, () => undefined)).toEqual({ ok: false, status: 400, error: "invalid-ticket" });
  });

  test("a revoked or expired ticket can't be opened", async () => {
    const setup = await salesSetup();
    const { order, token } = await ticketFor(setup);
    setup.advance(TICKET_VALIDITY_MS);
    expect(await open(setup, token)).toEqual({ ok: false, status: 410, error: "ticket-expired" });
    await revokeTicket(setup.ctx, ADMIN, order.id);
    expect(await open(setup, token)).toEqual({ ok: false, status: 410, error: "ticket-revoked" });
  });
});

describe("who may play a walk", () => {
  test("sales closed: everyone, without asking the database (the site works as before)", async () => {
    const setup = testCommerceContext({ salesEnabled: false });
    await openSales(setup.ctx);
    expect(await playAccess(setup.ctx, SOLD.walkSlug, undefined)).toBe("open");
  });

  test("a walk that isn't on sale stays open", async () => {
    const setup = await salesSetup();
    expect(await playAccess(setup.ctx, "poortjes-van-antwerpen", undefined)).toBe("open");
  });

  test("on sale: a ticket is needed; a phone that opened its ticket may play; another walk's ticket doesn't count", async () => {
    const setup = await salesSetup();
    expect(await playAccess(setup.ctx, SOLD.walkSlug, undefined)).toBe("ticket-required");
    expect(await playAccess(setup.ctx, SOLD.walkSlug, "made-up-cookie")).toBe("ticket-required");
    const { token } = await ticketFor(setup);
    const opened = await open(setup, token);
    const secret = opened.ok ? opened.data.deviceSecret! : "";
    expect(await playAccess(setup.ctx, SOLD.walkSlug, secret)).toBe("granted");
    // The same cookie for another walk on sale:
    await setup.store.saveProduct({ ...(await setup.store.getProduct("poortjes-van-antwerpen"))!, active: true, taxCategoryId: "experience" });
    expect(await playAccess(setup.ctx, "poortjes-van-antwerpen", secret)).toBe("ticket-required");
  });

  test("revoking the ticket (or a refund) stops every phone; expiry too", async () => {
    const setup = await salesSetup();
    const { order, token } = await ticketFor(setup);
    const opened = await open(setup, token);
    const secret = opened.ok ? opened.data.deviceSecret! : "";
    await revokeTicket(setup.ctx, ADMIN, order.id);
    expect(await playAccess(setup.ctx, SOLD.walkSlug, secret)).toBe("ticket-required");

    const second = await ticketFor(setup);
    const openedSecond = await open(setup, second.token);
    setup.advance(TICKET_VALIDITY_MS);
    expect(await playAccess(setup.ctx, SOLD.walkSlug, openedSecond.ok ? openedSecond.data.deviceSecret! : "")).toBe("ticket-required");
  });
});

describe("admin: orders", () => {
  test("freeing all seats lets the group open the link again; the old phones lose access", async () => {
    const setup = await salesSetup();
    const { order, token } = await ticketFor(setup, 1);
    const opened = await open(setup, token);
    await resetTicketDevices(setup.ctx, ADMIN, order.id);
    expect(await playAccess(setup.ctx, SOLD.walkSlug, opened.ok ? opened.data.deviceSecret! : "")).toBe("ticket-required");
    expect((await open(setup, token)).ok).toBe(true);
    const actions = (await setup.store.listAudit({ skip: 0, limit: 5 })).entries.map((entry) => entry.action);
    expect(actions).toContain("ticket-devices-reset");
  });

  test("resending the confirmation sends a new email with the same ticket link", async () => {
    const setup = await salesSetup();
    const { order, token } = await ticketFor(setup);
    const before = (setup.mailer as MemoryMailer).sent.length;
    expect(await resendConfirmation(setup.ctx, ADMIN, order.id, BASE_URL)).toEqual({ ok: true, data: { queued: true } });
    await deliverDueEmails(setup.ctx);
    const sent = (setup.mailer as MemoryMailer).sent;
    expect(sent).toHaveLength(before + 1);
    expect(ticketTokenFrom(sent.at(-1)!.text)).toBe(token);
    expect(await resendConfirmation(setup.ctx, ADMIN, "nope", BASE_URL)).toEqual({ ok: false, status: 409, error: "nothing-to-resend" });
  });

  test("the ticket link can always be made again from the ticket id (it isn't stored)", async () => {
    const setup = await salesSetup();
    const { order, token } = await ticketFor(setup);
    const grant = (await setup.store.getGrantByOrder(order.id))!;
    expect(ticketUrl(setup.ctx, grant.id, BASE_URL)).toBe(`${BASE_URL}/tickets/open#${token}`);
  });

  test("order list (filter, pages) and detail", async () => {
    const setup = await salesSetup();
    const { order } = await ticketFor(setup);
    await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1 }, BASE_URL);
    expect((await listOrdersPage(setup.ctx, 1, 10, undefined)).total).toBe(2);
    expect(await listOrdersPage(setup.ctx, 1, 10, "paid")).toMatchObject({ total: 1, status: "paid" });
    expect(await listOrdersPage(setup.ctx, -3, 1, "nonsense")).toMatchObject({ page: 1, pageCount: 2, status: null });
    const detail = await getOrderDetail(setup.ctx, order.id);
    expect(detail?.grant?.seats).toBe(2);
    expect(detail?.documents.map((document) => document.kind)).toEqual(["receipt"]);
    expect(await getOrderDetail(setup.ctx, "x".repeat(101))).toBeNull();
    expect(await revokeTicket(setup.ctx, ADMIN, "nope")).toEqual({ ok: false, status: 404, error: "no-ticket" });
    expect(await resetTicketDevices(setup.ctx, ADMIN, "nope")).toEqual({ ok: false, status: 404, error: "no-ticket" });
  });
});

describe("admin: tax settings", () => {
  test("each save is a new version with the author; the audit log records it", async () => {
    const setup = testCommerceContext();
    expect((await getTaxSettings(setup.ctx)).version).toBe(0);
    const first = await updateTaxSettings(setup.ctx, ADMIN, TEST_TAX);
    const second = await updateTaxSettings(setup.ctx, ADMIN, { ...TEST_TAX, ossEnabled: false, ossRates: [] });
    expect(first.ok && first.data.version).toBe(1);
    expect(second.ok && second.data).toMatchObject({ version: 2, updatedBy: ADMIN.email, ossEnabled: false });
    expect((await getTaxSettings(setup.ctx)).version).toBe(2);
    const [latest] = (await setup.store.listAudit({ skip: 0, limit: 1 })).entries;
    expect(latest).toMatchObject({ action: "tax-settings-updated", details: { version: 2, ossEnabled: false } });
  });

  test("a save without the confirmation ticked closes sales, also when only a rate changed", async () => {
    const setup = testCommerceContext({ salesEnabled: true });
    await openSales(setup.ctx);
    await updateTaxSettings(setup.ctx, ADMIN, { ...TEST_TAX, confirmedByAccountant: false });
    expect((await startCheckout(setup.ctx, { walkSlug: SOLD.walkSlug, quantity: 1 }, BASE_URL)).ok).toBe(false);
  });

  test("a category still used by a product can't be removed; invalid forms are refused", async () => {
    const setup = testCommerceContext({ salesEnabled: true });
    await openSales(setup.ctx);
    expect(await updateTaxSettings(setup.ctx, ADMIN, { ...TEST_TAX, categories: [{ id: "other", label: "Other", rateBasisPoints: 0 }], ossRates: [] })).toEqual({
      ok: false,
      status: 409,
      error: "category-in-use",
    });
    expect(await updateTaxSettings(setup.ctx, ADMIN, { regime: "nope" })).toEqual({ ok: false, status: 400, error: "invalid-regime" });
  });

  test("two admins saving at the same moment: one wins, the other is told", async () => {
    const setup = testCommerceContext();
    const results = await Promise.all([updateTaxSettings(setup.ctx, ADMIN, TEST_TAX), updateTaxSettings(setup.ctx, ADMIN, TEST_TAX)]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.find((result) => !result.ok)).toEqual({ ok: false, status: 409, error: "saved-at-the-same-time" });
  });
});

describe("admin: discount codes", () => {
  test("created once per code, switched off and on, listed; every change in the audit log", async () => {
    const setup = testCommerceContext();
    const created = await createDiscount(setup.ctx, ADMIN, { code: "spring", kind: "percent", value: 10 });
    expect(created.ok && created.data).toMatchObject({ code: "SPRING", active: true, redemptions: 0, createdBy: ADMIN.email });
    expect(await createDiscount(setup.ctx, ADMIN, { code: "SPRING", kind: "fixed", value: "5" })).toEqual({ ok: false, status: 409, error: "code-exists" });
    const id = created.ok ? created.data.id : "";
    expect((await setDiscountActive(setup.ctx, ADMIN, id, { active: false })).ok).toBe(true);
    expect((await listDiscounts(setup.ctx))[0].active).toBe(false);
    expect(await setDiscountActive(setup.ctx, ADMIN, id, { active: "no" })).toEqual({ ok: false, status: 400, error: "invalid-active" });
    expect(await setDiscountActive(setup.ctx, ADMIN, "nope", { active: true })).toEqual({ ok: false, status: 404, error: "unknown-discount" });
    const actions = (await setup.store.listAudit({ skip: 0, limit: 5 })).entries.map((entry) => entry.action);
    expect(actions).toEqual(["discount-updated", "discount-created"]);
    expect(await createDiscount(setup.ctx, ADMIN, { code: "x" })).toEqual({ ok: false, status: 400, error: "invalid-code" });
  });
});
