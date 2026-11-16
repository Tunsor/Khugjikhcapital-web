import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "../config/logger.js";
import { badRequest, internal } from "../utils/http-error.js";
import {
  hasValidSignature,
  IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE,
} from "../utils/file-signature.js";

export const BUCKETS = {
  siteAssets: "site-assets",
  companyNews: "company-news",
  loanDocuments: "loan-documents",
} as const;

/** Validates an uploaded image (type whitelist, size, magic bytes). */
export function validateImage(
  file: Express.Multer.File | undefined,
  missingMessage = "Зураг сонгоно уу."
): asserts file is Express.Multer.File {
  if (!file || file.size === 0) {
    throw badRequest(missingMessage);
  }

  if (!IMAGE_EXTENSIONS[file.mimetype] || file.size > MAX_IMAGE_SIZE) {
    throw badRequest(
      "Зөвхөн JPG, PNG, WebP форматтай, 5 MB хүртэлх зураг оруулна."
    );
  }

  if (!hasValidSignature(file.buffer, file.mimetype)) {
    throw badRequest(
      "Зургийн бодит формат буруу байна. JPG, PNG эсвэл WebP зураг оруулна уу."
    );
  }
}

/** Uploads a validated image under `${folder}/<uuid>.<ext>`. */
export async function uploadPublicImage(
  supabase: SupabaseClient,
  bucket: string,
  folder: string,
  file: Express.Multer.File,
  fileName: string = randomUUID()
) {
  const path = `${folder}/${fileName}.${IMAGE_EXTENSIONS[file.mimetype]}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    logger.error({ err: error, bucket, path }, "Storage upload failed");
    throw internal("Зураг хадгалахад алдаа гарлаа.");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { path, publicUrl: data.publicUrl };
}

export async function removeFiles(
  supabase: SupabaseClient,
  bucket: string,
  paths: string[]
) {
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    logger.error({ err: error, bucket, paths }, "Storage cleanup failed");
  }
}

/** Extracts the object path from a Supabase public URL for `bucket`. */
export function pathFromPublicUrl(url: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}
