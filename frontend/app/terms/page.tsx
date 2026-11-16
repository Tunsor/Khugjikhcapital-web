import Link from "next/link";
import { connection } from "next/server";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Үйлчилгээний нөхцөл | Хөгжих Капитал ББСБ",
  description:
    "Хөгжих Капитал ББСБ-ийн вебсайтын үйлчилгээний нөхцөл, зээлийн хүсэлт илгээх журам.",
};

const sections = [
  {
    id: "general",
    title: "1. Нийтлэг үндэслэл",
    paragraphs: [
      "Энэхүү Үйлчилгээний нөхцөл нь “Хөгжих Капитал ББСБ” ХХК-ийн вебсайтаар мэдээлэл авах, зээлийн бүтээгдэхүүнтэй танилцах, зээлийн тооцоолуур ашиглах, зээлийн хүсэлт илгээхтэй холбоотой харилцаанд хамаарна.",
      "Вебсайтыг ашиглахдаа хэрэглэгч холбогдох хууль тогтоомж болон энэхүү нөхцөлд заасан шаардлагыг дагаж мөрдөнө.",
    ],
  },
  {
    id: "services",
    title: "2. Вебсайтаар үзүүлэх үйлчилгээ",
    paragraphs: [
      "Вебсайт нь байгууллагын мэдээлэл, зээлийн бүтээгдэхүүний танилцуулга болон цахим хүсэлт илгээх боломжийг олгоно.",
    ],
    bullets: [
      "Байгууллагын танилцуулга, холбоо барих мэдээлэл авах",
      "Зээлийн бүтээгдэхүүн, нөхцөлтэй танилцах",
      "Зээлийн тооцоолуур ашиглах",
      "Зээлийн хүсэлт цахимаар илгээх",
      "Шаардлагатай баримт бичиг хавсаргах",
      "Байгууллагын мэдээ, мэдээлэлтэй танилцах",
    ],
  },
  {
    id: "applications",
    title: "3. Зээлийн хүсэлт илгээх",
    paragraphs: [
      "Хэрэглэгч зээлийн хүсэлт гаргахдаа үнэн зөв, бүрэн мэдээлэл өгөх үүрэгтэй.",
      "Цахимаар зээлийн хүсэлт илгээсэн нь тухайн хүсэлтийг байгууллага хүлээн авч бүртгэсэн үйлдэл бөгөөд зээл олгох баталгаа, зээлийн гэрээ байгуулсан үйлдэлд тооцогдохгүй.",
      "Байгууллага хүсэлтийг холбогдох журам, шаардлага болон эрсдэлийн үнэлгээний хүрээнд хянан шийдвэрлэнэ. Шаардлагатай тохиолдолд нэмэлт мэдээлэл, баримт бичиг хүсэж болно.",
    ],
  },
  {
    id: "calculator",
    title: "4. Зээлийн тооцоолуур",
    paragraphs: [
      "Вебсайтад байршуулсан зээлийн тооцоолуур нь хэрэглэгчид зээлийн төлбөрийн жишиг тооцоолол хийхэд зориулсан мэдээллийн хэрэгсэл юм.",
      "Тооцоолуурын үр дүн нь зээлийн эцсийн санал, батлагдсан нөхцөл эсвэл гэрээний үүрэг биш.",
      "Бодит зээлийн хүү, хугацаа, шимтгэл, бусад төлбөр болон эргэн төлөлтийн хуваарийг тухайн бүтээгдэхүүний батлагдсан нөхцөл, холбогдох гэрээгээр тодорхойлно.",
    ],
  },
  {
    id: "responsibilities",
    title: "5. Хэрэглэгчийн үүрэг",
    paragraphs: [
      "Хэрэглэгч вебсайтыг хууль ёсны зорилгоор ашиглах бөгөөд дараах шаардлагыг мөрдөнө.",
    ],
    bullets: [
      "Үнэн зөв, өөрт хамаарах мэдээлэл илгээх",
      "Бусдын хувийн мэдээллийг эрх зүйн үндэслэлгүйгээр ашиглахгүй байх",
      "Хуурамч, төөрөгдүүлсэн баримт бичиг илгээхгүй байх",
      "Системийн хэвийн ажиллагаанд санаатайгаар саад учруулахгүй байх",
      "Зөвшөөрөлгүй хандалт, мэдээлэл авах оролдлого хийхгүй байх",
    ],
  },
  {
    id: "security",
    title: "6. Мэдээллийн аюулгүй байдал",
    paragraphs: [
      "Байгууллага вебсайтаар дамжуулан хүлээн авсан мэдээллийг хамгаалахад чиглэсэн техникийн болон зохион байгуулалтын арга хэмжээ авна.",
      "Хувийн мэдээллийг цуглуулах, боловсруулах, хадгалахтай холбоотой дэлгэрэнгүй нөхцөлийг Нууцлалын бодлогод тусгасан.",
      "Хэрэглэгч өөрийн төхөөрөмж, нэвтрэх мэдээлэл болон ашиглаж буй сүлжээний аюулгүй байдалд анхаарах шаардлагатай.",
    ],
  },
  {
    id: "availability",
    title: "7. Вебсайтын хүртээмж",
    paragraphs: [
      "Байгууллага вебсайтын хэвийн ажиллагааг хангахыг зорих боловч системийн шинэчлэлт, засвар үйлчилгээ, сүлжээний доголдол болон бусад техникийн нөхцөлөөс шалтгаалан үйлчилгээ түр хугацаанд тасалдаж болно.",
      "Үйлчилгээний тасалдал, техникийн алдаанаас үүссэн асуудлыг холбогдох хууль тогтоомж болон талуудын эрх, үүргийн хүрээнд шийдвэрлэнэ.",
    ],
  },
  {
    id: "content",
    title: "8. Вебсайтын агуулга",
    paragraphs: [
      "Вебсайтад байршуулсан байгууллагын нэр, лого, дизайн, текст, зураг болон бусад агуулгыг холбогдох оюуны өмчийн эрх, хууль тогтоомжийн хүрээнд хамгаална.",
      "Хуульд зөвшөөрснөөс бусад тохиолдолд агуулгыг эрх эзэмшигчийн зөвшөөрөлгүйгээр арилжааны зорилгоор хуулбарлах, өөрчлөх, түгээхийг хориглоно.",
    ],
  },
  {
    id: "changes",
    title: "9. Үйлчилгээний нөхцөлийн өөрчлөлт",
    paragraphs: [
      "Байгууллага нь үйлчилгээ, хууль тогтоомж, системийн ажиллагаанд өөрчлөлт орсон тохиолдолд энэхүү нөхцөлийг шинэчилж болно.",
      "Шинэчилсэн хувилбар болон хүчин төгөлдөр мөрдөж эхлэх огноог вебсайтад нийтэлнэ. Шаардлагатай тохиолдолд хэрэглэгчээс шинэ зөвшөөрөл авна.",
    ],
  },
  {
    id: "disputes",
    title: "10. Маргаан шийдвэрлэх",
    paragraphs: [
      "Вебсайтын ашиглалттай холбоотой санал, хүсэлт, гомдлыг байгууллагын холбоо барих сувгаар хүлээн авна.",
      "Талууд маргааныг харилцан зөвшилцөх замаар шийдвэрлэхийг эрмэлзэх бөгөөд шийдвэрлэж чадаагүй тохиолдолд Монгол Улсын холбогдох хууль тогтоомжийн дагуу шийдвэрлүүлнэ.",
    ],
  },
  {
    id: "contact",
    title: "11. Холбоо барих",
    paragraphs: [
      "Үйлчилгээний нөхцөлтэй холбоотой асуулт, санал хүсэлтээ дараах сувгаар ирүүлж болно.",
    ],
  },
];

