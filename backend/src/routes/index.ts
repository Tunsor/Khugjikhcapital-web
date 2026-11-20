import { Router } from "express";

import { getAuth, requireAdmin } from "../middleware/auth.js";
import { noStore } from "../middleware/cache.js";
import { publicReadRateLimit } from "../middleware/rate-limit.js";
import {
  adminApplicationsRouter,
  publicApplicationsRouter,
} from "../modules/applications/applications.routes.js";
import {
  adminCalculatorRouter,
  publicCalculatorRouter,
} from "../modules/calculator/calculator.routes.js";
import { adminDocumentsRouter } from "../modules/documents/documents.routes.js";
import {
  adminLoanProductsRouter,
  publicLoanProductsRouter,
} from "../modules/loan-products/loan-products.routes.js";
import {
  adminNewsRouter,
  cronRouter,
  publicNewsRouter,
} from "../modules/news/news.routes.js";
import {
  adminPaymentAccountsRouter,
  publicPaymentAccountsRouter,
} from "../modules/payment-accounts/payment-accounts.routes.js";
import {
  adminSiteSettingsRouter,
  publicSiteSettingsRouter,
} from "../modules/site-settings/site-settings.routes.js";
import { systemRouter } from "../modules/system/system.routes.js";

// ─── Public (website) ──────────────────────────────────
const publicRouter = Router();
publicRouter.use(systemRouter);
// Per-IP limit for all public reads (health/server-time above are exempt).
// POST /applications has its own stricter, database-backed IP limit.
publicRouter.use((req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD") {
    publicReadRateLimit(req, res, next);
    return;
  }
  next();
});
publicRouter.use("/site-settings", publicSiteSettingsRouter);
publicRouter.use("/loan-products", publicLoanProductsRouter);
publicRouter.use("/calculator-settings", publicCalculatorRouter);
publicRouter.use("/news", publicNewsRouter);
publicRouter.use("/payment-accounts", publicPaymentAccountsRouter);
publicRouter.use("/applications", publicApplicationsRouter);

// ─── Admin (Bearer Supabase JWT + is_admin) ────────────
const adminRouter = Router();
adminRouter.use(noStore, requireAdmin);
adminRouter.get("/me", (req, res) => {
  const { user } = getAuth(req);
  res.json({ data: { id: user.id, email: user.email ?? null } });
});
adminRouter.use("/site-settings", adminSiteSettingsRouter);
adminRouter.use("/loan-products", adminLoanProductsRouter);
adminRouter.use("/calculator-settings", adminCalculatorRouter);
adminRouter.use("/news", adminNewsRouter);
adminRouter.use("/payment-accounts", adminPaymentAccountsRouter);
adminRouter.use("/applications", adminApplicationsRouter);
adminRouter.use("/documents", adminDocumentsRouter);

// ─── v1 ────────────────────────────────────────────────
export const apiRouter = Router();
apiRouter.use("/admin", adminRouter);
apiRouter.use("/cron", noStore, cronRouter);
apiRouter.use(publicRouter);
