
import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { connection } from "next/server";

export const metadata = {
  title: "Нууцлалын бодлого | Хөгжих Капитал ББСБ",
  description:
    "Хөгжих Капитал ББСБ-ийн хувийн мэдээлэл цуглуулах, боловсруулах, хамгаалахтай холбоотой нууцлалын бодлого.",
};

const sections = [
  {
    id: "introduction",
    title: "1. Нийтлэг үндэслэл",
    paragraphs: [
      "Энэхүү Нууцлалын бодлого нь “Хөгжих Капитал ББСБ” ХХК-ийн вебсайтаар дамжуулан харилцагчийн мэдээллийг цуглуулах, ашиглах, хадгалах, хамгаалахтай холбоотой зарчмыг тайлбарлана.",
      "Бид Монгол Улсын Хүний хувийн мэдээлэл хамгаалах тухай хууль болон холбогдох хууль тогтоомжийн шаардлагыг мөрдөж, мэдээллийг зөвшөөрөгдсөн зорилго, эрх зүйн үндэслэлийн хүрээнд боловсруулахыг зорьдог.",
    ],
  },
  {
    id: "information",
    title: "2. Ямар мэдээлэл цуглуулах вэ?",
    paragraphs: [
      "Харилцагч зээлийн хүсэлт илгээх үед дараах мэдээллийг цуглуулж болно:",
    ],
    bullets: [
      "Овог, нэр",
      "Регистрийн дугаар",
      "Холбоо барих утасны дугаар",
      "Сонгосон зээлийн бүтээгдэхүүн, хүссэн дүн, хугацаа",
      "Орлогын мэдээлэл",
      "Хүсэлтэд хавсаргасан баримт бичиг",
      "Харилцагчийн өөрийн хүсэлтээр оруулсан нэмэлт тайлбар",
      "Вебсайтын ажиллагаа, аюулгүй байдалтай холбоотой техникийн мэдээлэл",
    ],
  },
  {
    id: "purpose",
    title: "3. Мэдээлэл боловсруулах зорилго",
    paragraphs: [
      "Цуглуулсан мэдээллийг зөвхөн тодорхой, хууль ёсны зорилгын хүрээнд боловсруулна.",
    ],
    bullets: [
      "Зээлийн хүсэлтийг хүлээн авах, бүртгэх, хянах",
      "Хүсэлт гаргагчтай холбогдох",
      "Зээлийн бүтээгдэхүүн, үйлчилгээний талаар мэдээлэл өгөх",
      "Хүсэлтэд хавсаргасан баримт бичгийг шалгах",
      "Хууль тогтоомжид заасан үүргийг биелүүлэх",
      "Системийн аюулгүй байдлыг хангах, зүй бус ашиглалтаас сэргийлэх",
    ],
  },
  {
    id: "legal-basis",
    title: "4. Мэдээлэл боловсруулах эрх зүйн үндэслэл",
    paragraphs: [
      "Хувийн мэдээллийг холбогдох хууль тогтоомжид заасан эрх зүйн үндэслэл болон шаардлагатай тохиолдолд мэдээллийн эзний зөвшөөрөлд тулгуурлан боловсруулна.",
      "Зөвшөөрөл шаардлагатай тохиолдолд мэдээлэл боловсруулах зорилго, хамрах хүрээ болон бусад шаардлагатай мэдээллийг танилцуулсны дараа зөвшөөрөл авна.",
    ],
  },
  {
    id: "storage",
    title: "5. Мэдээлэл хадгалах, хамгаалах",
    paragraphs: [
      "Мэдээллийг зөвшөөрөлгүй хандалт, өөрчлөлт, алдагдал, задралаас хамгаалахад чиглэсэн техникийн болон зохион байгуулалтын арга хэмжээ авна.",
      "Вебсайтын өгөгдлийн сан, хэрэглэгчийн нэвтрэлт, файл хадгалалтын үйлчилгээнд Supabase платформ ашиглаж байгаа бөгөөд сервер талын эрхийн шалгалт, өгөгдлийн сангийн хандалтын хяналт болон хувийн файл хадгалалтын механизмыг хэрэгжүүлсэн.",
      "Мэдээлэл хадгалах бодит хугацааг мэдээллийн төрөл, боловсруулах зорилго, хуульд заасан шаардлага болон байгууллагын батлагдсан журмаар тодорхойлно. Хугацаа дууссан мэдээллийг холбогдох журмын дагуу устгах буюу таних боломжгүй болгоно.",
    ],
  },
  {
    id: "sharing",
    title: "6. Гуравдагч этгээдэд мэдээлэл дамжуулах",
    paragraphs: [
      "Бид хувийн мэдээллийг хуульд заасан үндэслэл, мэдээллийн эзний хүчинтэй зөвшөөрөл эсвэл үйлчилгээ үзүүлэхэд шаардлагатай, хуульд нийцсэн нөхцөлөөс бусад тохиолдолд гуравдагч этгээдэд задруулахгүй.",
      "Мэдээлэл боловсруулахад оролцож буй технологийн үйлчилгээ үзүүлэгчидтэй харилцахдаа мэдээллийн нууцлал, хамгаалалт болон холбогдох хууль тогтоомжийн шаардлагыг харгалзан үзнэ.",
      "Мэдээлэл гадаад улсад дамжуулах эсэх, дамжуулж байгаа тохиолдолд түүний эрх зүйн үндэслэл болон хамгаалалтын нөхцөлийг байгууллагын бодит үйлчилгээний тохиргоонд үндэслэн тусад нь баталгаажуулна.",
    ],
  },
  {
    id: "rights",
    title: "7. Мэдээллийн эзний эрх",
    paragraphs: [
      "Харилцагч нь холбогдох хууль тогтоомжийн хүрээнд өөрийн мэдээлэлтэй холбоотой хүсэлт гаргах эрхтэй.",
    ],
    bullets: [
      "Өөрийн мэдээллийг боловсруулж байгаа эсэх талаар мэдээлэл авах",
      "Хуульд заасан нөхцөлөөр мэдээлэлтэйгээ танилцах",
      "Буруу, дутуу мэдээллийг залруулах хүсэлт гаргах",
      "Хуульд заасан нөхцөлөөр мэдээлэл устгуулах хүсэлт гаргах",
      "Зөвшөөрөлд үндэслэсэн боловсруулалтын зөвшөөрлөө буцаах",
      "Мэдээллийн боловсруулалттай холбоотой гомдол гаргах",
    ],
  },
  {
    id: "cookies",
    title: "8. Cookie болон техникийн мэдээлэл",
    paragraphs: [
      "Вебсайт нь хэрэглэгчийн нэвтрэлт, аюулгүй байдал болон үндсэн ажиллагаанд шаардлагатай cookie болон түүнтэй төстэй технологи ашиглаж болно.",
      "Зээлийн хүсэлтийн автомат илгээлтээс хамгаалахад Cloudflare Turnstile үйлчилгээ ашиглаж байгаа. Гуравдагч этгээдийн аналитик, маркетингийн cookie нэвтрүүлэх тохиолдолд энэхүү бодлогыг шинэчилж, шаардлагатай зөвшөөрлийн механизмыг хэрэгжүүлнэ.",
    ],
  },
  {
    id: "changes",
    title: "9. Бодлогын өөрчлөлт",
    paragraphs: [
      "Байгууллага нь хууль тогтоомж, үйлчилгээ болон мэдээлэл боловсруулах үйл ажиллагаанд өөрчлөлт орсон тохиолдолд энэхүү бодлогыг шинэчилж болно.",
      "Шинэчилсэн хувилбар болон хүчин төгөлдөр мөрдөж эхлэх огноог энэ хуудсанд нийтэлнэ.",
    ],
  },
  {
    id: "contact",
    title: "10. Холбоо барих",
    paragraphs: [
      "Хувийн мэдээлэл боловсруулахтай холбоотой асуулт, хүсэлт, гомдлыг дараах сувгаар ирүүлж болно.",
    ],
  },
];

    export const instant = false;

    export default async function PrivacyPage() {
    await connection();

    return (
        <>
        <SiteHeader />

      <main className="bg-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-white/10" />

          <div className="container-main relative py-20 md:py-28">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#F4AC38]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4AC38]">
                Privacy Policy
              </p>
            </div>

            <h1 className="mt-7 text-[40px] font-semibold leading-tight tracking-[-0.04em] md:text-[60px]">
              Нууцлалын
              <br />
              <span className="text-[#F4AC38]">бодлого.</span>
            </h1>

            <p className="mt-6 max-w-[620px] text-[13px] leading-8 text-white/75">
              Бид таны хувийн мэдээллийг хүндэтгэж,
              мэдээллийн нууцлал, аюулгүй байдлыг хангахыг
              үйл ажиллагааныхаа чухал зарчим гэж үздэг.
            </p>

            <p className="mt-6 text-[11px] text-white/60">
              Хүчин төгөлдөр болох огноо: Байгууллага батална
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 lg:py-24">
          <div className="container-main">
            <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
              {/* TABLE OF CONTENTS */}
              <aside className="hidden lg:block">
                <nav
                  aria-label="Нууцлалын бодлогын агуулга"
                  className="sticky top-28 rounded-[17px] border border-[#E4EAF4] bg-[#F8FAFD] p-6"
                >
                  <p className="mb-5 text-[12px] font-semibold text-[#003189]">
                    Агуулга
                  </p>

                  <div className="space-y-3">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block text-[11px] leading-5 text-[#657487] transition-colors hover:text-[#003189]"
                      >
                        {section.title}
                      </a>
                    ))}
                  </div>
                </nav>
              </aside>

              {/* POLICY TEXT */}
              <div className="min-w-0">
                <div className="mb-10 rounded-[17px] border-l-4 border-[#F4AC38] bg-[#F8FAFD] p-6">
                  <p className="text-[12px] leading-7 text-[#657487]">
                    Энэхүү бодлого нь вебсайтаар дамжуулан
                    цуглуулах мэдээлэлд хамаарна.
                    Зээлийн гэрээ болон бусад үйлчилгээний
                    тусгай нөхцөл тусдаа зохицуулалттай байж болно.
                  </p>
                </div>

                <div className="space-y-12">
                  {sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-28 border-b border-[#E4EAF4] pb-10 last:border-0"
                    >
                      <h2 className="text-[23px] font-semibold tracking-[-0.025em] text-[#0D1216] md:text-[27px]">
                        {section.title}
                      </h2>

                      <div className="mt-5 space-y-4">
                        {section.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-[13px] leading-8 text-[#657487]"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {"bullets" in section && section.bullets && (
                        <ul className="mt-5 list-disc space-y-3 pl-6 marker:text-[#F4AC38]">
                          {section.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="text-[13px] leading-7 text-[#657487]"
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.id === "contact" && (
                        <div className="mt-6 rounded-[17px] border border-[#E4EAF4] bg-[#F8FAFD] p-6">
                          <p className="font-semibold text-[#003189]">
                            Хөгжих Капитал ББСБ ХХК
                          </p>
                          <p className="mt-3 text-[12px] text-[#657487]">
                            Утас: 7588-8585
                          </p>
                          <p className="mt-2 text-[12px] text-[#657487]">
                            Имэйл: info@khugjikhcapital.mn
                          </p>
                        </div>
                      )}
                    </section>
                  ))}
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  <Link
                    href="/terms"
                    className="inline-flex min-h-[48px] items-center rounded-[10px] bg-[#003189] px-6 text-[12px] font-semibold text-white transition-colors hover:bg-[#00266C]"
                  >
                    Үйлчилгээний нөхцөл →
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex min-h-[48px] items-center rounded-[10px] border border-[#E4EAF4] px-6 text-[12px] font-semibold text-[#003189] hover:bg-[#F8FAFD]"
                  >
                    Нүүр хуудас
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
