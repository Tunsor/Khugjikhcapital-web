import type { NextFunction, Request, Response } from "express";

import { logger } from "../config/logger.js";
import { checkDatabaseRateLimit } from "../services/rate-limit.js";
import { verifyTurnstile } from "../services/turnstile.js";
import { getClientIp, getRateLimitIp } from "../utils/client-ip.js";
import { badRequest, HttpError, serviceUnavailable } from "../utils/http-error.js";
import { MAX_DOCUMENT_SIZE, MAX_DOCUMENTS } from "./upload.js";

/**
 * Guards that run BEFORE multer buffers any file into memory, so that
 * unverified or abusive clients can't make the server read large bodies.
 *
 * Order on the route: size → IP rate limit → Turnstile → concurrency → multer.
 */

export const TURNSTILE_HEADER = "x-turnstile-token";

/** Whole multipart body: all files plus text fields and boundaries. */
export const MAX_APPLICATION_BODY = MAX_DOCUMENT_SIZE * MAX_DOCUMENTS + 1024 * 1024;

/** Max number of multipart bodies buffered in memory at the same time. */
const MAX_CONCURRENT_UPLOADS = 4;

const IP_LIMIT = 10;
const IP_WINDOW_SECONDS = 10 * 60;

/** Rejects bodies with no declared length or one above the limit. */
export function limitApplicationBodySize(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers["content-length"];

  if (!header) {
    // Chunked bodies have no length to check up front.
    next(new HttpError(411, "Хүсэлтийн хэмжээ тодорхойгүй байна."));
    return;
  }

  const length = Number(header);

  if (!Number.isFinite(length) || length < 0) {
    next(badRequest("Хүсэлтийн хэмжээ буруу байна."));
    return;
  }

  if (length > MAX_APPLICATION_BODY) {
    next(new HttpError(413, "Хүсэлтийн хэмжээ хэтэрсэн байна."));
    return;
  }

  next();
}

/** Per-IP limit, checked before the body is read. */
export async function limitApplicationsByIp(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // Never skipped: without a trusted proxy this is the socket address.
  const ip = getRateLimitIp(req);
  let result;

  try {
    result = await checkDatabaseRateLimit(`ip:${ip}`, IP_LIMIT, IP_WINDOW_SECONDS);
  } catch (error) {
    logger.error({ err: error }, "Application IP rate limit error");
    throw serviceUnavailable(
      "Хүсэлтийг түр шалгах боломжгүй байна. Дараа дахин оролдоно уу."
    );
  }

  if (!result.allowed) {
    throw new HttpError(
      429,
      "Хэт олон хүсэлт илгээсэн байна. Түр хүлээгээд дахин оролдоно уу.",
      { "Retry-After": String(result.retryAfter) }
    );
  }

  next();
}

/** Verifies the Turnstile token sent as a header (the body isn't parsed yet). */
export async function requireTurnstile(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.get(TURNSTILE_HEADER)?.trim() ?? "";

  if (!token || token.length > 4096) {
    throw badRequest("CAPTCHA баталгаажуулалт шаардлагатай.");
  }

  let verified: boolean;

  try {
    verified = await verifyTurnstile(token, getClientIp(req));
  } catch (error) {
    logger.error({ err: error }, "Turnstile service error");
    throw serviceUnavailable("CAPTCHA үйлчилгээ түр ажиллахгүй байна.");
  }

  if (!verified) {
    throw badRequest("CAPTCHA баталгаажуулалт амжилтгүй боллоо.");
  }

  next();
}

let activeUploads = 0;

/** Caps how many request bodies are buffered in RAM at once. */
export function limitConcurrentUploads(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (activeUploads >= MAX_CONCURRENT_UPLOADS) {
    next(
      new HttpError(503, "Сервер ачаалалтай байна. Түр хүлээгээд дахин оролдоно уу.", {
        "Retry-After": "10",
      })
    );
    return;
  }

  activeUploads += 1;
  let released = false;

  // "close" fires on both normal completion and aborted connections.
  res.once("close", () => {
    if (released) return;
    released = true;
    activeUploads -= 1;
  });

  next();
}
