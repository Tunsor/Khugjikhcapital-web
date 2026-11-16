import { Router, type Request, type Response } from "express";

import { logger } from "../../config/logger.js";
import { getAdminClient } from "../../config/supabase.js";
import { BUCKETS } from "../../services/storage.js";
import { DOCUMENT_EXTENSIONS } from "../../utils/file-signature.js";
import { internal, notFound } from "../../utils/http-error.js";
import { assertUuid } from "../../utils/validation.js";

export const adminDocumentsRouter = Router();

/**
 * Streams a private loan document. Mounted behind `requireAdmin`, so the
 * service-role client is only used after authorization.
 */
adminDocumentsRouter.get(
  "/:id/download",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    assertUuid(id, "Баримт бичгийн ID буруу байна.");

    const admin = getAdminClient();

    const { data: document, error } = await admin
      .from("application_documents")
      .select("id,file_path,file_type")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      logger.error({ err: error }, "Document lookup error");
      throw internal("Баримт бичгийн мэдээлэл авахад алдаа гарлаа.");
    }

    if (!document) {
      throw notFound("Баримт бичиг олдсонгүй.");
    }

    const { data: file, error: downloadError } = await admin.storage
      .from(BUCKETS.loanDocuments)
      .download(document.file_path);

    if (downloadError || !file) {
      logger.error({ err: downloadError }, "Private document download error");
      throw notFound("Файлыг нээх боломжгүй байна.");
    }

    // Only whitelisted types are echoed back; the file name is derived from
    // the ID so user-supplied names never reach HTTP headers.
    const extension = DOCUMENT_EXTENSIONS[document.file_type];
    const contentType = extension ? document.file_type : "application/octet-stream";
    const buffer = Buffer.from(await file.arrayBuffer());

    res
      .status(200)
      .set({
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="document-${id}.${extension ?? "bin"}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      })
      .send(buffer);
  }
);
