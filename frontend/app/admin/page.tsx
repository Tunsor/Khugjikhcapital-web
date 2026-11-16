
import { connection } from "next/server";
import { adminGet } from "@/lib/api/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const instant = false;

type DashboardApplication = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  loan_type: string;
  amount: number;
  term: number;
  status: string;
  created_at: string;
};

export default async function AdminPage() {
  await connection();

  // Auth + admin authorization are enforced by the API.
  const [result, me] = await Promise.all([
    adminGet<DashboardApplication[]>("/applications"),
    adminGet<{ id: string; email: string | null }>("/me"),
  ]);

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
  const user = { email: me.data?.email ?? "" };
  const loanApplications = applications ?? [];

  // ========================================
  // 4. STATUS COUNTERS
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
  // 5. DASHBOARD
  // ========================================

  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          {/* HEADER */}
          <header className="flex flex-wrap items-start justify-between gap-5 border-b border-[#E4EAF4] pb-7">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
                Overview
              </p>

              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-brand-blue">
                Dashboard
              </h1>

              <p className="mt-2 text-[11px] text-[#657487]">
                Хөгжих Капитал ББСБ вебсайтын удирдлагын хэсэг
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[9px] uppercase tracking-[0.1em] text-[#657487]">
                Нэвтэрсэн хэрэглэгч
              </p>

              <p className="mt-2 break-all text-[11px] font-medium text-brand-dark">
                {user.email}
              </p>
            </div>
          </header>

          {/* STAT CARDS */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Шинэ хүсэлт"
              value={newCount.toString()}
              description="Шалгах шаардлагатай"
            />

            <StatCard
              label="Шалгаж байгаа"
              value={reviewingCount.toString()}
              description="Хянагдаж байгаа"
            />

            <StatCard
              label="Зөвшөөрсөн"
              value={approvedCount.toString()}
              description="Амжилттай хүсэлт"
            />

            <StatCard
              label="Татгалзсан"
              value={rejectedCount.toString()}
              description="Татгалзсан хүсэлт"
            />
          </div>

          {/* APPLICATIONS */}
          <div className="mt-8 overflow-hidden rounded-[22px] border border-[#E4EAF4] bg-white shadow-[0_8px_30px_#00318908]">
            <div className="border-b border-[#E4EAF4] px-6 py-5">
              <h2 className="text-[16px] font-semibold text-brand-blue">
                Сүүлийн зээлийн хүсэлтүүд
              </h2>

              <p className="mt-1 text-[11px] text-[#657487]">
                Харилцагчдаас ирүүлсэн хүсэлтүүдийн мэдээлэл
              </p>
            </div>

            {applicationsError ? (
              <div className="px-6 py-14 text-center">
                <p className="text-[12px] font-medium text-red-700">
                  Зээлийн хүсэлтүүдийг ачаалж чадсангүй.
                </p>
              </div>
            ) : loanApplications.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <p className="text-[12px] font-medium text-brand-dark">
                  Одоогоор зээлийн хүсэлт байхгүй байна.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E4EAF4] bg-[#EDF3FC] text-left">
                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Харилцагч
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Утас
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Зээлийн төрөл
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Дүн
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]">
                        Төлөв
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loanApplications
                      .slice(0, 5)
                      .map((application) => (
                        <tr
                          key={application.id}
                          className="border-b border-[#E4EAF4] transition-colors hover:bg-[#EDF3FC]/40 last:border-b-0"
                        >
                          <td className="px-6 py-5">
                            <p className="text-[11px] font-semibold text-brand-dark">
                              {application.last_name}{" "}
                              {application.first_name}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-[11px] text-[#657487]">
                            {application.phone}
                          </td>

                          <td className="px-6 py-5 text-[11px] text-[#657487]">
                            {getLoanTypeLabel(
                              application.loan_type
                            )}
                          </td>

                          <td className="px-6 py-5 text-[11px] font-medium text-brand-dark">
                            {Number(
                              application.amount
                            ).toLocaleString("en-US")}{" "}
                            ₮
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={application.status}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <span className="text-[24px] font-bold">
            !
          </span>
        </div>

        <h1 className="mt-6 text-[24px] font-semibold text-brand-dark">
          Хандах эрхгүй
        </h1>

        <p className="mt-3 text-[13px] leading-6 text-[#657487]">
          {message}
        </p>

        <a
          href="/"
          className="mt-7 inline-flex rounded-[10px] bg-brand-blue px-6 py-3 text-[12px] font-semibold text-white"
        >
          Нүүр хуудас руу буцах
        </a>
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
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_4px_20px_#00318906] transition-shadow hover:shadow-[0_12px_30px_#00318912]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#657487]">
        {label}
      </p>

      <div className="mt-5 flex items-end justify-between">
        <p className="text-[36px] font-semibold leading-none tracking-[-0.05em] text-brand-blue">
          {value}
        </p>

        <div className="h-2 w-2 rounded-full bg-brand-orange" />
      </div>

      <p className="mt-4 text-[9px] text-[#657487]">
        {description}
      </p>
    </div>
  );
}

// ========================================
// LOAN TYPE LABEL
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
