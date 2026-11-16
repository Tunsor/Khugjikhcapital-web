import { Router } from "express";

import * as controller from "./loan-products.controller.js";

export const publicLoanProductsRouter = Router();
publicLoanProductsRouter.get("/", controller.listPublic);
publicLoanProductsRouter.get("/:slug", controller.getPublicBySlug);

export const adminLoanProductsRouter = Router();
adminLoanProductsRouter.get("/", controller.listAdmin);
adminLoanProductsRouter.post("/", controller.create);
// Must be declared before "/:id" so "order" is not treated as an id.
adminLoanProductsRouter.put("/order", controller.reorder);
adminLoanProductsRouter.get("/:id", controller.getAdmin);
adminLoanProductsRouter.put("/:id", controller.update);
adminLoanProductsRouter.delete("/:id", controller.remove);
