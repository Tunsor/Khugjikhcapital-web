
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api/client";

export default function NewsForm() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);

      const image = formData.get("image");

      if (image instanceof File && image.size > 5 * 1024 * 1024) {
        throw new Error("Зургийн хэмжээ 5 MB-аас их байна.");
      }

      const result = await adminApi<{ id: string }>("/news/company", { method: "POST", body: formData });

      if (result.error !== null) {
        throw new Error(
          result.error ?? "Мэдээ хадгалахад алдаа гарлаа."
        );
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Мэдээ хадгалахад алдаа гарлаа."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-[#E4EAF4] px-4 py-3 text-[13px] outline-none focus:border-brand-blue";

  const labelClass =
    "mb-2 block text-[12px] font-semibold text-brand-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <label htmlFor="title" className={labelClass}>
          Мэдээний гарчиг *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={200}
          required
          placeholder="Мэдээний гарчиг"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="summary" className={labelClass}>
          Товч тайлбар
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          maxLength={500}
          placeholder="Мэдээний товч тайлбар"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Мэдээний ангилал
        </label>
        <select
          id="category"
          name="category"
          defaultValue="company"
          className={inputClass}
        >
          <option value="company">Байгууллагын мэдээ</option>
          <option value="announcement">Зарлал</option>
          <option value="promotion">Урамшуулал</option>
          <option value="event">Арга хэмжээ</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Мэдээний үндсэн агуулга *
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          required
          placeholder="Мэдээний дэлгэрэнгүй агуулга..."
          className={`${inputClass} leading-7`}
        />
      </div>

      <div>
        <label htmlFor="image" className={labelClass}>
          Мэдээний зураг
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-[#EDF3FC] file:px-4 file:py-2 file:text-brand-blue`}
        />
        <p className="mt-2 text-[10px] text-[#657487]">
          JPG, PNG, WebP — хамгийн ихдээ 5 MB
        </p>
      </div>

      <div>
        <label htmlFor="status" className={labelClass}>
          Нийтлэлийн төлөв
        </label>
        <select
          id="status"
          name="status"
          defaultValue="draft"
          className={inputClass}
        >
          <option value="draft">Ноорог хадгалах</option>
          <option value="published">Шууд нийтлэх</option>
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-[12px] text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3 border-t border-[#E4EAF4] pt-6">
        <Link
          href="/admin/news"
          className="rounded-[10px] border border-[#E4EAF4] px-5 py-3 text-[12px] text-[#657487]"
        >
          Буцах
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="rounded-[10px] bg-brand-blue px-6 py-3 text-[12px] font-semibold text-white hover:bg-[#00266D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Хадгалж байна..." : "Мэдээ хадгалах"}
        </button>
      </div>
    </form>
  );
}
