import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";

/**
 * M-05: every visible text must come from the translations (`t("…")`) or from a
 * walk's content, never be typed into a component: `npm run i18n:check` only sees
 * the JSON files, so English typed into JSX slipped through before ("Clues 3 / 8",
 * "Ledger" on every Hidden Pubs screen).
 *
 * This test reads every component and reports text in JSX that contains a letter:
 * - text between tags:                 <span>Clues</span>
 * - text attributes:                   aria-label="Close"
 * - strings shown as children:         {isOpen ? "Hide" : "Show"}
 * Symbols (★ ✓ · → ?) are fine. The playtest tools are English on purpose
 * (the playtest/ folder and files named *Playtest*).
 */

const SRC = join(process.cwd(), "src");
const SKIPPED_FOLDERS = ["__tests__", "playtest"];
const TEXT_ATTRIBUTES = new Set(["aria-label", "alt", "title", "placeholder", "aria-description", "aria-roledescription"]);
/** Our own components' text props: label, eyebrow, heading, confirmLabel, loadErrorText, subtitle… */
const TEXT_PROP = /^(label|eyebrow|heading|message)$|(Label|Text|Title|Message)$/;
/** Latin (with accents) and Cyrillic letters. */
const HAS_LETTER = /[A-Za-zÀ-ɏЀ-ӿ]/;

function listComponentFiles(folder: string): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return SKIPPED_FOLDERS.includes(name) ? [] : listComponentFiles(path);
    return name.endsWith(".tsx") && !name.includes("Playtest") ? [path] : [];
  });
}

interface ShownText {
  node: ts.Node;
  text: string;
}

/**
 * Text that ends up on screen as-is: a string, the fixed parts of a template
 * (`Clues ${n}`), either side of `+`, or a branch of `?:`, `&&`, `||`, `??`.
 */
function shownStrings(expression: ts.Expression): ShownText[] {
  if (ts.isStringLiteralLike(expression)) return [{ node: expression, text: expression.text }];
  if (ts.isTemplateExpression(expression)) {
    return [expression.head, ...expression.templateSpans.map((span) => span.literal)].map((part) => ({ node: part, text: part.text }));
  }
  if (ts.isParenthesizedExpression(expression)) return shownStrings(expression.expression);
  if (ts.isConditionalExpression(expression)) return [...shownStrings(expression.whenTrue), ...shownStrings(expression.whenFalse)];
  if (ts.isBinaryExpression(expression)) {
    const operator = expression.operatorToken.kind;
    if (operator === ts.SyntaxKind.AmpersandAmpersandToken) return shownStrings(expression.right);
    if (
      operator === ts.SyntaxKind.BarBarToken ||
      operator === ts.SyntaxKind.QuestionQuestionToken ||
      operator === ts.SyntaxKind.PlusToken
    ) {
      return [...shownStrings(expression.left), ...shownStrings(expression.right)];
    }
  }
  return [];
}

export function findHardcodedText(fileName: string, source: string): string[] {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const report = (node: ts.Node, text: string) => {
    const { line } = file.getLineAndCharacterOfPosition(node.getStart());
    found.push(`${fileName}:${line + 1}  "${text.trim()}"`);
  };

  function visit(node: ts.Node) {
    if (ts.isJsxText(node) && HAS_LETTER.test(node.text)) report(node, node.text);

    const attributeName = ts.isJsxAttribute(node) ? node.name.getText(file) : "";
    if (ts.isJsxAttribute(node) && (TEXT_ATTRIBUTES.has(attributeName) || TEXT_PROP.test(attributeName)) && node.initializer) {
      const value = ts.isJsxExpression(node.initializer) ? node.initializer.expression : node.initializer;
      if (value) for (const shown of shownStrings(value as ts.Expression)) if (HAS_LETTER.test(shown.text)) report(shown.node, shown.text);
    }

    // {…} as a child of an element (not an attribute value).
    if (ts.isJsxExpression(node) && node.expression && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) {
      for (const shown of shownStrings(node.expression)) if (HAS_LETTER.test(shown.text)) report(shown.node, shown.text);
    }

    ts.forEachChild(node, visit);
  }
  visit(file);
  return found;
}

describe("no hard-coded text in components", () => {
  test("the check itself finds each kind of hard-coded text", () => {
    const found = findHardcodedText(
      "Example.tsx",
      `export const A = ({ open, n }) => (
        <div aria-label="Close">
          <span>Clues {n}</span>
          {open ? "Ledger" : t("game.header.route")}
          <span aria-hidden="true">★ · ✓ ?</span>
          {t("common.close")}
          {\`Stop \${n}\`}
          {"Clue " + n}
          <MapButton label="Zoom" eyebrow={t("x")} loadErrorText="No map" />
          <span>{\`\${n} / \${n}\`}</span>
        </div>
      );`,
    );
    expect(found).toEqual([
      'Example.tsx:2  "Close"',
      'Example.tsx:3  "Clues"',
      'Example.tsx:4  "Ledger"',
      'Example.tsx:7  "Stop"',
      'Example.tsx:8  "Clue"',
      'Example.tsx:9  "Zoom"',
      'Example.tsx:9  "No map"',
    ]);
  });

  test("every component takes its text from the translations or the walk's content", () => {
    const found = listComponentFiles(SRC).flatMap((path) =>
      findHardcodedText(relative(process.cwd(), path).replaceAll("\\", "/"), readFileSync(path, "utf8")),
    );
    expect(found).toEqual([]);
  });
});
