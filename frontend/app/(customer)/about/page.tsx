
import Image from "next/image";
import Link from "next/link";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { connection } from "next/server";

const values = [
  {
    number: "01",
    title: "Бүтээгдэхүүн, үйлчилгээг хөгжүүлэх",
    description:
      "Харилцагчдын хэрэгцээнд нийцсэн бүтээгдэхүүн, үйлчилгээг тасралтгүй сайжруулна.",
  },
  {
    number: "02",
    title: "Харилцагчийн туршлага",
    description:
      "Харилцагч бүрд ойлгомжтой, хүртээмжтэй, таатай үйлчилгээ хүргэхийг зорьдог.",
  },
  {
    number: "03",
    title: "Ил тод байдал",
    description:
      "Зээлийн бүтээгдэхүүн, үйлчилгээний нөхцөлийг ойлгомжтой, нээлттэй тайлбарлахыг эрхэмлэнэ.",
  },
  {
    number: "04",
    title: "Бодит үнэ цэн",
    description:
      "Харилцагчийн хэрэгцээ, боломжид нийцсэн санхүүгийн шийдэл санал болгоно.",
  },
  {
    number: "05",
    title: "Шударга, хүндэтгэлтэй харилцаа",
    description:
      "Харилцагч, хамтрагч, ажилтнуудтайгаа шударга, хүндэтгэлтэй харилцана.",
  },
  {
    number: "06",
    title: "Мэдээллийн аюулгүй байдал",
    description:
      "Харилцагчийн мэдээллийн нууцлал, аюулгүй байдлыг хамгаалахыг эрхэмлэнэ.",
  },
];

export const instant = false;

