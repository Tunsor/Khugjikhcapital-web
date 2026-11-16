import { createHmac } from "node:crypto";

import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { getAdminClient } from "../config/supabase.js";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

/**
 * Database-backed fixed-window rate limiter (`check_api_rate_limit` RPC).
 * The identifier is HMAC-hashed so raw PII never reaches the table.
 */
export async function checkDatabaseRateLimit(
  identifier: string,
  limit = 5,
  windowSeconds = 60
): Promise<RateLimitResult> {
  if (!identifier.trim()) {
    throw new Error("Rate limit identifier is required");
  }

  const keyHash = createHmac("sha256", env.RATE_LIMIT_HASH_SECRET)
    .update(`loan-application:${identifier}`)
    .digest("hex");

  const { data, error } = await getAdminClient().rpc("check_api_rate_limit", {
    p_key_hash: keyHash,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    logger.error({ err: error }, "Database rate limit error");
    throw new Error("Rate limit verification failed");
  }

  const result = data?.[0];

  if (!result) {
    throw new Error("Rate limit returned no result");
  }

  return {
    allowed: result.allowed === true,
    remaining: Number(result.remaining),
    retryAfter: Number(result.retry_after),
  };
}
