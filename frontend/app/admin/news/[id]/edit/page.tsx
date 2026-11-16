
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { adminGet } from "@/lib/api/server";
import EditNewsForm from "./EditNewsForm";

export const instant = false;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsPage({
  params,
}: PageProps) {
  await connection();

  const { id } = await params;
  // Засах мэдээг унших (auth + admin эрхийг API шалгана)
  const result = await adminGet<
    ComponentProps<typeof EditNewsForm>["news"]
  >(`/news/company/${encodeURIComponent(id)}`);

  if (result.forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
        <p className="text-sm text-red-700">Админ эрх шаардлагатай.</p>
      </main>
    );
  }

  if (result.error !== null) {
    if (result.status === 404 || result.status === 400) {
      notFound();
    }

    console.error("Read company news:", result.error);

    return (
      <main className="p-8 text-sm text-red-700">
        Мэдээний мэдээллийг ачаалж чадсангүй.
      </main>
    );
  }

  const news = result.data;

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
              Мэдээ засах
            </h1>

            <p className="mt-2 text-[11px] text-[#657487]">
              Мэдээний агуулга болон нийтлэлийн төлөвийг
              өөрчлөх
            </p>
          </header>

          <div className="mt-8 max-w-4xl rounded-[22px] border border-[#E4EAF4] bg-white p-6 shadow-[0_8px_30px_#00318908] sm:p-8">
            <EditNewsForm news={news} />
          </div>
        </section>
      </div>
    </main>
  );
}
