import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";

afterEach(cleanup);

// L-21: a new screen starts at the top (and its title gets focus); switching the
// language re-renders the same screen with a translated title and must not.
describe("PlayScreen scrolls to the top only for a new screen", () => {
  test("a language switch (same screen, translated title) doesn't jump back to the top", () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    const { rerender } = render(<PlayScreen title="The Angel's Secret" screenId="challenge-pubs-den-engel" />);
    expect(scrollTo).toHaveBeenCalledTimes(1);

    rerender(<PlayScreen title="Het geheim van de Engel" screenId="challenge-pubs-den-engel" />);
    expect(scrollTo).toHaveBeenCalledTimes(1);

    rerender(<PlayScreen title="De klok" screenId="challenge-pubs-paters-vaetje" />);
    expect(scrollTo).toHaveBeenCalledTimes(2);
  });

  test("without a screen id it still follows the title (start and setup screens)", () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    const { rerender } = render(<PlayScreen title="Welcome" />);
    rerender(<PlayScreen title="How many players?" />);
    expect(scrollTo).toHaveBeenCalledTimes(2);
  });
});
