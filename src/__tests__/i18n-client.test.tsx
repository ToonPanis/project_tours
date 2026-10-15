import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { LocaleProvider, useLocale, useT } from "@/i18n/client";
import { messagesByLocale, type LocaleMessages } from "@/i18n/messages";
import { createTranslator } from "@/i18n/translate";

/**
 * The browser's translator (useT) gets English from its own bundle and the
 * visitor's language from the server (<LocaleProvider messages>), so a phone
 * never downloads all 8 languages.
 */

function Probe() {
  const t = useT();
  return (
    <p>
      {useLocale()}|{t("common.close")}|{t.plural("walks.card.stops", 3)}
    </p>
  );
}

const nl = createTranslator("nl");
const en = createTranslator("en");

describe("useT in the browser", () => {
  test("without a provider: English", () => {
    render(<Probe />);
    expect(screen.getByText(`en|${en("common.close")}|${en.plural("walks.card.stops", 3)}`)).toBeTruthy();
  });

  test("the provider's language, the same texts as on the server", () => {
    render(
      <LocaleProvider locale="nl" messages={messagesByLocale.nl}>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByText(`nl|${nl("common.close")}|${nl.plural("walks.card.stops", 3)}`)).toBeTruthy();
  });

  test("a text missing in that language falls back to English", () => {
    const withoutClose: LocaleMessages = { ...messagesByLocale.nl, common: { ...messagesByLocale.nl.common, close: undefined } };
    render(
      <LocaleProvider locale="nl" messages={withoutClose}>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByText(`nl|${en("common.close")}|${nl.plural("walks.card.stops", 3)}`)).toBeTruthy();
  });

  test("switching language (the server sends the new texts) re-renders in the new language", () => {
    const { rerender } = render(
      <LocaleProvider locale="nl" messages={messagesByLocale.nl}>
        <Probe />
      </LocaleProvider>,
    );
    rerender(
      <LocaleProvider locale="uk" messages={messagesByLocale.uk}>
        <Probe />
      </LocaleProvider>,
    );
    const uk = createTranslator("uk");
    expect(screen.getByText(`uk|${uk("common.close")}|${uk.plural("walks.card.stops", 3)}`)).toBeTruthy();
  });

  test("the browser side imports English only (not every language)", () => {
    const source = readFileSync(path.join(process.cwd(), "src/i18n/client.tsx"), "utf8");
    const imports = source.split(/\r?\n/).filter((line) => line.startsWith("import "));
    // Types from messages.ts are fine (they disappear from the bundle); its values are all 8 languages.
    expect(imports.filter((line) => line.includes('"./messages"') && !line.startsWith("import type"))).toEqual([]);
    expect(imports.some((line) => line.includes('"./translate"'))).toBe(false);
    expect(imports.filter((line) => line.includes("./locales/"))).toEqual(['import english from "./locales/en";']);
  });
});
