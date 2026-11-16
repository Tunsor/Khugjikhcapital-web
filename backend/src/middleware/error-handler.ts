import type { NextFunction, Request, Response } from "express";
import multer from "multer";

import { logger } from "../config/logger.js";
import { HttpError } from "../utils/http-error.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}

const MULTER_MESSAGES: Partial<Record<multer.ErrorCode, [number, string]>> = {
  LIMIT_FILE_SIZE: [413, "Файлын хэмжээ хэтэрсэн байна."],
  LIMIT_FILE_COUNT: [400, "Файлын тоо хэтэрсэн байна."],
  LIMIT_UNEXPECTED_FILE: [400, "Зөвшөөрөгдөөгүй файл илгээсэн байна."],
  LIMIT_FIELD_VALUE: [400, "Оруулсан текстийн урт хэтэрсэн байна."],
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Express identifies error handlers by their 4-argument signature.
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    res.set(err.headers).status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof multer.MulterError) {
    const [status, message] = MULTER_MESSAGES[err.code] ?? [
      400,
      "Файлын мэдээлэл буруу байна.",
    ];
    res.status(status).json({ error: message });
    return;
  }

  // Malformed JSON body from express.json()
  if (
    err instanceof SyntaxError &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    res.status(400).json({ error: "JSON өгөгдөл буруу байна." });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    err.type === "entity.too.large"
  ) {
    res.status(413).json({ error: "Хүсэлтийн хэмжээ хэтэрсэн байна." });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Серверийн алдаа гарлаа." });
}
