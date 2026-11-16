
import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  sectionLabel?: string | null;
  badgeText?: string | null;
  cardLabel?: string | null;
  cardTitle?: string | null;
  cardDescription?: string | null;
};

function renderHeroTitle(value: string) {
  return value
    .split(/(\[\[[\s\S]*?\]\])/g)
    .map((part, index) => {
      if (part.startsWith("[[") && part.endsWith("]]")) {
        return (
          <span
            key={index}
            className="text-[var(--site-secondary,#F4AC38)]"
          >
            {part.slice(2, -2)}
          </span>
        );
      }

      return part;
    });
}

export default function Hero({
  title,
  description,
  imageUrl,
  sectionLabel,
  badgeText,
  cardLabel,
  cardTitle,
  cardDescription,
}: HeroProps) {
  const displayBadge =
    badgeText?.trim() || "Хөгжих Капитал";

  const displayCardLabel =
    cardLabel?.trim() || "Санхүүгээс эхлэх боломж";

  const displayCardTitle =
    cardTitle?.trim() || "Таны дараагийн\nалхамд.";

  const displayCardDescription =
    cardDescription?.trim() ||
    "Таны хэрэгцээнд тохирсон санхүүжилт.";

  return (
    <section className="relative overflow-hidden bg-[var(--site-primary,#003189)] text-white">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

      <div className="container-main relative">
        <div className="grid items-center gap-12 py-20 md:py-28 lg:min-h-[720px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-32">

          {/* LEFT CONTENT */}
          <div className="relative z-10 min-w-0">

            {/* SECTION LABEL */}
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[var(--site-secondary,#F4AC38)]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--site-secondary,#F4AC38)]">
                {sectionLabel?.trim() || "Таны зорилго. Бидний шийдэл."}
              </p>
            </div>

            {/* TITLE */}
            <h1 className="mt-7 max-w-[750px] whitespace-pre-line text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">
              {title?.trim() ? (
                renderHeroTitle(title)
              ) : (
                <>
                  Санхүүгийн
                  <br />
                  <span className="text-[var(--site-secondary,#F4AC38)]">
                    шийдэл.
                  </span>
                  <br />
                  Таны хэмнэлээр.
                </>
              )}
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-7 max-w-[550px] whitespace-pre-line text-[13px] leading-7 text-white/70">
              {description?.trim() ||
                "Өдөр тутмын хэрэгцээнээс бизнесийн дараагийн алхам хүртэл. Өөрт тохирох санхүүжилтээ сонгож, төлөвлөгөөгөө бодит болгоорой."}
            </p>

            {/* BUTTONS */}
            <div className="mt-9 flex flex-wrap items-center gap-4">

              {/* LOAN BUTTON */}
              <Link
                href="/loans"
                className="group inline-flex min-h-[52px] items-center justify-between gap-8 rounded-[10px] bg-[var(--site-secondary,#F4AC38)] px-7 py-[17px] text-[11px] font-semibold text-[#0D1216] shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:brightness-95 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Зээлээ сонгох

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* CALCULATOR BUTTON */}
              <Link
                href="#calculator"
                className="group inline-flex min-h-[52px] items-center justify-between gap-8 rounded-[10px] border border-white/30 bg-white/[0.06] px-7 py-[17px] text-[11px] font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Тооцоолуур үзэх

                <span className="text-[var(--site-secondary,#F4AC38)] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* TRUST LINE */}
            <div className="mt-12 max-w-[570px] border-t border-white/15 pt-6">
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {[
                  "Ойлгомжтой нөхцөл",
                  "Шуурхай шийдвэр",
                  "Танд тохирсон сонголт",
                ].map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2 text-[10px] text-white/60"
                  >
                    <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--site-secondary,#F4AC38)]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:ml-auto">
            <div className="group relative h-[380px] overflow-hidden rounded-[17px] border border-white/10 bg-[#0D1216] shadow-[0_12px_32px_rgba(0,0,0,0.2)] sm:h-[500px] lg:h-[540px]">

              <Image
                src={
                  imageUrl?.trim() ||
                  "/images/hero-building.jpg"
                }
                alt="Хөгжих Капитал ББСБ"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              {/* IMAGE OVERLAYS */}
              <div className="absolute inset-0 bg-[var(--site-primary,#003189)] opacity-10" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1216]/85 via-transparent to-transparent" />

              {/* TOP BADGE */}
              <div
                className="absolute right-5 top-5 rounded-[10px] border border-white/20 px-4 py-2 backdrop-blur-md"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--site-primary, #003189) 75%, transparent)",
                }}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
                  {displayBadge}
                </p>
              </div>

              {/* IMAGE CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="rounded-[17px] border border-white/15 bg-[#0D1216]/85 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur-md sm:p-7">

                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-[var(--site-secondary,#F4AC38)]" />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--site-secondary,#F4AC38)]">
                      {displayCardLabel}
                    </p>
                  </div>

                  <h2 className="mt-5 whitespace-pre-line text-[25px] font-semibold leading-[1.15] tracking-[-0.03em] text-white sm:text-[30px]">
                    {displayCardTitle}
                  </h2>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/15 pt-5">
                    <p className="whitespace-pre-line text-[10px] leading-5 text-white/65">
                      {displayCardDescription}
                    </p>

                    <Link
                      href="/about"
                      aria-label="Бидний тухай"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EDF3FC] text-[var(--site-primary,#003189)] transition-all duration-300 hover:bg-[var(--site-secondary,#F4AC38)]"
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE NUMBER */}
            <div className="mt-4 flex items-center justify-end gap-3">
              <span className="h-px w-7 bg-white/25" />

              <p className="text-[9px] tracking-[0.2em] text-white/50">
                01 / 04
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
