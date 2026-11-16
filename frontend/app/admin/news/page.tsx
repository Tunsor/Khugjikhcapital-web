import { Suspense } from "react";
import CompanyNewsSearch from "./CompanyNewsSearch";

import Link from "next/link";
import { connection } from "next/server";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { adminGet } from "@/lib/api/server";
import NewsSyncButton from "./NewsSyncButton";
import DeleteNewsButton from "./DeleteNewsButton";

export const instant = false;

type NewsCategory =
  | "loan"
  | "inflation"
  | "policy_rate"
  | "finance";

type ExternalNews = {
  id: string;
  title: string;
  source_name: string;
  source_url: string;
  category: NewsCategory;
  published_at: string;
  image_url: string | null;
};

const categoryLabels: Record<NewsCategory, string> = {
  loan: "Зээл",
  inflation: "Инфляц",
  policy_rate: "Бодлогын хүү",
  finance: "Санхүү",
};

type CompanyNewsRow = {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
  }>;
};

export default async function AdminNewsPage({
  searchParams,
  }: PageProps) {
    const { q, category, status } = await searchParams;

  const searchQuery = (q ?? "").trim().slice(0, 100);

  const allowedCategories = [
    "company",
    "announcement",
    "promotion",
    "event",
  ];

  const allowedStatuses = ["draft", "published"];

  const selectedCategory =
    category && allowedCategories.includes(category)
      ? category
      : null;

  const selectedStatus =
    status && allowedStatuses.includes(status)
      ? status
      : null;
  await connection();

  // Auth + admin authorization are enforced by the API.
  const [externalResult, companyResult] = await Promise.all([
    adminGet<ExternalNews[]>("/news/external", { query: { limit: 100 } }),
    adminGet<CompanyNewsRow[]>("/news/company", {
      query: {
        q: searchQuery || undefined,
        category: selectedCategory ?? undefined,
        status: selectedStatus ?? undefined,
      },
    }),
  ]);

  if (externalResult.forbidden || companyResult.forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
        <p className="text-sm text-red-700">Админ эрх шаардлагатай.</p>
      </main>
    );
  }

  // Сүүлийн 100 мэдээ
  const news = externalResult.data ?? [];
  const error = externalResult.error;

  // Байгууллагын өөрийн мэдээнүүд
  const companyNews = companyResult.data;
  const companyNewsError = companyResult.error;
  const ownNews = companyNews ?? [];


  const publishedCount = ownNews.filter(
    (item) => item.status === "published"
  ).length;

  const draftCount = ownNews.filter(
    (item) => item.status === "draft"
  ).length;


  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          {/* HEADER */}
          <header className="flex flex-wrap items-start justify-between gap-5 border-b border-[#E4EAF4] pb-7">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
                Content Management
              </p>

              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-brand-blue">
                Мэдээ удирдах
              </h1>

              <p className="mt-2 text-[11px] text-[#657487]">
                Монголбанкны болон байгууллагын мэдээний удирдлага
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Link
                    href="/admin/news/new"
                    className="inline-flex items-center justify-center rounded-[10px] bg-brand-orange px-5 py-3 text-[11px] font-semibold text-brand-blue transition-colors hover:opacity-90"
                >
                    + Шинэ мэдээ нэмэх
                </Link>
            <NewsSyncButton />
            </div>
          </header>

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_4px_20px_#00318906]">
              <p className="text-[10px] text-[#657487]">
                Ачаалсан мэдээ
              </p>
              <p className="mt-4 text-[36px] font-semibold text-brand-blue">
                {news.length}
              </p>
              <p className="mt-2 text-[10px] text-[#657487]">
                Сүүлийн 100 мэдээний хүрээнд
              </p>
            </div>

            <div className="rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_4px_20px_#00318906]">
              <p className="text-[10px] text-[#657487]">
                Мэдээний ангилал
              </p>
              <p className="mt-4 text-[36px] font-semibold text-brand-blue">
                4
              </p>
              <p className="mt-2 text-[10px] text-[#657487]">
                Зээл, инфляц, бодлогын хүү, санхүү
              </p>
            </div>
          </div>

        {/* COMPANY NEWS */}
        <div className="mt-8 overflow-hidden rounded-[22px] border border-[#E4EAF4] bg-white shadow-[0_8px_30px_#00318908]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4EAF4] px-6 py-5">
            <div>
            <h2 className="text-[16px] font-semibold text-brand-blue">
                Байгууллагын мэдээ
            </h2>
            <p className="mt-1 text-[11px] text-[#657487]">
                Нийт {ownNews.length} мэдээ · Нийтлэгдсэн {publishedCount} ·
                Ноорог {draftCount}
            </p>
            </div>

            <Link
            href="/admin/news/new"
            className="rounded-[10px] bg-brand-blue px-4 py-2.5 text-[11px] font-semibold text-white hover:opacity-90"
            >
            + Мэдээ нэмэх
            </Link>
        </div>

        {/* Байгууллагын мэдээ хайх */}
        <div className="border-b border-[#E4EAF4] px-6 py-4">
          <Suspense fallback={null}>
            <CompanyNewsSearch />
          </Suspense>
        </div>

        {companyNewsError ? (
            <p className="px-6 py-12 text-center text-[12px] text-red-700">
            Байгууллагын мэдээг ачаалж чадсангүй.
            </p>
        ) : ownNews.length === 0 ? (
            <div className="px-6 py-12 text-center">
            <p className="text-[12px] text-[#657487]">
                Одоогоор байгууллагын мэдээ байхгүй байна.
            </p>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#EDF3FC]">
                <tr className="text-[10px] text-[#657487]">
                    <th className="px-6 py-4">Мэдээний гарчиг</th>
                    <th className="px-6 py-4">Ангилал</th>
                    <th className="px-6 py-4">Төлөв</th>
                    <th className="px-6 py-4">Огноо</th>
                    <th className="px-6 py-4">Үйлдэл</th>
                </tr>
                </thead>

                <tbody>
                {ownNews.map((item) => (
                    <tr
                    key={item.id}
                    className="border-t border-[#E4EAF4] hover:bg-[#EDF3FC]/40"
                    >
                    <td className="max-w-[400px] px-6 py-5">
                        <p className="text-[12px] font-semibold text-brand-dark">
                        {item.title}
                        </p>
                        {item.summary && (
                        <p className="mt-1 line-clamp-2 text-[10px] text-[#657487]">
                            {item.summary}
                        </p>
                        )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-5 text-[11px] text-[#657487]">
                        {({
                        company: "Байгууллага",
                        announcement: "Зарлал",
                        promotion: "Урамшуулал",
                        event: "Арга хэмжээ",
                        } as Record<string, string>)[item.category] ??
                        item.category}
                    </td>

                    <td className="px-6 py-5">
                        <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                            item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-[#F4AC38]/20 text-[#9A6500]"
                        }`}
                        >
                        {item.status === "published"
                            ? "Нийтлэгдсэн"
                            : "Ноорог"}
                        </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-5 text-[11px] text-[#657487]">
                        {new Intl.DateTimeFormat("mn-MN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        timeZone: "Asia/Ulaanbaatar",
                        }).format(new Date(item.created_at))}
                    </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/news/${item.id}/edit`}
                            className="whitespace-nowrap text-[11px] font-semibold text-brand-blue hover:underline"
                          >
                            Засах
                          </Link>

                          <DeleteNewsButton
                            id={item.id}
                            title={item.title}
                          />
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
          )}
        </div>

          {/* NEWS TABLE */}
          <div className="mt-8 overflow-hidden rounded-[22px] border border-[#E4EAF4] bg-white shadow-[0_8px_30px_#00318908]">
            <div className="border-b border-[#E4EAF4] px-6 py-5">
              <h2 className="text-[16px] font-semibold text-brand-blue">
                Монголбанкны мэдээнүүд
              </h2>
              <p className="mt-1 text-[11px] text-[#657487]">
                Огноогоор эрэмбэлсэн сүүлийн 100 мэдээ
              </p>
            </div>

            {error ? (
              <p className="px-6 py-12 text-center text-sm text-red-700">
                Мэдээний мэдээллийг ачаалж чадсангүй.
              </p>
            ) : news.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-[#657487]">
                Одоогоор мэдээ байхгүй байна.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#EDF3FC]">
                    <tr className="text-[10px] text-[#657487]">
                      <th className="px-6 py-4">Мэдээ</th>
                      <th className="px-6 py-4">Ангилал</th>
                      <th className="px-6 py-4">Огноо</th>
                      <th className="px-6 py-4">Үйлдэл</th>
                    </tr>
                  </thead>

                  <tbody>
                    {news.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-[#E4EAF4] hover:bg-[#EDF3FC]/40"
                      >
                        <td className="max-w-[420px] px-6 py-5">
                          <p className="text-[12px] font-semibold leading-5 text-brand-dark">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[10px] text-[#657487]">
                            {item.source_name}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="whitespace-nowrap rounded-full bg-[#003189]/10 px-3 py-1.5 text-[10px] font-medium text-brand-blue">
                            {categoryLabels[item.category] ??
                              item.category}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-[11px] text-[#657487]">
                          {new Intl.DateTimeFormat("mn-MN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            timeZone: "Asia/Ulaanbaatar",
                          }).format(new Date(item.published_at))}
                        </td>

                        <td className="px-6 py-5">
                          <Link
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap text-[11px] font-semibold text-brand-blue hover:underline"
                          >
                            Эх сурвалж ↗
                          </Link>
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
