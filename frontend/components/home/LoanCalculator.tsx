
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculatePMT } from "@/lib/loan-calculator";
import { api } from "@/lib/api/client";

type LoanSetting = {
  id: string;
  loan_name: string;
  monthly_interest_rate: number;
  max_dti_ratio: number;
  min_term_months: number;
  max_term_months: number;
  max_loan_amount: number | null;
  is_active: boolean;
};

type Mode = "payment" | "eligibility";

const applicationSlugs: Record<string, string> = {
  car: "car",
  property: "real-estate",
  phone: "phone-number",
};

const fallbackLoans: LoanSetting[] = [
  {
    id: "phone",
    loan_name: "Дугаар барьцаалсан зээл",
    monthly_interest_rate: 2.8,
    max_dti_ratio: 55,
    min_term_months: 1,
    max_term_months: 12,
    max_loan_amount: null,
    is_active: true,
  },
  {
    id: "property",
    loan_name: "Үл хөдлөх барьцаалсан зээл",
    monthly_interest_rate: 2.5,
    max_dti_ratio: 55,
    min_term_months: 1,
    max_term_months: 36,
    max_loan_amount: null,
    is_active: true,
  },
  {
    id: "car",
    loan_name: "Автомашин барьцаалсан зээл",
    monthly_interest_rate: 3,
    max_dti_ratio: 55,
    min_term_months: 1,
    max_term_months: 36,
    max_loan_amount: null,
    is_active: true,
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("mn-MN").format(
    Math.round(Math.max(0, value))
  );

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function CalculatorRange({
  id,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const progress =
    max > min
      ? clamp(((value - min) / (max - min)) * 100, 0, 100)
      : 0;

  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={clamp(value, min, max)}
      disabled={max <= min}
      onChange={(event) =>
        onChange(Number(event.target.value))
      }
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        background: `linear-gradient(
          to right,
          #003189 0%,
          #003189 ${progress}%,
          #E4EAF4 ${progress}%,
          #E4EAF4 100%
        )`,
      }}
      className="calculator-range block h-[6px] w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#F4AC38] focus-visible:ring-offset-4 disabled:opacity-50"
    />
  );
}

