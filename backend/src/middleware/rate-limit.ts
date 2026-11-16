import { timingSafeEqual } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env.js";
import { getRateLimitIp } from "../utils/client-ip.js";
import { HttpError } from "../utils/http-error.js";

export const INTERNAL_API_HEADER = "x-internal-api-key";

const TOO_MANY_REQUESTS =
  "Хэт олон хүсэлт илгээсэн байна. Түр хүлээгээд дахин оролдоно уу.";

type Bucket = { count: number; resetAt: number };

type MemoryRateLimitOptions = {
  /** Max requests per window per IP. */
  limit: number;
  windowSeconds: number;
  /** Separates counters of different limiters. */
  prefix: string;
  /** Upper bound on tracked IPs, so a flood of addresses can't exhaust RAM. */
  maxKeys?: number;
};

/**
 * True when the request comes from our own Next.js server (SSR), which
 * would otherwise share one IP for every visitor.
 */
export function isTrustedInternalRequest(req: Request): boolean {
  const secret = env.INTERNAL_API_SECRET;
  const provided = req.get(INTERNAL_API_HEADER);

  if (!secret || !provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(secret);

  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * In-memory fixed-window limiter keyed by client IP. Meant for cheap
 * public reads, where a database round-trip per request would cost more
 * than the request itself. Counters are per process.
 */
export function memoryRateLimit({
  limit,
  windowSeconds,
  prefix,
  maxKeys = 50_000,
}: MemoryRateLimitOptions) {
  const buckets = new Map<string, Bucket>();
  const windowMs = windowSeconds * 1000;

  const sweep = (now: number) => {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }

    // Still full: drop the oldest entries (Map keeps insertion order).
    for (const key of buckets.keys()) {
      if (buckets.size < maxKeys) break;
      buckets.delete(key);
    }
  };

  setInterval(() => sweep(Date.now()), windowMs).unref();

  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS" || isTrustedInternalRequest(req)) {
      next();
      return;
    }

    const now = Date.now();
    const key = `${prefix}:${getRateLimitIp(req)}`;
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      if (!bucket && buckets.size >= maxKeys) sweep(now);
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    const remaining = Math.max(0, limit - bucket.count);
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    res.setHeader("RateLimit-Limit", String(limit));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(retryAfter));

    if (bucket.count > limit) {
      next(new HttpError(429, TOO_MANY_REQUESTS, { "Retry-After": String(retryAfter) }));
      return;
    }

    next();
  };
}

/** Public website reads: /news, /loan-products, /site-settings, ... */
export const publicReadRateLimit = memoryRateLimit({
  prefix: "public-read",
  limit: 120,
  windowSeconds: 60,
});
