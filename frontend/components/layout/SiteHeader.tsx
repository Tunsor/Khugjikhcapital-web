import Header from "@/components/layout/header";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <Header
      companyName={
        settings?.company_name || "Хөгжих Капитал ББСБ"
      }
      logoUrl={settings?.logo_url ?? null}
    />
  );
}