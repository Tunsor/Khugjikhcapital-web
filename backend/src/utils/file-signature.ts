/**
 * Validates the real file type by inspecting magic bytes, so a renamed
 * file cannot bypass the MIME-type whitelist.
 */
export function hasValidSignature(buffer: Buffer, mimeType: string): boolean {
  const bytes = buffer.subarray(0, 12);

  switch (mimeType) {
    case "application/pdf":
      return (
        bytes[0] === 0x25 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x44 &&
        bytes[3] === 0x46
      );

    case "image/jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    case "image/png":
      return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
        (value, index) => bytes[index] === value
      );

    case "image/webp":
      return (
        [0x52, 0x49, 0x46, 0x46].every(
          (value, index) => bytes[index] === value
        ) &&
        [0x57, 0x45, 0x42, 0x50].every(
          (value, index) => bytes[index + 8] === value
        )
      );

    default:
      return false;
  }
}

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const DOCUMENT_EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
