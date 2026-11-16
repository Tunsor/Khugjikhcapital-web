
import Link from "next/link";
import { connection } from "next/server";
import { adminGet } from "@/lib/api/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const instant = false;

type AdminApplication = {
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
};

export default async function ApplicationsPage() {
  await connection();

  // Auth + admin authorization are enforced by the API.
  const result = await adminGet<AdminApplication[]>("/applications");

  if (result.forbidden) {
    return (
      <AccessDenied
        message="Таны бүртгэлд админ эрх олгогдоогүй байна."
      />
    );
  }

  if (result.error !== null) {
    console.error("Loan applications error:", result.error);
  }

  const applications = result.data;
  const applicationsError = result.error;
  const loanApplications = applications ?? [];

  // ========================================
  // APPLICATION COUNTERS
  // ========================================

  const newCount = loanApplications.filter(
    (application) => application.status === "new"
  ).length;

  const reviewingCount = loanApplications.filter(
    (application) => application.status === "reviewing"
  ).length;

  const approvedCount = loanApplications.filter(
    (application) => application.status === "approved"
  ).length;

  const rejectedCount = loanApplications.filter(
    (application) => application.status === "rejected"
  ).length;

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          {/* HEADER */}
          <header className="border-b border-[#E4EAF4] pb-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Applications
            </p>

            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-brand-blue">
              Зээлийн хүсэлтүүд
            </h1>

            <p className="mt-2 text-[11px] text-[#657487]">
              Customer website-ээр ирсэн бүх зээлийн хүсэлт
            </p>
          </header>

          {/* STATISTICS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Нийт хүсэлт"
              value={loanApplications.length}
            />

            <StatCard
              label="Шинэ"
              value={newCount}
            />

            <StatCard
              label="Шалгаж байгаа"
              value={reviewingCount}
            />

            <StatCard
              label="Зөвшөөрсөн"
              value={approvedCount}
            />

            <StatCard
              label="Татгалзсан"
              value={rejectedCount}
            />
          </div>

          {/* APPLICATION TABLE */}
          <section className="mt-6 overflow-hidden rounded-[22px] border border-[#E4EAF4] bg-white shadow-[0_8px_30px_#00318908]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4EAF4] px-6 py-5">
              <div>
                <h2 className="text-[16px] font-semibold text-brand-blue">
                  Бүх зээлийн хүсэлт
                </h2>

                <p className="mt-1 text-[11px] text-[#657487]">
                  Хүсэлтүүдийг хамгийн сүүлд ирсэн огноогоор эрэмбэлсэн
                </p>
              </div>

              <span className="rounded-[10px] bg-brand-light px-3 py-2 text-[10px] font-semibold text-brand-blue">
                {loanApplications.length} хүсэлт
              </span>
            </div>

            {applicationsError ? (
              <div className="px-6 py-16 text-center">
                <p className="text-[12px] font-semibold text-red-700">
                  Зээлийн хүсэлтүүдийг ачаалж чадсангүй.
                </p>

                <p className="mt-2 text-[11px] text-[#657487]">
                  Supabase холболт болон хүснэгтийн эрхийг шалгана уу.
                </p>
              </div>
            ) : loanApplications.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-[12px] font-medium text-brand-dark">
                  Одоогоор зээлийн хүсэлт байхгүй байна.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#E4EAF4] bg-brand-light text-left">
                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Харилцагч
                      </th>

                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Утас
                      </th>

                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Зээлийн төрөл
                      </th>

                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Дүн
                      </th>

                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Хугацаа
                      </th>

                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Огноо
                      </th>

                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Төлөв
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loanApplications.map(
                      (application) => (
                        <tr
                          key={application.id}
                          className="border-b border-[#E4EAF4] transition-colors hover:bg-[#EDF3FC]/40 last:border-b-0"
                        >
                          <td className="px-5 py-5">
                            <Link
                              href={`/admin/applications/${application.id}`}
                              className="group inline-block"
                            >
                              <p className="text-[11px] font-semibold text-brand-dark transition-colors group-hover:text-brand-blue">
                                {application.last_name}{" "}
                                {application.first_name}
                              </p>

                              <p className="mt-1 text-[9px] text-[#657487]">
                                {application.register_number}
                              </p>

                              <p className="mt-2 text-[9px] font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                Дэлгэрэнгүй →
                              </p>
                            </Link>
                          </td>

                          <td className="px-5 py-5 text-[11px] text-[#657487]">
                            {application.phone}
                          </td>

                          <td className="px-5 py-5 text-[11px] text-[#657487]">
                            {getLoanTypeLabel(
                              application.loan_type
                            )}
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-[11px] font-medium text-brand-dark">
                            {Number(
                              application.amount
                            ).toLocaleString("en-US")}{" "}
                            ₮
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-[11px] text-[#657487]">
                            {application.term} сар
                          </td>

                          <td className="whitespace-nowrap px-5 py-5">
                            <p className="text-[10px] font-medium text-brand-dark">
                              {formatDate(
                                application.created_at
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <StatusBadge
                              status={application.status}
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

// ========================================
// ACCESS DENIED
// ========================================

function AccessDenied({
  message,
}: {
  message: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
      <div className="w-full max-w-md rounded-[22px] border border-[#E4EAF4] bg-white p-8 text-center">
        <h1 className="text-[24px] font-semibold text-brand-dark">
          Хандах эрхгүй
        </h1>

        <p className="mt-3 text-[13px] leading-6 text-[#657487]">
          {message}
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

// ========================================
// STAT CARD
// ========================================

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[17px] border border-[#E4EAF4] bg-white p-5 shadow-[0_4px_20px_#00318906]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#657487]">
        {label}
      </p>

      <p className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-brand-blue">
        {value}
      </p>
    </div>
  );
}

// ========================================
// LOAN TYPE
// ========================================

function getLoanTypeLabel(type: string) {
  switch (type) {
    case "phone-number":
      return "Дугаар барьцаалсан";

    case "real-estate":
      return "Үл хөдлөх";

    case "car":
      return "Автомашин";

    default:
      return type;
  }
}

// ========================================
// STATUS BADGE
// ========================================

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
      className:
        "bg-[#003189]/10 text-[#003189]",
    },

    reviewing: {
      label: "Шалгаж байгаа",
      className:
        "bg-[#F4AC38]/20 text-[#9A6500]",
    },

    approved: {
      label: "Зөвшөөрсөн",
      className:
        "bg-green-100 text-green-700",
    },

    rejected: {
      label: "Татгалзсан",
      className:
        "bg-red-100 text-red-700",
    },
  };

  const current = statuses[status] ?? {
    label: status,
    className:
      "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-[10px] px-3 py-1.5 text-[9px] font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

// ========================================
// DATE FORMAT
// ========================================

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
