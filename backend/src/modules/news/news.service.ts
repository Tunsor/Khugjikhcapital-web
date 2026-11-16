import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";

import { logger } from "../../config/logger.js";
import { getPublicClient } from "../../config/supabase.js";
import {
  BUCKETS,
  pathFromPublicUrl,
  removeFiles,
  uploadPublicImage,
} from "../../services/storage.js";
import { internal, notFound } from "../../utils/http-error.js";
import type {
  adminCompanyNewsQuerySchema,
  CompanyNewsInput,
  externalNewsQuerySchema,
} from "./news.schema.js";

const COMPANY_PUBLIC_COLUMNS =
  "id,title,slug,summary,content,category,published_at,image_url";

const EXTERNAL_PUBLIC_COLUMNS =
  "id,title,summary,category,published_at,source_name,source_url,image_url";

/** External news older than two years is hidden from the website. */
function twoYearCutoff(): string {
  const cutoff = new Date();
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 2);
  return cutoff.toISOString();
}

/** Escapes user input for use inside a PostgREST `ilike` filter. */
function toIlikePattern(query: string): string {
  const escaped = query
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/[,().]/g, " ");

  return `%${escaped}%`;
}

// ─── Public ────────────────────────────────────────────

export async function listPublishedCompanyNews(limit: number) {
  const { data, error } = await getPublicClient()
    .from("company_news")
    .select(COMPANY_PUBLIC_COLUMNS)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ err: error }, "Public company news error");
    throw internal("Мэдээ уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

export async function getPublishedCompanyNewsBySlug(slug: string) {
  const { data, error } = await getPublicClient()
    .from("company_news")
    .select(COMPANY_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Public company news detail error");
    throw internal("Мэдээ уншихад алдаа гарлаа.");
  }

  if (!data) {
    throw notFound("Мэдээ олдсонгүй.");
  }

  return data;
}

export async function listExternalNews({
  category,
  page,
  pageSize,
}: z.infer<typeof externalNewsQuerySchema>) {
  const supabase = getPublicClient();
  const cutoff = twoYearCutoff();
  const now = new Date().toISOString();

  let countQuery = supabase
    .from("external_news")
    .select("id", { count: "exact", head: true })
    .gte("published_at", cutoff)
    .lte("published_at", now);

  if (category) countQuery = countQuery.eq("category", category);

  const { count, error: countError } = await countQuery;

  if (countError) {
    logger.error({ err: countError }, "External news count error");
    throw internal("Мэдээ уншихад алдаа гарлаа.");
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const from = (currentPage - 1) * pageSize;

  let listQuery = supabase
    .from("external_news")
    .select(EXTERNAL_PUBLIC_COLUMNS)
    .gte("published_at", cutoff)
    .lte("published_at", now);

  if (category) listQuery = listQuery.eq("category", category);

  const { data, error } = await listQuery
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    logger.error({ err: error }, "External news list error");
    throw internal("Мэдээ уншихад алдаа гарлаа.");
  }

  return {
    items: data ?? [],
    meta: { page: currentPage, pageSize, total, totalPages },
  };
}

// ─── Admin ─────────────────────────────────────────────

export async function listCompanyNewsForAdmin(
  supabase: SupabaseClient,
  { q, category, status }: z.infer<typeof adminCompanyNewsQuerySchema>
) {
  let query = supabase
    .from("company_news")
    .select("id,title,summary,category,status,published_at,created_at");

  if (q) {
    const pattern = toIlikePattern(q);
    query = query.or(`title.ilike.${pattern},summary.ilike.${pattern}`);
  }

  if (category) query = query.eq("category", category);
  if (status) query = query.eq("status", status);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    logger.error({ err: error }, "Admin company news list error");
    throw internal("Мэдээ уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

export async function listExternalNewsForAdmin(
  supabase: SupabaseClient,
  limit: number
) {
  const { data, error } = await supabase
    .from("external_news")
    .select("id,title,source_name,source_url,category,published_at,image_url")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ err: error }, "Admin external news list error");
    throw internal("Мэдээ уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

export async function getCompanyNewsById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("company_news")
    .select("id,title,slug,summary,content,category,status,image_url,published_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Admin company news read error");
    throw internal("Мэдээний мэдээллийг уншиж чадсангүй.");
  }

  if (!data) {
    throw notFound("Мэдээ олдсонгүй.");
  }

  return data;
}

export async function createCompanyNews(
  supabase: SupabaseClient,
  input: CompanyNewsInput,
  image: Express.Multer.File | undefined
) {
  const id = randomUUID();
  let uploaded: { path: string; publicUrl: string } | null = null;

  if (image) {
    uploaded = await uploadPublicImage(
      supabase,
      BUCKETS.companyNews,
      id,
      image,
      "cover"
    );
  }

  const { error } = await supabase.from("company_news").insert({
    id,
    slug: `news-${id}`,
    ...input,
    image_url: uploaded?.publicUrl ?? null,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    logger.error({ err: error }, "Company news insert error");

    if (uploaded) {
      await removeFiles(supabase, BUCKETS.companyNews, [uploaded.path]);
    }

    throw internal("Мэдээ хадгалахад алдаа гарлаа.");
  }

  return { id };
}

export async function updateCompanyNews(
  supabase: SupabaseClient,
  id: string,
  input: CompanyNewsInput
) {
  const { data: existing, error: readError } = await supabase
    .from("company_news")
    .select("id,published_at")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    logger.error({ err: readError }, "Company news read error");
    throw internal("Мэдээний мэдээллийг уншиж чадсангүй.");
  }

  if (!existing) {
    throw notFound("Мэдээ олдсонгүй.");
  }

  // Keep the original publish date when editing an already-published item.
  const publishedAt =
    input.status === "published"
      ? existing.published_at ?? new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("company_news")
    .update({
      ...input,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    logger.error({ err: error }, "Company news update error");
    throw internal("Мэдээ засахад алдаа гарлаа.");
  }
}

export async function replaceCompanyNewsImage(
  supabase: SupabaseClient,
  id: string,
  image: Express.Multer.File
) {
  const { data: existing, error: readError } = await supabase
    .from("company_news")
    .select("id,image_url")
    .eq("id", id)
    .maybeSingle();

  if (readError || !existing) {
    throw notFound("Мэдээ олдсонгүй.");
  }

  const { path, publicUrl } = await uploadPublicImage(
    supabase,
    BUCKETS.companyNews,
    id,
    image
  );

  const { error } = await supabase
    .from("company_news")
    .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    logger.error({ err: error }, "Company news image update error");
    await removeFiles(supabase, BUCKETS.companyNews, [path]);
    throw internal("Мэдээний зураг шинэчлэхэд алдаа гарлаа.");
  }

  // Remove the previous image if it lives in this news item's folder.
  const oldPath = existing.image_url
    ? pathFromPublicUrl(existing.image_url, BUCKETS.companyNews)
    : null;

  if (oldPath?.startsWith(`${id}/`)) {
    await removeFiles(supabase, BUCKETS.companyNews, [oldPath]);
  }

  return publicUrl;
}

export async function deleteCompanyNews(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("company_news")
    .delete()
    .eq("id", id)
    .select("id,image_url");

  if (error) {
    logger.error({ err: error }, "Company news delete error");
    throw internal("Мэдээ устгахад алдаа гарлаа.");
  }

  const deleted = data?.[0];

  if (!deleted) {
    throw notFound("Мэдээ олдсонгүй.");
  }

  // Clean up every image stored under this news item's folder.
  const { data: files } = await supabase.storage
    .from(BUCKETS.companyNews)
    .list(id);

  await removeFiles(
    supabase,
    BUCKETS.companyNews,
    (files ?? []).map((file) => `${id}/${file.name}`)
  );
}
