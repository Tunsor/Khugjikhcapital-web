import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

import { logger } from "../../config/logger.js";
import { getAdminClient } from "../../config/supabase.js";
import { MAX_DOCUMENTS } from "../../middleware/upload.js";
import { checkDatabaseRateLimit } from "../../services/rate-limit.js";
import { BUCKETS, removeFiles } from "../../services/storage.js";
import {
  DOCUMENT_EXTENSIONS,
  hasValidSignature,
} from "../../utils/file-signature.js";
import {
  badRequest,
  HttpError,
  internal,
  notFound,
  serviceUnavailable,
} from "../../utils/http-error.js";
import type { CreateApplicationInput } from "./applications.schema.js";

const MAX_TOTAL_FILE_SIZE = 50 * 1024 * 1024;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

type UploadedDocument = {
  documentName: string;
  file: Express.Multer.File;
};

// ─── Public: create ────────────────────────────────────

async function assertWithinRateLimit(registerNumber: string) {
  let result;

  try {
    result = await checkDatabaseRateLimit(`register:${registerNumber}`, 5, 60);
  } catch (error) {
    logger.error({ err: error }, "Application rate limit error");
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
}

/** Matches uploaded files (`document-<index>`) to the product's required list. */
function collectDocuments(
  requiredDocuments: unknown,
  files: Express.Multer.File[]
): UploadedDocument[] {
  const required = Array.isArray(requiredDocuments) ? requiredDocuments : [];

  if (required.length > MAX_DOCUMENTS) {
    throw badRequest("Шаардлагатай баримт бичгийн тоо хэтэрсэн байна.");
  }

  const byField = new Map(files.map((file) => [file.fieldname, file]));
  const documents: UploadedDocument[] = [];
  let totalSize = 0;

  required.forEach((documentName, index) => {
    if (typeof documentName !== "string") {
      throw internal("Баримт бичгийн тохиргоо буруу байна.");
    }

    const file = byField.get(`document-${index}`);

    if (!file || file.size === 0) {
      throw badRequest(`"${documentName}" файлыг оруулна уу.`);
    }

    totalSize += file.size;

    if (totalSize > MAX_TOTAL_FILE_SIZE) {
      throw new HttpError(413, "Файлуудын нийт хэмжээ 50MB-аас их байна.");
    }

    if (!DOCUMENT_EXTENSIONS[file.mimetype]) {
      throw badRequest(`"${documentName}" файл PDF, JPG эсвэл PNG байх ёстой.`);
    }

    if (!hasValidSignature(file.buffer, file.mimetype)) {
      throw badRequest(`"${documentName}" файлын бодит төрөл буруу байна.`);
    }

    documents.push({ documentName, file });
  });

  return documents;
}

/** Turnstile, IP limit and body size are checked by middleware before upload. */
export async function createApplication(
  input: CreateApplicationInput,
  files: Express.Multer.File[]
) {
  await assertWithinRateLimit(input.registerNumber);

  const supabase = getAdminClient();

  // 1. Loan product limits
  const { data: product, error: productError } = await supabase
    .from("loan_products")
    .select("id,slug,documents,is_active,max_amount,max_term")
    .eq("slug", input.loanType)
    .eq("is_active", true)
    .maybeSingle();

  if (productError) {
    logger.error({ err: productError }, "Loan lookup error");
    throw internal("Зээлийн мэдээллийг шалгаж чадсангүй.");
  }

  if (!product) {
    throw badRequest("Зээлийн бүтээгдэхүүн олдсонгүй.");
  }

  if (product.max_amount !== null && input.amount > Number(product.max_amount)) {
    throw badRequest(
      `Зээлийн хэмжээ ${Number(product.max_amount).toLocaleString("en-US")}₮-өөс их байж болохгүй.`
    );
  }

  if (product.max_term !== null && input.term > Number(product.max_term)) {
    throw badRequest(
      `Зээлийн хугацаа ${product.max_term} сараас их байж болохгүй.`
    );
  }

  // 2. Duplicate submission guard
  const { data: duplicate, error: duplicateError } = await supabase
    .from("loan_applications")
    .select("id")
    .eq("register_number", input.registerNumber)
    .eq("loan_type", input.loanType)
    .gte("created_at", new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString())
    .limit(1)
    .maybeSingle();

  if (duplicateError) {
    logger.error({ err: duplicateError }, "Duplicate check error");
    throw internal("Хүсэлтийг шалгах үед алдаа гарлаа.");
  }

  if (duplicate) {
    throw new HttpError(
      429,
      "Ижил зээлийн хүсэлт саяхан илгээгдсэн байна. 5 минутын дараа дахин оролдоно уу."
    );
  }

  // 3. Required documents
  const documents = collectDocuments(product.documents, files);

  // 4. Persist application
  const { data: application, error: insertError } = await supabase
    .from("loan_applications")
    .insert({
      last_name: input.lastName,
      first_name: input.firstName,
      phone: input.phone,
      register_number: input.registerNumber,
      loan_type: input.loanType,
      amount: input.amount,
      term: input.term,
      monthly_income: input.monthlyIncome,
      note: input.note,
    })
    .select("id")
    .single();

  if (insertError || !application) {
    logger.error({ err: insertError }, "Application insert error");
    throw internal("Хүсэлтийг хадгалж чадсангүй.");
  }

  // 5. Upload documents (rollback everything on failure)
  const uploadedPaths: string[] = [];

  try {
    for (const { documentName, file } of documents) {
      const path = `${application.id}/${randomUUID()}.${DOCUMENT_EXTENSIONS[file.mimetype]}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKETS.loanDocuments)
        .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

      if (uploadError) throw uploadError;
      uploadedPaths.push(path);

      const { error: documentError } = await supabase
        .from("application_documents")
        .insert({
          application_id: application.id,
          document_name: documentName,
          file_path: path,
          file_name: file.originalname,
          file_type: file.mimetype,
          file_size: file.size,
        });

      if (documentError) throw documentError;
    }
  } catch (error) {
    logger.error({ err: error }, "Document processing error");

    await removeFiles(supabase, BUCKETS.loanDocuments, uploadedPaths);
    const { error: cleanupError } = await supabase
      .from("loan_applications")
      .delete()
      .eq("id", application.id);

    if (cleanupError) {
      logger.error({ err: cleanupError }, "Application cleanup error");
    }

    throw internal("Баримт бичгийг хадгалах үед алдаа гарлаа.");
  }

  return { applicationId: application.id as string };
}

// ─── Admin ─────────────────────────────────────────────

export async function listApplications(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("loan_applications")
    .select(
      "id,first_name,last_name,phone,register_number,loan_type,amount,term,monthly_income,note,status,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    logger.error({ err: error }, "Loan applications list error");
    throw internal("Зээлийн хүсэлтүүдийг ачаалж чадсангүй.");
  }

  return data ?? [];
}

export async function getApplicationDetail(supabase: SupabaseClient, id: string) {
  const { data: application, error } = await supabase
    .from("loan_applications")
    .select(
      "id,first_name,last_name,phone,register_number,loan_type,amount,term,monthly_income,note,status,created_at,updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, "Application detail error");
    throw internal("Зээлийн хүсэлтийн мэдээллийг ачаалж чадсангүй.");
  }

  if (!application) {
    throw notFound("Зээлийн хүсэлт олдсонгүй.");
  }

  const [productResult, documentsResult, historyResult] = await Promise.all([
    supabase
      .from("loan_products")
      .select("title")
      .eq("slug", application.loan_type)
      .maybeSingle(),
    supabase
      .from("application_documents")
      .select("id,document_name,file_name,file_type,file_size,created_at")
      .eq("application_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("application_status_history")
      .select("id,admin_id,old_status,new_status,created_at")
      .eq("application_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (productResult.error) {
    logger.error({ err: productResult.error }, "Loan product lookup error");
  }

  if (documentsResult.error) {
    logger.error({ err: documentsResult.error }, "Application documents error");
    throw internal("Хавсаргасан баримт бичгийн мэдээллийг ачаалж чадсангүй.");
  }

  if (historyResult.error) {
    logger.error({ err: historyResult.error }, "Status history error");
    throw internal("Төлөвийн өөрчлөлтийн түүхийг ачаалж чадсангүй.");
  }

  const history = historyResult.data ?? [];
  const adminEmails = await resolveAdminEmails(
    history.map((entry) => entry.admin_id as string)
  );

  return {
    application,
    loanProductTitle: (productResult.data?.title as string | undefined) ?? null,
    documents: documentsResult.data ?? [],
    statusHistory: history.map((entry) => ({
      ...entry,
      admin_email: adminEmails.get(entry.admin_id as string) ?? null,
    })),
  };
}

/** Maps admin user IDs to e-mails via the Auth admin API (service role). */
async function resolveAdminEmails(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const emails = new Map<string, string>();

  if (unique.length === 0) return emails;

  const admin = getAdminClient();
  const results = await Promise.all(
    unique.map(async (id) => {
      const { data, error } = await admin.auth.admin.getUserById(id);

      if (error) {
        logger.warn({ err: error }, "Admin email lookup error");
        return null;
      }

      return data.user?.email ? ([id, data.user.email] as const) : null;
    })
  );

  for (const entry of results) {
    if (entry) emails.set(entry[0], entry[1]);
  }

  return emails;
}

export async function updateStatus(
  supabase: SupabaseClient,
  id: string,
  status: string
) {
  // The RPC runs as the admin so the status history records auth.uid().
  const { data, error } = await supabase.rpc("update_application_status", {
    p_application_id: id,
    p_new_status: status,
  });

  if (error) {
    logger.error({ err: error }, "Application status update error");
    throw internal("Төлөв шинэчлэхэд алдаа гарлаа.");
  }

  const application = data?.[0] ?? null;

  if (!application) {
    throw notFound("Хүсэлт олдсонгүй эсвэл өөрчлөх эрхгүй байна.");
  }

  return application;
}
