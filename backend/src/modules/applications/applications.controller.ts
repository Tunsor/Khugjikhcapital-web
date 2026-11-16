import type { Request, Response } from "express";

import { getAuth } from "../../middleware/auth.js";
import { assertUuid, parseOrThrow } from "../../utils/validation.js";
import {
  createApplicationSchema,
  updateStatusSchema,
} from "./applications.schema.js";
import * as service from "./applications.service.js";

type IdParams = { id: string };

export async function create(req: Request, res: Response) {
  const input = parseOrThrow(createApplicationSchema, req.body);
  const files = Array.isArray(req.files) ? req.files : [];

  const data = await service.createApplication(input, files);

  res.status(201).json({ data, message: "Хүсэлт амжилттай илгээгдлээ." });
}

export async function list(req: Request, res: Response) {
  res.json({ data: await service.listApplications(getAuth(req).supabase) });
}

export async function getById(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id, "Хүсэлтийн ID буруу байна.");
  res.json({
    data: await service.getApplicationDetail(getAuth(req).supabase, req.params.id),
  });
}

export async function updateStatus(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id, "Хүсэлтийн ID буруу байна.");
  const { status } = parseOrThrow(updateStatusSchema, req.body, "Төлөв заагаагүй байна.");

  const data = await service.updateStatus(getAuth(req).supabase, req.params.id, status);

  res.json({ data, message: "Төлөв амжилттай шинэчлэгдлээ." });
}
