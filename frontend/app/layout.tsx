
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Хөгжих Капитал ББСБ",
    template: "%s | Хөгжих Капитал ББСБ",
  },

  description:
    "Хөгжих Капитал ББСБ — Таны хэрэгцээнд тохирсон санхүүгийн шийдэл.",

  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },

  applicationName: "Хөгжих Капитал ББСБ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