function ResultRow({
  title,
  value,
  emphasized = false,
}: {
  title: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span
        className={`text-[11px] ${
          emphasized
            ? "font-semibold text-white"
            : "text-white/65"
        }`}
      >
        {title}
      </span>

      <span
        className={`text-right text-[12px] ${
          emphasized
            ? "font-semibold text-[#F4AC38]"
            : "font-medium text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function LoanCalculator() {
  const [mode, setMode] = useState<Mode>("payment");
  const [loans, setLoans] =
    useState<LoanSetting[]>(fallbackLoans);

  const [loanType, setLoanType] = useState("phone");
  const [amount, setAmount] = useState(5_000_000);
  const [term, setTerm] = useState(12);

  const [income, setIncome] = useState(2_500_000);
  const [existingPayments, setExistingPayments] =
    useState(350_000);

  const [settingsError, setSettingsError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const { data: rows, error } = await api<unknown>(
          "/calculator-settings"
        );

        if (error) {
          throw new Error(error);
        }

        if (!Array.isArray(rows)) {
          throw new Error("Invalid settings");
        }

        const parsed = rows
          .filter((row): row is LoanSetting => {
            if (!row || typeof row !== "object") {
              return false;
            }

            const r = row as Record<string, unknown>;

            return (
              typeof r.id === "string" &&
              typeof r.loan_name === "string" &&
              Number.isFinite(
                Number(r.monthly_interest_rate)
              ) &&
              Number.isFinite(Number(r.max_dti_ratio)) &&
              Number.isInteger(Number(r.min_term_months)) &&
              Number.isInteger(Number(r.max_term_months)) &&
              (r.max_loan_amount == null ||
                Number.isFinite(Number(r.max_loan_amount))) &&
              typeof r.is_active === "boolean"
            );
          })
          .map((row) => ({
            ...row,
            monthly_interest_rate: Number(
              row.monthly_interest_rate
            ),
            max_dti_ratio: Number(row.max_dti_ratio),
            min_term_months: Number(row.min_term_months),
            max_term_months: Number(row.max_term_months),
            max_loan_amount:
              row.max_loan_amount == null
                ? null
                : Number(row.max_loan_amount),
          }))
          .filter(
            (row) =>
              row.is_active &&
              row.max_term_months >= row.min_term_months
          );

        if (active) {
          setLoans(parsed);
          setSettingsError(false);
        }
      } catch {
        if (active) {
          setSettingsError(true);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const selectedLoan =
    loans.find((loan) => loan.id === loanType) ?? loans[0];

  const minTerm = selectedLoan?.min_term_months ?? 1;
  const maxTerm = selectedLoan?.max_term_months ?? 12;
  const safeTerm = clamp(term, minTerm, maxTerm);

  const maxAmount =
    selectedLoan?.max_loan_amount ?? 100_000_000;

  const sliderMax = Math.max(1_000_000, maxAmount);
  const safeAmount = Math.min(amount, sliderMax);

  const rate = selectedLoan?.monthly_interest_rate ?? 0;
  const dti = selectedLoan?.max_dti_ratio ?? 55;

  // Excel PMT-тэй ижил сарын төлөлт
  const calculation = useMemo(() => {
    const monthlyPayment = calculatePMT(
      safeAmount,
      rate,
      safeTerm
    );

    const totalPayment = monthlyPayment * safeTerm;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest: Math.max(
        0,
        totalPayment - safeAmount
      ),
    };
  }, [safeAmount, rate, safeTerm]);

  // Өр, орлогын харьцаагаар боломжит зээл тооцох
  const eligibility = useMemo(() => {
    const maxMonthlyDebt =
      (Math.max(0, income) * dti) / 100;

    const affordablePayment = Math.max(
      0,
      maxMonthlyDebt - Math.max(0, existingPayments)
    );

    const monthlyRate = rate / 100;

    const estimatedPrincipal =
      monthlyRate === 0
        ? affordablePayment * safeTerm
        : (affordablePayment *
            (1 - Math.pow(1 + monthlyRate, -safeTerm))) /
          monthlyRate;

    const possibleAmount = Math.min(
      Math.max(0, estimatedPrincipal),
      maxAmount
    );

    const monthlyPayment = calculatePMT(
      possibleAmount,
      rate,
      safeTerm
    );

    return {
      affordablePayment,
      possibleAmount,
      monthlyPayment,
      capped: estimatedPrincipal > maxAmount,
    };
  }, [
    income,
    existingPayments,
    dti,
    rate,
    safeTerm,
    maxAmount,
  ]);

  function changeLoanType(value: string) {
    const next = loans.find((loan) => loan.id === value);

    if (!next) return;

    setLoanType(value);

    setTerm((old) =>
      clamp(old, next.min_term_months, next.max_term_months)
    );

    if (next.max_loan_amount !== null) {
      setAmount((old) =>
        Math.min(old, next.max_loan_amount!)
      );
    }
  }

  return (
    <>
      <style jsx global>{`
        .calculator-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
        }

        .calculator-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
          background: transparent;
        }

        .calculator-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          margin-top: -7px;
          border-radius: 50%;
          background: #f4ac38;
          border: 4px solid #003189;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 49, 137, 0.2);
        }

        .calculator-range::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: transparent;
        }

        .calculator-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f4ac38;
          border: 4px solid #003189;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 49, 137, 0.2);
        }
      `}</style>

      <section
        id="calculator"
        className="relative overflow-hidden bg-[#003189] py-20 text-white lg:py-28"
      >
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

        <div className="container-main relative z-10">
          {/* SECTION HEADER */}
          <div className="mb-10 lg:mb-12">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F4AC38]">
                02 / Зээлийн тооцоолуур
              </p>
            </div>

            <h2 className="mt-5 max-w-[780px] text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] md:text-[46px]">
              Төлбөрөө мэдээд,
              <br />
              <span className="text-[#F4AC38]">
                шийдвэрээ гарга.
              </span>
            </h2>

            <p className="mt-5 max-w-[570px] text-[13px] leading-7 text-white/70">
              Зээлийн сарын төлбөр эсвэл орлогодоо тохирох
              боломжит зээлийн хэмжээг урьдчилан тооцоолоорой.
            </p>
          </div>

          {/* MODE SELECTOR */}
          <div
            className="mb-7 grid max-w-[620px] grid-cols-2 gap-2 rounded-xl border border-white/15 bg-white/10 p-1.5"
            role="tablist"
            aria-label="Тооцоолуурын горим"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "payment"}
              onClick={() => setMode("payment")}
              className={`rounded-lg px-3 py-3 text-[12px] font-semibold transition ${
                mode === "payment"
                  ? "bg-[#F4AC38] text-[#0D1216]"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Энгийн тооцоолуур
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mode === "eligibility"}
              onClick={() => setMode("eligibility")}
              className={`rounded-lg px-3 py-3 text-[12px] font-semibold transition ${
                mode === "eligibility"
                  ? "bg-[#F4AC38] text-[#0D1216]"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              Зээлийн боломж
            </button>
          </div>

          {settingsError && (
            <p
              className="mb-5 text-[12px] text-[#F4AC38]"
              role="alert"
            >
              Тохиргоог серверээс уншиж чадсангүй.
              Түр хугацаанд жишиг нөхцөл ашиглаж байна.
            </p>
          )}

          {/* CALCULATOR GRID */}
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
            {/* LEFT PANEL */}
            <div className="rounded-[17px] border border-white/15 bg-white p-6 shadow-[0_4px_18px_#001A4A12] sm:p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#F4AC38]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#003189]">
                  01 / Зээлийн нөхцөл
                </p>
              </div>

              <h3 className="mt-5 text-[24px] font-semibold tracking-[-0.035em] text-[#0D1216] sm:text-[28px]">
                {mode === "payment"
                  ? "Тооцооллоо тохируулах."
                  : "Зээлийн боломжоо тооцох."}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#657487]">
                Доорх талбаруудыг өөрчлөхөд тооцоолол
                автоматаар шинэчлэгдэнэ.
              </p>

              {/* LOAN TYPE */}
              <div className="mt-9">
                <label
                  htmlFor="calculator-loan-type"
                  className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#657487]"
                >
                  Зээлийн төрөл
                </label>

                <select
                  id="calculator-loan-type"
                  value={selectedLoan?.id ?? ""}
                  onChange={(event) =>
                    changeLoanType(event.target.value)
                  }
                  className="h-14 w-full rounded-[10px] border border-[#E4EAF4] bg-[#F8FAFD] px-4 text-[12px] font-medium text-[#0D1216] outline-none focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10"
                >
                  {loans.length === 0 && (
                    <option value="">
                      Идэвхтэй зээл байхгүй
                    </option>
                  )}

                  {loans.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {loan.loan_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* AMOUNT OR INCOME */}
              {mode === "payment" ? (
                <div className="mt-9 border-t border-[#E4EAF4] pt-8">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <label
                      htmlFor="calculator-amount"
                      className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#657487]"
                    >
                      Зээлийн хэмжээ
                    </label>

                    <span className="text-[22px] font-semibold tracking-[-0.03em] text-[#003189]">
                      {money(safeAmount)}
                      <span className="ml-1 text-[13px] font-medium text-[#657487]">
                        ₮
                      </span>
                    </span>
                  </div>

                  <CalculatorRange
                    id="calculator-amount"
                    min={Math.min(1_000_000, sliderMax)}
                    max={sliderMax}
                    step={sliderMax < 500_000 ? 1 : 500_000}
                    value={safeAmount}
                    onChange={setAmount}
                  />

                  <div className="mt-4 flex justify-between text-[10px] text-[#657487]">
                    <span>
                      {money(Math.min(1_000_000, sliderMax))} ₮
                    </span>
                    <span>{money(sliderMax)} ₮</span>
                  </div>
                </div>
              ) : (
                <div className="mt-9 space-y-6 border-t border-[#E4EAF4] pt-8">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#657487]">
                    Сарын цэвэр орлого (₮)

                    <input
                      type="number"
                      min="0"
                      step="10000"
                      value={income}
                      onChange={(event) =>
                        setIncome(
                          Math.max(
                            0,
                            Number(event.target.value) || 0
                          )
                        )
                      }
                      className="mt-3 h-14 w-full rounded-[10px] border border-[#E4EAF4] bg-[#F8FAFD] px-4 text-[15px] font-medium text-[#0D1216] outline-none focus:border-[#003189]"
                    />
                  </label>

                  <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#657487]">
                    Бусад зээлийн сарын нийт төлөлт (₮)

                    <input
                      type="number"
                      min="0"
                      step="10000"
                      value={existingPayments}
                      onChange={(event) =>
                        setExistingPayments(
                          Math.max(
                            0,
                            Number(event.target.value) || 0
                          )
                        )
                      }
                      className="mt-3 h-14 w-full rounded-[10px] border border-[#E4EAF4] bg-[#F8FAFD] px-4 text-[15px] font-medium text-[#0D1216] outline-none focus:border-[#003189]"
                    />
                  </label>

                  <p className="text-[11px] leading-6 text-[#657487]">
                    Бусад бүх зээлийн сарын төлөлтийг
                    нийлүүлж оруулна. Өр, орлогын
                    харьцааны хязгаар:{" "}
                    <strong>{dti}%</strong>.
                  </p>
                </div>
              )}

              {/* TERM */}
              <div className="mt-9 border-t border-[#E4EAF4] pt-8">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <label
                    htmlFor="calculator-term"
                    className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#657487]"
                  >
                    Зээлийн хугацаа
                  </label>

                  <span className="text-[22px] font-semibold tracking-[-0.03em] text-[#003189]">
                    {safeTerm}
                    <span className="ml-2 text-[13px] font-medium text-[#657487]">
                      сар
                    </span>
                  </span>
                </div>

                <CalculatorRange
                  id="calculator-term"
                  min={minTerm}
                  max={maxTerm}
                  step={1}
                  value={safeTerm}
                  onChange={setTerm}
                />

                <div className="mt-4 flex justify-between text-[10px] text-[#657487]">
                  <span>{minTerm} сар</span>
                  <span>{maxTerm} сар</span>
                </div>
              </div>
            </div>

            {/* RIGHT RESULT CARD */}
            <div className="relative overflow-hidden rounded-[17px] border border-white/15 bg-[#00266C] p-6 shadow-[0_12px_32px_#001A4A25] sm:p-8 lg:p-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[#F4AC38]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F4AC38]">
                    02 / Урьдчилсан тооцоо
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/15 bg-white/10 text-[#F4AC38]"
                >
                  ▦
                </span>
              </div>

              {/* MAIN RESULT */}
              <div className="mt-9">
                <p className="text-[12px] font-medium text-white/70">
                  {mode === "payment"
                    ? "Сард төлөх дүн"
                    : "Тооцоолсон боломжит зээлийн хэмжээ"}
                </p>

                <p
                  aria-live="polite"
                  className="mt-3 break-words text-[34px] font-semibold leading-[1.1] tracking-[-0.04em] text-[#F4AC38] sm:text-[42px] lg:text-[46px]"
                >
                  {money(
                    mode === "payment"
                      ? calculation.monthlyPayment
                      : eligibility.possibleAmount
                  )}

                  <span className="ml-2 text-[20px] font-medium">
                    ₮
                  </span>
                </p>

                <p className="mt-4 text-[11px] leading-6 text-white/55">
                  {mode === "payment"
                    ? "PMT томьёогоор тооцсон тогтмол сарын төлөлт."
                    : "Өр, орлогын харьцаанд суурилсан урьдчилсан боломж."}
                </p>
              </div>

              {/* RESULT DETAILS */}
              <div className="mt-9 divide-y divide-white/10 border-y border-white/15">
                <ResultRow
                  title="Сарын хүү"
                  value={`${rate}%`}
                />

                <ResultRow
                  title="Хугацаа"
                  value={`${safeTerm} сар`}
                />

                {mode === "payment" ? (
                  <>
                    <ResultRow
                      title="Зээлийн дүн"
                      value={`${money(safeAmount)} ₮`}
                    />

                    <ResultRow
                      title="Нийт хүү"
                      value={`${money(
                        calculation.totalInterest
                      )} ₮`}
                    />

                    <ResultRow
                      title="Нийт төлөх дүн"
                      value={`${money(
                        calculation.totalPayment
                      )} ₮`}
                      emphasized
                    />
                  </>
                ) : (
                  <>
                    <ResultRow
                      title="Өр, орлогын харьцаа"
                      value={`${dti}%`}
                    />

                    <ResultRow
                      title="Шинэ зээлд төлөх боломжит сарын дүн"
                      value={`${money(
                        eligibility.affordablePayment
                      )} ₮`}
                    />

                    <ResultRow
                      title="Тооцоолсон зээлийн сарын төлөлт"
                      value={`${money(
                        eligibility.monthlyPayment
                      )} ₮`}
                      emphasized
                    />

                    {eligibility.capped && (
                      <ResultRow
                        title="Бүтээгдэхүүний дээд хэмжээ"
                        value={`${money(maxAmount)} ₮`}
                      />
                    )}
                  </>
                )}
              </div>

              {/* APPLY BUTTON */}
              {selectedLoan &&
              (mode === "payment" ||
                eligibility.possibleAmount >= 1) ? (
                <Link
                  href={`/apply?type=${encodeURIComponent(
                    applicationSlugs[selectedLoan.id] ?? selectedLoan.id
                   )}&amount=${Math.floor(
                    mode === "payment"
                      ? safeAmount
                      : eligibility.possibleAmount
                  )}&term=${safeTerm}`}
                  className="group mt-9 flex min-h-[54px] w-full items-center justify-between gap-5 rounded-[10px] bg-[#F4AC38] px-6 py-4 text-[11px] font-semibold text-[#0D1216] shadow-[0_6px_20px_#F4AC3826] transition-all duration-300 hover:bg-[#E49B26] hover:shadow-[0_8px_24px_#F4AC3833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Энэ нөхцөлөөр хүсэлт гаргах

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ) : (
                <p className="mt-8 text-[12px] text-white/70">
                  Одоогийн мэдээллээр хүсэлт гаргах
                  боломжит дүн тооцоологдсонгүй.
                </p>
              )}

              {/* DISCLAIMER */}
              <p className="mt-5 text-[10px] leading-6 text-white/55">
                Энэхүү тооцоолол нь урьдчилсан бөгөөд
                зээлийн бодит нөхцөл, шимтгэл, барьцааны
                үнэлгээ болон бусад шалгуураас хамааран
                өөрчлөгдөж болно.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
