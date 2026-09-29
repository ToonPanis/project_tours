/**
 * Reads the width and height of a JPEG or PNG file from its header bytes.
 * Dependency-free: used by scripts/download-commons-images.mjs (to record the
 * real size of each saved file) and by the data tests (to check images.json).
 *
 * PNG:  the IHDR chunk right after the 8-byte signature holds width and height.
 * JPEG: a series of segments (0xFF, marker, 2-byte length, data); the
 *       "start of frame" segment (SOF0 baseline, SOF2 progressive, or another
 *       SOFn) holds height then width.
 */

/**
 * @param {Uint8Array} bytes the whole file (or at least its header)
 * @returns {{ width: number, height: number } | null} null when the format isn't recognised
 */
export function readImageSize(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // PNG: 89 50 4E 47 0D 0A 1A 0A, then IHDR (length, "IHDR", width, height).
  if (bytes.length >= 24 && view.getUint32(0) === 0x89504e47 && view.getUint32(4) === 0x0d0a1a0a) {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  // JPEG: starts with FF D8 (start of image).
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xff) return null;
      const marker = bytes[offset + 1];
      // Fill bytes (FF FF …): skip one byte.
      if (marker === 0xff) {
        offset += 1;
        continue;
      }
      // Markers without a length: TEM and RST0–RST7.
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      const length = view.getUint16(offset + 2);
      // SOF0–SOF15, except DHT (C4), JPG (C8) and DAC (CC), which share the range.
      const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isStartOfFrame && offset + 9 <= bytes.length) {
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      offset += 2 + length;
    }
  }

  return null;
}
