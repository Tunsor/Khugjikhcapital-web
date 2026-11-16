export const instant = false;

import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteTheme from "@/components/layout/SiteTheme";

export const metadata: Metadata = {
  title: {
    default: "Хөгжих Капитал ББСБ",
    template: "%s | Хөгжих Капитал ББСБ",
  },

  description:
    "Хөгжих Капитал ББСБ — Зээлийн бүтээгдэхүүн, санхүүгийн үйлчилгээ, зээлийн тооцоолуур болон зээлийн хүсэлт гаргах боломж.",

  applicationName: "Хөгжих Капитал ББСБ",

  keywords: [
    "Хөгжих Капитал",
    "Хөгжих Капитал ББСБ",
    "ББСБ",
    "банк бус санхүүгийн байгууллага",
    "зээлийн бүтээгдэхүүн",
    "зээлийн хүсэлт",
    "зээлийн тооцоолуур",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "mn_MN",
    title: "Хөгжих Капитал ББСБ",
    description:
      "Таны хэрэгцээнд нийцсэн санхүүгийн шийдэл.",
    siteName: "Хөгжих Капитал ББСБ",
  },
};

export default function CustomerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SiteTheme>
      <div className="customer-site flex min-h-screen flex-col">
        {children}
      </div>
    </SiteTheme>
  );
}
