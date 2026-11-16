"use client";

import { useState } from "react";

import { adminDownload } from "@/lib/api/client";

export default function DocumentDownloadButton({
  documentId,
  className,
}: {
  documentId: string;
  className?: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    if (downloading) return;

    setDownloading(true);
    setError("");

    try {
      await adminDownload(
        `/documents/${encodeURIComponent(documentId)}/download`,
        `document-${documentId}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Файлыг нээх боломжгүй байна."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className={className}
      >
        {downloading ? "Татаж байна..." : "Файл татах ↓"}
      </button>

      {error && (
        <p role="alert" className="text-[9px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
