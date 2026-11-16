"use client";

import {
  Suspense,
  FormEvent,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import LegalConsentModal from "@/components/apply/LegalConsentModal";
import { api } from "@/lib/api/client";

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void;
    onTurnstileExpired?: () => void;
    turnstile?: {
      reset: () => void;
    };
  }
}

type LoanProduct = {
  id: string;
  title: string;
  slug: string;
  documents: string[];
  max_amount: number | null;
  max_term: number;
};

export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplyPageLoading />}>
      <ApplyPageContent />
    </Suspense>
  );
}

function ApplyPageContent() {
  const searchParams = useSearchParams();

  const initialType = searchParams.get("type") ?? "";
  const initialAmount = searchParams.get("amount") ?? "";
  const initialTerm = searchParams.get("term") ?? "";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [legalOpen, setLegalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const pendingFormData = useRef<FormData | null>(null);
  const submittingRef = useRef(false);

  const [loanProducts, setLoanProducts] = useState<
    LoanProduct[]
  >([]);

  const [selectedLoan, setSelectedLoan] = useState(initialType);
  const [amount, setAmount] = useState(initialAmount);
  const [term, setTerm] = useState(initialTerm);

  const selectedLoanProduct = loanProducts.find(
    (loan) => loan.slug === selectedLoan
  );

  const requiredDocuments =
    selectedLoanProduct?.documents ?? [];

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };

    window.onTurnstileExpired = () => {
      setTurnstileToken("");
    };

    return () => {
      delete window.onTurnstileSuccess;
      delete window.onTurnstileExpired;
    };
  }, []);

  useEffect(() => {
    async function loadLoanProducts() {
      const { data, error } = await api<LoanProduct[]>("/loan-products");

      if (error) {
        console.error("Loan products error:", error);
        return;
      }

      const products = (data ?? []) as LoanProduct[];

      setLoanProducts(products);

      setSelectedLoan((current) => {
        if (products.some((loan) => loan.slug === current)) {
          return current;
        }

        return products[0]?.slug ?? "";
      });
    }

    loadLoanProducts();
  }, []);

  
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submittingRef.current || legalOpen) return;

    if (!turnstileToken) {
      alert("Та робот биш гэдгээ баталгаажуулна уу.");
      return;
    }

    // Формын мэдээлэл болон хавсаргасан файлуудыг хадгална.
    pendingFormData.current = new FormData(e.currentTarget);

    setTermsAccepted(false);
    setPrivacyAccepted(false);
    setLegalOpen(true);
  }

  async function confirmAndSubmit() {
    if (
      submittingRef.current ||
      !pendingFormData.current ||
      !termsAccepted ||
      !privacyAccepted
    ) {
      return;
    }

    if (!turnstileToken) {
      alert(
        "Баталгаажуулалтын хугацаа дууссан байна. Дахин баталгаажуулна уу."
      );
      setLegalOpen(false);
      pendingFormData.current = null;
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    const formData = pendingFormData.current;
    formData.delete("turnstileToken");
    // Sent as a header so the API can verify it before reading the files.
    formData.delete("cf-turnstile-response");

    try {
      const result = await api<{ applicationId: string }>("/applications", {
        method: "POST",
        body: formData,
        headers: { "X-Turnstile-Token": turnstileToken },
      });

      if (result.error !== null) {
        console.error("Application API error:", result.error);

        setTurnstileToken("");
        window.turnstile?.reset();

        setLegalOpen(false);
        pendingFormData.current = null;

        alert(
          result.error || "Хүсэлт илгээх үед алдаа гарлаа."
        );

        return;
      }

      pendingFormData.current = null;

      setLegalOpen(false);
      setTermsAccepted(false);
      setPrivacyAccepted(false);

      setSelectedLoan("");
      setAmount("");
      setTerm("");

      setTurnstileToken("");
      window.turnstile?.reset();

      setSubmitted(true);
    } catch (error) {
      console.error("Application request error:", error);

      setTurnstileToken("");
      window.turnstile?.reset();

      setLegalOpen(false);
      pendingFormData.current = null;

      alert("Сервертэй холбогдох үед алдаа гарлаа.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function closeLegalModal() {
    if (submittingRef.current) return;

    setLegalOpen(false);
    pendingFormData.current = null;
  }


  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <LegalConsentModal
        open={legalOpen}
        submitting={submitting}
        termsAccepted={termsAccepted}
        privacyAccepted={privacyAccepted}
        onTermsChange={setTermsAccepted}
        onPrivacyChange={setPrivacyAccepted}
        onClose={closeLegalModal}
        onConfirm={confirmAndSubmit}
      />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

          <div className="pointer-events-none absolute -right-16 -top-16 h-[320px] w-[320px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative z-10 py-20 md:py-28 lg:py-32">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F4AC38]">
                Онлайн хүсэлт
              </p>
            </div>

            <h1 className="mt-7 max-w-[850px] text-[44px] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">
              Зээлийн хүсэлт
              <br />
              <span className="text-[#F4AC38]">
                гаргах.
              </span>
            </h1>

            <p className="mt-7 max-w-[580px] text-[13px] leading-7 text-white/70">
              Доорх мэдээллийг үнэн зөв бөглөж илгээнэ үү.
              Манай ажилтан хүсэлтийг хүлээн авч тантай
              холбогдоно.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
              <span className="text-[10px] font-medium text-white/60">
                Хөгжих Капитал ББСБ
              </span>

              <span className="h-[4px] w-[4px] rounded-full bg-[#F4AC38]" />

              <span className="text-[10px] text-white/60">
                Зээлийн урьдчилсан хүсэлт
              </span>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="bg-[#F8FAFD] py-20 lg:py-28">
          <div className="container-main">
            <div className="grid items-start gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14">
              {/* LEFT INFORMATION */}
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                    01 / Мэдээлэл
                  </p>
                </div>

                <h2 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                  Хүсэлтээ
                  <br />
                  <span className="text-[#003189]">
                    илгээгээрэй
                  </span>
                  <span className="text-[#F4AC38]">.</span>
                </h2>

                <p className="mt-5 max-w-[360px] text-[13px] leading-7 text-[#657487]">
                  Таны оруулсан мэдээллийг зээлийн хүсэлтийг
                  судлах зорилгоор ашиглана.
                </p>

                {/* PROCESS STEPS */}
                <div className="mt-9 overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white px-6 shadow-[0_4px_18px_#00318908]">
                  <Step
                    number="01"
                    text="Мэдээллээ бөглөнө"
                  />

                  <Step
                    number="02"
                    text="Хүсэлтээ илгээнэ"
                  />

                  <Step
                    number="03"
                    text="Манай ажилтан холбогдоно"
                  />
                </div>

                <div className="mt-6 rounded-[17px] border border-[#E4EAF4] bg-white p-6">
                  <p className="text-[11px] font-semibold text-[#003189]">
                    Анхаарах зүйл
                  </p>

                  <p className="mt-3 text-[11px] leading-6 text-[#657487]">
                    Хүсэлт илгээснээр зээл автоматаар
                    зөвшөөрөгдөхгүй. Эцсийн шийдвэр нь
                    зээлийн судалгааны үр дүнгээс хамаарна.
                  </p>
                </div>
              </div>

              {/* RIGHT FORM */}
              <div className="min-w-0 rounded-[17px] border border-[#E4EAF4] bg-white p-6 shadow-[0_8px_32px_#0031890A] sm:p-8 lg:p-10">
                {submitted ? (
                  <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[17px] bg-[#EDF3FC] text-[26px] font-semibold text-[#003189]">
                      ✓
                    </div>

                    <h2 className="mt-7 text-[28px] font-semibold tracking-[-0.03em] text-[#0D1216]">
                      Хүсэлт хүлээн авлаа.
                    </h2>

                    <p className="mt-4 max-w-[420px] text-[12px] leading-7 text-[#657487]">
                      Таны хүсэлтийг амжилттай хүлээн авлаа.
                      Манай ажилтан хүсэлтийг шалгасны дараа
                      тантай холбогдоно.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLoan(
                          loanProducts[0]?.slug ?? ""
                        );
                        setSubmitted(false);
                      }}
                      className="mt-8 inline-flex min-h-[52px] items-center gap-6 rounded-[10px] bg-[#003189] px-7 py-4 text-[11px] font-semibold text-white transition-colors duration-300 hover:bg-[#00266C]"
                    >
                      Шинэ хүсэлт гаргах
                      <span className="text-[#F4AC38]">→</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* PERSONAL INFORMATION */}
                    <FormTitle
                      number="01"
                      title="Хувийн мэдээлэл"
                    />

                    <div className="mt-7 grid gap-6 md:grid-cols-2">
                      <Field
                        label="Овог"
                        name="lastName"
                        placeholder="Овог"
                        required
                      />

                      <Field
                        label="Нэр"
                        name="firstName"
                        placeholder="Нэр"
                        required
                      />

                      <Field
                        label="Утасны дугаар"
                        name="phone"
                        type="tel"
                        placeholder="9911 2233"
                        required
                      />

                      <Field
                        label="Регистрийн дугаар"
                        name="registerNumber"
                        placeholder="АА00000000"
                        required
                      />
                    </div>

                    <div className="my-10 h-px bg-[#E4EAF4]" />

                    {/* LOAN INFORMATION */}
                    <FormTitle
                      number="02"
                      title="Зээлийн мэдээлэл"
                    />

                    <div className="mt-7 grid gap-6 md:grid-cols-2">
                      {/* LOAN TYPE */}
                      <div>
                        <label
                          htmlFor="loanType"
                          className="mb-2 block text-[10px] font-semibold text-[#657487]"
                        >
                          Зээлийн төрөл
                        </label>

                        <select
                          id="loanType"
                          name="loanType"
                          required
                          value={selectedLoan}
                          onChange={(e) => {
                            setSelectedLoan(e.target.value);
                            setAmount("");
                            setTerm("");
                          }}
                          className="h-14 w-full rounded-[10px] border border-[#E4EAF4] bg-white px-4 text-[12px] text-[#0D1216] outline-none transition-colors duration-300 focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10"
                        >
                          {loanProducts.length === 0 && (
                            <option value="">
                              Бүтээгдэхүүн байхгүй
                            </option>
                          )}

                          {loanProducts.map((loan) => (
                            <option
                              key={loan.id}
                              value={loan.slug}
                            >
                              {loan.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* AMOUNT */}
                      <div>
                        <label
                          htmlFor="amount"
                          className="mb-2 block text-[10px] font-semibold text-[#657487]"
                        >
                          Хүсэж буй зээлийн хэмжээ
                        </label>

                        <input
                          id="amount"
                          type="number"
                          name="amount"
                          required
                          min="1"
                          max={
                            selectedLoanProduct?.max_amount ??
                            undefined
                          }
                          value={amount}
                          onChange={(e) =>
                            setAmount(e.target.value)
                          }
                          placeholder="5000000"
                          className="h-14 w-full rounded-[10px] border border-[#E4EAF4] bg-white px-4 text-[12px] text-[#0D1216] outline-none transition-colors duration-300 placeholder:text-[#A7ADAF] focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10"
                        />

                        {selectedLoanProduct?.max_amount != null && (
                          <p className="mt-2 text-[10px] text-[#657487]">
                            Дээд хэмжээ:{" "}
                            <span className="font-semibold text-[#003189]">
                              {Number(
                                selectedLoanProduct.max_amount
                              ).toLocaleString("en-US")}{" "}
                              ₮
                            </span>
                          </p>
                        )}
                      </div>

                      {/* TERM */}
                      <div>
                        <label
                          htmlFor="term"
                          className="mb-2 block text-[10px] font-semibold text-[#657487]"
                        >
                          Хугацаа / сар
                        </label>

                        <input
                          id="term"
                          type="number"
                          name="term"
                          required
                          min="1"
                          max={selectedLoanProduct?.max_term}
                          value={term}
                          onChange={(e) =>
                            setTerm(e.target.value)
                          }
                          placeholder="12"
                          className="h-14 w-full rounded-[10px] border border-[#E4EAF4] bg-white px-4 text-[12px] text-[#0D1216] outline-none transition-colors duration-300 placeholder:text-[#A7ADAF] focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10"
                        />

                        {selectedLoanProduct && (
                          <p className="mt-2 text-[10px] text-[#657487]">
                            Дээд хугацаа:{" "}
                            <span className="font-semibold text-[#003189]">
                              {selectedLoanProduct.max_term} сар
                            </span>
                          </p>
                        )}
                      </div>

                      <Field
                        label="Сарын орлого"
                        name="monthlyIncome"
                        type="number"
                        placeholder="2500000"
                      />
                    </div>

                    {/* REQUIRED DOCUMENTS */}
                    {selectedLoan &&
                      requiredDocuments.length > 0 && (
                        <div className="mt-10">
                          <FormTitle
                            number="03"
                            title="Бүрдүүлэх материал"
                          />

                          <p className="mt-4 text-[11px] leading-6 text-[#657487]">
                            Сонгосон зээлийн бүтээгдэхүүнд
                            шаардлагатай материалыг хавсаргана уу.
                            PDF, JPG, PNG файл оруулах боломжтой.
                          </p>

                          <div className="mt-6 space-y-4">
                            {requiredDocuments.map(
                              (document, index) => (
                                <div
                                  key={`${document}-${index}`}
                                  className="rounded-[17px] border border-[#E4EAF4] bg-[#F8FAFD] p-5"
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#003189] text-[10px] font-semibold text-white">
                                      {index + 1}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                      <p className="text-[12px] font-semibold leading-6 text-[#0D1216]">
                                        {document}
                                      </p>

                                      <input
                                        type="file"
                                        name={`document-${index}`}
                                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                        required
                                        className="mt-4 block w-full text-[11px] text-[#657487] file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#003189] file:px-4 file:py-3 file:text-[10px] file:font-semibold file:text-white hover:file:bg-[#00266C]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <div className="my-10 h-px bg-[#E4EAF4]" />

                    {/* ADDITIONAL INFORMATION */}
                    <FormTitle
                      number={
                        requiredDocuments.length > 0
                          ? "04"
                          : "03"
                      }
                      title="Нэмэлт мэдээлэл"
                    />

                    <div className="mt-7">
                      <label
                        htmlFor="note"
                        className="mb-2 block text-[10px] font-semibold text-[#657487]"
                      >
                        Нэмэлт тайлбар
                      </label>

                      <textarea
                        id="note"
                        name="note"
                        rows={5}
                        placeholder="Нэмэлт мэдээлэл байвал энд бичнэ үү..."
                        className="w-full resize-none rounded-[10px] border border-[#E4EAF4] bg-white p-4 text-[12px] leading-6 text-[#0D1216] outline-none transition-colors duration-300 placeholder:text-[#A7ADAF] focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10"
                      />
                    </div>

                    {/* CONSENT */}
                    <p className="mt-7 text-[11px] leading-6 text-[#657487]">
                      Хүсэлт илгээхэд Нууцлалын бодлого болон
                      Үйлчилгээний нөхцөлтэй танилцаж, зөвшөөрөх
                      цонх нээгдэнэ.
                    </p>

                    {/* TURNSTILE */}
                    <div className="mt-7">
                      <div
                        className="cf-turnstile"
                        data-sitekey={
                          process.env
                            .NEXT_PUBLIC_TURNSTILE_SITE_KEY
                        }
                        data-callback="onTurnstileSuccess"
                        data-expired-callback="onTurnstileExpired"
                        data-theme="light"
                      />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      disabled={
                        submitting ||
                        loanProducts.length === 0
                      }
                      className="group mt-8 flex min-h-[56px] w-full items-center justify-between rounded-[10px] bg-[#003189] px-6 py-4 text-[12px] font-semibold text-white shadow-[0_4px_14px_#00318920] transition-all duration-300 hover:bg-[#00266C] hover:shadow-[0_8px_24px_#00318925] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? "Хүсэлт илгээж байна..."
                        : "Хүсэлт илгээх"}

                      <span className="text-[17px] text-[#F4AC38] transition-transform duration-300 group-hover:translate-x-1">
                        {submitting ? "..." : "→"}
                      </span>
                    </button>

                    <p className="mt-4 text-[10px] leading-6 text-[#657487]">
                      Хүсэлт илгээснээр зээл автоматаар
                      зөвшөөрөгдөхгүй. Эцсийн шийдвэр нь
                      зээлийн судалгааны үр дүнгээс хамаарна.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-[10px] font-semibold text-[#657487]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-14 w-full rounded-[10px] border border-[#E4EAF4] bg-white px-4 text-[12px] text-[#0D1216] outline-none transition-colors duration-300 placeholder:text-[#A7ADAF] focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10"
      />
    </div>
  );
}

function FormTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[10px] font-semibold text-[#003189]">
        {number}
      </span>

      <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#0D1216]">
        {title}
      </h3>
    </div>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-5 border-b border-[#E4EAF4] py-5 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[10px] font-semibold text-[#003189]">
        {number}
      </span>

      <p className="text-[12px] font-medium text-[#0D1216]">
        {text}
      </p>
    </div>
  );
}


function ApplyPageLoading() {
  return (
    <main>
      <section className="bg-[#003189] py-20 text-white md:py-28 lg:py-32">
        <div className="container-main">
          <div className="h-3 w-36 animate-pulse rounded bg-white/20" />

          <div className="mt-7 h-14 max-w-[520px] animate-pulse rounded-[10px] bg-white/15" />

          <div className="mt-6 h-5 max-w-[380px] animate-pulse rounded bg-white/10" />
        </div>
      </section>

      <section className="bg-[#F8FAFD] py-20 lg:py-28">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
            <div className="h-64 animate-pulse rounded-[17px] bg-[#E4EAF4]" />

            <div className="h-[600px] animate-pulse rounded-[17px] border border-[#E4EAF4] bg-white" />
          </div>
        </div>
      </section>
    </main>
  );
}
