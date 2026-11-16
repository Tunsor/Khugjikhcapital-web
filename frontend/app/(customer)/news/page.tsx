
import Link from "next/link";
import { connection } from "next/server";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import NewsImage from "@/components/home/NewsImage";
import { apiGet } from "@/lib/api/server";

export const instant = false;

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
  published_at: string | null;
  image_url: string | null;
};

type NewsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
  }>;
};

const PAGE_SIZE = 12;

const categories: {
  value: string;
  label: string;
}[] = [
  { value: "all", label: "Бүх мэдээ" },
  { value: "loan", label: "Зээл" },
  { value: "inflation", label: "Инфляц" },
  { value: "policy_rate", label: "Бодлогын хүү" },
  { value: "finance", label: "Санхүү" },
];

const categoryLabels: Record<NewsCategory, string> = {
  loan: "Зээл",
  inflation: "Инфляц",
  policy_rate: "Бодлогын хүү",
  finance: "Санхүү",
};

function formatDate(value: string): string {
  const date = new Date(value);

  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  })
    .format(date)
    .replace(/\//g, ".");
}

function getSourceName(item: ExternalNews): string {
  return item.source_name?.trim() || "Монголбанк";
}

function getCategoryLabel(
  category: NewsCategory
): string {
  return categoryLabels[category] ?? "Санхүү";
}

function getCategory(
  value: string | string[] | undefined
): string {
  const requested = Array.isArray(value)
    ? value[0]
    : value;

  if (
    requested &&
    categories.some((item) => item.value === requested)
  ) {
    return requested;
  }

  return "all";
}

function getPageNumber(
  value: string | string[] | undefined
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);

  if (
    !raw ||
    !Number.isSafeInteger(page) ||
    page < 1
  ) {
    return 1;
  }

  return page;
}

