import { qrCodeFor } from "@/features/pub-game/logic/qr";
import type { Partner } from "@/types/commerce";
import { partnerLink } from "../logic/partners";

/**
 * The partner link as a QR code in an SVG file (P7, brief 3.2), made on the
 * server with the QR library Hidden Pubs already uses (no new dependency).
 * SVG stays sharp at any size: a table card, a poster, a window sticker.
 */
export function partnerQrSvg(partner: Partner, baseUrl: string): { fileName: string; svg: string } {
  const code = qrCodeFor(partnerLink(baseUrl, partner.code));
  const margin = 4;
  const box = code.size + margin * 2;
  const svg = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${box} ${box}" width="${box * 10}" height="${box * 10}" shape-rendering="crispEdges">`,
    `<rect x="${-margin}" y="${-margin}" width="${box}" height="${box}" fill="#fff"/>`,
    `<path d="${code.path}" fill="#000"/>`,
    `</svg>`,
  ].join("\n");
  return { fileName: `hidden-antwerp-${partner.code.toLowerCase()}-qr.svg`, svg };
}

/** The download response for the SVG (never cached: it's behind a sign-in). */
export function svgDownload(file: { fileName: string; svg: string }): Response {
  return new Response(file.svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
