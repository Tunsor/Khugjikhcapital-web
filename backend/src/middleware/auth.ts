import type { NextFunction, Request, Response } from "express";

import { createUserClient, getAdminClient } from "../config/supabase.js";
import { logger } from "../config/logger.js";
import { forbidden, internal, unauthorized } from "../utils/http-error.js";

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 && token.length <= 8192 ? token : null;
}

/**
 * Verifies the Supabase access token sent as `Authorization: Bearer`,
 * then checks the `is_admin()` RPC as that user.
 */
export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = extractBearerToken(req);

  if (!token) {
    throw unauthorized();
  }

  const {
    data: { user },
    error: authError,
  } = await getAdminClient().auth.getUser(token);

  if (authError || !user) {
    throw unauthorized();
  }

  const supabase = createUserClient(token);

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError) {
    logger.error({ err: adminError }, "Admin authorization error");
    throw internal("Эрх шалгахад алдаа гарлаа.");
  }

  if (isAdmin !== true) {
    throw forbidden();
  }

  req.auth = { user, supabase };
  next();
}

/** Narrow helper for controllers mounted behind `requireAdmin`. */
export function getAuth(req: Request) {
  if (!req.auth) {
    throw unauthorized();
  }

  return req.auth;
}
