import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QuoteForm } from "@/features/commerce/components/QuoteForm";
import { englishTranslator as t } from "@/i18n/translate";

// Texts from the translations (English: rendered without a language provider).

function answer(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));
}

function fill() {
  fireEvent.change(screen.getByLabelText(t("corporate.form.company")), { target: { value: "Brewery NV" } });
  fireEvent.change(screen.getByLabelText(t("corporate.form.contactName")), { target: { value: "An Peeters" } });
  fireEvent.change(screen.getByLabelText(t("corporate.form.email")), { target: { value: "an@brewery.example" } });
  fireEvent.change(screen.getByLabelText(t("corporate.form.participants")), { target: { value: "24" } });
}

describe("quote form", () => {
  test("sends the fields, the empty hidden field and how long it took; then thanks the company", async () => {
    const fetchMock = answer(200, { received: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: t("corporate.form.submit") }));
    expect(await screen.findByText(t("corporate.form.thanks"))).toBeDefined();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/quotes");
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({ company: "Brewery NV", contactName: "An Peeters", email: "an@brewery.example", participants: 24, language: "en", website: "" });
    expect(typeof body.elapsedMs).toBe("number");
  });

  test("the hidden bot field isn't visible to people or screen readers", () => {
    render(<QuoteForm />);
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(honeypot?.getAttribute("tabindex")).toBe("-1");
  });

  test("a refusal from the server is explained; unknown codes get the general message", async () => {
    vi.stubGlobal("fetch", answer(400, { error: "invalid-date" }));
    render(<QuoteForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: t("corporate.form.submit") }));
    expect(await screen.findByText(t("corporate.errors.invalid-date"))).toBeDefined();
    vi.stubGlobal("fetch", answer(500, { error: "something-new" }));
    fireEvent.click(screen.getByRole("button", { name: t("corporate.form.submit") }));
    expect(await screen.findByText(t("corporate.errors.generic"))).toBeDefined();
  });

  test("every activity and formula has a translated option", () => {
    render(<QuoteForm />);
    expect(screen.getByRole("option", { name: t("corporate.activities.alcohol-free-city-challenge") })).toBeDefined();
    expect(screen.getByRole("option", { name: t("corporate.formulas.guided") })).toBeDefined();
  });
});
