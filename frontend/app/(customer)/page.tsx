
import { Suspense } from "react";
import { connection } from "next/server";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

import Hero from "@/components/home/Hero";
import LoanProducts from "@/components/home/LoanProducts";
import LoanCalculator from "@/components/home/LoanCalculator";
import AboutSection from "@/components/home/AboutSection";
import NewsSection from "@/components/home/NewsSection";
import CTASection from "@/components/home/CTASection";

import { getSiteSettings } from "@/lib/data/site-settings";

// Нүүр хуудасны үндсэн компонент
export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

// Динамик өгөгдөл татах компонент
async function HomeContent() {
  await connection();

  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <Hero
          title={settings?.hero_title}
          description={settings?.hero_description}
          imageUrl={settings?.hero_image_url}
          sectionLabel={settings?.hero_section_label}
          badgeText={settings?.hero_badge_text}
          cardLabel={settings?.hero_card_label}
          cardTitle={settings?.hero_card_title}
          cardDescription={settings?.hero_card_description}
        />

        <LoanProducts />
        <LoanCalculator />
        <AboutSection />
        <NewsSection />
        <CTASection />
      </main>

      <SiteFooter />
    </>
  );
}

// Өгөгдөл ачаалж байх үеийн харагдац
function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-20 animate-pulse bg-slate-100" />

      <main id="main-content">
        <div className="h-[500px] animate-pulse bg-slate-100" />

        <div className="container-main space-y-10 py-16">
          <div className="h-12 w-64 animate-pulse rounded-lg bg-slate-100" />

          <div className="grid gap-6 md:grid-cols-3">
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      </main>
    </div>
  );
}
