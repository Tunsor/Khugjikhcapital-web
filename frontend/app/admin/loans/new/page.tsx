import Link from "next/link";
import { connection } from "next/server";
import { adminGet } from "@/lib/api/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import NewLoanProductForm from "@/components/admin/NewLoanProductForm";

export const instant = false;

export default async function NewLoanProductPage() {
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
    <main className="min-h-screen bg-[#F4F5F5]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="w-full min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8 lg:px-12">
          {/* BACK */}
          <Link
            href="/admin/loans"
            className="text-[10px] font-semibold text-[#003189]"
          >
            ← Зээлийн бүтээгдэхүүн
          </Link>

          {/* HEADER */}
          <header className="mt-6 border-b border-[#A7ADAF]/25 pb-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#003189]">
              New Loan Product
            </p>

            <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#0D1216] md:text-[32px]">
              Шинэ бүтээгдэхүүн
            </h1>

            <p className="mt-2 text-[11px] text-[#0D1216]/45">
              Вебсайт дээр шинэ зээлийн бүтээгдэхүүн нэмэх
            </p>
          </header>

          {/* FORM */}
          <section className="mt-8 max-w-[900px] border border-[#A7ADAF]/25 bg-white">
            <div className="border-b border-[#A7ADAF]/20 px-6 py-5">
              <h2 className="text-[14px] font-semibold text-[#0D1216]">
                Үндсэн мэдээлэл
              </h2>

              <p className="mt-1 text-[9px] text-[#A7ADAF]">
                Шинэ бүтээгдэхүүний мэдээллийг оруулна уу
              </p>
            </div>

            <NewLoanProductForm />
          </section>
        </section>
      </div>
    </main>
  );
}