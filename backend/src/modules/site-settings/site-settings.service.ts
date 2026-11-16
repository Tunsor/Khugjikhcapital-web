import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "../../config/logger.js";
import { getPublicClient } from "../../config/supabase.js";
import {
  BUCKETS,
  removeFiles,
  uploadPublicImage,
} from "../../services/storage.js";
import { internal } from "../../utils/http-error.js";
import type { UpdateSiteSettingsInput } from "./site-settings.schema.js";

const SETTINGS_ID = 1;

/** Columns that are safe to expose on the public website. */
const PUBLIC_COLUMNS = [
  "company_name",
  "company_description",
  "logo_url",
  "phone",
  "email",
  "address",
  "facebook_url",
  "instagram_url",
  "primary_color",
  "secondary_color",
  "hero_title",
  "hero_description",
  "hero_image_url",
  "hero_section_label",
  "hero_badge_text",
  "hero_card_label",
  "hero_card_title",
  "hero_card_description",
].join(",");

export async function getPublicSiteSettings() {
  const { data, error } = await getPublicClient()
    .from("site_settings")
    .select(PUBLIC_COLUMNS)
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Public site settings error");
    throw internal("Тохиргоо уншихад алдаа гарлаа.");
  }

  return data;
}

export async function getSiteSettings(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Admin site settings error");
    throw internal("Тохиргоо уншихад алдаа гарлаа.");
  }

  return data;
}

export async function updateSiteSettings(
  supabase: SupabaseClient,
  updates: UpdateSiteSettingsInput
) {
  const { data, error } = await supabase
    .from("site_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", SETTINGS_ID)
    .select("*")
    .single();

  if (error) {
    logger.error({ err: error }, "Settings update error");
    throw internal("Тохиргоог хадгалахад алдаа гарлаа.");
  }

  return data;
}

/** Uploads a new image and stores its public URL in `column`. */
export async function replaceSiteImage(
  supabase: SupabaseClient,
  column: "logo_url" | "hero_image_url",
  folder: "logos" | "hero",
  file: Express.Multer.File
): Promise<string> {
  const { path, publicUrl } = await uploadPublicImage(
    supabase,
    BUCKETS.siteAssets,
    folder,
    file
  );

  const { error } = await supabase
    .from("site_settings")
    .update({ [column]: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", SETTINGS_ID);

  if (error) {
    logger.error({ err: error, column }, "Site image settings update error");
    await removeFiles(supabase, BUCKETS.siteAssets, [path]);
    throw internal("Зургийн мэдээллийг хадгалахад алдаа гарлаа.");
  }

  return publicUrl;
}
