import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import WalkDetailPage from "../app/walks/[slug]/page";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { getHowItWorksSteps } from "@/features/walks/utils/walk-content";
import { englishTranslator as t } from "@/i18n/translate";
import { getOrderedLocations } from "@/lib/walk-locations";
import { revealedIn } from "./fixtures/hidden-stop";
import type { WalkLocation } from "@/types/location";

afterEach(cleanup);

// Like HomePage, this is an async Server Component: await it, then render the result.
async function renderWalkPage(slug: string) {
  const page = await WalkDetailPage({
    params: Promise.resolve({ slug }),
    searchParams: Promise.resolve({}),
  });
  render(page);
}

/** "Stop {number}: hidden location" with any stop number. */
const hiddenStopHeading = new RegExp(
  containing(t("walks.preview.hiddenStop", { number: "#" })).source.replace("#", "\\d+"),
);

/** Matches text containing `text` literally (like a regex, but safe for any character). */
function containing(text: string): RegExp {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

// Outside a request there is no language cookie, so the page renders in English.
// Every expected text comes from the English walk data or UI texts, so
// researchers can correct the content without breaking these tests.
describe("Walk detail page", () => {
  test("renders the Poortjes walk (The Gates of Antwerp) without the Hidden Pubs story", async () => {
    await renderWalkPage("poortjes-van-antwerpen");

    expect(screen.getByRole("heading", { level: 1, name: poortjesWalk.title })).toBeDefined();
    expect(
      screen.getByRole("link", { name: getWalkCopy(poortjesWalk, t).startLabel }).getAttribute("href"),
    ).toBe("/walks/poortjes-van-antwerpen/play");
    expect(screen.queryByText(t("walks.detail.storyFiction"))).toBeNull();
  });

  test("the Poortjes walk shows its collection, including vanished gates", async () => {
    const collection = poortjesWalk.collection!;
    const vanishedGate = collection.items.find((item) => item.status === "vanished")!;
    await renderWalkPage("poortjes-van-antwerpen");

    expect(screen.getByRole("heading", { level: 2, name: collection.title })).toBeDefined();
    // Addresses are never translated.
    expect(screen.getByRole("heading", { name: vanishedGate.address })).toBeDefined();
    expect(screen.getAllByText(t("guide.status.vanished")).length).toBeGreaterThan(0);
  });

  test("renders Hidden Pubs with its story, highlights and practical info", async () => {
    const howItWorks = getHowItWorksSteps(hiddenPubsWalk, t);
    await renderWalkPage("hidden-pubs");

    expect(screen.getByRole("heading", { level: 1, name: hiddenPubsWalk.title })).toBeDefined();
    expect(screen.getByText(t("walks.detail.storyFiction"))).toBeDefined();
    expect(screen.getByRole("heading", { name: hiddenPubsWalk.narrative!.title })).toBeDefined();
    expect(screen.getByRole("heading", { name: t("walks.detail.whatToExpect") })).toBeDefined();
    // Practical info, including the alcohol rule ("Never required…").
    for (const item of hiddenPubsWalk.practicalInfo!) {
      expect(screen.getByText(item.value)).toBeDefined();
    }
    expect(screen.getByRole("heading", { name: howItWorks[4] })).toBeDefined();
  });

  test("Hidden Pubs reveals only the first café before the walk starts", async () => {
    const [first, ...hidden] = getOrderedLocations(hiddenPubsWalk);
    await renderWalkPage("hidden-pubs");

    expect(screen.getByRole("heading", { name: containing(first.name) })).toBeDefined();
    expect(screen.getAllByRole("heading", { name: hiddenStopHeading })).toHaveLength(hidden.length);
    expect(screen.getByText(t("walks.preview.finalDestination"))).toBeDefined();
    // Nothing may give a hidden café away: not its name, a short form of it, or its address.
    expect(hidden.length).toBeGreaterThan(0);
    for (const location of hidden) {
      expect(revealedIn(document.body.textContent ?? "", location)).toEqual([]);
    }
  });

  test("the hidden-café check catches short names and the address, not a neighbour's number", () => {
    const cafe = { name: "In Den Gouden Hoorn", address: "Grote Markt 3, 2000 Antwerpen" } as WalkLocation;
    expect(revealedIn("Next: Den Gouden Hoorn", cafe)).toEqual(["Den Gouden Hoorn", "Gouden Hoorn"]);
    expect(revealedIn("Next: Gouden Hoorn", cafe)).toEqual(["Gouden Hoorn"]);
    expect(revealedIn("Meet at Grote Markt 3", cafe)).toHaveLength(1);
    expect(revealedIn("Rococo, Grote Markt 32", cafe)).toEqual([]);
  });

  test("Poortjes van Antwerpen shows every stop", async () => {
    await renderWalkPage("poortjes-van-antwerpen");

    expect(screen.queryAllByRole("heading", { name: hiddenStopHeading })).toHaveLength(0);
  });

  test("applies the walk's theme to the page", async () => {
    await renderWalkPage("hidden-pubs");

    expect(document.querySelector('[data-walk-theme="tavern"]')).not.toBeNull();
  });
});
