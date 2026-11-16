
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Page солигдоход mobile menu автоматаар хаагдана
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-40 flex h-[70px] w-full items-center justify-between bg-brand-blue px-5 text-white md:hidden">
        <Link href="/admin">
          <Image
            src="/images/logos/logo-white.png"
            alt="Хөгжих Капитал"
            width={160}
            height={50}
            className="h-auto w-[135px]"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Admin цэс нээх"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/20 transition-colors hover:bg-white/10"
        >
          <div className="flex flex-col gap-[5px]">
            <span className="block h-[1px] w-5 bg-white" />
            <span className="block h-[1px] w-5 bg-white" />
            <span className="block h-[1px] w-5 bg-white" />
          </div>
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <button
          type="button"
          aria-label="Admin цэс хаах"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[280px] flex-col
          overflow-y-auto
          bg-brand-blue px-6 py-7 text-white
          transition-transform duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:fixed
          md:left-0
          md:top-0
          md:z-30
          md:h-screen
          md:w-[260px]
          md:translate-x-0
        `}
      >
        {/* LOGO */}
        <div className="shrink-0 border-b border-white/15 pb-7">
          <div className="flex items-start justify-between gap-4">
            <Link href="/admin">
              <Image
                src="/images/logos/logo-white.png"
                alt="Хөгжих Капитал"
                width={180}
                height={60}
                className="h-auto w-[160px]"
                priority
              />
            </Link>

            {/* MOBILE CLOSE */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Admin цэс хаах"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/20 text-xl font-light transition-colors hover:bg-white/10 md:hidden"
            >
              ×
            </button>
          </div>

          <p className="mt-3 text-[8px] uppercase tracking-[0.2em] text-white/50">
            Administration
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          <SidebarLink
            href="/admin"
            label="Dashboard"
            pathname={pathname}
            exact
          />

          <SidebarLink
            href="/admin/applications"
            label="Зээлийн хүсэлтүүд"
            pathname={pathname}
          />

          <SidebarLink
            href="/admin/loans"
            label="Зээлийн бүтээгдэхүүн"
            pathname={pathname}
          />

          <SidebarLink
            href="/admin/news"
            label="Мэдээ"
            pathname={pathname}
          />

          <SidebarLink
            href="/admin/settings"
            label="Вебсайт тохиргоо"
            pathname={pathname}
          />
        </nav>

        {/* LOGOUT */}
        <div className="shrink-0 border-t border-white/15 pt-6">
          <LogoutButton />
        </div>
      </aside>

      {/* DESKTOP SIDEBAR SPACE */}
      <div
        aria-hidden="true"
        className="hidden w-[260px] shrink-0 md:block"
      />
    </>
  );
}

function SidebarLink({
  href,
  label,
  pathname,
  exact = false,
}: {
  href: string;
  label: string;
  pathname: string;
  exact?: boolean;
}) {
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`rounded-[10px] border-l-[3px] px-4 py-3 text-[11px] font-medium transition-colors ${
        isActive
          ? "border-brand-orange bg-[#EDF3FC] font-semibold text-brand-blue"
          : "border-transparent text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
