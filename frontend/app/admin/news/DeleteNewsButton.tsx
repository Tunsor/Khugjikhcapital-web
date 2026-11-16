"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/api/client";

type Props = {
  id: string;
  title: string;
};

export default function DeleteNewsButton({ id, title }: Props) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);
    setError("");

    try {
      const result = await adminApi<null>(`/news/company/${encodeURIComponent(id)}`, { method: "DELETE" });

      if (result.error !== null) {
        throw new Error(
          result.error ?? "Мэдээ устгахад алдаа гарлаа."
        );
      }

      setConfirmOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Мэдээ устгахад алдаа гарлаа."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setConfirmOpen(true);
        }}
        className="whitespace-nowrap text-[11px] font-semibold text-red-600 hover:underline"
      >
        Устгах
      </button>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${id}`}
            className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-xl"
          >
            <h2
              id={`delete-title-${id}`}
              className="text-[20px] font-semibold text-brand-dark"
            >
              Мэдээ устгах уу?
            </h2>

            <p className="mt-3 text-[12px] leading-6 text-[#657487]">
              <strong className="text-brand-dark">
                {title}
              </strong>{" "}
              мэдээг бүрмөсөн устгах гэж байна.
              Энэ үйлдлийг буцаах боломжгүй.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-[10px] bg-red-50 p-3 text-[12px] text-red-700"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="rounded-[10px] border border-[#E4EAF4] px-5 py-3 text-[12px] font-medium text-[#657487] disabled:opacity-50"
              >
                Болих
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-[10px] bg-red-600 px-5 py-3 text-[12px] font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Устгаж байна..." : "Тийм, устгах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
