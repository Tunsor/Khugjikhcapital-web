
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/footer";

import { connection } from "next/server";
import { apiGet } from "@/lib/api/server";

type CompanyArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  category: string;
  image_url: string | null;
  published_at: string | null;
};

const categoryLabels: Record<string, string> = {
  company: "Байгууллага",
  announcement: "Зарлал",
  promotion: "Урамшуулал",
  event: "Арга хэмжээ",
};

function formatDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(value));
}

export const instant = false;

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
await connection();

const { slug } = await params;
const { data, error } = await apiGet<CompanyArticle>(
  `/news/company/${encodeURIComponent(slug)}`
);

if (error || !data) {
  notFound();
}

const newsArticle = data as CompanyArticle;

const article = {
  category:
    categoryLabels[newsArticle.category] ??
    newsArticle.category,
  date: formatDate(newsArticle.published_at),
  title: newsArticle.title,
  description: newsArticle.summary ?? "",
  image: newsArticle.image_url,
  content: newsArticle.content.split(/\r?\n/).filter(Boolean),
};

  return (
    <>
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          {/* BACKGROUND DECORATION */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative py-14 md:py-20 lg:py-24">
            {/* BREADCRUMB */}
            <div className="flex flex-wrap items-center gap-3 text-[9px] text-white/60">
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-white"
              >
                Нүүр
              </Link>

              <span>/</span>

              <Link
                href="/news"
                className="transition-colors duration-300 hover:text-white"
              >
                Мэдээ
              </Link>

              <span>/</span>

              <span className="text-[#F4AC38]">
                {article.category}
              </span>
            </div>

            {/* HERO CONTENT */}
            <div className="mt-12 max-w-[900px]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex rounded-[10px] bg-white/10 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#F4AC38]">
                  {article.category}
                </span>

                <span className="h-px w-6 bg-white/20" />

                <span className="text-[9px] text-white/65">
                  {article.date}
                </span>
              </div>

              <h1 className="mt-7 text-[40px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[52px] lg:text-[62px]">
                {article.title}
              </h1>

              <p className="mt-7 max-w-[650px] text-[12px] leading-6 text-white/70">
                {article.description}
              </p>
            </div>
          </div>
        </section>

        {/* IMAGE */}
        <section className="bg-white">
          <div className="container-main py-10 lg:py-14">
            <div className="relative h-[300px] overflow-hidden rounded-[17px] bg-[#EDF3FC] shadow-[0_8px_30px_#00318912] sm:h-[450px] lg:h-[620px]">
              {article.image && (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-[#003189]/5" />
            </div>
          </div>
        </section>

        {/* ARTICLE */}
        <section className="bg-white pb-20 lg:pb-28">
          <div className="container-main">
            <div className="mx-auto max-w-[760px]">
              {/* ARTICLE LABEL */}
              <div className="mb-10 flex items-center gap-3">
                <span className="h-px w-8 bg-[#F4AC38]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#003189]">
                  Нийтлэл
                </span>
              </div>

              {/* ARTICLE CONTENT */}
              <div className="space-y-7">
                {article.content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[13px] leading-8 text-[#657487]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* BACK TO NEWS */}
              <div className="mt-14 border-t border-[#E4EAF4] pt-8">
                <Link
                  href="/news"
                  className="group inline-flex items-center gap-4 rounded-[10px] border border-[#E4EAF4] bg-[#F8FAFD] px-5 py-4 text-[10px] font-semibold text-[#003189] transition-all duration-300 hover:border-[#003189]/20 hover:bg-[#EDF3FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>

                  Бүх мэдээ рүү буцах
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#F8FAFD] py-16 lg:py-20">
          <div className="container-main flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#003189]">
                Хөгжих Капитал
              </p>

              <h2 className="mt-4 text-[29px] font-semibold tracking-[-0.035em] text-[#0D1216] md:text-[38px]">
                Санхүүгийн шийдлээ сонгоорой.
              </h2>
            </div>

            <Link
              href="/loans"
              className="group inline-flex w-fit items-center gap-10 rounded-[10px] bg-[#003189] px-7 py-[17px] text-[11px] font-semibold text-white shadow-[0_4px_14px_#00318920] transition-all duration-300 hover:bg-[#00266C] hover:shadow-[0_8px_24px_#00318925] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
            >
              Зээлийн бүтээгдэхүүн

              <span className="text-[#F4AC38] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
