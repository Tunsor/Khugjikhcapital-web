
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/client";

type Props = {
  initialImageUrl?: string | null;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export default function HeroImageUpload({
  initialImageUrl,
}: Props) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(
    initialImageUrl || "/images/hero-building.jpg"
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Зөвхөн PNG, JPG, WebP зураг сонгоно уу.");
      setFile(null);
      event.target.value = "";
      return;
    }

    if (
      selectedFile.size === 0 ||
      selectedFile.size > MAX_FILE_SIZE
    ) {
      setError("Зургийн хэмжээ 5 MB-аас ихгүй байна.");
      setFile(null);
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file || uploading) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await adminApi<{ hero_image_url: string }>("/site-settings/hero-image", { method: "POST", body: formData });

      if (result.error !== null) {
        throw new Error(
          result.error || "Hero зураг хадгалахад алдаа гарлаа."
        );
      }

      setCurrentImageUrl(result.data.hero_image_url);
      setFile(null);
      setMessage("Hero зураг амжилттай хадгалагдлаа.");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Тодорхойгүй алдаа гарлаа."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[14px] border border-[#DCE4F0] bg-white p-5">
      <div>
        <h3 className="text-[15px] font-semibold text-[#003189]">
          Нүүр хуудасны Hero зураг
        </h3>

        <p className="mt-2 text-[12px] leading-5 text-[#657487]">
          Нүүр хуудасны үндсэн зургийг солих боломжтой.
          JPG, PNG, WebP форматтай, 5 MB-аас бага зураг оруулна.
        </p>
      </div>

      <div className="relative aspect-[16/10] w-full max-w-[600px] overflow-hidden rounded-[12px] border border-[#DCE4F0] bg-[#F7F9FC]">
        <Image
          src={previewUrl || currentImageUrl}
          alt="Hero зургийн урьдчилсан харагдац"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
        />
      </div>

      <div className="space-y-3">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-label="Hero зураг сонгох"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full max-w-[600px] rounded-[10px] border border-[#DCE4F0] bg-white p-3 text-[12px] text-[#344054] file:mr-4 file:rounded-md file:border-0 file:bg-[#EDF3FC] file:px-4 file:py-2 file:font-semibold file:text-[#003189]"
        />

        {file && (
          <p className="text-[11px] text-[#657487]">
            Сонгосон зураг: {file.name}
          </p>
        )}

        {error && (
          <p role="alert" className="text-[12px] text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="text-[12px] text-green-700">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="rounded-[10px] bg-[#003189] px-6 py-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#00266C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Зураг хадгалж байна..." : "Hero зураг хадгалах"}
        </button>
      </div>
    </div>
  );
}
