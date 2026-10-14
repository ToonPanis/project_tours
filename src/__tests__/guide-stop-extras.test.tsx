import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import { CardDeck } from "@/features/guide/components/CardDeck";
import { MoreStories } from "@/features/guide/components/MoreStories";
import { createTranslator } from "@/i18n/translate";
import type { GuideStopContent } from "@/types/guide";

// A Dutch-speaking walker; every expected text comes from the walk data or the Dutch UI texts.
const walk = getClassicsWalk("nl");
const t = createTranslator("nl");

function guideOf(id: string): GuideStopContent {
  const guide = walk.locations.find((location) => location.id === id)?.guide;
  if (!guide) throw new Error(`${id} has no guide content`);
  return guide;
}

describe("More stories (optional deeper content)", () => {
  const stories = guideOf("classics-diamond-district").moreStories!;

  test("is closed until the walker asks for it, and can be closed again", () => {
    render(<MoreStories stories={stories} t={t} />);
    const button = screen.getByRole("button", { name: new RegExp(t("guide.moreStories")) });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("heading", { name: stories[0].title })).toBeNull();

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("heading", { level: 2, name: stories[0].title })).toBeDefined();
    // The images of the story come with their captions.
    expect(screen.getByText(stories[0].image!.caption)).toBeDefined();
    for (const image of stories[0].images ?? []) expect(screen.getByText(image.caption)).toBeDefined();
    // An image without a known source says so in its credit, instead of linking nowhere.
    const unsourced = [stories[0].image!, ...(stories[0].images ?? [])].find((image) => !image.sourceUrl);
    if (unsourced) {
      expect(screen.getAllByText(new RegExp(t("guide.rightsToVerify"))).length).toBeGreaterThan(0);
      expect(screen.queryByRole("link", { name: unsourced.source })).toBeNull();
    }

    fireEvent.click(screen.getByRole("button", { name: new RegExp(t("guide.moreStoriesHide")) }));
    expect(screen.queryByRole("heading", { name: stories[0].title })).toBeNull();
  });
});

describe("Cathedral slides", () => {
  const cards = guideOf("classics-cathedral").cards!;

  test("shows one slide at a time, each with its own images", () => {
    render(<CardDeck cards={cards} t={t} />);
    expect(screen.getByRole("heading", { level: 2, name: cards[0].title })).toBeDefined();
    expect(screen.queryByRole("heading", { level: 2, name: cards[1].title })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: cards[1].title }));
    expect(screen.getByRole("heading", { level: 2, name: cards[1].title })).toBeDefined();
    for (const image of [cards[1].image!, ...(cards[1].images ?? [])]) {
      expect(screen.getByText(image.caption)).toBeDefined();
    }
  });

  test("labels the novel of Nello & Patrasche as fiction", () => {
    render(<CardDeck cards={cards} t={t} />);
    const nello = cards.find((card) => card.id === "nello-patrasche")!;
    fireEvent.click(screen.getByRole("button", { name: nello.title }));
    expect(screen.getByText(t("guide.sectionLabels.fiction"))).toBeDefined();
  });
});
