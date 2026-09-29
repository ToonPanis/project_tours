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

// Outside a request there is no language cookie, so the page renders in English.
describe("Walk detail page", () => {
  test("renders the Poortjes walk (The Gates of Antwerp) without the Hidden Pubs story", async () => {
    await renderWalkPage("poortjes-van-antwerpen");

    expect(screen.getByRole("heading", { level: 1, name: "The Gates of Antwerp" })).toBeDefined();
    expect(screen.getByRole("link", { name: /start the walk/i }).getAttribute("href")).toBe(
      "/walks/poortjes-van-antwerpen/play",
    );
    expect(screen.queryByText("The story · fiction")).toBeNull();
  });

  test("the Poortjes walk shows its collection, including vanished gates", async () => {
    await renderWalkPage("poortjes-van-antwerpen");

    expect(screen.getByRole("heading", { level: 2, name: "The collection: all the drawings" })).toBeDefined();
    // Addresses are never translated.
    expect(screen.getByRole("heading", { name: "Zilversmidstraat 5" })).toBeDefined();
    expect(screen.getAllByText("Vanished").length).toBeGreaterThan(0);
  });

  test("renders Hidden Pubs with its story, highlights and practical info", async () => {
    await renderWalkPage("hidden-pubs");

    expect(screen.getByRole("heading", { level: 1, name: "Hidden Pubs" })).toBeDefined();
    expect(screen.getByText("The story · fiction")).toBeDefined();
    expect(screen.getByRole("heading", { name: "The Lost Tavern Ledger" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "What to expect" })).toBeDefined();
    expect(screen.getByText(/Never required/)).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "Discover the history and collect the clue" }),
    ).toBeDefined();
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

  test("Poortjes van Antwerpen shows every stop", async () => {
    await renderWalkPage("poortjes-van-antwerpen");

    expect(screen.queryAllByRole("heading", { name: /hidden location/ })).toHaveLength(0);
  });

  test("applies the walk's theme to the page", async () => {
    await renderWalkPage("hidden-pubs");

    expect(document.querySelector('[data-walk-theme="tavern"]')).not.toBeNull();
  });
});
