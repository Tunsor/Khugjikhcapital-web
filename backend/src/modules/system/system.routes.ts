import { Router } from "express";

import { noStore } from "../../middleware/cache.js";

export const systemRouter = Router();

systemRouter.get("/health", noStore, (_req, res) => {
  res.json({ data: { status: "ok", uptime: process.uptime() } });
});

/** Current year in Ulaanbaatar — used for the footer copyright. */
systemRouter.get("/server-time", noStore, (_req, res) => {
  const now = new Date();
  const year = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ulaanbaatar",
      year: "numeric",
    }).format(now)
  );

  res.json({ data: { year, now: now.toISOString() } });
});
