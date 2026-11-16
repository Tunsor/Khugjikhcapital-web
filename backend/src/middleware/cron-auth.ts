import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env.js";
import { unauthorized } from "../utils/http-error.js";

/** Constant-time check of `Authorization: Bearer <CRON_SECRET>`. */
export function requireCronSecret(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw unauthorized("Unauthorized");
  }

  const expected = Buffer.from(env.CRON_SECRET, "utf8");
  const provided = Buffer.from(header.slice("Bearer ".length), "utf8");

  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    throw unauthorized("Unauthorized");
  }

  next();
}
