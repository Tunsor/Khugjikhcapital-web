/** Response DTOs returned by the REST API. */

export type PublicSiteSettings = {
  company_name: string | null;
  company_description: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  hero_section_label: string | null;
  hero_badge_text: string | null;
  hero_card_label: string | null;
  hero_card_title: string | null;
  hero_card_description: string | null;
};

export type LoanProductSummary = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  interest_rate: number;
  max_amount: number | null;
  max_term: number;
  documents: string[] | null;
  sort_order: number;
};

export type LoanProductDetail = LoanProductSummary & {
  description: string | null;
  is_active: boolean;
  requirements: string[] | null;
};

export type CompanyNewsItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  category: string;
  published_at: string;
  image_url: string | null;
};

export type ExternalNewsItem = {
  id: string;
  title: string;
  summary: string | null;
  category: "loan" | "inflation" | "policy_rate" | "finance";
  published_at: string;
  source_name: string | null;
  source_url: string;
  image_url: string | null;
};