function buildNewsUrl(
  category: string,
  page: number
): string {
  const params = new URLSearchParams();

  if (category !== "all") {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/news?${query}` : "/news";
}

function NewsCard({
  item,
  featured = false,
}: {
  item: ExternalNews;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <a
        href={item.source_url}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
        className="group grid overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:border-[#003189]/20 hover:shadow-[0_12px_32px_#00318912] lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="relative h-[300px] overflow-hidden bg-[#EDF3FC] sm:h-[420px] lg:h-[500px]">
          <NewsImage
            imageUrl={item.image_url}
            title={item.title}
            featured
            sourceName={getSourceName(item)}
          />

          <div className="absolute left-5 top-5 rounded-[10px] bg-[#F4AC38] px-4 py-2 shadow-[0_4px_12px_#0D121620]">
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#0D1216]">
              Онцлох
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-12">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-[10px] bg-[#EDF3FC] px-3 py-2 text-[9px] font-semibold text-[#003189]">
                {getCategoryLabel(item.category)}
              </span>

              <span className="h-px w-5 bg-[#E4EAF4]" />

              <span className="text-[9px] text-[#657487]">
                {formatDate(item.published_at)}
              </span>
            </div>

            <h3 className="mt-7 text-[28px] font-semibold leading-[1.15] tracking-[-0.035em] text-[#0D1216] transition-colors duration-300 group-hover:text-[#003189] md:text-[36px]">
              {item.title}
            </h3>

            <p className="mt-5 max-w-[450px] text-[11px] leading-6 text-[#657487]">
              {item.summary ||
                "Мэдээний дэлгэрэнгүй мэдээллийг эх сурвалжаас уншаарай."}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-[#E4EAF4] pt-6">
            <div>
              <span className="text-[10px] font-semibold text-[#003189]">
                Эх мэдээг унших
              </span>
              <p className="mt-2 text-[9px] text-[#657487]">
                Эх сурвалж: {getSourceName(item)}
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[#003189] transition-all duration-300 group-hover:bg-[#F4AC38]">
              ↗
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={item.source_url}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
      className="group flex h-full flex-col overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:border-[#003189]/20 hover:shadow-[0_12px_32px_#00318912]"
    >
      <div className="relative h-[240px] shrink-0 overflow-hidden bg-[#EDF3FC] sm:h-[280px]">
        <NewsImage
          imageUrl={item.image_url}
          title={item.title}
          sourceName={getSourceName(item)}
        />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap items-center gap-4">
          <span className="rounded-[10px] bg-[#EDF3FC] px-3 py-2 text-[9px] font-semibold text-[#003189]">
            {getCategoryLabel(item.category)}
          </span>

          <span className="h-px w-4 bg-[#E4EAF4]" />

          <span className="text-[9px] text-[#657487]">
            {formatDate(item.published_at)}
          </span>
        </div>

        <h3 className="mt-5 text-[20px] font-semibold leading-[1.25] tracking-[-0.025em] text-[#0D1216] transition-colors duration-300 group-hover:text-[#003189]">
          {item.title}
        </h3>

        <p className="mt-4 text-[11px] leading-6 text-[#657487]">
          {item.summary ||
            "Мэдээний дэлгэрэнгүй мэдээллийг эх сурвалжаас уншаарай."}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-[#E4EAF4] pt-5">
          <div>
            <span className="text-[10px] font-semibold text-[#003189]">
              Эх мэдээг унших
            </span>
            <p className="mt-1 text-[9px] text-[#657487]">
              {getSourceName(item)}
            </p>
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[#003189] transition-all duration-300 group-hover:bg-[#F4AC38] group-hover:translate-x-1">
            ↗
          </span>
        </div>
      </div>
    </a>
  );
}

export default async function NewsPage({
  searchParams,
}: NewsPageProps) {
  await connection();

  const params = await searchParams;
  const selectedCategory = getCategory(params.category);
  const requestedPage = getPageNumber(params.page);

  // Байгууллагын нийтлэгдсэн мэдээнүүд + Монголбанкны мэдээ (хуудаслалттай)
  const [
    { data: companyNews, error: companyNewsError },
    { data, meta, error },
  ] = await Promise.all([
    apiGet<CompanyNews[]>("/news/company"),
    apiGet<ExternalNews[]>("/news/external", {
      query: {
        category:
          selectedCategory === "all" ? undefined : selectedCategory,
        page: requestedPage,
        pageSize: PAGE_SIZE,
      },
    }),
  ]);

  if (companyNewsError) {
    console.error(
      "Customer company news error:",
      companyNewsError
    );
  }

const publishedCompanyNews: CompanyNews[] =
  companyNewsError ? [] : (companyNews ?? []);

  if (error) {
    console.error("News page query error:", error);
  }

  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? 1;
  const totalNews = meta?.total ?? 0;
  const news = data ?? [];

  const featured =
    currentPage === 1 ? news[0] : undefined;

  const otherNews =
    currentPage === 1 ? news.slice(1) : news;

  return (
    <>
      <SiteHeader />

      <main id="main-content">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#003189] text-white">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

          <div className="container-main relative py-20 md:py-28 lg:py-32">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#F4AC38]">
                Мэдээ, мэдээлэл
              </p>
            </div>

            <h1 className="mt-7 text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">
              Мэдээлэлтэй
              <br />
              <span className="text-[#F4AC38]">
                ойр байгаарай.
              </span>
            </h1>

            <p className="mt-7 max-w-[550px] text-[13px] leading-7 text-white/70">
              Монголбанк, Санхүүгийн зохицуулах хорооноос нийтэлсэн зээл, инфляц,
              бодлогын хүү болон санхүүгийн салбарын
              сүүлийн хоёр жилийн мэдээ, мэдээлэлтэй
              танилцаарай.
            </p>
          </div>
        </section>

        {/* COMPANY NEWS */}
        {publishedCompanyNews.length > 0 && (
          <section className="bg-white py-16 lg:py-24">
            <div className="container-main">
              <div className="mb-10">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                  Хөгжих Капитал ББСБ
                </p>

                <h2 className="mt-4 text-[36px] font-semibold tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                  Байгууллагын мэдээ.
                </h2>

                <p className="mt-3 text-[12px] text-[#657487]">
                  Манай байгууллагын шинэ мэдээ, зарлал,
                  урамшуулал болон арга хэмжээнүүд.
                </p>
              </div>

              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {publishedCompanyNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${encodeURIComponent(item.slug)}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-white shadow-[0_4px_18px_#00318908] transition-all duration-300 hover:border-[#003189]/20 hover:shadow-[0_12px_32px_#00318912]"
                  >
                    <div className="relative h-[240px] overflow-hidden bg-[#EDF3FC]">
                      <NewsImage
                        imageUrl={item.image_url}
                        title={item.title}
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-[10px] bg-[#EDF3FC] px-3 py-2 text-[9px] font-semibold text-[#003189]">
                          {({
                            company: "Байгууллага",
                            announcement: "Зарлал",
                            promotion: "Урамшуулал",
                            event: "Арга хэмжээ",
                          } as Record<string, string>)[item.category] ??
                            item.category}
                        </span>

                        {item.published_at && (
                          <span className="text-[9px] text-[#657487]">
                            {formatDate(item.published_at)}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-5 text-[20px] font-semibold leading-[1.3] text-[#0D1216] transition-colors duration-300 group-hover:text-[#003189]">
                        {item.title}
                      </h3>

                      <p className="mt-4 line-clamp-3 text-[11px] leading-6 text-[#657487]">
                        {item.summary || item.content}
                      </p>

                      <div className="mt-auto border-t border-[#E4EAF4] pt-5">
                        <span className="text-[10px] font-semibold text-[#003189]">
                          Хөгжих Капитал ББСБ
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
                    </section>
        )}

        {/* NEWS — Монголбанкны мэдээ */}
        <section className="bg-[#F8FAFD] py-20 lg:py-28">
          <div className="container-main">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[#F4AC38]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                    01 / Шинэ мэдээ
                  </p>
                </div>

                <h2 className="mt-5 text-[36px] font-semibold tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
                  Сүүлийн мэдээлэл.
                </h2>
              </div>

              <p className="max-w-[380px] text-[11px] leading-6 text-[#657487]">
                Эх сурвалж: Монголбанк, Санхүүгийн зохицуулах хороо.
                Мэдээн дээр дарахад эх нийтлэл
                шинэ цонхонд нээгдэнэ.
              </p>
            </div>

            {/* CATEGORY FILTER */}
            <div className="mb-10 flex flex-wrap gap-3">
              {categories.map((category) => {
                const active =
                  selectedCategory === category.value;

                return (
                  <Link
                    key={category.value}
                    href={buildNewsUrl(
                      category.value,
                      1
                    )}
                    aria-current={
                      active ? "page" : undefined
                    }
                    className={
                      active
                        ? "rounded-[10px] bg-[#003189] px-5 py-3 text-[11px] font-semibold text-white"
                        : "rounded-[10px] border border-[#E4EAF4] bg-white px-5 py-3 text-[11px] font-semibold text-[#003189] transition-colors hover:border-[#003189]"
                    }
                  >
                    {category.label}
                  </Link>
                );
              })}
            </div>

            <p className="mb-7 text-[11px] text-[#657487]">
              Нийт {totalNews} мэдээ
            </p>

            {news.length === 0 ? (
              <div className="rounded-[17px] border border-[#E4EAF4] bg-white px-6 py-16 text-center">
                <p className="text-[14px] font-semibold text-[#003189]">
                  Одоогоор мэдээ байхгүй байна.
                </p>
                <p className="mt-3 text-[12px] text-[#657487]">
                  Энэ ангилалд шинэ мэдээ нэмэгдэх үед
                  энд харагдана.
                </p>
              </div>
            ) : (
              <>
                {featured && (
                  <NewsCard
                    item={featured}
                    featured
                  />
                )}

                {otherNews.length > 0 && (
                  <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {otherNews.map((item) => (
                      <NewsCard
                        key={item.id}
                        item={item}
                      />
                    ))}
                  </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Мэдээний хуудаслалт"
                    className="mt-12 flex flex-wrap items-center justify-center gap-3"
                  >
                    {currentPage > 1 && (
                      <Link
                        href={buildNewsUrl(
                          selectedCategory,
                          currentPage - 1
                        )}
                        className="rounded-[10px] border border-[#E4EAF4] bg-white px-5 py-3 text-[11px] font-semibold text-[#003189] hover:border-[#003189]"
                      >
                        ← Өмнөх
                      </Link>
                    )}

                    <span className="px-4 text-[11px] font-semibold text-[#657487]">
                      {currentPage} / {totalPages}
                    </span>

                    {currentPage < totalPages && (
                      <Link
                        href={buildNewsUrl(
                          selectedCategory,
                          currentPage + 1
                        )}
                        className="rounded-[10px] bg-[#003189] px-5 py-3 text-[11px] font-semibold text-white transition-colors hover:bg-[#00256A]"
                      >
                        Дараах →
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#003189] py-16 text-white lg:py-20">
          <div className="container-main flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F4AC38]">
                Санхүүжилт хэрэгтэй юу?
              </p>

              <h2 className="mt-4 text-[30px] font-semibold tracking-[-0.035em] md:text-[40px]">
                Өөрт тохирох шийдлээ сонгоорой.
              </h2>
            </div>

            <Link
              href="/loans"
              className="group inline-flex w-fit items-center gap-10 rounded-[10px] bg-[#F4AC38] px-7 py-[17px] text-[11px] font-semibold text-[#0D1216] shadow-[0_6px_20px_#F4AC3826] transition-all duration-300 hover:bg-[#E49B26] hover:shadow-[0_8px_24px_#F4AC3833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Зээлийн бүтээгдэхүүн
              <span className="transition-transform duration-300 group-hover:translate-x-1">
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
