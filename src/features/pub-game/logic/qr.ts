import qrcode from "qrcode-generator";

export interface QrCode {
  /** Squares per side (without the white margin). */
  size: number;
  /** One SVG path with a 1×1 square per dark module. */
  path: string;
}

/**
 * The QR code for a link, as one SVG path. Computed on the SERVER (the game
 * page), so the QR library never ends up in the phone's download.
 * Error correction "M": still readable when ~15% is damaged (glare, a crease).
 */
export function qrCodeFor(text: string): QrCode {
  const code = qrcode(0, "M");
  code.addData(text);
  code.make();
  const size = code.getModuleCount();
  let path = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (code.isDark(row, col)) path += `M${col} ${row}h1v1h-1z`;
    }
  }
  return { size, path };
}
