
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api/client";

type ApplicationStatusProps = {
  applicationId: string;
  currentStatus: string;
};

const statuses = [
  { value: "new", label: "Шинэ" },
  { value: "reviewing", label: "Шалгаж байгаа" },
  { value: "approved", label: "Зөвшөөрсөн" },
  { value: "rejected", label: "Татгалзсан" },
];

export default function ApplicationStatus({
  applicationId,
  currentStatus,
}: ApplicationStatusProps) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savedStatus, setSavedStatus] =
    useState(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
    setSavedStatus(currentStatus);
  }, [currentStatus, applicationId]);

  async function handleSave() {
    if (saving || status === savedStatus) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const result = await adminApi<{ status: string }>(`/applications/${encodeURIComponent(applicationId)}/status`, { method: "PATCH", body: { status } });

      if (result.error !== null) {
        throw new Error(
          result.error ??
            "Төлөв шинэчлэхэд алдаа гарлаа."
        );
      }

      setSavedStatus(result.data.status);
      setStatus(result.data.status);
      setMessage("Төлөв амжилттай шинэчлэгдлээ.");

      router.refresh();
    } catch (error) {
      console.error("Status update error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Төлөв шинэчлэхэд алдаа гарлаа."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="application-status"
        className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#657487]"
      >
        Хүсэлтийн төлөв
      </label>

      <select
        id="application-status"
        value={status}
        disabled={saving}
        onChange={(event) => {
          setStatus(event.target.value);
          setMessage("");
        }}
        className="mt-3 w-full rounded-[10px] border border-[#CAD7EC] bg-white px-4 py-3 text-[11px] text-brand-dark outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {statuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || status === savedStatus}
        className="mt-3 w-full rounded-[10px] bg-brand-orange px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-dark shadow-[0_4px_14px_#F4AC3826] transition-colors hover:bg-[#E49B26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "Хадгалж байна..." : "Төлөв хадгалах"}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 text-[10px] ${
            message === "Төлөв амжилттай шинэчлэгдлээ."
              ? "text-green-700"
              : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
