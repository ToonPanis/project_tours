import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import WalkDetailPage from "../app/walks/[slug]/page";

afterEach(cleanup);

// Like HomePage, this is an async Server Component: await it, then render the result.
async function renderWalkPage(slug: string) {
  const page = await WalkDetailPage({
    params: Promise.resolve({ slug }),
    searchParams: Promise.resolve({}),
  });
  render(page);
}

describe("Walk detail page", () => {
  test("renders The 17 Gates without the optional Hidden Pubs sections", async () => {
    await renderWalkPage("the-17-gates");

    expect(screen.getByRole("heading", { level: 1, name: "The 17 Gates" })).toBeDefined();
    expect(screen.getByRole("link", { name: /start adventure/i }).getAttribute("href")).toBe(
      "/walks/the-17-gates/play",
    );
    expect(screen.queryByText("The story · fiction")).toBeNull();
    expect(screen.queryByRole("heading", { name: "What to expect" })).toBeNull();
  });

  test("renders Hidden Pubs with its story, highlights and practical info", async () => {
    await renderWalkPage("hidden-pubs");

    expect(screen.getByRole("heading", { level: 1, name: "Hidden Pubs" })).toBeDefined();
    expect(screen.getByText("The story · fiction")).toBeDefined();
    expect(screen.getByRole("heading", { name: "The Lost Tavern Ledger" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "What to expect" })).toBeDefined();
    expect(screen.getByText(/Never required/)).toBeDefined();
    expect(screen.getByRole("heading", { name: "Collect the clue" })).toBeDefined();
  });

  test("Hidden Pubs reveals only the first café before the walk starts", async () => {
    await renderWalkPage("hidden-pubs");

    expect(screen.getByRole("heading", { name: /Rococo Antwerp/ })).toBeDefined();
    expect(screen.getAllByRole("heading", { name: /hidden location/ })).toHaveLength(7);
    expect(screen.getByText("Final destination")).toBeDefined();
    // The hidden names must not appear anywhere in the rendered page.
    expect(document.body.textContent).not.toContain("Den Engel");
    expect(document.body.textContent).not.toContain("Boer van Tienen");
  });

  test("The 17 Gates shows every stop", async () => {
    await renderWalkPage("the-17-gates");

    expect(screen.queryAllByRole("heading", { name: /hidden location/ })).toHaveLength(0);
  });

  test("applies the walk's theme to the page", async () => {
    await renderWalkPage("hidden-pubs");

    expect(document.querySelector('[data-walk-theme="tavern"]')).not.toBeNull();
  });
});
