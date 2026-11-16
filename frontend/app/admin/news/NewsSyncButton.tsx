
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { adminApi } from "@/lib/api/client";

type SourceResult = {
  success: boolean;
  matched?: number;
  images_saved?: number;
  message?: string;
};

type SyncResult = {
  success: boolean;
  mongolbank: SourceResult;
  frc: SourceResult;
};

export default function NewsSyncButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSync() {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const result = await adminApi<SyncResult>("/news/sync", {
        method: "POST",
      });

      if (result.error !== null) {
        throw new Error(result.error);
      }

      const { mongolbank, frc } = result.data;
      const matched = (mongolbank.matched ?? 0) + (frc.matched ?? 0);
      const imagesSaved =
        (mongolbank.images_saved ?? 0) + (frc.images_saved ?? 0);

      if (!result.data.success) {
        setIsError(true);
      }

      setMessage(
        `${matched} мэдээ шалгаж, ${imagesSaved} зураг хадгаллаа.` +
          (result.data.success
            ? ""
            : ` (${[mongolbank, frc]
                .filter((source) => !source.success)
                .map((source) => source.message)
                .join(" ")})`)
      );

      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Синк хийхэд алдаа гарлаа."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        className="rounded-[10px] bg-brand-blue px-5 py-3 text-[11px] font-semibold text-white transition-colors hover:bg-[#00266D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Синк хийж байна..." : "Мэдээ синк хийх"}
      </button>

      {message && (
        <p
          role="status"
          className={`max-w-xs text-[11px] ${
            isError ? "text-red-700" : "text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
