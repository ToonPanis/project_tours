import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import HomePage from "../app/page";

afterEach(cleanup);

// HomePage is an async Server Component. Vitest can't render those directly,
// but because its children are synchronous we can await it and render the result.
describe("Home page", () => {
  test("renders the hero heading and main call to action", async () => {
    render(await HomePage());

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Antwerp keeps its secrets",
    );
    expect(screen.getByRole("link", { name: "Explore walks" }).getAttribute("href")).toBe(
      "/walks",
    );
  });

  test("explains how it works in three steps", async () => {
    render(await HomePage());

    expect(screen.getByRole("heading", { level: 2, name: "How it works" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: "Choose your walk" })).toBeDefined();
  });

  test("features The 17 Gates", async () => {
    render(await HomePage());

    expect(screen.getByRole("link", { name: "The 17 Gates" }).getAttribute("href")).toBe(
      "/walks/the-17-gates",
    );
  });
});
