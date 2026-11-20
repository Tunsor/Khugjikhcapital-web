
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Нүүр" },
  { href: "/loans", label: "Зээлийн бүтээгдэхүүн" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/news", label: "Мэдээ" },
  { href: "/payment", label: "Төлбөр төлөх" },
];

type HeaderProps = {
    companyName?: string;
    logoUrl?: string | null;
  };

  export default function Header({
    companyName = "Хөгжих Капитал ББСБ",
    logoUrl = null,
  }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* MAIN NAVIGATION */}
      <div className="border-b border-[#E4EAF4] bg-white">
        <div className="container-main flex h-[70px] items-center justify-between gap-5 lg:h-[78px]">
          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center"
            aria-label={`${companyName} — Нүүр`}
          >
            <Image
              src={logoUrl || "/images/logos/logo-orange-blue.png"}
              alt={companyName}
              width={220}
              height={70}
              priority
              unoptimized
              className="h-auto w-[145px] sm:w-[170px] lg:w-[190px]"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Үндсэн цэс"
            className="hidden items-center gap-5 lg:flex xl:gap-8"
          >
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap py-2 !text-[13px] !leading-[20px] font-semibold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[var(--site-secondary)] after:transition-all ${
                    active
                      ? "text-[var(--site-primary)] after:w-full"
                      : "text-[#31415B] after:w-0 hover:text-[var(--site-primary)] hover:after:w-full"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/apply"
              onClick={closeMenu}
              className="hidden min-h-[56px] items-center justify-center gap-3 rounded-[10px] bg-[var(--site-secondary)] px-6 py-3 !text-[13px] !leading-[20px] font-semibold text-[#0D1216] transition-all duration-300 hover:brightness-95 sm:inline-flex"
            >
              Зээлийн хүсэлт
              <span aria-hidden="true" className="!text-[13px]">
                ↗
              </span>
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Цэс хаах" : "Цэс нээх"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E4EAF4] text-[var(--site-primary)] transition-colors hover:bg-[#F8FAFD] lg:hidden"
            >
              <div className="relative h-5 w-6">
                <span
                  className={`absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
                    menuOpen ? "top-[9px] rotate-45" : "top-[3px]"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[9px] h-[2px] rounded-full bg-current transition-all duration-300 ${
                    menuOpen ? "w-0 opacity-0" : "w-6 opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
                    menuOpen ? "top-[9px] -rotate-45" : "top-[15px]"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`overflow-hidden bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[520px] border-b border-[#E4EAF4] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className={`container-main py-5 ${!menuOpen ? "invisible" : ""}`}>
          <nav
            aria-label="Гар утасны цэс"
            className="flex flex-col"
          >
            {navigation.map((item, index) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-[#E4EAF4] py-4 !text-[15px] font-semibold transition-colors ${
                    active
                      ? "text-[var(--site-primary)]"
                      : "text-[#31415B] hover:text-[var(--site-primary)]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="!text-[11px] font-bold text-[var(--site-secondary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </span>

                  <span aria-hidden="true" className="text-[var(--site-primary)]">
                    ↗
                  </span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/apply"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className="mt-6 flex w-full items-center justify-between rounded-[10px] bg-[var(--site-secondary)] px-5 py-4 !text-[14px] font-semibold text-[#0D1216] transition-colors hover:brightness-95"
          >
            Зээлийн хүсэлт гаргах
            <span aria-hidden="true">↗</span>
          </Link>

          <div className="mt-5 text-center !text-[11px] text-[#657487]">
            {companyName}
          </div>
        </div>
      </div>
    </header>
  );
}
