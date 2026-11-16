
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { adminGet } from "@/lib/api/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ApplicationStatus from "@/components/admin/ApplicationStatus";
import DocumentDownloadButton from "@/components/admin/DocumentDownloadButton";

export const instant = false;

type ApplicationDetail = {
  application: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    register_number: string;
    loan_type: string;
    amount: number;
    term: number;
    monthly_income: number | null;
    note: string | null;
    status: string;
    created_at: string;
    updated_at: string | null;
  };
  loanProductTitle: string | null;
  documents: {
    id: string;
    document_name: string;
    file_name: string;
    file_type: string;
    file_size: number;
    created_at: string;
  }[];
  statusHistory: {
    id: string;
    admin_id: string;
    admin_email: string | null;
    old_status: string;
    new_status: string;
    created_at: string;
  }[];
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  // Auth + admin authorization are enforced by the API.
  const result = await adminGet<ApplicationDetail>(
    `/applications/${encodeURIComponent(id)}`
  );

  if (result.forbidden) {
    return <AccessDenied />;
  }

  if (result.error !== null) {
    if (result.status === 404 || result.status === 400) {
      notFound();
    }

    throw new Error(result.error);
  }

  const { application, documents, statusHistory } = result.data;

  const loanTypeLabel =
    result.data.loanProductTitle ?? application.loan_type;

  // 8. PAGE
  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          {/* BACK */}
          <Link
            href="/admin/applications"
            className="text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-blue transition-colors hover:text-[#00266C]"
          >
            ← Зээлийн хүсэлтүүд
          </Link>

          {/* HEADER */}
          <header className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#E4EAF4] pb-7">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
                Application Detail
              </p>

              <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-brand-blue">
                {application.last_name}{" "}
                {application.first_name}
              </h1>

              <p className="mt-2 text-[11px] text-[#657487]">
                Зээлийн хүсэлтийн дэлгэрэнгүй мэдээлэл
              </p>
            </div>

            <StatusBadge
              status={application.status}
            />
          </header>

          {/* CONTENT */}
          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {/* CUSTOMER INFO */}
              <section className="overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_20px_#00318906]">
                <div className="border-b border-[#E4EAF4] px-6 py-5">
                  <h2 className="text-[14px] font-semibold text-brand-blue">
                    Харилцагчийн мэдээлэл
                  </h2>
                </div>

                <div className="grid gap-0 md:grid-cols-2">
                  <InfoItem
                    label="Овог"
                    value={application.last_name}
                  />

                  <InfoItem
                    label="Нэр"
                    value={application.first_name}
                  />

                  <InfoItem
                    label="Утасны дугаар"
                    value={application.phone}
                  />

                  <InfoItem
                    label="Регистрийн дугаар"
                    value={application.register_number}
                  />
                </div>
              </section>

              {/* LOAN INFO */}
              <section className="overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_20px_#00318906]">
                <div className="border-b border-[#E4EAF4] px-6 py-5">
                  <h2 className="text-[14px] font-semibold text-brand-blue">
                    Зээлийн мэдээлэл
                  </h2>
                </div>

                <div className="grid gap-0 md:grid-cols-2">
                  <InfoItem
                    label="Зээлийн төрөл"
                    value={loanTypeLabel}
                  />

                  <InfoItem
                    label="Хүссэн дүн"
                    value={`${Number(
                      application.amount
                    ).toLocaleString("en-US")} ₮`}
                  />

                  <InfoItem
                    label="Хугацаа"
                    value={`${application.term} сар`}
                  />

                  <InfoItem
                    label="Сарын орлого"
                    value={
                      application.monthly_income != null
                        ? `${Number(
                            application.monthly_income
                          ).toLocaleString("en-US")} ₮`
                        : "Оруулаагүй"
                    }
                  />
                </div>
              </section>

              {/* DOCUMENTS */}
              <section className="overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_20px_#00318906]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4EAF4] px-6 py-5">
                  <div>
                    <h2 className="text-[14px] font-semibold text-brand-blue">
                      Бүрдүүлсэн материал
                    </h2>

                    <p className="mt-1 text-[9px] text-[#657487]">
                      Хэрэглэгчийн хүсэлтэд хавсаргасан файлууд
                    </p>
                  </div>

                  <span className="shrink-0 rounded-[10px] bg-brand-light px-3 py-2 text-[9px] font-semibold text-brand-blue">
                    {documents.length} файл
                  </span>
                </div>

                {documents.length === 0 ? (
                  <div className="px-6 py-8">
                    <p className="text-[11px] text-[#657487]">
                      Хавсаргасан материал байхгүй.
                    </p>
                  </div>
                ) : (
                  <div>
                    {documents.map(
                      (document, index) => (
                        <div
                          key={document.id}
                          className="flex flex-col gap-4 border-b border-[#E4EAF4] px-6 py-5 transition-colors hover:bg-[#EDF3FC]/40 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-brand-light text-[16px] text-brand-blue">
                              📄
                            </div>

                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-brand-dark">
                                {index + 1}.{" "}
                                {document.document_name}
                              </p>

                              <p className="mt-1 truncate text-[9px] text-[#657487]">
                                {document.file_name}
                              </p>

                              <p className="mt-1 text-[8px] text-[#657487]">
                                {formatFileSize(
                                  document.file_size
                                )}
                              </p>
                            </div>
                          </div>

                          <DocumentDownloadButton
                            documentId={document.id}
                            className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-brand-orange px-5 py-3 text-[9px] font-semibold text-brand-dark transition-colors hover:bg-[#E49B26] disabled:cursor-wait disabled:opacity-60"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* STATUS CHANGE HISTORY */}
              <section className="overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_20px_#00318906]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4EAF4] px-6 py-5">
                  <div>
                    <h2 className="text-[14px] font-semibold text-brand-blue">
                      Төлөвийн өөрчлөлтийн түүх
                    </h2>

                    <p className="mt-1 text-[9px] text-[#657487]">
                      Зээлийн хүсэлтийн төлөвийг хэн, хэзээ өөрчилсөн
                    </p>
                  </div>

                  <span className="rounded-[10px] bg-brand-light px-3 py-2 text-[9px] font-semibold text-brand-blue">
                    {(statusHistory ?? []).length} өөрчлөлт
                  </span>
                </div>

                {!statusHistory?.length ? (
                  <p className="px-6 py-8 text-[11px] text-[#657487]">
                    Одоогоор төлөвийн өөрчлөлт бүртгэгдээгүй байна.
                  </p>
                ) : (
                  <div>
                    {statusHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="border-b border-[#E4EAF4] px-6 py-5 last:border-b-0"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            status={entry.old_status}
                          />

                          <span
                            className="text-[12px] text-[#657487]"
                            aria-label="Шилжсэн"
                          >
                            →
                          </span>

                          <StatusBadge
                            status={entry.new_status}
                          />
                        </div>

                        <p className="mt-3 text-[10px] text-[#657487]">
                          Өөрчилсөн:{" "}
                          <span className="break-all font-medium text-brand-dark">
                            {entry.admin_email ?? "Имэйл олдсонгүй"}
                          </span>
                        </p>

                        <p className="mt-1 text-[10px] text-[#657487]">
                          Огноо:{" "}
                          <span className="font-medium text-brand-dark">
                            {formatDate(entry.created_at)}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* NOTE */}
              <section className="rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_4px_20px_#00318906]">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#657487]">
                  Нэмэлт тайлбар
                </p>

                <p className="mt-3 whitespace-pre-wrap text-[12px] leading-6 text-brand-dark/70">
                  {application.note ||
                    "Нэмэлт тайлбар байхгүй."}
                </p>
              </section>
            </div>

            {/* RIGHT SIDE */}
            <aside>
              <section className="rounded-[22px] border border-[#E4EAF4] bg-white p-6 shadow-[0_8px_30px_#00318908]">
                <ApplicationStatus
                  applicationId={application.id}
                  currentStatus={application.status}
                />

                <div className="mt-6 border-t border-[#E4EAF4] pt-5">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-[#657487]">
                    Хүсэлт илгээсэн
                  </p>

                  <p className="mt-2 text-[11px] font-medium text-brand-dark">
                    {formatDate(
                      application.created_at
                    )}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-[#657487]">
                    Сүүлд шинэчлэгдсэн
                  </p>

                  <p className="mt-2 text-[11px] font-medium text-brand-dark">
                    {application.updated_at
                      ? formatDate(
                          application.updated_at
                        )
                      : "Шинэчлэгдээгүй"}
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

// ACCESS DENIED
function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
      <div className="w-full max-w-md rounded-[22px] border border-[#E4EAF4] bg-white p-8 text-center">
        <h1 className="text-[24px] font-semibold text-brand-dark">
          Хандах эрхгүй
        </h1>

        <p className="mt-3 text-[13px] leading-6 text-[#657487]">
          Таны бүртгэлд админ эрх олгогдоогүй байна.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-[10px] bg-brand-blue px-6 py-3 text-[12px] font-semibold text-white"
        >
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </main>
  );
}

// INFO ITEM
function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="border-b border-[#E4EAF4] px-6 py-5 md:border-r">
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
        {label}
      </p>

      <p className="mt-2 break-words text-[12px] font-medium text-brand-dark">
        {value ?? "Оруулаагүй"}
      </p>
    </div>
  );
}

// STATUS BADGE
function StatusBadge({
  status,
}: {
  status: string;
}) {
  const statuses: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    new: {
      label: "Шинэ",
      className: "bg-[#003189]/10 text-[#003189]",
    },

    reviewing: {
      label: "Шалгаж байгаа",
      className: "bg-[#F4AC38]/20 text-[#9A6500]",
    },

    approved: {
      label: "Зөвшөөрсөн",
      className: "bg-green-100 text-green-700",
    },

    rejected: {
      label: "Татгалзсан",
      className: "bg-red-100 text-red-700",
    },
  };

  const current = statuses[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-[10px] px-3 py-2 text-[9px] font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

// DATE FORMAT
function formatDate(date: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(date));
}

// FILE SIZE
function formatFileSize(size: number | null) {
  if (size == null) {
    return "Хэмжээ тодорхойгүй";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
