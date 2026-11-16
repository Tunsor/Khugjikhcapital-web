
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/client";

type LogoUploadProps = {
  initialLogoUrl: string | null;
};

export default function LogoUpload({
  initialLogoUrl,
}: LogoUploadProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialLogoUrl
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(initialLogoUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, initialLogoUrl]);

  async function handleUpload() {
    if (!file || uploading) return;

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await adminApi<{ logo_url: string }>("/site-settings/logo", { method: "POST", body: formData });

      if (result.error !== null) {
        throw new Error(
          result.error || "Лого оруулахад алдаа гарлаа."
        );
      }

      setFile(null);
      setPreview(result.data.logo_url);
      setMessage("Лого амжилттай шинэчлэгдлээ.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Алдаа гарлаа."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-[22px] border border-[#E4EAF4] bg-white p-6 sm:p-8">
      <h2 className="text-[18px] font-semibold text-[#003189]">
        Байгууллагын лого
      </h2>

      <p className="mt-2 text-[12px] text-[#657487]">
        PNG, JPG эсвэл WebP зураг оруулна. Дээд хэмжээ 5 MB.
      </p>

      <div className="mt-6 flex min-h-[130px] items-center justify-center rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFD] p-5">
        {preview ? (
          <Image
            src={preview}
            alt="Байгууллагын лого"
            width={260}
            height={100}
            unoptimized
            className="h-auto max-h-[110px] w-auto max-w-full object-contain"
          />
        ) : (
          <span className="text-[12px] text-[#657487]">
            Одоогоор лого оруулаагүй байна.
          </span>
        )}
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={uploading}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0] ?? null;

          setMessage("");
          setError("");

          if (
            selectedFile &&
            (selectedFile.size > 5 * 1024 * 1024 ||
              ![
                "image/png",
                "image/jpeg",
                "image/webp",
              ].includes(selectedFile.type))
          ) {
            setFile(null);
            setError("PNG, JPG, WebP төрлийн 5 MB-аас бага зураг сонгоно уу.");
            event.target.value = "";
            return;
          }

          setFile(selectedFile);
        }}
        className="mt-5 block w-full text-[12px] text-[#31415B] file:mr-4 file:rounded-[9px] file:border-0 file:bg-[#EDF3FC] file:px-4 file:py-3 file:font-semibold file:text-[#003189] hover:file:bg-[#E4EAF4]"
      />

      {error && (
        <p className="mt-4 text-[12px] text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-4 text-[12px] text-green-700">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-5 rounded-[10px] bg-[#003189] px-6 py-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#00266C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Лого хадгалж байна..." : "Лого хадгалах"}
      </button>
    </div>
  );
}
