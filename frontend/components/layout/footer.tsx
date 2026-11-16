
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import CurrentYear from "@/components/layout/CurrentYear";

const footerLinks = [
  { label: "Нүүр", href: "/" },
  { label: "Зээлийн бүтээгдэхүүн", href: "/loans" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Мэдээ", href: "/news" },
];

const serviceLinks = [
  { label: "Зээлийн бүтээгдэхүүн", href: "/loans" },
  { label: "Зээлийн тооцоолуур", href: "/#calculator" },
  { label: "Зээлийн хүсэлт", href: "/apply" },
];

type FooterProps = {
  companyName?: string;
  companyDescription?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
};

export default function Footer({
  companyName = "Хөгжих Капитал ББСБ",
  companyDescription = null,
  logoUrl = null,
  phone = null,
  email = null,
  address = null,
  facebookUrl = null,
  instagramUrl = null,
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden bg-[#0D1216] text-white">
      <div className="h-[3px] w-full bg-[var(--site-secondary,#F4AC38)]" />

      <div className="pointer-events-none absolute -right-40 -top-40 h-[440px] w-[440px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[280px] w-[280px] rounded-full border border-white/[0.04]" />

      <div className="container-main relative z-10">
        <div className="grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.75fr_0.85fr_1.1fr] lg:gap-x-12 lg:py-20">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              aria-label={`${companyName} — Нүүр хуудас`}
              className="inline-flex rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--site-secondary,#F4AC38)]"
            >
              <Image
                src={logoUrl || "/images/logos/logo-orange-blue.png"}
                alt={companyName}
                width={220}
                height={70}
                unoptimized
                className="h-auto w-[200px] object-contain"
              />
            </Link>

            <p className="mt-7 max-w-[320px] text-[12px] leading-7 text-white/60">
              {companyDescription ||
                "Таны хэрэгцээ, зорилгод нийцсэн санхүүгийн шийдлийг ойлгомжтой, хүртээмжтэй хүргэнэ."}
            </p>

            <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--site-secondary,#F4AC38)]">
              {companyName}
            </p>
          </div>

          {/* MENU */}
          <div>
            <FooterHeading title="Цэс" />

            <nav
              aria-label="Footer цэс"
              className="flex flex-col items-start gap-4"
            >
              {footerLinks.map((link) => (
                <FooterLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </nav>
          </div>

          {/* SERVICES */}
          <div>
            <FooterHeading title="Үйлчилгээ" />

            <nav
              aria-label="Footer үйлчилгээ"
              className="flex flex-col items-start gap-4"
            >
              {serviceLinks.map((link) => (
                <FooterLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div>
            <FooterHeading title="Холбоо барих" />

            {(facebookUrl || instagramUrl) && (
              <div className="mb-8 mt-8 flex flex-wrap items-center gap-3">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="group inline-flex items-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.04] px-3 py-3 text-[11px] font-medium text-white/80 transition-all duration-300 hover:border-[var(--site-secondary,#F4AC38)] hover:bg-white/[0.08] hover:text-[var(--site-secondary,#F4AC38)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-[17px] w-[17px]"
                      aria-hidden="true"
                    >
                      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
                    </svg>

                    <span>Facebook</span>
                    <span className="text-white/35 transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                )}

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="group inline-flex items-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.04] px-3 py-3 text-[11px] font-medium text-white/80 transition-all duration-300 hover:border-[var(--site-secondary,#F4AC38)] hover:bg-white/[0.08] hover:text-[var(--site-secondary,#F4AC38)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-[18px] w-[18px]"
                      aria-hidden="true"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                      />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="0.8"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>

                    <span>Instagram</span>
                    <span className="text-white/35 transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                )}
              </div>
            )}

            <div className="space-y-6 pt-2">

              {/* LOCATION */}
              <div className="flex items-start gap-3">
                <ContactIcon>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[17px] w-[17px]"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </ContactIcon>

                <div>
                  <p className="text-[10px] font-semibold text-white/90">
                    Байршил
                  </p>
                  <p className="mt-2 whitespace-pre-line text-[11px] leading-6 text-white/60">
                    {address || "Улаанбаатар хот, Монгол Улс"}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-3">
                <ContactIcon>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[17px] w-[17px]"
                    aria-hidden="true"
                  >
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.12.96.34 1.9.66 2.8a2 2 0 0 1-.45 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.3-1.3a2 2 0 0 1 2.1-.45c.9.32 1.84.54 2.8.66a2 2 0 0 1 1.7 2.09Z" />
                  </svg>
                </ContactIcon>

                <div>
                  <p className="text-[10px] font-semibold text-white/90">
                    Утас
                  </p>
                  <p className="mt-2 text-[11px] leading-6 text-white/60">
                    {phone || "+976 XXXX XXXX"}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-3">
                <ContactIcon>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[17px] w-[17px]"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </ContactIcon>

                <div>
                  <p className="text-[10px] font-semibold text-white/90">
                    И-мэйл
                  </p>
                  <p className="mt-2 break-all text-[11px] leading-6 text-white/60">
                    {email || "info@example.mn"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-5 border-t border-white/15 py-7 md:flex-row md:items-center md:justify-between">
          <p className="text-[10px] leading-6 text-white/45">
            © <CurrentYear /> {companyName}. Бүх эрх хуулиар хамгаалагдсан.
          </p>

          {/* PRIVACY POLICY & TERMS */}
          <nav
            aria-label="Хууль эрх зүйн мэдээлэл"
            className="flex flex-wrap items-center gap-x-7 gap-y-3"
          >
            <Link
              href="/privacy"
              className="text-[10px] text-white/55 transition-colors duration-300 hover:text-[var(--site-secondary,#F4AC38)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-secondary,#F4AC38)]"
            >
              Нууцлалын бодлого
            </Link>

            <Link
              href="/terms"
              className="text-[10px] text-white/55 transition-colors duration-300 hover:text-[var(--site-secondary,#F4AC38)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-secondary,#F4AC38)]"
            >
              Үйлчилгээний нөхцөл
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ title }: { title: string }) {
  return (
    <div className="mb-7">
      <div className="mb-4 h-[2px] w-6 bg-[var(--site-secondary,#F4AC38)]" />
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
        {title}
      </h2>
    </div>
  );
}

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-sm text-[12px] leading-6 text-white/60 transition-colors duration-300 hover:text-[var(--site-secondary,#F4AC38)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-secondary,#F4AC38)]"
    >
      <span className="h-[3px] w-0 rounded-full bg-[var(--site-secondary,#F4AC38)] transition-all duration-300 group-hover:w-2" />
      <span>{label}</span>
    </Link>
  );
}

function ContactIcon({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.05] text-[var(--site-secondary,#F4AC38)]">
      {children}
    </span>
  );
}
