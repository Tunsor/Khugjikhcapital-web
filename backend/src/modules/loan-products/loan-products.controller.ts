import type { Request, Response } from "express";

import { getAuth } from "../../middleware/auth.js";
import { badRequest } from "../../utils/http-error.js";
import { assertUuid, parseOrThrow } from "../../utils/validation.js";
import { loanProductSchema, reorderSchema } from "./loan-products.schema.js";
import * as service from "./loan-products.service.js";

type IdParams = { id: string };
type SlugParams = { slug: string };

export async function listPublic(_req: Request, res: Response) {
  res.json({ data: await service.listActive() });
}

export async function getPublicBySlug(req: Request<SlugParams>, res: Response) {
  const { slug } = req.params;

  if (!slug || slug.length > 100) {
    throw badRequest("Slug буруу байна.");
  }

  res.json({ data: await service.getActiveBySlug(slug) });
}

export async function listAdmin(req: Request, res: Response) {
  res.json({ data: await service.listAll(getAuth(req).supabase) });
}

export async function getAdmin(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id);
  res.json({ data: await service.getById(getAuth(req).supabase, req.params.id) });
}

export async function create(req: Request, res: Response) {
  const input = parseOrThrow(loanProductSchema, req.body);
  const data = await service.create(getAuth(req).supabase, input);

  res.status(201).json({ data, message: "Бүтээгдэхүүн амжилттай нэмэгдлээ." });
}

export async function update(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id);
  const input = parseOrThrow(loanProductSchema, req.body);
  const data = await service.update(getAuth(req).supabase, req.params.id, input);

  res.json({ data, message: "Бүтээгдэхүүн амжилттай шинэчлэгдлээ." });
}

export async function remove(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id);
  await service.remove(getAuth(req).supabase, req.params.id);

  res.status(204).end();
}

export async function reorder(req: Request, res: Response) {
  const { ids } = parseOrThrow(reorderSchema, req.body);
  await service.reorder(getAuth(req).supabase, ids);

  res.status(204).end();
}
