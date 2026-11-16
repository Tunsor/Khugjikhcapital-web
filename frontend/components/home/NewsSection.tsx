
import NewsImage from "@/components/home/NewsImage";
import Link from "next/link";

import { apiGet } from "@/lib/api/server";

type NewsCategory =
  | "loan"
  | "inflation"
  | "policy_rate"
  | "finance";

type ExternalNews = {
  id: string;
  title: string;
  summary: string | null;
  category: NewsCategory;
  published_at: string;
  source_name: string | null;
  source_url: string;
  image_url: string | null;
};

type CompanyNews = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  category: string;
  published_at: string;
  image_url: string | null;
};

type HomepageNews = {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  published_at: string;
  image_url: string | null;
  source_url: string;
  source: "company" | "external";
  source_name: string;
};

const COMPANY_NAME = "Хөгжих Капитал ББСБ";
const DEFAULT_EXTERNAL_SOURCE = "Монголбанк";

const categoryLabels: Record<NewsCategory, string> = {
  loan: "Зээл",
  inflation: "Инфляц",
  policy_rate: "Бодлогын хүү",
  finance: "Санхүү",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  })
    .format(new Date(date))
    .replace(/\//g, ".");
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ...categoryLabels,
    company: "Байгууллага",
    announcement: "Зарлал",
    promotion: "Урамшуулал",
    event: "Арга хэмжээ",
  };

  return labels[category] ?? "Санхүү";
}

  export default async function NewsSection() {
    const [
      { data: companyNewsData, error: companyNewsError },
      { data, error },
    ] = await Promise.all([
      apiGet<CompanyNews[]>("/news/company", { query: { limit: 3 } }),
      apiGet<ExternalNews[]>("/news/external", {
        query: { pageSize: 3 },
      }),
    ]);

    if (companyNewsError) {
      console.error(
        "Homepage company news error:",
        companyNewsError
      );
    }

    const companyNews = (
      companyNewsError ? [] : companyNewsData ?? []
    ) as CompanyNews[];

    if (error) {
      console.error(
        "External news fetch error:",
        error
      );
    }

  const externalNews = (error ? [] : data ?? []) as ExternalNews[];

  const combinedNews: HomepageNews[] = [
    ...companyNews.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      category: item.category,
      published_at: item.published_at,
      image_url: item.image_url,
      source_url: `/news/${encodeURIComponent(item.slug)}`,
      source: "company" as const,
      source_name: COMPANY_NAME,
    })),

    ...externalNews.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      category: item.category,
      published_at: item.published_at,
      image_url: item.image_url,
      source_url: item.source_url,
      source: "external" as const,
      source_name: item.source_name?.trim() || DEFAULT_EXTERNAL_SOURCE,
    })),
  ];

  const news = combinedNews
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() -
        new Date(a.published_at).getTime()
    )
    .slice(0, 3);

  const featured = news[0];
  const otherNews = news.slice(1);

  return (
    <section className="bg-[#F8FAFD] py-20 lg:py-28">
      <div className="container-main">
        {/* SECTION HEADER */}
        <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end lg:mb-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                04 / Мэдээ, мэдээлэл
              </p>
            </div>

            <h2 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
              Мэдээ,
              <br />
              <span className="text-[#003189]">
                мэдээлэл
              </span>
              <span className="text-[#F4AC38]">.</span>
            </h2>

            <p className="mt-5 max-w-[520px] text-[13px] leading-7 text-[#657487]">
              Хөгжих Капитал ББСБ-ийн мэдээ, зарлал,
              урамшуулал болон Монголбанк, Санхүүгийн зохицуулах хорооны санхүүгийн
              салбарын мэдээлэлтэй танилцаарай.
            </p>
          </div>

          <Link
            href="/news"
            className="group inline-flex min-h-[52px] w-fit shrink-0 items-center justify-between gap-8 rounded-[10px] border border-[#003189] bg-white px-6 py-4 text-[11px] font-semibold text-[#003189] transition-all duration-300 hover:bg-[#003189] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
          >
            Бүх мэдээ
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* EMPTY STATE */}
        {!featured ? (
          <div className="rounded-[17px] border border-[#E4EAF4] bg-white px-6 py-14 text-center">
            <p className="text-[14px] font-semibold text-[#003189]">
              Одоогоор мэдээ байхгүй байна.
            </p>
          </div>
        ) : (
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:gap-8">
            {/* FEATURED NEWS */}
            <a
              href={featured.source_url}
              target={featured.source === "external" ? "_blank" : undefined}
              rel={featured.source === "external" ? "noopener noreferrer" : undefined}
              className="group block min-w-0"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4DFEF] hover:shadow-[0_12px_30px_#00318912]">
                <div className="relative h-[280px] overflow-hidden sm:h-[360px] lg:h-[400px] xl:h-[430px]">
                  <NewsImage
                    imageUrl={featured.image_url}
                    title={featured.title}
                    featured
                    sourceName={featured.source_name}
                  />

                  <div className="absolute left-5 top-5 rounded-[10px] border border-white/15 bg-[#003189]/95 px-4 py-2.5 backdrop-blur-sm">
                    <span className="text-[9px] font-semibold text-white">
                      {getCategoryLabel(featured.category)}
                    </span>
                  </div>

                  <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#F4AC38]">
                    <span className="text-[11px] font-semibold text-[#003189]">
                      01
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-5 bg-[#F4AC38]" />
                    <p className="text-[10px] font-medium text-[#657487]">
                      {formatDate(featured.published_at)}
                    </p>
                  </div>

                  <h3 className="mt-5 max-w-[650px] text-[23px] font-semibold leading-[1.3] tracking-[-0.03em] text-[#0D1216] transition-colors duration-300 group-hover:text-[#003189] md:text-[27px]">
                    {featured.title}
                  </h3>

                  <p className="mt-4 max-w-[600px] text-[12px] leading-7 text-[#657487]">
                    {featured.summary ||
                      "Мэдээний дэлгэрэнгүй мэдээллийг эх сурвалжаас уншаарай."}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-5 pt-8">
                    <div>
                      <span className="text-[11px] font-semibold text-[#003189]">
                        {featured.source === "company"
                        ? "Дэлгэрэнгүй унших"
                        : "Эх мэдээг унших"}
                      </span>
                      <p className="mt-2 text-[9px] text-[#657487]">
                        {featured.source === "company"
                        ? featured.source_name
                        : `Эх сурвалж: ${featured.source_name}`}
                      </p>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[#003189] transition-all group-hover:bg-[#F4AC38]">
                      ↗
                    </span>
                  </div>
                </div>
              </article>
            </a>

            {/* SMALL NEWS */}
            <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {otherNews.map((item, index) => (
                <a
                  key={item.id}
                  href={item.source_url}
                  target={item.source === "external" ? "_blank" : undefined}
                  rel={item.source === "external" ? "noopener noreferrer" : undefined}
                  className="group block min-w-0"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4DFEF] hover:shadow-[0_12px_30px_#00318912] sm:flex-row lg:flex-row">
                    <div className="relative h-[210px] shrink-0 sm:h-full sm:min-h-[210px] sm:w-[42%] lg:h-auto lg:w-[42%]">
                      <NewsImage
                        imageUrl={item.image_url}
                        title={item.title}
                        sourceName={item.source_name}
                      />

                      <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#003189] text-[10px] font-semibold text-white">
                        {String(index + 2).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between p-5 lg:p-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[9px] font-semibold text-[#003189]">
                            {getCategoryLabel(item.category)}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-[#F4AC38]" />

                          <span className="text-[9px] text-[#657487]">
                            {formatDate(item.published_at)}
                          </span>
                        </div>

                        <h3 className="mt-4 text-[16px] font-semibold leading-[1.4] tracking-[-0.02em] text-[#0D1216] transition-colors duration-300 group-hover:text-[#003189] xl:text-[18px]">
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E4EAF4] pt-4">
                        <div>
                          <span className="text-[10px] font-semibold text-[#003189]">
                            {item.source === "company"
                            ? "Дэлгэрэнгүй унших"
                            : "Эх мэдээг унших"}
                          </span>
                          <p className="mt-1 text-[9px] text-[#657487]">
                            {item.source_name}
                          </p>
                        </div>

                        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[#003189] transition-all group-hover:bg-[#F4AC38]">
                          ↗
                        </span>
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
