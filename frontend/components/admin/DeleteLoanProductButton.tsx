
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminApi } from "@/lib/api/client";

export default function DeleteLoanProductButton({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `"${productTitle}" бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");

    const { error } = await adminApi(
      `/loan-products/${encodeURIComponent(productId)}`,
      { method: "DELETE" }
    );

    if (error !== null) {
      console.error("Loan product delete error:", error);

      setErrorMessage(
        "Бүтээгдэхүүн устгах үед алдаа гарлаа."
      );

      setDeleting(false);
      return;
    }

    router.push("/admin/loans");
    router.refresh();
  }

  return (
    <div>
      {errorMessage && (
        <p className="mb-3 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-[10px] font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center justify-center rounded-[10px] border border-red-200 bg-white px-5 py-3 text-[9px] font-semibold text-red-600 transition-colors hover:border-red-500 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting
          ? "Устгаж байна..."
          : "Бүтээгдэхүүн устгах"}
      </button>
    </div>
  );
}
