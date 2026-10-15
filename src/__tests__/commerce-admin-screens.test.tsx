import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { adminErrorMessage, formatEuros } from "@/features/commerce/admin/admin-api";
import { LoginForm } from "@/features/commerce/admin/LoginForm";
import { VerifyLogin } from "@/features/commerce/admin/VerifyLogin";

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

function answer(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));
}

describe("admin sign-in screens (English only, like the playtest tools)", () => {
  test("asking for a link posts the address and says what happens next, without saying whether it's an admin", async () => {
    const fetchMock = answer(200, { sent: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "owner@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Email me a sign-in link" }));
    expect(await screen.findByText(/If owner@example.com is an admin address/)).toBeDefined();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/admin/auth/login-link");
    expect(JSON.parse(String(init.body))).toEqual({ email: "owner@example.com" });
  });

  test("a refusal is shown in the status element", async () => {
    vi.stubGlobal("fetch", answer(429, { error: "too-many-requests" }));
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "owner@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Email me a sign-in link" }));
    expect(await screen.findByText(adminErrorMessage("too-many-requests"))).toBeDefined();
  });

  test("the verify page sends the secret after # only when the button is pressed, then opens the admin area", async () => {
    const fetchMock = answer(200, { email: "owner@example.com" });
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState(null, "", "/admin/login/verify#the-secret-from-the-email");
    render(<VerifyLogin />);
    // Opening the page (as a mail scanner would) sends nothing.
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/admin"));
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({ token: "the-secret-from-the-email" });
    // Used up: gone from the address bar.
    expect(window.location.hash).toBe("");
  });

  test("a link without its secret says so, without asking the server", async () => {
    const fetchMock = answer(200, {});
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState(null, "", "/admin/login/verify");
    render(<VerifyLogin />);
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText(adminErrorMessage("invalid-link"))).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("no connection and unknown codes still give a sentence; prices in Belgian format", () => {
    expect(adminErrorMessage("offline")).toMatch(/No connection/);
    expect(adminErrorMessage("something-new")).toContain("something-new");
    expect(formatEuros(1495).replace(/\s/g, " ")).toBe("€ 14,95");
  });
});
