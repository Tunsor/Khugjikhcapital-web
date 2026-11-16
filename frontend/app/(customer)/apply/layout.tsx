
import type { ReactNode } from "react";
import { Suspense } from "react";
import { connection } from "next/server";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ApplyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<HeaderLoading />}>
        <DynamicHeader />
      </Suspense>

      {children}

      <Suspense fallback={<FooterLoading />}>
        <DynamicFooter />
      </Suspense>
    </>
  );
}

async function DynamicHeader() {
  await connection();

  return <SiteHeader />;
}

async function DynamicFooter() {
  await connection();

  return <SiteFooter />;
}

function HeaderLoading() {
  return (
    <div
      className="h-20 w-full bg-white"
      aria-label="Цэс ачаалж байна"
    />
  );
}

function FooterLoading() {
  return (
    <div
      className="min-h-40 w-full bg-[#003189]"
      aria-label="Хуудасны доод хэсэг ачаалж байна"
    />
  );
}
