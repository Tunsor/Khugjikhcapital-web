
import Footer from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <Footer
      companyName={
        settings?.company_name || "Хөгжих Капитал ББСБ"
      }
      companyDescription={
        settings?.company_description ?? null
      }
      logoUrl={settings?.logo_url ?? null}
      phone={settings?.phone ?? null}
      email={settings?.email ?? null}
      address={settings?.address ?? null}
      facebookUrl={settings?.facebook_url ?? null}
      instagramUrl={settings?.instagram_url ?? null}
    />
  );
}
