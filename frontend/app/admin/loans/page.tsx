
import Link from "next/link";
import { connection } from "next/server";
import type { ComponentProps } from "react";

import { adminGet } from "@/lib/api/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SortableLoanProducts from "@/components/admin/SortableLoanProducts";

export const instant = false;

export default async function AdminLoansPage() {
  await connection();

  // Зээлийн бүтээгдэхүүнүүдийг авах (auth + admin эрхийг API шалгана)
  const result = await adminGet<
    ComponentProps<typeof SortableLoanProducts>["products"]
  >("/loan-products");

  if (result.forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
        <p className="text-sm text-red-700">Админ эрх шаардлагатай.</p>
      </main>
    );
  }

  if (result.error !== null) {
    console.error("Loan products error:", result.error);
  }

  const products = result.data;
  const loanProducts = products ?? [];

  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-8 py-8 lg:px-12">
          {/* HEADER */}
          <header className="flex items-start justify-between gap-4 border-b border-[#E4EAF4] pb-7">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
                Loan Products
              </p>

              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-brand-blue">
                Зээлийн бүтээгдэхүүн
              </h1>

              <p className="mt-2 text-[11px] text-[#657487]">
                Вебсайт дээр харагдах зээлийн бүтээгдэхүүнүүдийг удирдана.
              </p>
            </div>

            <Link
              href="/admin/loans/new"
              className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-brand-orange px-5 py-3 text-[9px] font-semibold text-brand-dark shadow-[0_4px_14px_#F4AC3826] transition-colors hover:bg-[#E49B26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              + Шинэ бүтээгдэхүүн
            </Link>
          </header>

          {/* LOAN PRODUCTS */}
          <section className="mt-8">
            {loanProducts.length === 0 ? (
              <div className="rounded-[17px] border border-[#E4EAF4] bg-white px-6 py-16 text-center shadow-[0_4px_20px_#00318906]">
                <p className="text-[12px] font-medium text-brand-dark">
                  Одоогоор зээлийн бүтээгдэхүүн байхгүй байна.
                </p>
              </div>
            ) : (
              <SortableLoanProducts products={loanProducts} />
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
