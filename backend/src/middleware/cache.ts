import type { NextFunction, Request, Response } from "express";

/** Disable caching for dynamic / private API responses. */
export function noStore(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  next();
}
