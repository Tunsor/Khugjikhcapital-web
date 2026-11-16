
import { connection } from "next/server";
import NewsForm from "./NewsForm";
import Link from "next/link";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { adminGet } from "@/lib/api/server";

export const instant = false;

export default async function NewCompanyNewsPage() {
  await connection();

  // Нэвтрэлт + админ эрх шалгах
  const me = await adminGet<{ id: string }>("/me");

  if (me.forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
        <p className="text-sm text-red-700">Админ эрх шаардлагатай.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          <header className="border-b border-[#E4EAF4] pb-7">
            <Link
              href="/admin/news"
              className="text-[11px] font-medium text-brand-blue hover:underline"
            >
              ← Мэдээ удирдах
            </Link>

            <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Content Management
            </p>

            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-brand-blue">
              Шинэ мэдээ нэмэх
            </h1>

            <p className="mt-2 text-[11px] text-[#657487]">
              Байгууллагын мэдээ, мэдээллийг бэлтгэж нийтлэх
            </p>
          </header>

          <div className="mt-8 max-w-4xl rounded-[22px] border border-[#E4EAF4] bg-white p-6 shadow-[0_8px_30px_#00318908] sm:p-8">
            <NewsForm />
          </div>
        </section>
      </div>
    </main>
  );
}