export const instant = false;

export default async function TermsPage() {
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
                Terms & Conditions
              </p>
            </div>

            <h1 className="mt-7 text-[40px] font-semibold leading-tight tracking-[-0.04em] md:text-[60px]">
              Үйлчилгээний
              <br />
              <span className="text-[#F4AC38]">нөхцөл.</span>
            </h1>

            <p className="mt-6 max-w-[620px] text-[13px] leading-8 text-white/75">
              Вебсайтын үйлчилгээ, зээлийн хүсэлт илгээх журам,
              хэрэглэгчийн эрх, үүрэг болон холбогдох нөхцөлтэй
              танилцана уу.
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
                  aria-label="Үйлчилгээний нөхцөлийн агуулга"
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

              {/* TERMS TEXT */}
              <div className="min-w-0">
                <div className="mb-10 rounded-[17px] border-l-4 border-[#F4AC38] bg-[#F8FAFD] p-6">
                  <p className="text-[12px] leading-7 text-[#657487]">
                    Вебсайтаар зээлийн хүсэлт илгээх нь
                    зээл батлагдсан гэсэн үг биш.
                    Зээлийн эцсийн нөхцөл нь байгууллагын
                    шийдвэр болон холбогдох гэрээгээр тогтоогдоно.
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

                      {section.id === "security" && (
                        <Link
                          href="/privacy"
                          className="mt-5 inline-block text-[12px] font-semibold text-[#003189] underline underline-offset-4"
                        >
                          Нууцлалын бодлоготой танилцах →
                        </Link>
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
                    href="/privacy"
                    className="inline-flex min-h-[48px] items-center rounded-[10px] bg-[#003189] px-6 text-[12px] font-semibold text-white transition-colors hover:bg-[#00266C]"
                  >
                    Нууцлалын бодлого →
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
