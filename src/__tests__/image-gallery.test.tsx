import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import { ImageGallery } from "@/features/guide/components/ImageGallery";
import { createTranslator } from "@/i18n/translate";

// A Dutch-speaking walker; every expected text comes from the walk data or the Dutch UI texts.
const walk = getClassicsWalk("nl");
const t = createTranslator("nl");
const gallery = walk.locations.find((location) => location.id === "classics-handelsbeurs")!.guide!.galleries![0];
const [first, second] = gallery.images;

const status = () => screen.getByRole("status").textContent ?? "";

describe("Image gallery (Handelsbeurs prints)", () => {
  test("shows the title, every image with its caption, and where you are", () => {
    render(<ImageGallery gallery={gallery} t={t} />);
    expect(screen.getByRole("heading", { level: 2, name: gallery.title })).toBeDefined();
    for (const image of gallery.images) {
      expect(screen.getByAltText(image.alt)).toBeDefined();
      expect(screen.getByText(image.caption)).toBeDefined();
    }
    expect(status()).toContain(t("guide.gallery.position", { current: 1, total: 2 }));
  });

  test("previous / next buttons and the arrow keys move through the images", () => {
    render(<ImageGallery gallery={gallery} t={t} />);
    const previous = screen.getByRole("button", { name: t("guide.gallery.previous") });
    const next = screen.getByRole("button", { name: t("guide.gallery.next") });
    expect(previous.hasAttribute("disabled")).toBe(true);

    fireEvent.click(next);
    expect(status()).toContain(t("guide.gallery.position", { current: 2, total: 2 }));
    expect(status()).toContain(second.caption);
    expect(next.hasAttribute("disabled")).toBe(true);

    const track = screen.getByLabelText(t("guide.gallery.trackLabel", { title: gallery.title }));
    fireEvent.keyDown(track, { key: "ArrowLeft" });
    expect(status()).toContain(first.caption);
  });

  test("an image opens large, with its caption, and closes again", () => {
    render(<ImageGallery gallery={gallery} t={t} />);
    fireEvent.click(screen.getByRole("button", { name: `${t("guide.gallery.enlarge")}: ${first.alt}` }));
    const dialog = screen.getByRole("dialog", { name: first.caption });
    expect(dialog).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: t("common.close") }));
    expect(screen.queryByRole("dialog", { name: first.caption })).toBeNull();
  });
});
