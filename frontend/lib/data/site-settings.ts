import "server-only";

import { cache } from "react";

import { apiGet } from "@/lib/api/server";
import type { PublicSiteSettings } from "@/lib/api/types";

/**
 * Public site settings, de-duplicated per request so the header, footer,
 * theme and hero share a single API call.
 */
export const getSiteSettings = cache(async () => {
  const { data, error } = await apiGet<PublicSiteSettings | null>("/site-settings");

  if (error) {
    console.error("Site settings error:", error);
  }

  return data;
});
