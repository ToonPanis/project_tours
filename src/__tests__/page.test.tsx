import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import HomePage from "../app/page";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { englishTranslator as t } from "@/i18n/translate";

afterEach(cleanup);

// HomePage is an async Server Component. Vitest can't render those directly,
// but because its children are synchronous we can await it and render the result.
// Outside a request there is no language cookie, so the page renders in English.
describe("Home page", () => {
  test("renders the hero heading and main call to action", async () => {
    render(await HomePage());

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(t("home.titleStart"));
    expect(screen.getByRole("link", { name: t("home.exploreWalks") }).getAttribute("href")).toBe("/walks");
  });

  test("explains how it works in three steps", async () => {
    render(await HomePage());

    expect(screen.getByRole("heading", { level: 2, name: t("home.howItWorks") })).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: t("home.steps.chooseTitle") })).toBeDefined();
  });

  test("features the Poortjes walk (The Gates of Antwerp)", async () => {
    render(await HomePage());

    expect(screen.getByRole("link", { name: poortjesWalk.title }).getAttribute("href")).toBe(
      "/walks/poortjes-van-antwerpen",
    );
  });
});
