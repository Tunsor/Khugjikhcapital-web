import type { Request, Response } from "express";

import { getAuth } from "../../middleware/auth.js";
import { validateImage } from "../../services/storage.js";
import { parseOrThrow } from "../../utils/validation.js";
import { updateSiteSettingsSchema } from "./site-settings.schema.js";
import * as service from "./site-settings.service.js";

export async function getPublic(_req: Request, res: Response) {
  res.json({ data: await service.getPublicSiteSettings() });
}

export async function getAdmin(req: Request, res: Response) {
  res.json({ data: await service.getSiteSettings(getAuth(req).supabase) });
}

export async function update(req: Request, res: Response) {
  const input = parseOrThrow(
    updateSiteSettingsSchema,
    req.body,
    "Мэдээллийн формат буруу байна."
  );

  const data = await service.updateSiteSettings(getAuth(req).supabase, input);
  res.json({ data, message: "Тохиргоо амжилттай хадгалагдлаа." });
}

export async function uploadLogo(req: Request, res: Response) {
  validateImage(req.file, "Лого зураг сонгоно уу.");

  const logoUrl = await service.replaceSiteImage(
    getAuth(req).supabase,
    "logo_url",
    "logos",
    req.file
  );

  res.json({
    data: { logo_url: logoUrl },
    message: "Лого амжилттай шинэчлэгдлээ.",
  });
}

export async function uploadHeroImage(req: Request, res: Response) {
  validateImage(req.file, "Hero зураг сонгоно уу.");

  const heroImageUrl = await service.replaceSiteImage(
    getAuth(req).supabase,
    "hero_image_url",
    "hero",
    req.file
  );

  res.json({
    data: { hero_image_url: heroImageUrl },
    message: "Hero зураг амжилттай шинэчлэгдлээ.",
  });
}
