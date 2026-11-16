
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/api/client";

type Settings = {
  company_name: string;
  company_description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_badge_text: string | null;
  hero_card_label: string | null;
  hero_card_title: string | null;
  hero_card_description: string | null;
  hero_section_label: string | null;
  primary_color: string;
  secondary_color: string;
};

type Props = {
  initialSettings: Settings;
};

type FieldName = keyof Settings;

const fields: {
  name: FieldName;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    name: "company_name",
    label: "Байгууллагын нэр",
    placeholder: "Хөгжих Капитал ББСБ",
  },
  {
    name: "company_description",
    label: "Байгууллагын тайлбар",
    placeholder: "Байгууллагын товч танилцуулга",
    multiline: true,
  },
  {
    name: "phone",
    label: "Утасны дугаар",
    placeholder: "Утасны дугаар",
  },
  {
    name: "email",
    label: "Имэйл хаяг",
    placeholder: "info@example.mn",
  },
  {
    name: "address",
    label: "Байгууллагын хаяг",
    placeholder: "Байгууллагын хаяг",
    multiline: true,
  },
  {
    name: "facebook_url",
    label: "Facebook холбоос",
    placeholder: "https://facebook.com/...",
  },
  {
    name: "instagram_url",
    label: "Instagram холбоос",
    placeholder: "https://instagram.com/...",
  },
  {
    name: "hero_title",
    label: "Нүүр хуудасны гарчиг",
    placeholder: "Нүүр хуудасны үндсэн гарчиг",
    multiline: true,
  },
  {
    name: "hero_description",
    label: "Нүүр хуудасны тайлбар",
    placeholder: "Нүүр хуудасны үндсэн тайлбар",
    multiline: true,
  },
  {
  name: "hero_section_label",
    label: "Hero-ийн зүүн дээд жижиг гарчиг",
    placeholder: "Таны зорилго. Бидний шийдэл.",
  },
  {
    name: "hero_badge_text",
    label: "Hero зургийн дээд талын текст",
    placeholder: "Хөгжих Капитал",
  },
  {
    name: "hero_card_label",
    label: "Hero картын жижиг гарчиг",
    placeholder: "Санхүүгээс эхлэх боломж",
  },
  {
    name: "hero_card_title",
    label: "Hero картын үндсэн гарчиг",
    placeholder: "Таны дараагийн алхамд.",
    multiline: true,
  },
  {
    name: "hero_card_description",
    label: "Hero картын тайлбар",
    placeholder: "Таны хэрэгцээнд тохирсон санхүүжилт.",
    multiline: true,
  },
];

function validColor(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value)
    ? value
    : fallback;
}

function renderPreviewTitle(
  value: string,
  secondaryColor: string
) {
  return value
    .split(/(\[\[[\s\S]*?\]\])/g)
    .map((part, index) => {
      if (part.startsWith("[[") && part.endsWith("]]")) {
        return (
          <span
            key={index}
            style={{ color: secondaryColor }}
          >
            {part.slice(2, -2)}
          </span>
        );
      }

      return part;
    });
}

