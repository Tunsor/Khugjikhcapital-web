
import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "2016", label: "Байгуулагдсан он" },
  { value: "ЖДБ", label: "Бизнес эрхлэгчдийг дэмжинэ" },
  { value: "6", label: "Үнэт зүйл" },
];

export default function AboutSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-main">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* LEFT IMAGE */}
          <div className="relative min-w-0">
            <div className="pointer-events-none absolute -left-3 -top-3 h-24 w-24 rounded-tl-[10px] border-l border-t border-[#F4AC38] sm:-left-4 sm:-top-4" />
            <div className="group relative h-[400px] overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-[#EDF3FC] shadow-[0_4px_18px_#00318908] sm:h-[480px] md:h-[570px]">
              <Image
                src="/images/about-building.jpg"
                alt="Хөгжих Капитал ББСБ-ийн танилцуулга"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003189]/65 via-[#003189]/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[17px] border border-white/15 bg-[#003189]/95 p-6 text-white shadow-[0_8px_30px_#00318930] backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[#F4AC38]" />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F4AC38]">
                    Бидний уриа
                  </p>
                </div>
                <p className="mt-4 max-w-[360px] text-[17px] font-semibold leading-7 tracking-[-0.02em] text-white sm:text-[20px]">
                  Таны амжилт — Бидний өсөлт.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 right-5 rounded-[10px] bg-[#F4AC38] px-5 py-3 shadow-[0_6px_18px_#F4AC3826]">
              <span className="text-[10px] font-semibold tracking-[0.15em] text-[#003189]">
                03 / ABOUT
              </span>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="min-w-0 pt-5 lg:pt-0">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 shrink-0 bg-[#F4AC38]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#003189]">
                03 / Бидний тухай
              </p>
            </div>
            <h2 className="mt-5 max-w-[570px] text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0D1216] md:text-[46px]">
              Хөгжих Капитал
              <br />
              <span className="text-[#003189]">ББСБ</span>
              <span className="text-[#F4AC38]">.</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-[13px] leading-7 text-[#657487]">
              “Хөгжих Капитал ББСБ” ХХК нь 2016 онд Улаанбаатар хотод байгуулагдаж,
              бичил, жижиг, дунд бизнес эрхлэгчдэд санхүүгийн үйлчилгээ хүргэх
              чиглэлээр ажиллаж ирсэн байгууллага юм.
            </p>
            <p className="mt-4 max-w-[560px] text-[13px] leading-7 text-[#657487]">
              Бид харилцагч бүрийн хэрэгцээ, бизнесийн онцлогт нийцсэн
              санхүүгийн шийдлийг санал болгож, ил тод байдал, шударга харилцаа,
              урт хугацааны итгэлцлийг эрхэмлэн ажилладаг.
            </p>
            <div className="mt-10 grid grid-cols-3 overflow-hidden rounded-[17px] border border-[#E4EAF4] bg-[#F8FAFD] shadow-[0_4px_18px_#00318908]">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`min-w-0 px-3 py-6 sm:px-5 sm:py-7 ${index !== 0 ? "border-l border-[#E4EAF4]" : ""}`}
                >
                  <p className="break-words text-[24px] font-semibold tracking-[-0.04em] text-[#003189] md:text-[30px]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-[#657487]">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex min-h-[52px] items-center justify-between gap-10 rounded-[10px] bg-[#003189] px-7 py-[17px] text-[11px] font-semibold text-white shadow-[0_4px_14px_#00318920] transition-all duration-300 hover:bg-[#00266C] hover:shadow-[0_8px_24px_#00318925] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
              >
                Дэлгэрэнгүй
                <span className="text-[#F4AC38] transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/apply"
                className="group inline-flex min-h-[52px] items-center justify-between gap-6 rounded-[10px] border border-[#003189] bg-white px-6 py-[16px] text-[11px] font-semibold text-[#003189] transition-all duration-300 hover:bg-[#EDF3FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003189]"
              >
                Зээлийн хүсэлт
                <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
