import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getServerApiUrl } from "./config";
import { request, type ApiResult, type RequestOptions } from "./http";

type GetOptions = Pick<RequestOptions, "query">;

/**
 * Identifies this Next.js server to the API so SSR traffic — one IP for
 * every visitor — is exempt from the API's per-IP limit on public reads.
 */
function internalHeaders(): Record<string, string> | undefined {
  const secret = process.env.INTERNAL_API_SECRET;
  return secret ? { "X-Internal-Api-Key": secret } : undefined;
}

/** Public API call from a Server Component (no user credentials). */
export function apiGet<T>(path: string, options?: GetOptions): Promise<ApiResult<T>> {
  return request<T>(getServerApiUrl(), path, { ...options, headers: internalHeaders() });
}

/** Reads the admin's Supabase access token from the session cookie. */
async function getAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // The token is verified by the API on every request; here we only forward it.
  return session?.access_token ?? null;
}

export type AdminResult<T> =
  | { data: T; forbidden: false; error: null }
  | { data: null; forbidden: true; error: string }
  | { data: null; forbidden: false; error: string; status: number };

/**
 * Admin API call from a Server Component.
 * - No session / expired token (401) → redirects to the login page.
 * - Not an admin (403) → `forbidden: true` so the page can render a notice.
 */
export async function adminGet<T>(
  path: string,
  options?: GetOptions
): Promise<AdminResult<T>> {
  const token = await getAccessToken();

  if (!token) {
    redirect("/admin/login");
  }

  const result = await request<T>(getServerApiUrl(), `/admin${path}`, {
    ...options,
    token,
  });

  if (result.status === 401) {
    redirect("/admin/login");
  }

  if (result.status === 403) {
    return { data: null, forbidden: true, error: result.error ?? "Хандах эрхгүй." };
  }

  if (result.error !== null) {
    return { data: null, forbidden: false, error: result.error, status: result.status };
  }

  return { data: result.data, forbidden: false, error: null };
}
