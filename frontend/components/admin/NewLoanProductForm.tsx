
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { adminApi } from "@/lib/api/client";

export default function NewLoanProductForm() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [requirements, setRequirements] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);

  function addRequirement() {
    setRequirements((current) => [...current, ""]);
  }

  function updateRequirement(index: number, value: string) {
    setRequirements((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? value : item
      )
    );
  }

  function removeRequirement(index: number) {
    setRequirements((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function addDocument() {
    setDocuments((current) => [...current, ""]);
  }

  function updateDocument(index: number, value: string) {
    setDocuments((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? value : item
      )
    );
  }

  function removeDocument(index: number) {
    setDocuments((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();

    const interestRate = Number(
      formData.get("interest_rate")
    );

    const maxAmountValue = String(
      formData.get("max_amount") ?? ""
    ).trim();

    const maxTerm = Number(
      formData.get("max_term")
    );

    const shortDescription = String(
      formData.get("short_description") ?? ""
    ).trim();

    const description = String(
      formData.get("description") ?? ""
    ).trim();

    // Хоосон мөрүүдийг хадгалахгүй
    const cleanedRequirements = requirements
      .map((item) => item.trim())
      .filter(Boolean);

    const cleanedDocuments = documents
      .map((item) => item.trim())
      .filter(Boolean);

    // VALIDATION
    if (!title || !slug) {
      setErrorMessage(
        "Бүтээгдэхүүний нэр болон slug заавал шаардлагатай."
      );
      setSaving(false);
      return;
    }

    if (
      Number.isNaN(interestRate) ||
      interestRate < 0
    ) {
      setErrorMessage("Зээлийн хүүг зөв оруулна уу.");
      setSaving(false);
      return;
    }

    if (
      Number.isNaN(maxTerm) ||
      maxTerm < 1
    ) {
      setErrorMessage("Зээлийн хугацааг зөв оруулна уу.");
      setSaving(false);
      return;
    }

    let maxAmount: number | null = null;

    if (maxAmountValue) {
      maxAmount = Number(maxAmountValue);

      if (
        Number.isNaN(maxAmount) ||
        maxAmount <= 0
      ) {
        setErrorMessage(
          "Зээлийн дээд хэмжээг зөв оруулна уу."
        );
        setSaving(false);
        return;
      }
    }

    // API INSERT
    const { error, status } = await adminApi("/loan-products", {
      method: "POST",
      body: {
        title,
        slug,
        interest_rate: interestRate,
        max_amount: maxAmount,
        max_term: maxTerm,

        short_description: shortDescription || null,
        description: description || null,

        requirements: cleanedRequirements,
        documents: cleanedDocuments,

        is_active: formData.get("is_active") === "on",
      },
    });

    if (error !== null) {
      console.error("Loan product insert error:", error);

      setErrorMessage(
        status === 409
          ? "Энэ slug аль хэдийн ашиглагдаж байна."
          : status === 400
            ? error
            : "Бүтээгдэхүүн нэмэх үед алдаа гарлаа."
      );

      setSaving(false);
      return;
    }

    router.push("/admin/loans");
    router.refresh();
  }

  const inputClass =
    "mt-2 w-full rounded-[10px] border border-[#E4EAF4] bg-white px-4 py-3 text-[11px] text-[#0D1216] outline-none transition-colors placeholder:text-[#A7ADAF] focus:border-[#003189] focus:ring-2 focus:ring-[#003189]/10";

  const labelClass =
    "text-[9px] font-semibold uppercase tracking-[0.08em] text-[#657487]";

  const addButtonClass =
    "rounded-[10px] border border-[#003189] px-4 py-2 text-[9px] font-semibold text-[#003189] transition-colors hover:bg-[#003189] hover:text-white";

  const removeButtonClass =
    "shrink-0 rounded-[10px] px-3 py-3 text-[9px] font-semibold text-red-600 transition-colors hover:bg-red-50";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        {/* TITLE */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            Бүтээгдэхүүний нэр
          </label>

          <input
            type="text"
            name="title"
            required
            placeholder="Жишээ: Бизнесийн зээл"
            className={inputClass}
          />
        </div>

        {/* SLUG */}
        <div>
          <label className={labelClass}>
            Slug
          </label>

          <input
            type="text"
            name="slug"
            required
            placeholder="business-loan"
            className={inputClass}
          />
        </div>

        {/* INTEREST */}
        <div>
          <label className={labelClass}>
            Сарын хүү (%)
          </label>

          <input
            type="number"
            name="interest_rate"
            required
            step="0.01"
            min="0"
            placeholder="2.50"
            className={inputClass}
          />
        </div>

        {/* MAX AMOUNT */}
        <div>
          <label className={labelClass}>
            Зээлийн дээд хэмжээ
          </label>

          <input
            type="number"
            name="max_amount"
            min="1"
            placeholder="50000000"
            className={inputClass}
          />
        </div>

        {/* MAX TERM */}
        <div>
          <label className={labelClass}>
            Дээд хугацаа (сар)
          </label>

          <input
            type="number"
            name="max_term"
            required
            min="1"
            placeholder="36"
            className={inputClass}
          />
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            Товч тайлбар
          </label>

          <textarea
            name="short_description"
            rows={3}
            placeholder="Бүтээгдэхүүний товч тайлбар..."
            className={`${inputClass} resize-none leading-5`}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            Дэлгэрэнгүй тайлбар
          </label>

          <textarea
            name="description"
            rows={6}
            placeholder="Бүтээгдэхүүний дэлгэрэнгүй мэдээлэл..."
            className={`${inputClass} resize-none leading-5`}
          />
        </div>

        {/* REQUIREMENTS */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between gap-4 border-b border-[#E4EAF4] pb-4">
            <div>
              <p className="text-[11px] font-semibold text-[#003189]">
                Тавигдах шаардлага
              </p>

              <p className="mt-1 text-[9px] text-[#657487]">
                Зээлдэгчид тавигдах шаардлагууд
              </p>
            </div>

            <button
              type="button"
              onClick={addRequirement}
              className={addButtonClass}
            >
              + Шаардлага нэмэх
            </button>
          </div>

          {requirements.length === 0 ? (
            <p className="py-5 text-[10px] text-[#657487]">
              Одоогоор шаардлага нэмээгүй байна.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[9px] font-semibold text-[#003189]">
                    {index + 1}
                  </span>

                  <input
                    type="text"
                    value={requirement}
                    onChange={(event) =>
                      updateRequirement(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="Жишээ: 18 нас хүрсэн байх"
                    className={inputClass.replace("mt-2 ", "")}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeRequirement(index)
                    }
                    className={removeButtonClass}
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DOCUMENTS */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between gap-4 border-b border-[#E4EAF4] pb-4">
            <div>
              <p className="text-[11px] font-semibold text-[#003189]">
                Бүрдүүлэх материал
              </p>

              <p className="mt-1 text-[9px] text-[#657487]">
                Онлайн хүсэлтэд хэрэглэгчээс авах материалууд
              </p>
            </div>

            <button
              type="button"
              onClick={addDocument}
              className={addButtonClass}
            >
              + Материал нэмэх
            </button>
          </div>

          {documents.length === 0 ? (
            <p className="py-5 text-[10px] text-[#657487]">
              Одоогоор материал нэмээгүй байна.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {documents.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F4AC38]/15 text-[9px] font-semibold text-[#9A6500]">
                    {index + 1}
                  </span>

                  <input
                    type="text"
                    value={document}
                    onChange={(event) =>
                      updateDocument(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="Жишээ: Иргэний үнэмлэхний лавлагаа"
                    className={inputClass.replace("mt-2 ", "")}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeDocument(index)
                    }
                    className={removeButtonClass}
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVE */}
        <div className="md:col-span-2">
          <p className={labelClass}>
            Вебсайт дээр харагдах
          </p>

          <label className="mt-3 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked
              className="h-4 w-4 rounded-[4px] accent-[#003189]"
            />

            <span className="text-[11px] text-[#0D1216]">
              Идэвхтэй
            </span>
          </label>
        </div>
      </div>

      {/* ACTION */}
      <div className="border-t border-[#E4EAF4] bg-[#F8FAFD] px-6 py-5">
        {errorMessage && (
          <p className="mb-4 text-[10px] font-medium text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-[10px] bg-[#F4AC38] px-6 py-3 text-[9px] font-semibold text-[#0D1216] shadow-[0_4px_14px_#F4AC3826] transition-colors hover:bg-[#E49B26] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Нэмж байна..."
              : "Бүтээгдэхүүн нэмэх"}
          </button>
        </div>
      </div>
    </form>
  );
}
