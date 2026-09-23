import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkCard } from "@/features/walks/components/WalkCard";
import type { WalkSummary } from "@/types/walk";

afterEach(cleanup);

const exampleWalk: WalkSummary = {
  id: "walk-test",
  slug: "test-walk",
  title: "Test Walk",
  tagline: "A walk for testing",
  shortDescription: "Short description for the test.",
  city: "Antwerp",
  estimatedDuration: { minMinutes: 60, maxMinutes: 120 },
  distanceInMeters: 3000,
  difficulty: "easy",
  price: { amountInCents: 995, currency: "EUR" },
  theme: "classic",
  locationCount: 5,
  contentStatus: "verified",
};

describe("WalkCard", () => {
  test("links the title to the walk detail page", () => {
    render(<WalkCard walk={exampleWalk} />);

    const link = screen.getByRole("link", { name: "Test Walk" });
    expect(link.getAttribute("href")).toBe("/walks/test-walk");
  });

  test("shows key facts about the walk", () => {
    render(<WalkCard walk={exampleWalk} />);

    expect(screen.getByText("5 stops")).toBeDefined();
    expect(screen.getByText(/1–2 h/)).toBeDefined();
    expect(screen.getByText(/3 km/)).toBeDefined();
  });

  test("hides the distance while it is still unknown", () => {
    render(<WalkCard walk={{ ...exampleWalk, distanceInMeters: null }} />);

    expect(screen.queryByText(/km/)).toBeNull();
    expect(screen.queryByText(/To be confirmed/)).toBeNull();
  });

  test("applies the walk's visual theme", () => {
    render(<WalkCard walk={{ ...exampleWalk, theme: "tavern" }} />);

    const card = screen.getByRole("article");
    expect(card.getAttribute("data-walk-theme")).toBe("tavern");
  });

  test("only shows the preview badge for placeholder content", () => {
    const { rerender } = render(<WalkCard walk={exampleWalk} />);
    expect(screen.queryByText("Preview content")).toBeNull();

    rerender(<WalkCard walk={{ ...exampleWalk, contentStatus: "placeholder" }} />);
    expect(screen.getByText("Preview content")).toBeDefined();
  });
});
