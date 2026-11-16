import { z } from "zod";

export const COMPANY_NEWS_CATEGORIES = [
  "company",
  "announcement",
  "promotion",
  "event",
] as const;

export const EXTERNAL_NEWS_CATEGORIES = [
  "loan",
  "inflation",
  "policy_rate",
  "finance",
] as const;

export const NEWS_STATUSES = ["draft", "published"] as const;

export const companyNewsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Гарчиг, тайлбар эсвэл агуулга буруу байна." })
    .max(200, { error: "Гарчиг, тайлбар эсвэл агуулга буруу байна." }),
  summary: z
    .string()
    .trim()
    .max(500, { error: "Гарчиг, тайлбар эсвэл агуулга буруу байна." })
    .optional()
    .transform((value) => value || null),
  content: z
    .string()
    .trim()
    .min(1, { error: "Гарчиг, тайлбар эсвэл агуулга буруу байна." })
    .max(100_000, { error: "Гарчиг, тайлбар эсвэл агуулга буруу байна." }),
  category: z.enum(COMPANY_NEWS_CATEGORIES, {
    error: "Мэдээний ангилал буруу байна.",
  }),
  status: z.enum(NEWS_STATUSES, { error: "Нийтлэлийн төлөв буруу байна." }),
});

export type CompanyNewsInput = z.infer<typeof companyNewsSchema>;

const pageNumber = z.coerce.number().int().min(1).max(10_000).catch(1);

export const externalNewsQuerySchema = z.object({
  category: z.enum(EXTERNAL_NEWS_CATEGORIES).optional().catch(undefined),
  page: pageNumber,
  pageSize: z.coerce.number().int().min(1).max(50).catch(12),
});

export const companyNewsListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).catch(100),
});

export const adminCompanyNewsQuerySchema = z.object({
  q: z.string().trim().max(200).optional().catch(undefined),
  category: z.enum(COMPANY_NEWS_CATEGORIES).optional().catch(undefined),
  status: z.enum(NEWS_STATUSES).optional().catch(undefined),
});

export const adminExternalNewsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).catch(100),
});
