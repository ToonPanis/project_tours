import type { QrCode } from "../logic/qr";

/**
 * A QR code drawn as SVG: black squares on white with the standard 4-square
 * quiet zone, so phone cameras read it even on a dark page.
 */
export function QrCodeImage({ code, label }: { code: QrCode; label: string }) {
  const margin = 4;
  const box = code.size + margin * 2;
  return (
    <svg
      viewBox={`${-margin} ${-margin} ${box} ${box}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className="mx-auto h-auto w-full max-w-56 rounded-sm bg-white"
    >
      <path d={code.path} fill="#000" />
    </svg>
  );
}
