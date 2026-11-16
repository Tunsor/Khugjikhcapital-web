import { Router, type Request, type Response } from "express";

import { getAuth } from "../../middleware/auth.js";
import { parseOrThrow } from "../../utils/validation.js";
import { updateCalculatorSettingSchema } from "./calculator.schema.js";
import * as service from "./calculator.service.js";

export const publicCalculatorRouter = Router();

publicCalculatorRouter.get("/", async (_req: Request, res: Response) => {
  res.json({ data: await service.listActiveSettings() });
});

export const adminCalculatorRouter = Router();

adminCalculatorRouter.get("/", async (req: Request, res: Response) => {
  res.json({ data: await service.listAllSettings(getAuth(req).supabase) });
});

adminCalculatorRouter.patch("/", async (req: Request, res: Response) => {
  const input = parseOrThrow(updateCalculatorSettingSchema, req.body, "Буруу хүсэлт.");
  const data = await service.updateSetting(getAuth(req).supabase, input);

  res.json({ data, message: "Тохиргоо амжилттай хадгалагдлаа." });
});
