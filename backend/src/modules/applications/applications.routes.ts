import { Router } from "express";

import {
  limitApplicationBodySize,
  limitApplicationsByIp,
  limitConcurrentUploads,
  requireTurnstile,
} from "../../middleware/application-guard.js";
import { noStore } from "../../middleware/cache.js";
import { documentUpload } from "../../middleware/upload.js";
import * as controller from "./applications.controller.js";

export const publicApplicationsRouter = Router();
// Every check runs before multer reads files into memory.
publicApplicationsRouter.post(
  "/",
  noStore,
  limitApplicationBodySize,
  limitApplicationsByIp,
  requireTurnstile,
  limitConcurrentUploads,
  documentUpload.any(),
  controller.create
);

export const adminApplicationsRouter = Router();
adminApplicationsRouter.get("/", controller.list);
adminApplicationsRouter.get("/:id", controller.getById);
adminApplicationsRouter.patch("/:id/status", controller.updateStatus);
