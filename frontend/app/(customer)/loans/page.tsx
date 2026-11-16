
import Link from "next/link";
import { connection } from "next/server";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { apiGet } from "@/lib/api/server";
import type { LoanProductSummary } from "@/lib/api/types";

export const instant = false;

export default async function LoansPage() {
  await connection();

  const { data: loans, error } = await apiGet<LoanProductSummary[]>(
    "/loan-products"
  );

  if (error) {
    console.error("Public loan products error:", error);
  }

  const loanProducts = loans ?? [];

  return (
    <>
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          {/* BACKGROUND DECORATIONS */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/[0.06]" />

          <div className="pointer-events-none absolute -right-12 -top-12 h-[260px] w-[260px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative z-10 py-20 md:py-28 lg:py-32">
            {/* EYEBROW */}
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F4AC38]">
                Зээлийн бүтээгдэхүүн
              </p>
            </div>

            {/* HERO TITLE */}
            <h1 className="mt-7 max-w-[850px] text-[44px] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">
              Таны хэрэгцээнд
              <br />
              тохирсон{" "}
              <span className="text-[#F4AC38]">
                шийдэл.
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-7 max-w-[580px] text-[13px] leading-7 text-white/70">
              Санхүүгийн зорилго, хэрэгцээндээ тохирох
              бүтээгдэхүүнээ сонгож, нөхцөл болон шаардлагатай
              мэдээлэлтэй танилцаарай.
            </p>

            {/* HERO BOTTOM DETAIL */}
            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
              <span className="text-[10px] font-medium text-white/60">
                Хөгжих Капитал ББСБ
              </span>

              <span className="h-[4px] w-[4px] rounded-full bg-[#F4AC38]" />

              <span className="text-[10px] text-white/60">
                Санхүүгийн бүтээгдэхүүн
              </span>
            </div>
          </div>
        </section>

        {/* LOAN PRODUCTS */}
        <section className="bg-[#F8FAFD] py-20 lg:py-28">
          <div className="container-main">
            {/* SECTION HEADER */}
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mb-14">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                    01 / Бүтээгдэхүүн
                  </p>
                </div>

                <h2 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                  Зээлээ{" "}
                  <span className="text-[#003189]">
                    сонгоорой
                  </span>
                  <span className="text-[#F4AC38]">.</span>
                </h2>

                <p className="mt-5 max-w-[560px] text-[13px] leading-7 text-[#657487]">
                  Боломжит зээлийн бүтээгдэхүүнүүдийн
                  нөхцөлийг харьцуулж, өөрт тохирох
                  сонголтоо хийгээрэй.
                </p>
              </div>

              {/* PRODUCT COUNT */}
              <div className="inline-flex w-fit items-center gap-3 rounded-[10px] border border-[#E4EAF4] bg-white px-5 py-3">
                <span className="text-[10px] font-medium text-[#657487]">
                  Нийт бүтээгдэхүүн
                </span>

                <span className="text-[18px] font-semibold text-[#003189]">
                  {String(loanProducts.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* LOAN LIST */}
            {loanProducts.length === 0 ? (
              <div className="rounded-[17px] border border-[#E4EAF4] bg-white px-6 py-16 text-center shadow-[0_4px_18px_#00318908]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[20px] text-[#003189]">
                  i
                </div>

                <h3 className="mt-5 text-[18px] font-semibold text-[#0D1216]">
                  Бүтээгдэхүүн олдсонгүй
                </h3>

                <p className="mt-3 text-[12px] leading-6 text-[#657487]">
                  Одоогоор зээлийн бүтээгдэхүүн байхгүй байна.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {loanProducts.map((loan, index) => (
                  <article
                    key={loan.id}
                    className="group overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4DFEF] hover:shadow-[0_12px_32px_#00318912]"
                  >
                    <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[56px_minmax(0,1.5fr)_minmax(200px,0.8fr)_auto] lg:items-center lg:gap-8 lg:p-9">
                      {/* NUMBER */}
                      <div>
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[11px] font-semibold tracking-[0.12em] text-[#003189] transition-colors duration-300 group-hover:bg-[#003189] group-hover:text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* LOAN CONTENT */}
                      <div className="min-w-0">
                        <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.025em] text-[#0D1216] transition-colors duration-300 group-hover:text-[#003189] md:text-[25px]">
                          {loan.title}
                        </h3>

                        <p className="mt-3 max-w-[520px] text-[12px] leading-7 text-[#657487]">
                          {loan.short_description ||
                            "Зээлийн бүтээгдэхүүний дэлгэрэнгүй мэдээлэлтэй танилцана уу."}
                        </p>
                      </div>

                      {/* LOAN INFORMATION */}
                      <div className="grid grid-cols-2 gap-5 border-t border-[#E4EAF4] pt-6 sm:gap-8 lg:border-l lg:border-t-0 lg:py-2 lg:pl-7">
                        <div>
                          <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#657487]">
                            Сарын хүү
                          </p>

                          <p className="mt-3 text-[20px] font-semibold tracking-[-0.03em] text-[#003189]">
                            {Number(loan.interest_rate).toFixed(2)}%
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#657487]">
                            Хугацаа
                          </p>

                          <p className="mt-3 text-[20px] font-semibold tracking-[-0.03em] text-[#0D1216]">
                            {loan.max_term} сар хүртэл
                          </p>
                        </div>
                      </div>

                      {/* DETAILS BUTTON */}
                      <div className="lg:justify-self-end">
                        <Link
                          href={`/loans/${loan.slug}`}
                          className="group/link inline-flex min-h-[52px] items-center justify-between gap-6 rounded-[10px] border border-[#E4EAF4] bg-[#F8FAFD] px-5 py-3 text-[11px] font-semibold text-[#003189] transition-all duration-300 hover:border-[#003189] hover:bg-[#003189] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
                        >
                          Дэлгэрэнгүй

                          <span className="text-[16px] text-[#003189] transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:text-[#F4AC38]">
                            ↗
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* CARD BOTTOM ACCENT */}
                    <div className="h-[2px] w-0 bg-[#F4AC38] transition-all duration-500 group-hover:w-full" />
                  </article>
                ))}
              </div>
            )}

            {/* DISCLAIMER */}
            <p className="mt-8 max-w-[700px] text-[10px] leading-6 text-[#657487]">
              Зээлийн нөхцөл, хүү болон хэмжээ нь бүтээгдэхүүн
              болон харилцагчийн нөхцөлөөс хамаарч
              өөрчлөгдөж болно.
            </p>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-white py-20 lg:py-24">
          <div className="container-main">
            <div className="flex flex-col justify-between gap-8 border-t border-[#E4EAF4] pt-10 md:flex-row md:items-center md:gap-12">
              {/* CTA CONTENT */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                    02 / Хүсэлт гаргах
                  </p>
                </div>

                <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#0D1216] md:text-[36px]">
                  Өөрт тохирох зээлээ олсон уу?
                </h2>

                <p className="mt-4 max-w-[520px] text-[12px] leading-6 text-[#657487]">
                  Сонгосон бүтээгдэхүүнийхээ дагуу
                  зээлийн хүсэлтээ онлайнаар илгээгээрэй.
                </p>
              </div>

              {/* CTA BUTTON */}
              <Link
                href="/apply"
                className="group inline-flex min-h-[54px] w-fit shrink-0 items-center justify-between gap-10 rounded-[10px] bg-[#F4AC38] px-7 py-4 text-[11px] font-semibold text-[#0D1216] shadow-[0_6px_20px_#F4AC3826] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E49B26] hover:shadow-[0_8px_24px_#F4AC3833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
              >
                Зээлийн хүсэлт гаргах

                <span className="text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
