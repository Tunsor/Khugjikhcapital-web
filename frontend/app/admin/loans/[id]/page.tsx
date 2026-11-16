
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";

import { adminGet } from "@/lib/api/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LoanProductForm from "@/components/admin/LoanProductForm";
import DeleteLoanProductButton from "@/components/admin/DeleteLoanProductButton";

export const instant = false;

export default async function AdminLoanEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  const result = await adminGet<
    ComponentProps<typeof LoanProductForm>["product"]
  >(`/loan-products/${encodeURIComponent(id)}`);

  if (result.forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
        <p className="text-sm text-red-700">Админ эрх шаардлагатай.</p>
      </main>
    );
  }

  if (result.error !== null) {
    console.error("Loan product error:", result.error);
  }

  const product = result.data;

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-8 py-8 lg:px-12">
          {/* BACK */}
          <Link
            href="/admin/loans"
            className="text-[10px] font-semibold text-brand-blue transition-colors hover:text-[#00266C]"
          >
            ← Зээлийн бүтээгдэхүүн
          </Link>

          {/* HEADER */}
          <header className="mt-6 border-b border-[#E4EAF4] pb-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
                  Edit Loan Product
                </p>

                <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-brand-blue">
                  {product.title}
                </h1>

                <p className="mt-2 text-[11px] text-[#657487]">
                  Зээлийн бүтээгдэхүүний мэдээллийг удирдах
                </p>
              </div>

              {product.is_active ? (
                <span className="inline-flex shrink-0 rounded-[10px] bg-green-100 px-3 py-2 text-[9px] font-semibold text-green-700">
                  Идэвхтэй
                </span>
              ) : (
                <span className="inline-flex shrink-0 rounded-[10px] bg-[#EDF3FC] px-3 py-2 text-[9px] font-semibold text-[#657487]">
                  Идэвхгүй
                </span>
              )}
            </div>
          </header>

          {/* FORM */}
          <section className="mt-8 max-w-[900px] overflow-hidden rounded-[22px] border border-[#E4EAF4] bg-white shadow-[0_8px_30px_#00318908]">
            <div className="border-b border-[#E4EAF4] px-6 py-5">
              <h2 className="text-[14px] font-semibold text-brand-blue">
                Үндсэн мэдээлэл
              </h2>

              <p className="mt-1 text-[9px] text-[#657487]">
                Зээлийн бүтээгдэхүүний вебсайт дээр харагдах мэдээлэл
              </p>
            </div>

            <LoanProductForm product={product} />

            {/* DANGER ZONE */}
            <section className="mt-6 max-w-[900px] rounded-[17px] border border-red-200 bg-white">
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[12px] font-semibold text-brand-dark">
                    Бүтээгдэхүүн устгах
                  </h2>

                  <p className="mt-1 max-w-[500px] text-[9px] leading-4 text-[#657487]">
                    Устгасан бүтээгдэхүүнийг буцаан сэргээх боломжгүй.
                  </p>
                </div>

                <DeleteLoanProductButton
                  productId={product.id}
                  productTitle={product.title}
                />
              </div>
            </section>
          </section>
        </section>
      </div>
    </main>
  );
}
