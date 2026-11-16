import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "../../config/logger.js";
import { getPublicClient } from "../../config/supabase.js";
import { internal } from "../../utils/http-error.js";
import type { UpdateCalculatorSettingInput } from "./calculator.schema.js";

const PUBLIC_COLUMNS =
  "id,loan_name,monthly_interest_rate,max_dti_ratio,min_term_months,max_term_months,max_loan_amount,is_active";

export async function listActiveSettings() {
  const { data, error } = await getPublicClient()
    .from("loan_calculator_settings")
    .select(PUBLIC_COLUMNS)
    .eq("is_active", true)
    .order("loan_name");

  if (error) {
    logger.error({ err: error }, "Public calculator settings error");
    throw internal("Тохиргоо уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

export async function listAllSettings(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("loan_calculator_settings")
    .select("*")
    .order("id");

  if (error) {
    logger.error({ err: error }, "Admin calculator settings error");
    throw internal("Зээлийн тооцоолуурын тохиргоог уншихад алдаа гарлаа.");
  }

  return data ?? [];
}

export async function updateSetting(
  supabase: SupabaseClient,
  { id, ...values }: UpdateCalculatorSettingInput
) {
  const { data, error } = await supabase
    .from("loan_calculator_settings")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error({ err: error }, "Calculator settings update error");
    throw internal("Зээлийн тооцоолуурын тохиргоог шинэчлэхэд алдаа гарлаа.");
  }

  return data;
}
