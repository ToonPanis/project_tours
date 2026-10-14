/**
 * Rules for evidence photos and videos, shared by the phone (before uploading)
 * and the server (which checks everything again).
 */

export type EvidenceKind = "photo" | "video";

export const ALLOWED_TYPES: Record<EvidenceKind, string[]> = {
  // HEIC: iPhone photos that couldn't be converted to JPEG on the phone.
  photo: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  video: ["video/mp4", "video/quicktime", "video/webm"],
};

/** Photos are shrunk on the phone first (to ~1 MB); this limit is for the rare unshrunk one. */
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
/** About a minute of phone video. */
export const MAX_VIDEO_BYTES = 75 * 1024 * 1024;

export function maxBytesFor(kind: EvidenceKind): number {
  return kind === "photo" ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES;
}

export function isAllowedType(kind: EvidenceKind, contentType: string): boolean {
  return ALLOWED_TYPES[kind].includes(contentType.split(";")[0].trim().toLowerCase());
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export function extensionFor(contentType: string): string {
  return EXTENSIONS[contentType.split(";")[0].trim().toLowerCase()] ?? "bin";
}

/**
 * Every file of a game lives under games/<CODE>/: the server only accepts a
 * media id with this game's prefix, so a phone can't link another game's file.
 */
export function mediaPrefix(code: string): string {
  return `games/${code}/`;
}

export function isMediaIdOfGame(mediaId: string, code: string): boolean {
  return (
    mediaId.startsWith(mediaPrefix(code)) &&
    /^games\/[A-Z0-9]{6}\/[A-Za-z0-9_-]{1,80}\.[a-z0-9]{2,5}$/.test(mediaId)
  );
}