export default function SettingsForm({
  initialSettings,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<Settings>(
    initialSettings
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const primaryColor = validColor(
    form.primary_color,
    "#003189"
  );

  const secondaryColor = validColor(
    form.secondary_color,
    "#F4AC38"
  );

  const previewTitle =
    form.hero_title?.trim() ||
    "Санхүүгийн\n[[шийдэл.]]\nТаны хэмнэлээр.";

  const previewBadge =
    form.hero_badge_text?.trim() ||
    "Хөгжих Капитал";

  const previewCardLabel =
    form.hero_card_label?.trim() ||
    "Санхүүгээс эхлэх боломж";

  const previewCardTitle =
    form.hero_card_title?.trim() ||
    "Таны дараагийн алхамд.";

  const previewCardDescription =
    form.hero_card_description?.trim() ||
    "Таны хэрэгцээнд тохирсон санхүүжилт.";

  function updateField(
    name: FieldName,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const result = await adminApi<unknown>("/site-settings", { method: "PATCH", body: form });

      if (result.error !== null) {
        throw new Error(
          result.error ||
            "Тохиргоог хадгалахад алдаа гарлаа."
        );
      }

      setMessage(
        "Тохиргоо амжилттай хадгалагдлаа."
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Тодорхойгүй алдаа гарлаа."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-9"
    >
      {/* COMPANY INFORMATION */}
      <div>
        <h2 className="text-[18px] font-semibold text-[#003189]">
          Байгууллагын мэдээлэл
        </h2>

        <p className="mt-2 text-[12px] text-[#657487]">
          Байгууллагын үндсэн мэдээлэл болон
          холбоо барих мэдээллийг шинэчилнэ.
        </p>
      </div>

      {/* SETTINGS FIELDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={
              field.multiline
                ? "md:col-span-2"
                : ""
            }
          >
            <label
              htmlFor={field.name}
              className="mb-2 block text-[11px] font-semibold text-[#344054]"
            >
              {field.label}
            </label>

            {field.multiline ? (
              <textarea
                id={field.name}
                value={form[field.name] ?? ""}
                onChange={(event) =>
                  updateField(
                    field.name,
                    event.target.value
                  )
                }
                rows={
                  field.name === "hero_title"
                    ? 5
                    : 4
                }
                className="w-full rounded-[10px] border border-[#DCE4F0] bg-white px-4 py-3 text-[13px] text-[#0D1216] outline-none transition-colors focus:border-[#003189]"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                id={field.name}
                type={
                  field.name === "email"
                    ? "email"
                    : field.name.endsWith("_url")
                      ? "url"
                      : "text"
                }
                value={form[field.name] ?? ""}
                onChange={(event) =>
                  updateField(
                    field.name,
                    event.target.value
                  )
                }
                required={
                  field.name === "company_name"
                }
                className="w-full rounded-[10px] border border-[#DCE4F0] bg-white px-4 py-3 text-[13px] text-[#0D1216] outline-none transition-colors focus:border-[#003189]"
                placeholder={field.placeholder}
              />
            )}

            {/* HERO TITLE GUIDE */}
            {field.name === "hero_title" && (
              <>
                <div className="mt-3 rounded-[10px] border border-[#DCE4F0] bg-[#F7F9FC] p-4">
                  <p className="text-[12px] font-semibold text-[#003189]">
                    Гарчиг бичих заавар
                  </p>

                  <p className="mt-2 text-[12px] leading-6 text-[#657487]">
                    Өнгөөр онцлох үг эсвэл
                    өгүүлбэрээ{" "}
                    <code className="rounded bg-[#E4EAF4] px-1.5 py-1 font-mono text-[#003189]">
                      [[ ]]
                    </code>{" "}
                    тэмдэглэгээний дунд бичнэ.
                    Онцолсон хэсэг нь вебсайтын
                    туслах өнгөөр харагдана.
                  </p>

                  <div className="mt-3 rounded-[8px] border border-[#DCE4F0] bg-white p-3">
                    <p className="mb-2 text-[11px] font-semibold text-[#657487]">
                      Бичих жишээ
                    </p>

                    <pre className="whitespace-pre-wrap font-mono text-[12px] leading-6 text-[#344054]">
                      {"Санхүүгийн\n[[шийдэл.]]\nТаны хэмнэлээр."}
                    </pre>
                  </div>

                  <p className="mt-3 text-[11px] leading-5 text-[#657487]">
                    Enter дарж шинэ мөр үүсгэнэ.
                    [[ ]] тэмдэглэгээ хэрэглэгчийн
                    сайтад харагдахгүй.
                  </p>
                </div>

                {/* HERO TITLE LIVE PREVIEW */}
                <div className="mt-4 overflow-hidden rounded-[12px] border border-[#DCE4F0]">
                  <div className="border-b border-[#DCE4F0] bg-[#F7F9FC] px-4 py-3">
                    <p className="text-[12px] font-semibold text-[#344054]">
                      Гарчгийн шууд харагдац
                    </p>

                    <p className="mt-1 text-[11px] text-[#657487]">
                      Гарчиг болон өнгийг
                      өөрчлөхөд шууд шинэчлэгдэнэ.
                    </p>
                  </div>

                  <div
                    className="p-6 sm:p-8"
                    style={{
                      backgroundColor:
                        primaryColor,
                    }}
                  >
                    <h3 className="whitespace-pre-line break-words text-[30px] font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-[42px]">
                      {renderPreviewTitle(
                        previewTitle,
                        secondaryColor
                      )}
                    </h3>
                  </div>
                </div>
              </>
            )}

            {/* HERO CARD TEXT LIVE PREVIEW */}
            {field.name ===
              "hero_card_description" && (
              <div className="mt-4 overflow-hidden rounded-[12px] border border-[#DCE4F0]">
                <div className="border-b border-[#DCE4F0] bg-[#F7F9FC] px-4 py-3">
                  <p className="text-[12px] font-semibold text-[#344054]">
                    Hero картын шууд харагдац
                  </p>
                  <p className="mt-1 text-[11px] text-[#657487]">
                    Дээрх текстүүдийг өөрчлөхөд
                    энэ харагдац шинэчлэгдэнэ.
                  </p>
                </div>

                <div
                  className="p-5 sm:p-7"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                >
                  <div className="mb-5 flex justify-end">
                    <span
                      className="rounded-full border border-white/30 px-3 py-1.5 text-[11px] font-medium text-white"
                    >
                      {previewBadge}
                    </span>
                  </div>

                  <div className="rounded-[14px] bg-white p-5 shadow-lg">
                    <p
                      className="text-[11px] font-semibold"
                      style={{
                        color: primaryColor,
                      }}
                    >
                      {previewCardLabel}
                    </p>

                    <h3 className="mt-2 whitespace-pre-line text-[22px] font-semibold leading-tight text-[#0D1216]">
                      {previewCardTitle}
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-[12px] leading-6 text-[#657487]">
                      {previewCardDescription}
                    </p>

                    <div
                      className="mt-4 h-1 w-12 rounded-full"
                      style={{
                        backgroundColor:
                          secondaryColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* WEBSITE COLORS */}
      <div className="border-t border-[#E4EAF4] pt-8">
        <h2 className="text-[18px] font-semibold text-[#003189]">
          Вебсайтын өнгө
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {(
            [
              [
                "primary_color",
                "Үндсэн өнгө",
              ],
              [
                "secondary_color",
                "Туслах өнгө",
              ],
            ] as const
          ).map(([name, label]) => (
            <div key={name}>
              <label className="mb-2 block text-[11px] font-semibold text-[#344054]">
                {label}
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label={label}
                  value={
                    name === "primary_color"
                      ? primaryColor
                      : secondaryColor
                  }
                  onChange={(event) =>
                    updateField(
                      name,
                      event.target.value
                    )
                  }
                  className="h-11 w-14 cursor-pointer rounded-md border border-[#DCE4F0] bg-white p-1"
                />

                <input
                  type="text"
                  aria-label={`${label} HEX код`}
                  value={form[name]}
                  onChange={(event) =>
                    updateField(
                      name,
                      event.target.value
                    )
                  }
                  maxLength={7}
                  pattern="#[0-9a-fA-F]{6}"
                  className="w-full rounded-[10px] border border-[#DCE4F0] bg-white px-4 py-3 text-[13px] text-[#0D1216] outline-none focus:border-[#003189]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p
          role="alert"
          className="text-[12px] text-red-700"
        >
          {error}
        </p>
      )}

      {/* SUCCESS MESSAGE */}
      {message && (
        <p
          role="status"
          className="text-[12px] text-green-700"
        >
          {message}
        </p>
      )}

      {/* SAVE BUTTON */}
      <div className="flex justify-end border-t border-[#E4EAF4] pt-7">
        <button
          type="submit"
          disabled={saving}
          className="rounded-[10px] bg-[#003189] px-7 py-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#00266C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Хадгалж байна..."
            : "Өөрчлөлтийг хадгалах"}
        </button>
      </div>
    </form>
  );
}
