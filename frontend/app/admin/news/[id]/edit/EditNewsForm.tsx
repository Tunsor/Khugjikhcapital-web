
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { adminApi } from "@/lib/api/client";

type CompanyNews = {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  category: string;
  status: string;
  image_url: string | null;
};

type Props = {
  news: CompanyNews;
};

export default function EditNewsForm({ news }: Props) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(news.image_url);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMessage, setImageMessage] = useState("");

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [selectedImage]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setImageMessage("");
    setError("");

    if (file && file.size > 5 * 1024 * 1024) {
      setSelectedImage(null);
      event.target.value = "";
      setError("Зургийн хэмжээ 5 MB-аас их байна.");
      return;
    }

    if (
      file &&
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setSelectedImage(null);
      event.target.value = "";
      setError("Зөвхөн JPG, PNG, WebP зураг сонгоно уу.");
      return;
    }

    setSelectedImage(file);
  }

  async function handleImageUpload() {
    if (!selectedImage || uploadingImage || saving) return;

    setUploadingImage(true);
    setError("");
    setImageMessage("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const result = await adminApi<{ image_url: string }>(`/news/company/${news.id}/image`, { method: "PUT", body: formData });

      if (result.error !== null) {
        throw new Error(
          result.error ?? "Зураг солиход алдаа гарлаа."
        );
      }

      setCurrentImageUrl(result.data.image_url);
      setSelectedImage(null);
      setImageMessage("Зураг амжилттай солигдлоо.");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Зураг солиход алдаа гарлаа."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-[#E4EAF4] px-4 py-3 text-[13px] outline-none focus:border-brand-blue";

  const labelClass =
    "mb-2 block text-[12px] font-semibold text-brand-dark";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const form = new FormData(event.currentTarget);

      const payload = {
        title: String(form.get("title") ?? ""),
        summary: String(form.get("summary") ?? ""),
        content: String(form.get("content") ?? ""),
        category: String(form.get("category") ?? ""),
        status: String(form.get("status") ?? ""),
      };

      const result = await adminApi<{ id: string }>(`/news/company/${news.id}`, { method: "PUT", body: payload });

      if (result.error !== null) {
        throw new Error(
          result.error ?? "Мэдээ засахад алдаа гарлаа."
        );
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Мэдээ засахад алдаа гарлаа."
      );
    } finally {
      setSaving(false);
    }
  }

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
          defaultValue={news.title}
          maxLength={200}
          required
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
          defaultValue={news.summary ?? ""}
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
          defaultValue={news.category}
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
          defaultValue={news.content}
          required
          className={`${inputClass} leading-7`}
        />
      </div>

      
      <div>
        <label htmlFor="news-image" className={labelClass}>
          Мэдээний зураг
        </label>

        {currentImageUrl && !previewUrl && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt={news.title}
              className="max-h-[280px] w-full rounded-[12px] border border-[#E4EAF4] object-contain"
            />
            <p className="mt-2 text-[10px] text-[#657487]">
              Одоогийн зураг
            </p>
          </div>
        )}

        {previewUrl && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Шинэ зургийн урьдчилсан харагдац"
              className="max-h-[280px] w-full rounded-[12px] border border-[#E4EAF4] object-contain"
            />
            <p className="mt-2 text-[10px] text-[#657487]">
              Шинээр сонгосон зураг — хараахан хадгалагдаагүй
            </p>
          </div>
        )}

        <input
          id="news-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-[#EDF3FC] file:px-4 file:py-2 file:text-brand-blue`}
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={!selectedImage || uploadingImage || saving}
            className="rounded-[10px] bg-brand-orange px-5 py-3 text-[11px] font-semibold text-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadingImage ? "Зураг хадгалж байна..." : "Зураг солих"}
          </button>

          <span className="text-[10px] text-[#657487]">
            JPG, PNG, WebP · 5 MB хүртэл
          </span>
        </div>

        {imageMessage && (
          <p role="status" className="mt-3 text-[11px] text-green-700">
            {imageMessage}
          </p>
        )}
      </div>


      <div>
        <label htmlFor="status" className={labelClass}>
          Нийтлэлийн төлөв
        </label>

        <select
          id="status"
          name="status"
          defaultValue={news.status}
          className={inputClass}
        >
          <option value="draft">Ноорог</option>
          <option value="published">Нийтлэгдсэн</option>
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
          className="rounded-[10px] bg-brand-blue px-6 py-3 text-[12px] font-semibold text-white hover:bg-[#00266D] disabled:opacity-60"
        >
          {saving ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
        </button>
      </div>
    </form>
  );
}
