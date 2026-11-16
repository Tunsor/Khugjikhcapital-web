import { Router } from "express";

import { requireCronSecret } from "../../middleware/cron-auth.js";
import { imageUpload } from "../../middleware/upload.js";
import * as controller from "./news.controller.js";

export const publicNewsRouter = Router();
publicNewsRouter.get("/company", controller.listCompany);
publicNewsRouter.get("/company/:slug", controller.getCompanyBySlug);
publicNewsRouter.get("/external", controller.listExternal);

export const adminNewsRouter = Router();
adminNewsRouter.get("/company", controller.adminListCompany);
adminNewsRouter.post("/company", imageUpload.single("image"), controller.adminCreateCompany);
adminNewsRouter.get("/company/:id", controller.adminGetCompany);
adminNewsRouter.put("/company/:id", controller.adminUpdateCompany);
adminNewsRouter.delete("/company/:id", controller.adminDeleteCompany);
adminNewsRouter.put(
  "/company/:id/image",
  imageUpload.single("image"),
  controller.adminReplaceImage
);
adminNewsRouter.get("/external", controller.adminListExternal);
adminNewsRouter.post("/sync", controller.syncNews);

/** Scheduled job endpoint (e.g. Vercel Cron sends GET with Bearer secret). */
export const cronRouter = Router();
cronRouter.use(requireCronSecret);
cronRouter.get("/news-sync", controller.syncNews);
cronRouter.post("/news-sync", controller.syncNews);
