import { Router } from "express";

import { imageUpload } from "../../middleware/upload.js";
import * as controller from "./payment-accounts.controller.js";

export const publicPaymentAccountsRouter = Router();
publicPaymentAccountsRouter.get("/", controller.listPublic);

export const adminPaymentAccountsRouter = Router();
adminPaymentAccountsRouter.get("/", controller.listAdmin);
adminPaymentAccountsRouter.post("/", controller.create);
// Must be declared before "/:id" so "order" is not treated as an id.
adminPaymentAccountsRouter.put("/order", controller.reorder);
adminPaymentAccountsRouter.put("/:id", controller.update);
adminPaymentAccountsRouter.delete("/:id", controller.remove);
adminPaymentAccountsRouter.post(
  "/:id/qr",
  imageUpload.single("file"),
  controller.uploadQr
);
adminPaymentAccountsRouter.delete("/:id/qr", controller.deleteQr);
