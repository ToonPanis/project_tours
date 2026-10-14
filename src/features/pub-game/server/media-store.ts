import { del, get, head, list, put } from "@vercel/blob";

/** What the server knows about an uploaded file. */
export interface MediaInfo {
  contentType: string;
  size: number;
}

export interface MediaFile extends MediaInfo {
  stream: ReadableStream<Uint8Array>;
}

/**
 * Where evidence photos and videos are kept. Two stores, one interface (like GameStore):
 * - BlobMediaStore: Vercel Blob, PRIVATE (production; BLOB_READ_WRITE_TOKEN set).
 *   Phones upload straight to Blob with a short-lived token from our route.
 * - MemoryMediaStore: development and tests. Phones send the file to our route.
 */
export interface MediaStore {
  /** "blob": phones upload to Vercel Blob; "direct": phones POST the file to /media. */
  readonly uploadMode: "blob" | "direct";
  /** Direct mode only: saves a file at this id. */
  save(mediaId: string, contentType: string, bytes: Uint8Array): Promise<void>;
  info(mediaId: string): Promise<MediaInfo | null>;
  open(mediaId: string): Promise<MediaFile | null>;
  /** Privacy (D29): removes every file uploaded before `date`. Returns how many. */
  deleteOlderThan(date: Date): Promise<number>;
}

export class MemoryMediaStore implements MediaStore {
  readonly uploadMode = "direct" as const;
  private files = new Map<string, { contentType: string; bytes: Uint8Array; savedAt: Date }>();

  constructor(private readonly now: () => Date = () => new Date()) {}

  async save(mediaId: string, contentType: string, bytes: Uint8Array): Promise<void> {
    this.files.set(mediaId, { contentType, bytes, savedAt: this.now() });
  }

  async info(mediaId: string): Promise<MediaInfo | null> {
    const file = this.files.get(mediaId);
    return file ? { contentType: file.contentType, size: file.bytes.byteLength } : null;
  }

  async open(mediaId: string): Promise<MediaFile | null> {
    const file = this.files.get(mediaId);
    if (!file) return null;
    const bytes = file.bytes;
    return {
      contentType: file.contentType,
      size: bytes.byteLength,
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      }),
    };
  }

  async deleteOlderThan(date: Date): Promise<number> {
    let count = 0;
    for (const [id, file] of this.files) {
      if (file.savedAt < date) {
        this.files.delete(id);
        count++;
      }
    }
    return count;
  }
}

/**
 * Vercel Blob with access "private": a file can only be read with the store's
 * token, so only our own route (which checks who's asking) can show it.
 * The @vercel/blob functions read BLOB_READ_WRITE_TOKEN from the environment.
 */
export class BlobMediaStore implements MediaStore {
  readonly uploadMode = "blob" as const;

  async save(mediaId: string, contentType: string, bytes: Uint8Array): Promise<void> {
    await put(mediaId, Buffer.from(bytes), { access: "private", contentType, addRandomSuffix: false });
  }

  async info(mediaId: string): Promise<MediaInfo | null> {
    try {
      const blob = await head(mediaId);
      return { contentType: blob.contentType, size: blob.size };
    } catch {
      // Not found (or not ours).
      return null;
    }
  }

  async open(mediaId: string): Promise<MediaFile | null> {
    const result = await get(mediaId, { access: "private" });
    // 304 (not modified) only happens with conditional headers, which we never send.
    if (!result || result.statusCode !== 200) return null;
    return { contentType: result.blob.contentType, size: result.blob.size, stream: result.stream };
  }

  async deleteOlderThan(date: Date): Promise<number> {
    let count = 0;
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: "games/", cursor, limit: 1000 });
      const old = page.blobs.filter((blob) => blob.uploadedAt < date).map((blob) => blob.url);
      if (old.length > 0) await del(old);
      count += old.length;
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return count;
  }
}
