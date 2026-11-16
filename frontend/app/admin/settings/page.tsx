
import { connection } from "next/server";

import AdminSidebar from "@/components/admin/AdminSidebar";
import type { ComponentProps } from "react";

import { adminGet } from "@/lib/api/server";

import SettingsForm from "./SettingsForm";
import LogoUpload from "./LogoUpload";
import HeroImageUpload from "./HeroImageUpload";
import CalculatorSettings from "./CalculatorSettings";

export const instant = false;

export default async function AdminSettingsPage() {
  await connection();

  // Сайтын тохиргоог унших (auth + admin эрхийг API шалгана)
  const result = await adminGet<
    ComponentProps<typeof SettingsForm>["initialSettings"] & {
      logo_url: string | null;
      hero_image_url: string | null;
    }
  >("/site-settings");

  if (result.forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
        <p className="text-sm text-red-700">Админ эрх шаардлагатай.</p>
      </main>
    );
  }

  const settings = result.data;
  const settingsError = result.error;

  if (settingsError) {
    console.error("Site settings fetch error:", settingsError);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFD]">
      <div className="min-h-screen md:flex">
        <AdminSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          {/* PAGE HEADER */}
          <header className="border-b border-[#E4EAF4] pb-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Website Management
            </p>

            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-brand-blue">
              Вебсайтын тохиргоо
            </h1>

            <p className="mt-2 text-[11px] text-[#657487]">
              Хөгжих Капитал ББСБ-ийн вебсайтын мэдээлэл,
              лого болон дизайны тохиргоо
            </p>
          </header>

          {/* SETTINGS FORM */}
          <div className="mt-8 rounded-[22px] border border-[#E4EAF4] bg-white p-6 sm:p-8">
            {settingsError || !settings ? (
              <p className="text-[12px] text-red-700">
                Сайтын тохиргоог уншихад алдаа гарлаа.
              </p>
            ) : (
              <SettingsForm
                initialSettings={{
                  company_name: settings.company_name,
                  company_description: settings.company_description,
                  phone: settings.phone,
                  email: settings.email,
                  address: settings.address,
                  facebook_url: settings.facebook_url,
                  instagram_url: settings.instagram_url,
                  hero_title: settings.hero_title,
                  hero_description: settings.hero_description,
                  hero_section_label: settings.hero_section_label ?? null,
                  primary_color: settings.primary_color,
                  secondary_color: settings.secondary_color,
                  hero_badge_text: settings.hero_badge_text ?? null,
                  hero_card_label: settings.hero_card_label ?? null,
                  hero_card_title: settings.hero_card_title ?? null,
                  hero_card_description: settings.hero_card_description ?? null,
                }}
              />
            )}
          </div>

          {/* IMAGE SETTINGS */}
          {!settingsError && settings && (
            <div className="mt-6 space-y-6">
              {/* LOGO UPLOAD */}
              <LogoUpload
                initialLogoUrl={settings.logo_url ?? null}
              />

              {/* HERO IMAGE UPLOAD */}
              <HeroImageUpload
                initialImageUrl={settings.hero_image_url ?? null}
              />
              <CalculatorSettings />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
