import multer from "multer";

import { MAX_IMAGE_SIZE } from "../utils/file-signature.js";

/**
 * In-memory multipart parsing. Files are validated (MIME + magic bytes)
 * in the services before being streamed to Supabase Storage.
 */
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1, fields: 20 },
});

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
export const MAX_DOCUMENTS = 10;

export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
    files: MAX_DOCUMENTS,
    fields: 30,
    fieldSize: 64 * 1024,
  },
});
