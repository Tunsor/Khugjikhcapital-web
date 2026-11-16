import { Router } from "express";

import { imageUpload } from "../../middleware/upload.js";
import * as controller from "./site-settings.controller.js";

export const publicSiteSettingsRouter = Router();
publicSiteSettingsRouter.get("/", controller.getPublic);

export const adminSiteSettingsRouter = Router();
adminSiteSettingsRouter.get("/", controller.getAdmin);
adminSiteSettingsRouter.patch("/", controller.update);
adminSiteSettingsRouter.post(
  "/logo",
  imageUpload.single("file"),
  controller.uploadLogo
);
adminSiteSettingsRouter.post(
  "/hero-image",
  imageUpload.single("file"),
  controller.uploadHeroImage
);
