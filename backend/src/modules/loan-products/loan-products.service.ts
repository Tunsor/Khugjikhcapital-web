import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { logger } from "../../config/logger.js";
import { getPublicClient } from "../../config/supabase.js";
import { conflict, internal, notFound } from "../../utils/http-error.js";
import type { LoanProductInput } from "./loan-products.schema.js";

const LIST_COLUMNS =
  "id,title,slug,short_description,interest_rate,max_amount,max_term,documents,sort_order";

const DETAIL_COLUMNS =
  "id,title,slug,short_description,description,interest_rate,max_amount,max_term,is_active,sort_order,requirements,documents";

const ADMIN_LIST_COLUMNS =
  "id,title,slug,short_description,interest_rate,max_amount,max_term,is_active,sort_order";

const UNIQUE_VIOLATION = "23505";

function handleWriteError(error: PostgrestError, context: string): never {
  logger.error({ err: error }, context);

  if (error.code === UNIQUE_VIOLATION) {
    throw conflict("Энэ slug аль хэдийн ашиглагдаж байна.");
  }

  throw internal("Бүтээгдэхүүнийг хадгалах үед алдаа гарлаа.");
}

// ─── Public ────────────────────────────────────────────

export async function listActive() {
  const { data, error } = await getPublicClient()
    .from("loan_products")
    .select(LIST_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    logger.error({ err: error }, "Loan products list error");
    throw internal("Зээлийн бүтээгдэхүүнийг уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

export async function getActiveBySlug(slug: string) {
  const { data, error } = await getPublicClient()
    .from("loan_products")
    .select(DETAIL_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Loan product detail error");
    throw internal("Зээлийн бүтээгдэхүүнийг уншихад алдаа гарлаа.");
  }

  if (!data) {
    throw notFound("Зээлийн бүтээгдэхүүн олдсонгүй.");
  }

  return data;
}

// ─── Admin ─────────────────────────────────────────────

export async function listAll(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("loan_products")
    .select(ADMIN_LIST_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    logger.error({ err: error }, "Admin loan products list error");
    throw internal("Зээлийн бүтээгдэхүүнийг уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

export async function getById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("loan_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Admin loan product error");
    throw internal("Зээлийн бүтээгдэхүүнийг уншихад алдаа гарлаа.");
  }

  if (!data) {
    throw notFound("Зээлийн бүтээгдэхүүн олдсонгүй.");
  }

  return data;
}

export async function create(supabase: SupabaseClient, input: LoanProductInput) {
  const { data, error } = await supabase
    .from("loan_products")
    .insert({ ...input, sort_order: 9999 })
    .select("*")
    .single();

  if (error) handleWriteError(error, "Loan product insert error");

  return data;
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: LoanProductInput
) {
  const { data, error } = await supabase
    .from("loan_products")
    .update(input)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) handleWriteError(error, "Loan product update error");

  if (!data) {
    throw notFound("Зээлийн бүтээгдэхүүн олдсонгүй.");
  }

  return data;
}

export async function remove(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("loan_products")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    logger.error({ err: error }, "Loan product delete error");
    throw internal("Бүтээгдэхүүн устгах үед алдаа гарлаа.");
  }

  if (!data || data.length === 0) {
    throw notFound("Зээлийн бүтээгдэхүүн олдсонгүй.");
  }
}

export async function reorder(supabase: SupabaseClient, ids: string[]) {
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase
        .from("loan_products")
        .update({ sort_order: index + 1 })
        .eq("id", id)
    )
  );

  const failed = results.filter((result) => result.error);

  if (failed.length > 0) {
    logger.error(
      { errors: failed.map((result) => result.error) },
      "Loan product reorder error"
    );
    throw internal("Дараалал хадгалах үед алдаа гарлаа.");
  }
}
