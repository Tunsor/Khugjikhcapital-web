
"use client";

import { useEffect } from "react";

type LegalConsentModalProps = {
  open: boolean;
  submitting: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  onTermsChange: (value: boolean) => void;
  onPrivacyChange: (value: boolean) => void;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function LegalConsentModal({
  open,
  submitting,
  termsAccepted,
  privacyAccepted,
  onTermsChange,
  onPrivacyChange,
  onClose,
  onConfirm,
}: LegalConsentModalProps) {
  useEffect(() => {
    if (!open) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [open]);

  if (!open) return null;

  const canSubmit =
    termsAccepted && privacyAccepted && !submitting;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D1216]/70 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#003189]">
              Хөгжих Капитал ББСБ
            </p>

            <h2
              id="legal-modal-title"
              className="text-xl font-bold text-[#0D1216] sm:text-2xl"
            >
              Нууцлалын бодлого ба зөвшөөрөл
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Зээлийн хүсэлт илгээхээс өмнө дараах
              мэдээлэлтэй танилцана уу.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Хаах"
            className="rounded-lg px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        {/* SCROLLABLE LONG TEXT */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <article className="space-y-6 text-sm leading-7 text-slate-700 sm:text-[15px]">
            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                1. Ерөнхий нөхцөл
              </h3>

              <p>
                Энэхүү нууцлалын бодлого нь Хөгжих
                Капитал ББСБ-ийн цахим хуудсаар
                дамжуулан зээлийн хүсэлт гаргаж буй
                хэрэглэгчийн хувийн мэдээллийг
                цуглуулах, ашиглах, хадгалах,
                хамгаалахтай холбоотой ерөнхий
                нөхцөлийг тайлбарлана.
              </p>

              <p className="mt-3">
                Хэрэглэгч нь зээлийн хүсэлтийн
                маягтад мэдээллээ оруулж,
                хүсэлт илгээхээс өмнө энэхүү
                бодлоготой танилцах боломжтой.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                2. Цуглуулах мэдээлэл
              </h3>

              <p>
                Зээлийн хүсэлтийг хүлээн авах,
                боловсруулах зорилгоор хэрэглэгчийн
                овог, нэр, утасны дугаар, зээлийн
                бүтээгдэхүүний сонголт, хүссэн
                зээлийн хэмжээ, хугацаа болон
                хүсэлтийн маягтад оруулсан бусад
                мэдээллийг хүлээн авч болно.
              </p>

              <p className="mt-3">
                Тухайн зээлийн бүтээгдэхүүний
                шаардлагаас хамааран хэрэглэгчийн
                хавсаргасан баримт бичиг,
                тодорхойлолт болон холбогдох
                нэмэлт мэдээллийг мөн хүлээн
                авч болно.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                3. Мэдээлэл боловсруулах зорилго
              </h3>

              <p>
                Хэрэглэгчээс ирүүлсэн мэдээллийг
                зээлийн хүсэлтийг бүртгэх,
                шаардлагатай баримт бичгийн
                бүрдлийг шалгах, хүсэлтийг
                үнэлэх, хэрэглэгчтэй холбогдох
                болон хүсэлтийн явц, шийдвэрийн
                талаар мэдэгдэх зорилгоор
                боловсруулна.
              </p>

              <p className="mt-3">
                Цахим хуудсаар хүсэлт илгээсэн
                нь зээл олгох шийдвэр гарсан
                эсвэл зээлийн гэрээ байгуулагдсан
                гэсэн үг биш юм.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                4. Мэдээллийн нууцлал, хамгаалалт
              </h3>

              <p>
                Байгууллага нь хэрэглэгчийн
                мэдээлэлд зөвшөөрөлгүй хандах,
                ашиглах, өөрчлөх, задруулах
                эрсдэлийг бууруулах зорилгоор
                зохих зохион байгуулалтын болон
                техникийн хамгаалалтын арга
                хэмжээ авахыг зорьж ажиллана.
              </p>

              <p className="mt-3">
                Хэрэглэгчийн мэдээлэлд хандах
                эрхийг ажил үүргийн шаардлагатай
                уялдуулан хязгаарлах бөгөөд
                мэдээллийг холбогдох хууль
                тогтоомжийн дагуу боловсруулна.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                5. Мэдээллийг бусдад дамжуулах
              </h3>

              <p>
                Хэрэглэгчийн мэдээллийг зээлийн
                хүсэлтийг боловсруулахад хууль
                ёсоор шаардлагатай тохиолдолд
                болон хууль тогтоомжид заасан
                үндэслэл, журмын дагуу эрх бүхий
                байгууллагад гаргаж өгч болно.
              </p>

              <p className="mt-3">
                Мэдээллийг гуравдагч этгээдэд
                дамжуулах тохиолдолд тухайн
                мэдээлэл боловсруулах зорилго,
                хууль зүйн үндэслэл болон
                хэрэглэгчийн эрхийг харгалзана.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                6. Мэдээлэл хадгалах
              </h3>

              <p>
                Хэрэглэгчийн мэдээллийг зээлийн
                хүсэлт боловсруулах зорилго,
                байгууллагын холбогдох журам
                болон хууль тогтоомжид нийцсэн
                хугацаанд хадгална.
              </p>

              <p className="mt-3">
                Мэдээлэл хадгалах шаардлага
                дууссан тохиолдолд холбогдох
                журам, хууль тогтоомжийн дагуу
                устгах, эсвэл таних боломжгүй
                болгох арга хэмжээ авна.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                7. Хэрэглэгчийн эрх
              </h3>

              <p>
                Хэрэглэгч нь өөрийн хувийн
                мэдээллийг боловсруулахтай
                холбоотой мэдээлэл авах,
                хуульд заасан нөхцөлөөр
                мэдээллээ залруулах, зөвшөөрлөө
                буцаах болон холбогдох бусад
                эрхээ хэрэгжүүлэх боломжтой.
              </p>

              <p className="mt-3">
                Эдгээр хүсэлтийг байгууллагын
                албан ёсны холбоо барих
                сувгаар гаргаж болно.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-[#003189]">
                8. Хэрэглэгчийн баталгаажуулалт
              </h3>

              <p>
                Хэрэглэгч нь зээлийн хүсэлтийн
                маягтад оруулсан мэдээлэл
                үнэн зөв, өөрийн мэдэлд байгаа
                бөгөөд хүсэлт боловсруулах
                зорилгоор мэдээллээ ашиглуулах
                нөхцөлтэй танилцсан болохоо
                баталгаажуулна.
              </p>

              <p className="mt-3">
                Нууцлалын бодлого болон
                үйлчилгээний нөхцөлийг
                зөвшөөрснөөр хэрэглэгч
                зээлийн хүсэлтээ байгууллагад
                цахимаар илгээх боломжтой болно.
              </p>
            </section>        

            {/* ҮЙЛЧИЛГЭЭНИЙ НӨХЦӨЛ */}
            <div className="mt-10 border-t-2 border-[#003189] pt-8">
  <h2 className="mb-6 text-xl font-bold text-[#003189] sm:text-2xl">
    ҮЙЛЧИЛГЭЭНИЙ НӨХЦӨЛ
  </h2>

  <section className="mb-6">
    <h3 className="mb-2 text-base font-bold text-[#003189]">
      1. Ерөнхий нөхцөл
    </h3>
    <p>
      Энэхүү үйлчилгээний нөхцөл нь Хөгжих Капитал ББСБ-ийн
      цахим хуудсаар дамжуулан зээлийн бүтээгдэхүүний мэдээлэл
      авах, зээлийн хүсэлт гаргах, холбогдох баримт бичиг
      илгээхтэй холбоотой хэрэглэгч болон байгууллагын
      хооронд үүсэх харилцааны ерөнхий нөхцөлийг тодорхойлно.
    </p>
    <p className="mt-3">
      Цахим хуудсаар зээлийн хүсэлт илгээсэн нь тухайн
      хүсэлтийг байгууллага зөвшөөрсөн, зээл олгох шийдвэр
      гаргасан, эсвэл зээлийн гэрээ байгуулагдсан гэсэн
      үг биш болно.
    </p>
  </section>

  <section className="mb-6">
    <h3 className="mb-2 text-base font-bold text-[#003189]">
      2. Зээлийн хүсэлт гаргах
    </h3>
    <p>
      Хэрэглэгч нь цахим хуудсанд байршуулсан зээлийн
      бүтээгдэхүүнүүдээс өөрийн хэрэгцээнд тохирох
      бүтээгдэхүүнийг сонгож, хүсэлтийн маягтад
      шаардлагатай мэдээллийг үнэн зөв, бүрэн бөглөнө.
    </p>
    <p className="mt-3">
      Зээлийн хүсэлт гаргахад шаардлагатай баримт
      бичгийг тухайн бүтээгдэхүүний шаардлагын дагуу
      хавсарган илгээнэ. Мэдээлэл дутуу, буруу эсвэл
      шаардлагатай баримт бичиг бүрдээгүй тохиолдолд
      хүсэлтийг шийдвэрлэх ажиллагаа хойшилж болно.
    </p>
  </section>

  <section className="mb-6">
    <h3 className="mb-2 text-base font-bold text-[#003189]">
      3. Хэрэглэгчийн эрх, үүрэг
    </h3>
    <p>
      Хэрэглэгч нь зээлийн бүтээгдэхүүний нөхцөл,
      хүү, хугацаа, холбогдох шимтгэл болон бусад
      мэдээлэлтэй танилцах, хүсэлтийн явцын талаар
      мэдээлэл авах эрхтэй.
    </p>
    <p className="mt-3">
      Хэрэглэгч нь өөрийн оруулсан мэдээллийн
      үнэн зөв байдлыг хариуцах, шаардлагатай
      нэмэлт мэдээллийг хуульд нийцүүлэн гаргаж өгөх,
      бусдын хувийн мэдээллийг зөвшөөрөлгүй
      ашиглахгүй байх үүрэгтэй.
    </p>
  </section>

  <section className="mb-6">
    <h3 className="mb-2 text-base font-bold text-[#003189]">
      4. Байгууллагын эрх, үүрэг
    </h3>
    <p>
      Хөгжих Капитал ББСБ нь ирүүлсэн зээлийн
      хүсэлтийг холбогдох хууль тогтоомж,
      дотоод журам болон зээлийн бүтээгдэхүүний
      шаардлагын хүрээнд шалгаж, үнэлнэ.
    </p>
    <p className="mt-3">
      Байгууллага нь хүсэлтийг үнэлэхэд
      шаардлагатай нэмэлт мэдээлэл, баримт
      бичгийг хүсэх, холбогдох шалгуурын
      дагуу зээл олгох эсэхийг шийдвэрлэх
      эрхтэй.
    </p>
  </section>

  <section className="mb-6">
    <h3 className="mb-2 text-base font-bold text-[#003189]">
      5. Зээлийн нөхцөл ба шийдвэр
    </h3>
    <p>
      Цахим хуудсанд байршуулсан зээлийн
      бүтээгдэхүүний мэдээлэл нь хэрэглэгчид
      урьдчилсан мэдээлэл өгөх зориулалттай.
      Зээлийн эцсийн хэмжээ, хугацаа, хүү,
      шимтгэл болон бусад нөхцөлийг холбогдох
      үнэлгээ, шийдвэр, гэрээгээр тодорхойлно.
    </p>
    <p className="mt-3">
      Зээлийн хүсэлт хүлээн авсан нь зээл
      олгох баталгаа болохгүй. Зээлийн
      харилцаа нь талууд холбогдох гэрээг
      зохих журмын дагуу байгуулснаар үүснэ.
    </p>
  </section>

  <section className="mb-6">
    <h3 className="mb-2 text-base font-bold text-[#003189]">
      6. Хариуцлага
    </h3>
    <p>
      Хэрэглэгч нь хүсэлтийн маягтад оруулсан
      мэдээлэл болон хавсаргасан баримт бичгийн
      үнэн зөв байдлыг хариуцна.
    </p>
    <p className="mt-3">
      Цахим системийн ажиллагаанд техникийн
      саатал үүссэн тохиолдолд хүсэлт илгээх,
      хүлээн авах ажиллагаа түр хугацаагаар
      хязгаарлагдаж болно. Талуудын хариуцлагыг
      холбогдох хууль тогтоомж болон
      байгуулагдсан гэрээний нөхцөлөөр
      тодорхойлно.
    </p>
  </section>

  <section>
    <h3 className="mb-2 text-base font-bold text-[#003189]">
      7. Нөхцөлтэй танилцах, зөвшөөрөх
    </h3>
    <p>
      Хэрэглэгч нь энэхүү үйлчилгээний
      нөхцөл болон нууцлалын бодлоготой
      танилцсаны дараа тус бүрийг
      зөвшөөрч, зээлийн хүсэлтээ
      цахимаар илгээнэ.
    </p>
    <p className="mt-3">
      Хэрэглэгчийн хувийн мэдээлэл
      боловсруулахтай холбоотой асуудлыг
      нууцлалын бодлого болон холбогдох
      хууль тогтоомжийн дагуу зохицуулна.
    </p>
               </section>
            </div>

          </article>
        </div>

        {/* CONSENT + ACTIONS */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-5 sm:px-8">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) =>
                  onPrivacyChange(e.target.checked)
                }
                disabled={submitting}
                className="mt-1 h-4 w-4 accent-[#003189]"
              />

              <span className="text-sm leading-6 text-slate-700">
                Би{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#003189] underline"
                >
                  нууцлалын бодлого
                </a>
                -той танилцаж, зээлийн хүсэлт
                боловсруулах зорилгоор хувийн
                мэдээллээ ашиглуулахыг зөвшөөрч байна.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) =>
                  onTermsChange(e.target.checked)
                }
                disabled={submitting}
                className="mt-1 h-4 w-4 accent-[#003189]"
              />

              <span className="text-sm leading-6 text-slate-700">
                Би{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#003189] underline"
                >
                  үйлчилгээний нөхцөл
                </a>
                -тэй танилцаж, зөвшөөрч байна.
              </span>
            </label>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Буцах
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={!canSubmit}
              className="rounded-xl bg-[#003189] px-6 py-3 font-semibold text-white transition hover:bg-[#00266B] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting
                ? "Хүсэлт илгээж байна..."
                : "Зөвшөөрч, хүсэлт илгээх"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
