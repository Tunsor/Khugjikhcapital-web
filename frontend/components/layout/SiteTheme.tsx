
import type { CSSProperties, ReactNode } from "react";
import { getSiteSettings } from "@/lib/data/site-settings";
import { connection } from "next/server";

type SiteThemeProps = {
  children: ReactNode;
};

type ThemeStyles = CSSProperties & {
  "--site-primary": string;
  "--site-secondary": string;
};

const DEFAULT_PRIMARY = "#003189";
const DEFAULT_SECONDARY = "#F4AC38";

function validColor(value: unknown, fallback: string) {
  return typeof value === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(value)
    ? value
    : fallback;
}

export default async function SiteTheme({
  children,
}: SiteThemeProps) {
  await connection();

  const settings = await getSiteSettings();

  const styles: ThemeStyles = {
    "--site-primary": validColor(
      settings?.primary_color,
      DEFAULT_PRIMARY
    ),
    "--site-secondary": validColor(
      settings?.secondary_color,
      DEFAULT_SECONDARY
    ),
  };

  return <div style={styles}>{children}</div>;
}
