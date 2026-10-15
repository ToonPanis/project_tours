"use client";

import { extensionFor, isAllowedType, maxBytesFor, mediaPrefix, type EvidenceKind } from "../media";

/** How this deployment stores evidence: "blob" = Vercel Blob (production), "direct" = our own route (development). */
export type UploadMode = "blob" | "direct";

export type UploadResult = { ok: true; mediaId: string } | { ok: false; error: string };

/** Longest side of an evidence photo after shrinking: plenty to recognise a beer tap or a sign. */
const PHOTO_MAX_SIDE = 1600;

/**
 * Shrinks a photo on the phone (a 12-megapixel photo is ~4 MB; this makes it
 * ~0.3–0.8 MB): faster on café wifi and smaller to store. If the browser
 * can't read the photo (e.g. some HEIC files), the original is sent.
 */
export async function shrinkPhoto(file: File): Promise<Blob> {
  if (typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    // Give the canvas's memory back right away (a few MB; older phones have little to spare).
    canvas.width = 0;
    canvas.height = 0;
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/**
 * Uploads one photo or video for a task and returns its media id (then the
 * phone sends SUBMIT_EVIDENCE with it). Checks type and size first, so a
 * wrong file fails at once instead of after a long upload. `signal` cancels
 * it (the "Cancel" button, or leaving the screen): then the error is "cancelled".
 */
export async function uploadEvidence(
  code: string,
  taskId: string,
  kind: EvidenceKind,
  file: File,
  mode: UploadMode,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
): Promise<UploadResult> {
  const body = kind === "photo" ? await shrinkPhoto(file) : file;
  const contentType = body.type || file.type;
  if (!isAllowedType(kind, contentType)) return { ok: false, error: "invalid-media" };
  if (body.size > maxBytesFor(kind)) return { ok: false, error: "too-large" };

  try {
    if (mode === "direct") {
      onProgress?.(0);
      const response = await fetch(`/api/games/${code}/media?task=${encodeURIComponent(taskId)}`, {
        method: "POST",
        headers: { "content-type": contentType },
        body,
        signal,
      });
      const json = (await response.json().catch(() => ({}))) as { mediaId?: string; error?: string };
      onProgress?.(100);
      return response.ok && json.mediaId ? { ok: true, mediaId: json.mediaId } : { ok: false, error: json.error ?? "upload-failed" };
    }

    // Production: straight to Vercel Blob (loaded only when needed: not in the page's first download).
    const { upload } = await import("@vercel/blob/client");
    const blob = await upload(`${mediaPrefix(code)}${taskId}.${extensionFor(contentType)}`, body, {
      access: "private",
      contentType,
      handleUploadUrl: `/api/games/${code}/media/upload`,
      clientPayload: JSON.stringify({ taskId }),
      // Videos in parts: retried part by part on a shaky connection.
      multipart: kind === "video",
      onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
      abortSignal: signal,
    });
    return { ok: true, mediaId: blob.pathname };
  } catch {
    return { ok: false, error: signal?.aborted ? "cancelled" : "upload-failed" };
  }
}
