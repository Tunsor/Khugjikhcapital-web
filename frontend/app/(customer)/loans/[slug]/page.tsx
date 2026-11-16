
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { apiGet } from "@/lib/api/server";
import type { LoanProductDetail } from "@/lib/api/types";

export const instant = false;

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const { data: loan, error, status } = await apiGet<LoanProductDetail>(
    `/loan-products/${encodeURIComponent(slug)}`
  );

  if (error && status !== 404) {
    console.error("Loan detail error:", error);
  }

  if (!loan) {
    notFound();
  }

  const formattedAmount =
    loan.max_amount !== null
      ? `${Number(loan.max_amount).toLocaleString("en-US")} ₮ хүртэл`
      : "Тун удахгүй";

  return (
    <>
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          {/* BACKGROUND DECORATIONS */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

          <div className="pointer-events-none absolute -right-16 -top-16 h-[320px] w-[320px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative z-10 py-20 md:py-28 lg:py-32">
            {/* BREADCRUMB */}
            <nav
              aria-label="Breadcrumb"
              className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white/60"
            >
              <Link
                href="/"
                className="transition-colors hover:text-white"
              >
                Нүүр
              </Link>

              <span className="text-white/30">/</span>

              <Link
                href="/loans"
                className="transition-colors hover:text-white"
              >
                Зээлийн бүтээгдэхүүн
              </Link>

              <span className="text-white/30">/</span>

              <span className="text-[#F4AC38]">
                {loan.title}
              </span>
            </nav>

            {/* SECTION LABEL */}
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F4AC38]">
                {String(loan.sort_order || 1).padStart(2, "0")} / Зээлийн бүтээгдэхүүн
              </p>
            </div>

            {/* HERO TITLE */}
            <h1 className="mt-7 max-w-[850px] break-words text-[44px] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">
              {loan.title}
              <span className="text-[#F4AC38]">.</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-7 max-w-[620px] whitespace-pre-line text-[13px] leading-7 text-white/70">
              {loan.description ||
                loan.short_description ||
                "Зээлийн бүтээгдэхүүний дэлгэрэнгүй мэдээлэлтэй танилцаарай."}
            </p>

            {/* HERO CTA */}
            <Link
              href={`/apply?type=${loan.slug}`}
              className="group mt-9 inline-flex min-h-[54px] w-fit items-center justify-between gap-10 rounded-[10px] bg-[#F4AC38] px-7 py-4 text-[11px] font-semibold text-[#0D1216] shadow-[0_6px_20px_#F4AC3826] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E49B26] hover:shadow-[0_8px_24px_#F4AC3833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Зээлийн хүсэлт гаргах

              <span className="text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* HERO BOTTOM DETAIL */}
            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
              <span className="text-[10px] font-medium text-white/60">
                Хөгжих Капитал ББСБ
              </span>

              <span className="h-[4px] w-[4px] rounded-full bg-[#F4AC38]" />

              <span className="text-[10px] text-white/60">
                Зээлийн нөхцөл, мэдээлэл
              </span>
            </div>
          </div>
        </section>

        {/* LOAN INFORMATION */}
        <section className="bg-[#F8FAFD] py-20 lg:py-28">
          <div className="container-main">
            {/* SECTION HEADER */}
            <div className="mb-12 lg:mb-14">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                  01 / Зээлийн нөхцөл
                </p>
              </div>

              <h2 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                Үндсэн{" "}
                <span className="text-[#003189]">
                  мэдээлэл
                </span>
                <span className="text-[#F4AC38]">.</span>
              </h2>

              <p className="mt-5 max-w-[560px] text-[13px] leading-7 text-[#657487]">
                Зээлийн бүтээгдэхүүний хүү, хугацаа болон
                санхүүжилтийн дээд хэмжээтэй танилцаарай.
              </p>
            </div>

            {/* LOAN STATS */}
            <div className="grid gap-5 md:grid-cols-3">
              <LoanInfo
                label="Сарын хүү"
                value={`${Number(loan.interest_rate).toFixed(2)}%`}
                number="01"
              />

              <LoanInfo
                label="Зээлийн хугацаа"
                value={`${loan.max_term} сар хүртэл`}
                number="02"
              />

              <LoanInfo
                label="Зээлийн хэмжээ"
                value={formattedAmount}
                number="03"
              />
            </div>

            {/* REQUIREMENTS */}
            <InfoList
              number="02"
              title="Тавигдах шаардлага"
              description="Зээлийн хүсэлт гаргахад тавигдах үндсэн шаардлагууд."
              items={loan.requirements ?? []}
            />

            {/* DOCUMENTS */}
            <InfoList
              number="03"
              title="Бүрдүүлэх материал"
              description="Зээлийн хүсэлтийг судлахад шаардлагатай материалууд."
              items={loan.documents ?? []}
            />
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="bg-white py-16 lg:py-20">
          <div className="container-main">
            <div className="rounded-[17px] border border-[#E4EAF4] border-l-[3px] border-l-[#F4AC38] bg-[#F8FAFD] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                  Анхааруулга
                </p>
              </div>

              <p className="mt-5 max-w-[850px] text-[12px] leading-7 text-[#657487]">
                Энд харуулсан мэдээлэл нь одоогоор хөгжүүлэлтийн
                зориулалттай. Бодит зээлийн нөхцөл, хүү, шимтгэл,
                шаардлагыг албан ёсны мэдээллээр шинэчилнэ.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#003189] py-20 text-white lg:py-24">
          {/* BACKGROUND DECORATION */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[360px] w-[360px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative z-10">
            <div className="flex flex-col justify-between gap-9 md:flex-row md:items-end">
              {/* CTA CONTENT */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F4AC38]">
                    04 / Дараагийн алхам
                  </p>
                </div>

                <h2 className="mt-5 max-w-[650px] text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] md:text-[40px]">
                  Зээлийн хүсэлтээ
                  <br />
                  <span className="text-[#F4AC38]">
                    илгээгээрэй.
                  </span>
                </h2>

                <p className="mt-5 max-w-[480px] text-[12px] leading-7 text-white/70">
                  Өөрт тохирох бүтээгдэхүүнээ сонгосон бол
                  урьдчилсан хүсэлтээ онлайнаар илгээгээрэй.
                </p>
              </div>

              {/* CTA BUTTON */}
              <Link
                href={`/apply?type=${loan.slug}`}
                className="group inline-flex min-h-[54px] w-fit shrink-0 items-center justify-between gap-10 rounded-[10px] bg-[#F4AC38] px-7 py-4 text-[11px] font-semibold text-[#0D1216] shadow-[0_6px_20px_#F4AC3826] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E49B26] hover:shadow-[0_8px_24px_#F4AC3833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Хүсэлт гаргах

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

/* LOAN INFORMATION CARD */
function LoanInfo({
  label,
  value,
  number,
}: {
  label: string;
  value: string;
  number: string;
}) {
  return (
    <div className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4DFEF] hover:shadow-[0_12px_30px_#00318912] sm:p-8">
      {/* CARD NUMBER */}
      <span className="absolute right-6 top-7 text-[10px] font-medium tracking-[0.12em] text-[#A0AABA] sm:right-8">
        {number}
      </span>

      {/* CARD LABEL */}
      <div className="flex items-center gap-3 pr-8">
        <span className="h-px w-5 shrink-0 bg-[#F4AC38]" />

        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#657487]">
          {label}
        </p>
      </div>

      {/* CARD VALUE */}
      <p className="mt-8 break-words text-[25px] font-semibold leading-[1.2] tracking-[-0.035em] text-[#003189] sm:text-[29px]">
        {value}
      </p>

      {/* BOTTOM ACCENT */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#F4AC38] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

/* REQUIREMENTS AND DOCUMENTS */
function InfoList({
  number,
  title,
  description,
  items,
}: {
  number: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="mt-16 lg:mt-20">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3">
        <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
          {number} / Мэдээлэл
        </p>
      </div>

      <h2 className="mt-5 text-[30px] font-semibold leading-[1.15] tracking-[-0.04em] text-[#0D1216] md:text-[38px]">
        {title}
        <span className="text-[#F4AC38]">.</span>
      </h2>

      <p className="mt-4 max-w-[580px] text-[12px] leading-7 text-[#657487]">
        {description}
      </p>

      {/* LIST */}
      <div className="mt-8 overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_18px_#00318908]">
        {items.length === 0 ? (
          <div className="flex items-start gap-4 px-6 py-8 sm:px-8">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[13px] font-semibold text-[#003189]">
              i
            </span>

            <p className="pt-2 text-[12px] leading-6 text-[#657487]">
              Одоогоор мэдээлэл оруулаагүй байна.
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="group flex items-start gap-5 border-b border-[#E4EAF4] px-6 py-5 transition-colors duration-300 last:border-b-0 hover:bg-[#F8FAFD] sm:gap-6 sm:px-8 sm:py-6"
            >
              {/* ITEM NUMBER */}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[10px] font-semibold text-[#003189] transition-colors duration-300 group-hover:bg-[#003189] group-hover:text-white">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* ITEM TEXT */}
              <p className="min-w-0 break-words pt-1.5 text-[12px] leading-7 text-[#657487]">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
