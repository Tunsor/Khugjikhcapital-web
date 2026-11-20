import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "../../config/logger.js";
import { getPublicClient } from "../../config/supabase.js";
import {
  BUCKETS,
  pathFromPublicUrl,
  removeFiles,
  uploadPublicImage,
} from "../../services/storage.js";
import { internal, notFound } from "../../utils/http-error.js";
import type { PaymentAccountInput } from "./payment-accounts.schema.js";

const TABLE = "payment_accounts";
const QR_FOLDER = "payment-qr";

const PUBLIC_COLUMNS =
  "id,bank_name,account_holder,account_number,iban,description,qr_image_url,sort_order";

// ─── Public ────────────────────────────────────────────

export async function listActive() {
  const { data, error } = await getPublicClient()
    .from(TABLE)
    .select(PUBLIC_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    logger.error({ err: error }, "Payment accounts list error");
    throw internal("Төлбөрийн дансны мэдээлэл уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

// ─── Admin ─────────────────────────────────────────────

export async function listAll(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    logger.error({ err: error }, "Admin payment accounts list error");
    throw internal("Төлбөрийн дансны мэдээлэл уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

async function getQrUrl(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("qr_image_url")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Payment account read error");
    throw internal("Төлбөрийн данс уншихад алдаа гарлаа.");
  }

  if (!data) {
    throw notFound("Төлбөрийн данс олдсонгүй.");
  }

  return data.qr_image_url as string | null;
}

async function removeQrFile(supabase: SupabaseClient, url: string | null) {
  if (!url) return;

  const path = pathFromPublicUrl(url, BUCKETS.siteAssets);

  if (path?.startsWith(`${QR_FOLDER}/`)) {
    await removeFiles(supabase, BUCKETS.siteAssets, [path]);
  }
}

export async function create(supabase: SupabaseClient, input: PaymentAccountInput) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error) {
    logger.error({ err: error }, "Payment account insert error");
    throw internal("Төлбөрийн данс хадгалахад алдаа гарлаа.");
  }

  return data;
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: PaymentAccountInput
) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Payment account update error");
    throw internal("Төлбөрийн данс хадгалахад алдаа гарлаа.");
  }

  if (!data) {
    throw notFound("Төлбөрийн данс олдсонгүй.");
  }

  return data;
}

export async function remove(supabase: SupabaseClient, id: string) {
  const qrUrl = await getQrUrl(supabase, id);

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    logger.error({ err: error }, "Payment account delete error");
    throw internal("Төлбөрийн данс устгахад алдаа гарлаа.");
  }

  await removeQrFile(supabase, qrUrl);
}

export async function reorder(supabase: SupabaseClient, ids: string[]) {
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from(TABLE).update({ sort_order: index + 1 }).eq("id", id)
    )
  );

  const failed = results.filter((result) => result.error);

  if (failed.length > 0) {
    logger.error(
      { errors: failed.map((result) => result.error) },
      "Payment account reorder error"
    );
    throw internal("Дараалал хадгалахад алдаа гарлаа.");
  }
}

/** Uploads a QR image for the account, replacing (and deleting) the old one. */
export async function replaceQr(
  supabase: SupabaseClient,
  id: string,
  file: Express.Multer.File
): Promise<string> {
  const oldUrl = await getQrUrl(supabase, id);

  const { path, publicUrl } = await uploadPublicImage(
    supabase,
    BUCKETS.siteAssets,
    QR_FOLDER,
    file
  );

  const { error } = await supabase
    .from(TABLE)
    .update({ qr_image_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    logger.error({ err: error }, "Payment QR update error");
    await removeFiles(supabase, BUCKETS.siteAssets, [path]);
    throw internal("QR зургийг хадгалахад алдаа гарлаа.");
  }

  await removeQrFile(supabase, oldUrl);
  return publicUrl;
}

export async function clearQr(supabase: SupabaseClient, id: string) {
  const oldUrl = await getQrUrl(supabase, id);

  const { error } = await supabase
    .from(TABLE)
    .update({ qr_image_url: null, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    logger.error({ err: error }, "Payment QR clear error");
    throw internal("QR зургийг устгахад алдаа гарлаа.");
  }

  await removeQrFile(supabase, oldUrl);
}
