
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#003189] text-white">
      {/* BACKGROUND DECORATIONS */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

      <div className="pointer-events-none absolute -right-20 -top-20 h-[330px] w-[330px] rounded-full border border-white/[0.06]" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-[240px] w-[240px] rounded-full bg-[#F4AC38]/[0.04] blur-[100px]" />

      <div className="container-main relative z-10 py-20 lg:py-28">
        {/* SECTION CONTENT */}
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto] lg:gap-12">
          {/* LEFT CONTENT */}
          <div className="min-w-0">
            {/* SECTION LABEL */}
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F4AC38]">
                05 / Дараагийн алхам
              </p>
            </div>

            {/* TITLE */}
            <h2 className="mt-5 max-w-[750px] text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] md:text-[46px] lg:text-[58px]">
              Таны төлөвлөгөө
              <br />
              <span className="text-[#F4AC38]">
                эндээс эхэлнэ.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-[520px] text-[13px] leading-7 text-white/70">
              Өөрт тохирох зээлийн бүтээгдэхүүнээ сонгож,
              урьдчилсан хүсэлтээ онлайнаар илгээгээрэй.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            {/* PRIMARY BUTTON */}
            <Link
              href="/apply"
              className="group inline-flex min-h-[54px] items-center justify-between gap-8 rounded-[10px] bg-[#F4AC38] px-7 py-4 text-[11px] font-semibold text-[#0D1216] shadow-[0_6px_20px_#F4AC3826] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E49B26] hover:shadow-[0_8px_24px_#F4AC3833] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Зээлийн хүсэлт гаргах

              <span className="text-[15px] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* SECONDARY BUTTON */}
            <Link
              href="/loans"
              className="group inline-flex min-h-[54px] items-center justify-between gap-6 rounded-[10px] border border-white/30 bg-white/[0.04] px-7 py-4 text-[11px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Бүтээгдэхүүн үзэх

              <span className="text-[15px] text-[#F4AC38] transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </div>
        </div>

        {/* BOTTOM DIVIDER */}
        <div className="mt-14 h-px w-full bg-white/10 lg:mt-20" />

        {/* BOTTOM INFORMATION */}
        <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[10px] font-medium tracking-[0.04em] text-white/50">
            Хөгжих Капитал ББСБ
          </p>

          <p className="text-[10px] text-white/50">
            Таны санхүүгийн зорилгод хамтдаа.
          </p>
        </div>
      </div>

      {/* BOTTOM ACCENT */}
      <div className="h-[3px] w-full bg-[#F4AC38]" />
    </section>
  );
}
