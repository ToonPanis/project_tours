/**
 * Marks whether content has been checked against historical sources.
 * "placeholder" content must be shown with a visible notice in the UI.
 */
export type ContentStatus = "placeholder" | "verified";

export interface ImageAsset {
  src: string;
  /** Required so every image stays accessible. */
  alt: string;
  /** Source or archive credit, e.g. "FelixArchief Antwerpen". */
  credit?: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}
