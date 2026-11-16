
import Link from "next/link";

import { apiGet } from "@/lib/api/server";
import type { LoanProductSummary } from "@/lib/api/types";
import LoanProductsSlider from "@/components/home/LoanProductsSlider";

export default async function LoanProducts() {
  const { data: loans, error } = await apiGet<LoanProductSummary[]>(
    "/loan-products"
  );

  if (error) {
    console.error("Homepage loan products error:", error);
  }

  const loanProducts = loans ?? [];

  return (
    <section className="bg-[#F8FAFD] py-20 lg:py-28">
      <div className="container-main">
        {/* SECTION HEADER */}
        <div className="mb-12 lg:mb-16">
          {/* EYEBROW */}
          <div className="flex items-center gap-3">
            <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
              01 / Зээлийн бүтээгдэхүүн
            </p>
          </div>

          {/* TITLE AND ACTION */}
          <div className="mt-5 flex flex-col justify-between gap-7 lg:flex-row lg:items-end lg:gap-10">
            <div className="max-w-[720px]">
              <h2 className="text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                Танд тохирох
                <br className="sm:hidden" /> санхүүжилт
                <span className="text-[#F4AC38]">.</span>
              </h2>

              <p className="mt-5 max-w-[530px] text-[13px] leading-7 text-[#657487]">
                Өөрийн хэрэгцээ, боломжид нийцсэн зээлийн
                бүтээгдэхүүнтэй танилцаж, тохирох санхүүжилтээ
                сонгоорой.
              </p>
            </div>

            <Link
              href="/loans"
              className="group inline-flex min-h-[50px] w-fit shrink-0 items-center justify-between gap-8 rounded-[10px] border border-[#003189] bg-transparent px-6 py-4 text-[11px] font-semibold text-[#003189] transition-all duration-300 hover:bg-[#003189] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
            >
              Бүх бүтээгдэхүүн

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* LOAN PRODUCTS SLIDER */}
        <LoanProductsSlider loans={loanProducts} />
      </div>
    </section>
  );
}
