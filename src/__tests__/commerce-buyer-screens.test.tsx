import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BuyBox } from "@/features/commerce/components/BuyBox";
import { OpenTicket } from "@/features/commerce/components/OpenTicket";
import { TicketRequired } from "@/features/commerce/components/TicketRequired";
import { MAX_PERSONS_PER_ORDER } from "@/features/commerce/config";
import { englishTranslator as t } from "@/i18n/translate";

// Every expected text comes from the translations (English: rendered without a language provider).

function answer(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));
}

describe("buy box", () => {
  test("sends only what the buyer chose (walk, persons, code, language): never a price", async () => {
    const fetchMock = answer(200, { url: "https://checkout.stripe.test/cs_1" });
    vi.stubGlobal("fetch", fetchMock);
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    render(<BuyBox walkSlug="classics-of-antwerp" unitPriceCents={795} />);

    fireEvent.click(screen.getByRole("button", { name: t("commerce.buy.increase") }));
    expect(screen.getByText(t.plural("commerce.persons", 3))).toBeDefined();
    fireEvent.change(screen.getByLabelText(t("commerce.buy.discountCode")), { target: { value: " welcome " } });
    fireEvent.click(screen.getByRole("button", { name: t("commerce.buy.button") }));

    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.stripe.test/cs_1"));
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/checkout");
    expect(JSON.parse(String(init.body))).toEqual({ walkSlug: "classics-of-antwerp", quantity: 3, discountCode: "welcome", locale: "en" });
  });

  test("persons stay between 1 and the maximum", () => {
    render(<BuyBox walkSlug="classics-of-antwerp" unitPriceCents={795} />);
    const fewer = screen.getByRole("button", { name: t("commerce.buy.decrease") });
    fireEvent.click(fewer);
    expect((fewer as HTMLButtonElement).disabled).toBe(true);
    const more = screen.getByRole("button", { name: t("commerce.buy.increase") });
    for (let i = 0; i < MAX_PERSONS_PER_ORDER + 5; i++) fireEvent.click(more);
    expect((more as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(t.plural("commerce.persons", MAX_PERSONS_PER_ORDER))).toBeDefined();
  });

  test("a refusal is shown in the buyer's language; unknown codes become the general message", async () => {
    vi.stubGlobal("fetch", answer(400, { error: "discount-expired" }));
    render(<BuyBox walkSlug="classics-of-antwerp" unitPriceCents={795} />);
    fireEvent.click(screen.getByRole("button", { name: t("commerce.buy.button") }));
    expect(await screen.findByText(t("commerce.errors.discount-expired"))).toBeDefined();

    vi.stubGlobal("fetch", answer(429, { error: "too-many-requests" }));
    fireEvent.click(screen.getByRole("button", { name: t("commerce.buy.button") }));
    expect(await screen.findByText(t("commerce.errors.generic"))).toBeDefined();
  });
});

describe("opening a ticket", () => {
  test("sends the ticket from after # once, removes it from the address bar, then offers to start the walk", async () => {
    const fetchMock = answer(200, { walkSlug: "classics-of-antwerp" });
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState(null, "", "/tickets/open#grant-id.signature");
    render(<OpenTicket />);
    const start = await screen.findByRole("link", { name: t("commerce.ticket.start") });
    expect(start.getAttribute("href")).toBe("/walks/classics-of-antwerp/play");
    expect(JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body))).toEqual({ token: "grant-id.signature" });
    expect(window.location.hash).toBe("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("a link without its ticket, or a full ticket: a clear message", async () => {
    window.history.replaceState(null, "", "/tickets/open");
    const { unmount } = render(<OpenTicket />);
    expect(await screen.findByText(t("commerce.ticket.missing"))).toBeDefined();
    unmount();

    vi.stubGlobal("fetch", answer(409, { error: "ticket-full" }));
    window.history.replaceState(null, "", "/tickets/open#x.y");
    render(<OpenTicket />);
    expect(await screen.findByText(t("commerce.errors.ticket-full"))).toBeDefined();
  });
});

test("the 'ticket needed' screen links to buying on the walk page", () => {
  render(<TicketRequired walkSlug="classics-of-antwerp" t={t} />);
  expect(screen.getByRole("heading", { level: 1, name: t("commerce.paywall.title") })).toBeDefined();
  expect(screen.getByRole("link", { name: t("commerce.paywall.buy") }).getAttribute("href")).toBe("/walks/classics-of-antwerp#buy");
});
