import type { Request, Response } from "express";

import { getAuth } from "../../middleware/auth.js";
import { validateImage } from "../../services/storage.js";
import { assertUuid, parseOrThrow } from "../../utils/validation.js";
import { paymentAccountSchema, reorderSchema } from "./payment-accounts.schema.js";
import * as service from "./payment-accounts.service.js";

type IdParams = { id: string };

export async function listPublic(_req: Request, res: Response) {
  res.json({ data: await service.listActive() });
}

export async function listAdmin(req: Request, res: Response) {
  res.json({ data: await service.listAll(getAuth(req).supabase) });
}

export async function create(req: Request, res: Response) {
  const input = parseOrThrow(paymentAccountSchema, req.body);
  const data = await service.create(getAuth(req).supabase, input);

  res.status(201).json({ data, message: "Төлбөрийн данс нэмэгдлээ." });
}

export async function update(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id);
  const input = parseOrThrow(paymentAccountSchema, req.body);
  const data = await service.update(getAuth(req).supabase, req.params.id, input);

  res.json({ data, message: "Төлбөрийн данс шинэчлэгдлээ." });
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

export async function uploadQr(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id);
  validateImage(req.file, "QR зураг сонгоно уу.");

  const qrImageUrl = await service.replaceQr(
    getAuth(req).supabase,
    req.params.id,
    req.file
  );

  res.json({
    data: { qr_image_url: qrImageUrl },
    message: "QR зураг шинэчлэгдлээ.",
  });
}

export async function deleteQr(req: Request<IdParams>, res: Response) {
  assertUuid(req.params.id);
  await service.clearQr(getAuth(req).supabase, req.params.id);

  res.status(204).end();
}
