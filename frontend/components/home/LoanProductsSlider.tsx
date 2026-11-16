
"use client";

import { useRef } from "react";
import Link from "next/link";

type Loan = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  interest_rate: number;
  max_term: number;
  sort_order: number;
};

export default function LoanProductsSlider({
  loans,
}: {
  loans: Loan[];
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollSlider(direction: "left" | "right") {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.querySelector<HTMLElement>(
      "[data-loan-card]"
    );

    const cardWidth = firstCard?.getBoundingClientRect().width ?? 380;
    const gap = 20;

    slider.scrollBy({
      left: (cardWidth + gap) * (direction === "left" ? -1 : 1),
      behavior: "smooth",
    });
  }

  return (
    <div>
      {/* SLIDER CONTROLS */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-[10px] font-medium text-[#657487]">
          Нийт{" "}
          <span className="font-semibold text-[#003189]">
            {loans.length}
          </span>{" "}
          бүтээгдэхүүн
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollSlider("left")}
            disabled={loans.length === 0}
            aria-label="Өмнөх бүтээгдэхүүн"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E4EAF4] bg-white text-[15px] text-[#003189] transition-all duration-300 hover:border-[#003189] hover:bg-[#003189] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => scrollSlider("right")}
            disabled={loans.length === 0}
            aria-label="Дараагийн бүтээгдэхүүн"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E4EAF4] bg-white text-[15px] text-[#003189] transition-all duration-300 hover:border-[#003189] hover:bg-[#003189] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {loans.length === 0 ? (
        <div className="rounded-[17px] border border-[#E4EAF4] bg-white px-6 py-16 text-center shadow-[0_4px_18px_#00318908]">
          <p className="text-[15px] font-semibold text-[#0D1216]">
            Одоогоор зээлийн бүтээгдэхүүн байхгүй байна.
          </p>

          <p className="mt-3 text-[12px] leading-6 text-[#657487]">
            Шинэ бүтээгдэхүүний мэдээллийг удахгүй хүргэнэ.
          </p>
        </div>
      ) : (
        <div
          ref={sliderRef}
          aria-label="Зээлийн бүтээгдэхүүнүүд"
          className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-w-max gap-5 pb-5">
            {loans.map((loan, index) => (
              <article
                key={loan.id}
                data-loan-card
                className="group relative flex w-[85vw] shrink-0 flex-col overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:border-[#003189]/20 hover:shadow-[0_12px_32px_#00318912] sm:w-[55vw] lg:w-[380px] lg:p-8"
              >
                {/* CARD TOP */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[#003189] transition-colors duration-300 group-hover:bg-[#003189] group-hover:text-white">
                    <span className="text-[22px]" aria-hidden="true">
                      ◇
                    </span>
                  </div>

                  <span className="text-[9px] font-semibold tracking-[0.18em] text-[#657487]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* CARD CONTENT */}
                <div className="mt-8 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-5 bg-[#F4AC38]" />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#003189]">
                      Зээлийн бүтээгдэхүүн
                    </p>
                  </div>

                  <h3 className="mt-5 break-words text-[23px] font-semibold leading-[1.2] tracking-[-0.035em] text-[#0D1216] transition-colors duration-300 group-hover:text-[#003189]">
                    {loan.title}
                  </h3>

                  <p className="mt-4 min-h-[72px] text-[12px] leading-6 text-[#657487]">
                    {loan.short_description ||
                      "Зээлийн бүтээгдэхүүний дэлгэрэнгүй мэдээлэлтэй танилцана уу."}
                  </p>
                </div>

                {/* LOAN INFORMATION */}
                <div className="mt-8 grid grid-cols-2 gap-5 border-t border-[#E4EAF4] pt-7">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#657487]">
                      Сарын хүү
                    </p>

                    <p className="mt-3 text-[26px] font-semibold tracking-[-0.035em] text-[#003189]">
                      {Number(loan.interest_rate).toFixed(2)}%
                    </p>
                  </div>

                  <div className="border-l border-[#E4EAF4] pl-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#657487]">
                      Зээлийн хугацаа
                    </p>

                    <p className="mt-3 text-[26px] font-semibold tracking-[-0.035em] text-[#0D1216]">
                      {loan.max_term}{" "}
                      <span className="text-[13px] font-medium text-[#657487]">
                        сар хүртэл
                      </span>
                    </p>
                  </div>
                </div>

                {/* DETAILS BUTTON */}
                <div className="mt-7 border-t border-[#E4EAF4] pt-6">
                  <Link
                    href={`/loans/${loan.slug}`}
                    className="group/link flex min-h-[50px] items-center justify-between gap-5 rounded-[10px] bg-[#003189] px-5 py-3 text-[11px] font-semibold text-white transition-all duration-300 hover:bg-[#00266C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
                  >
                    Дэлгэрэнгүй үзэх

                    <span className="text-[#F4AC38] transition-transform duration-300 group-hover/link:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>

                {/* HOVER ACCENT */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F4AC38] transition-all duration-500 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
