import { expect, test } from "vitest";
import { qrCodeFor } from "@/features/pub-game/logic/qr";

test("a join link becomes a QR code: a square grid with finder patterns in three corners", () => {
  const code = qrCodeFor("https://hidden-antwerp.example/games/K7M2QX");
  // A version-3 code or so: 29 squares per side, always 17 + 4 × version.
  expect((code.size - 17) % 4).toBe(0);
  expect(code.size).toBeGreaterThanOrEqual(21);

  const dark = new Set(code.path.match(/M\d+ \d+/g)!.map((move) => move.slice(1)));
  // The top-left, top-right and bottom-left 7×7 finder patterns start with a dark corner.
  for (const [col, row] of [[0, 0], [code.size - 7, 0], [0, code.size - 7]]) {
    expect(dark.has(`${col} ${row}`)).toBe(true);
  }
  // The same link always gives the same code.
  expect(qrCodeFor("https://hidden-antwerp.example/games/K7M2QX")).toEqual(code);
});