export default async function AboutPage() {
  await connection();

  return (
    <>
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative py-20 md:py-28 lg:py-32">
            <SectionEyebrow light>
              Бидний тухай
            </SectionEyebrow>

            <h1 className="mt-8 max-w-[900px] text-[44px] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">
              Таны амжилт —
              <br />
              <span className="text-[#F4AC38]">
                Бидний өсөлт.
              </span>
            </h1>

            <p className="mt-8 max-w-[590px] text-[13px] leading-8 text-white/75">
              2016 оноос хойш бичил, жижиг, дунд бизнес эрхлэгчдийн
              санхүүгийн хэрэгцээнд нийцсэн үйлчилгээг хүргэж,
              тэдний өсөлт, хөгжлийг дэмжин ажиллаж байна.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/loans"
                className="group inline-flex items-center gap-8 rounded-[10px] bg-[#F4AC38] px-6 py-4 text-[11px] font-semibold text-[#0D1216] transition-colors hover:bg-[#E49B26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Зээлийн бүтээгдэхүүн
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/apply"
                className="inline-flex items-center rounded-[10px] border border-white/25 px-6 py-4 text-[11px] font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Зээлийн хүсэлт гаргах
              </Link>
            </div>
          </div>
        </section>

        {/* COMPANY INTRODUCTION */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container-main">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* IMAGE */}
              <div className="relative">
                <div className="relative h-[420px] overflow-hidden rounded-[17px] bg-[#EDF3FC] sm:h-[520px] lg:h-[610px]">
                  <Image
                    src="/images/about-building.jpg"
                    alt="Хөгжих Капитал ББСБ-ийн танилцуулга"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#003189]/50 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 rounded-[17px] border border-white/20 bg-[#003189]/95 p-6 text-white shadow-xl backdrop-blur-sm sm:right-auto sm:min-w-[270px]">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F4AC38]">
                      Хөгжих Капитал
                    </p>

                    <p className="mt-3 text-[17px] font-semibold leading-6">
                      Банк бус санхүүгийн
                      <br />
                      байгууллага
                    </p>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 hidden h-40 w-40 rounded-[17px] bg-[#EDF3FC] lg:block" />
              </div>

              {/* CONTENT */}
              <div>
                <SectionEyebrow>
                  01 / Бид хэн бэ?
                </SectionEyebrow>

                <h2 className="mt-7 text-[36px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                  Бизнесийн өсөлтөд
                  <br />
                  <span className="text-[#003189]">
                    хамтдаа.
                  </span>
                </h2>

                <div className="mt-8 h-[3px] w-14 rounded-full bg-[#F4AC38]" />

                <p className="mt-8 max-w-[540px] text-[13px] leading-8 text-[#657487]">
                  “Хөгжих Капитал ББСБ” ХХК нь 2016 онд
                  Улаанбаатар хотод байгуулагдсан. Бид бичил,
                  жижиг, дунд бизнес эрхлэгчдэд санхүүгийн
                  үйлчилгээ хүргэх чиглэлээр ажилладаг.
                </p>

                <p className="mt-5 max-w-[540px] text-[13px] leading-8 text-[#657487]">
                  Харилцагч бүрийн бизнесийн онцлог, хэрэгцээ
                  шаардлагыг ойлгож, санхүүгийн зөв шийдвэр
                  гаргахад нь дэмжлэг үзүүлэх, ил тод, шударга,
                  хариуцлагатай харилцааг эрхэмлэдэг.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  <FeatureItem title="Хүн төвтэй үйлчилгээ">
                    Харилцагчийн онцлогт нийцсэн шийдэл
                  </FeatureItem>

                  <FeatureItem title="Итгэлцэл, ил тод байдал">
                    Шударга харилцаа, ойлгомжтой нөхцөл
                  </FeatureItem>
                </div>

                <Link
                  href="/loans"
                  className="group mt-10 inline-flex items-center gap-9 rounded-[10px] bg-[#003189] px-7 py-4 text-[11px] font-semibold text-white transition-all hover:bg-[#00266C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
                >
                  Бүтээгдэхүүн үзэх

                  <span className="text-[#F4AC38] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="bg-[#F8FAFD] py-20 lg:py-28">
          <div className="container-main">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <SectionEyebrow>
                  02 / Бидний зарчим
                </SectionEyebrow>

                <h2 className="mt-7 text-[36px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                  Бидний үнэт зүйлс.
                </h2>
              </div>

              <p className="max-w-[340px] text-[12px] leading-7 text-[#657487]">
                Бид бүтээгдэхүүн, үйлчилгээний чанар,
                ил тод байдал, харилцагчийн эрх ашгийг
                өдөр тутмын үйл ажиллагаандаа эрхэмлэнэ.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {values.map((value) => (
                <ValueCard
                  key={value.number}
                  number={value.number}
                  title={value.title}
                  description={value.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="relative overflow-hidden bg-[#0D1216] py-20 text-white lg:py-28">
          <div className="pointer-events-none absolute -bottom-44 -right-44 h-[500px] w-[500px] rounded-full border border-white/[0.04]" />

          <div className="container-main relative">
            <SectionEyebrow light>
              03 / Бидний зорилго
            </SectionEyebrow>

            <h2 className="mt-7 max-w-[760px] text-[36px] font-semibold leading-[1.12] tracking-[-0.04em] md:text-[46px]">
              Өнөөдрийн хэрэгцээ,
              <br />
              маргаашийн боломж.
            </h2>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[17px] border border-white/10 bg-white/[0.04] p-8 md:p-10">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4AC38]">
                  Эрхэм зорилго
                </span>

                <div className="mt-7 h-[2px] w-10 bg-[#F4AC38]" />

                <h3 className="mt-8 text-[27px] font-semibold leading-[1.2] tracking-[-0.035em] md:text-[34px]">
                  Хүн төвтэй
                  <br />
                  санхүүгийн үйлчилгээ.
                </h3>

                <p className="mt-6 max-w-[460px] text-[12px] leading-8 text-white/65">
                  Бичил санхүүгийн салбарт хүн төвтэй
                  хөгжлийг эрхэмлэн, жижиг, дунд бизнес
                  эрхлэгчдийн өсөлтийг дэмжих санхүүгийн
                  үйлчилгээг шуурхай хүргэх.
                </p>
              </div>

              <div className="rounded-[17px] border border-white/10 bg-white/[0.04] p-8 md:p-10">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4AC38]">
                  Алсын хараа
                </span>

                <div className="mt-7 h-[2px] w-10 bg-[#F4AC38]" />

                <h3 className="mt-8 text-[27px] font-semibold leading-[1.2] tracking-[-0.035em] md:text-[34px]">
                  Хүчирхэг,
                  <br />
                  хүн төвтэй баг.
                </h3>

                <p className="mt-6 max-w-[460px] text-[12px] leading-8 text-white/65">
                  Хүн төвтэй хөгжлийг харилцагчийн
                  бизнесийн үнэ цэн болгож, бүтээмжтэй,
                  чадвартай, найрсаг хамт олон, компанийн
                  сайн засаглалтай хүчирхэг баг болох.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#003189] py-16 text-white lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative flex flex-col justify-between gap-9 md:flex-row md:items-center">
            <div>
              <SectionEyebrow light>
                Санхүүгийн шийдэл
              </SectionEyebrow>

              <h2 className="mt-5 text-[30px] font-semibold leading-[1.2] tracking-[-0.035em] md:text-[40px]">
                Дараагийн алхмаа
                <br className="hidden sm:block" />
                эхлүүлээрэй.
              </h2>

              <p className="mt-5 max-w-[450px] text-[12px] leading-7 text-white/70">
                Өөрийн хэрэгцээнд тохирох зээлийн
                бүтээгдэхүүнийг сонгож, хүсэлтээ илгээнэ үү.
              </p>
            </div>

            <Link
              href="/apply"
              className="group inline-flex w-fit shrink-0 items-center gap-10 rounded-[10px] bg-[#F4AC38] px-7 py-[17px] text-[11px] font-semibold text-[#0D1216] transition-colors hover:bg-[#E49B26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Хүсэлт гаргах

              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/* SECTION EYEBROW */
function SectionEyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
          light ? "text-[#F4AC38]" : "text-[#003189]"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

/* FEATURE ITEM */
function FeatureItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-[#E4EAF4] bg-[#F8FAFD] p-5">
      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#EDF3FC] text-[#003189]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </div>

      <h3 className="text-[12px] font-semibold text-[#0D1216]">
        {title}
      </h3>

      <p className="mt-2 text-[11px] leading-6 text-[#657487]">
        {children}
      </p>
    </div>
  );
}

/* VALUE CARD */
function ValueCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group flex h-full flex-col rounded-[17px] border border-[#E4EAF4] bg-white p-8 shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:-translate-y-1 hover:border-[#003189]/20 hover:shadow-[0_12px_32px_#00318912]">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[11px] font-semibold text-[#003189] transition-colors duration-300 group-hover:bg-[#003189] group-hover:text-white">
          {number}
        </span>

        <span className="text-[18px] text-[#F4AC38]">
          ↗
        </span>
      </div>

      <div className="mt-10 h-[2px] w-9 bg-[#F4AC38]" />

      <h3 className="mt-6 text-[23px] font-semibold tracking-[-0.025em] text-[#0D1216]">
        {title}
      </h3>

      <p className="mt-4 max-w-[350px] text-[12px] leading-7 text-[#657487]">
        {description}
      </p>
    </article>
  );
}
