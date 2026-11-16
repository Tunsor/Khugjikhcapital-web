import type { Request, Response } from "express";

import { getAuth } from "../../middleware/auth.js";
import { runNewsSync } from "../../services/news-sync/index.js";
import { validateImage } from "../../services/storage.js";
import { badRequest } from "../../utils/http-error.js";
import { assertUuid, parseOrThrow } from "../../utils/validation.js";
import {
  adminCompanyNewsQuerySchema,
  adminExternalNewsQuerySchema,
  companyNewsListQuerySchema,
  companyNewsSchema,
  externalNewsQuerySchema,
} from "./news.schema.js";
import * as service from "./news.service.js";

type IdParams = { id: string };
type SlugParams = { slug: string };

const INVALID_ID = "Мэдээний ID буруу байна.";

// ─── Public ────────────────────────────────────────────

export async function listCompany(req: Request, res: Response) {
  const { limit } = companyNewsListQuerySchema.parse(req.query);
  res.json({ data: await service.listPublishedCompanyNews(limit) });
}

export async function getCompanyBySlug(req: Request<SlugParams>, res: Response) {
  const { slug } = req.params;

  if (!slug || slug.length > 200) {
    throw badRequest("Slug буруу байна.");
  }

  res.json({ data: await service.getPublishedCompanyNewsBySlug(slug) });
}

export async function listExternal(req: Request, res: Response) {
  const query = externalNewsQuerySchema.parse(req.query);
  const { items, meta } = await service.listExternalNews(query);

  res.json({ data: items, meta });
}

// ─── Admin ─────────────────────────────────────────────

export async function adminListCompany(req: Request, res: Response) {
  const query = adminCompanyNewsQuerySchema.parse(req.query);
  res.json({
    data: await service.listCompanyNewsForAdmin(getAuth(req).supabase, query),
  });
}

export async function adminListExternal(req: Request, res: Response) {
  const { limit } = adminExternalNewsQuerySchema.parse(req.query);
  res.json({
    data: await service.listExternalNewsForAdmin(getAuth(req).supabase, limit),
  });
}

export async function adminGetCompany(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id, INVALID_ID);
  res.json({
    data: await service.getCompanyNewsById(getAuth(req).supabase, req.params.id),
  });
}

export async function adminCreateCompany(req: Request, res: Response) {
  const input = parseOrThrow(companyNewsSchema, req.body);

  // The cover image is optional on create.
  const image = req.file && req.file.size > 0 ? req.file : undefined;
  if (image) validateImage(image);

  const data = await service.createCompanyNews(getAuth(req).supabase, input, image);

  res.status(201).json({
    data,
    message:
      input.status === "published"
        ? "Мэдээ амжилттай нийтлэгдлээ."
        : "Мэдээ ноорог байдлаар хадгалагдлаа.",
  });
}

export async function adminUpdateCompany(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id, INVALID_ID);
  const input = parseOrThrow(
    companyNewsSchema,
    req.body,
    "Мэдээний мэдээлэл дутуу эсвэл буруу байна."
  );

  await service.updateCompanyNews(getAuth(req).supabase, req.params.id, input);

  res.json({
    data: { id: req.params.id },
    message: "Мэдээ амжилттай шинэчлэгдлээ.",
  });
}

export async function adminReplaceImage(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id, INVALID_ID);
  validateImage(req.file);

  const imageUrl = await service.replaceCompanyNewsImage(
    getAuth(req).supabase,
    req.params.id,
    req.file
  );

  res.json({
    data: { image_url: imageUrl },
    message: "Мэдээний зураг амжилттай солигдлоо.",
  });
}

export async function adminDeleteCompany(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id, INVALID_ID);
  await service.deleteCompanyNews(getAuth(req).supabase, req.params.id);

  res.status(204).end();
}

/** Shared by the admin "sync now" button and the cron job. */
export async function syncNews(_req: Request, res: Response) {
  const result = await runNewsSync();

  res.status(result.success ? 200 : 207).json({ data: result });
}
