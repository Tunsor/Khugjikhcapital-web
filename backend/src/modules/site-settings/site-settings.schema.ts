import { z } from "zod";

const SOCIAL_DOMAINS = {
  facebook_url: ["facebook.com", "fb.com", "fb.me"],
  instagram_url: ["instagram.com"],
} as const;

function isAllowedSocialUrl(value: string, domains: readonly string[]) {
  if (!value) return true;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      domains.some((domain) => host === domain || host.endsWith(`.${domain}`))
    );
  } catch {
    return false;
  }
}

const baseText = (field: string, max: number) =>
  z
    .string({ error: `${field} талбар текст байх ёстой.` })
    .trim()
    .max(max, { error: `${field} талбар хэт урт байна.` });

/** Accepts `null` from untouched form fields and stores it as "". */
const nullToEmpty = (value: unknown) => (value === null ? "" : value);

const text = (field: string, max: number) =>
  z.preprocess(nullToEmpty, baseText(field, max));

const color = (field: string) =>
  baseText(field, 7).regex(/^#[0-9A-Fa-f]{6}$/, {
    error: `${field} өнгөний код буруу байна.`,
  });

export const updateSiteSettingsSchema = z
  .object({
    company_name: z.preprocess(
      nullToEmpty,
      baseText("company_name", 200).min(1, {
        error: "Байгууллагын нэр хоосон байж болохгүй.",
      })
    ),
    company_description: text("company_description", 5000),
    phone: text("phone", 50),
    email: z.preprocess(
      nullToEmpty,
      baseText("email", 254).refine(
        (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        { error: "Имэйл хаягийн формат буруу байна." }
      )
    ),
    address: text("address", 1000),
    facebook_url: z.preprocess(
      nullToEmpty,
      baseText("facebook_url", 2048).refine(
        (value) => isAllowedSocialUrl(value, SOCIAL_DOMAINS.facebook_url),
        { error: "facebook_url холбоос буруу байна." }
      )
    ),
    instagram_url: z.preprocess(
      nullToEmpty,
      baseText("instagram_url", 2048).refine(
        (value) => isAllowedSocialUrl(value, SOCIAL_DOMAINS.instagram_url),
        { error: "instagram_url холбоос буруу байна." }
      )
    ),
    hero_title: text("hero_title", 300),
    hero_description: text("hero_description", 2000),
    hero_section_label: text("hero_section_label", 200),
    hero_badge_text: text("hero_badge_text", 200),
    hero_card_label: text("hero_card_label", 200),
    hero_card_title: text("hero_card_title", 300),
    hero_card_description: text("hero_card_description", 2000),
    primary_color: color("primary_color"),
    secondary_color: color("secondary_color"),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    error: "Шинэчлэх мэдээлэл байхгүй байна.",
  });

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
