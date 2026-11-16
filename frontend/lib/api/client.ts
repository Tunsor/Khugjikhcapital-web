// Browser-only helpers (used from Client Components).
import { createClient } from "@/lib/supabase/client";
import { PUBLIC_API_URL } from "./config";
import { buildUrl, request, type ApiResult, type RequestOptions } from "./http";

/** Public API call from the browser. */
export function api<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
  return request<T>(PUBLIC_API_URL, path, options);
}

async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await createClient().auth.getSession();

  return session?.access_token ?? null;
}

/** Admin API call from the browser — attaches the Supabase access token. */
export async function adminApi<T>(
  path: string,
  options: Omit<RequestOptions, "token"> = {}
): Promise<ApiResult<T>> {
  const token = await getAccessToken();

  if (!token) {
    return {
      data: null,
      meta: null,
      message: null,
      error: "Нэвтрэх шаардлагатай.",
      status: 401,
    };
  }

  return request<T>(PUBLIC_API_URL, `/admin${path}`, { ...options, token });
}

/**
 * Downloads a protected file. A plain <a href> cannot carry the Bearer
 * token, so the file is fetched as a blob and saved via an object URL.
 */
export async function adminDownload(path: string, fallbackName: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Нэвтрэх шаардлагатай.");
  }

  const response = await fetch(buildUrl(PUBLIC_API_URL, `/admin${path}`), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.error ?? "Файлыг нээх боломжгүй байна.");
  }

  const disposition = response.headers.get("Content-Disposition") ?? "";
  const fileName = /filename="([^"]+)"/.exec(disposition)?.[1] ?? fallbackName;

  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
