/**
 * Minimal typed HTTP client for the Khugjikh Capital REST API.
 *
 * Every API response uses the envelope `{ data, meta?, message? }` on
 * success and `{ error }` on failure. Calls never throw for HTTP errors;
 * they resolve to an `ApiResult` so callers can branch on `error`/`status`.
 */

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ApiSuccess<T> = {
  data: T;
  meta: PaginationMeta | null;
  message: string | null;
  error: null;
  status: number;
};

export type ApiFailure = {
  data: null;
  meta: null;
  message: null;
  error: string;
  status: number;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Plain objects are sent as JSON; FormData is sent as multipart. */
  body?: unknown;
  query?: Record<string, QueryValue>;
  token?: string | null;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const NETWORK_ERROR = "Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.";

export function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, QueryValue>
): string {
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function request<T>(
  baseUrl: string,
  path: string,
  { method = "GET", body, query, token, headers: extraHeaders, signal }: RequestOptions = {}
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    ...extraHeaders,
    Accept: "application/json",
  };
  let payload: BodyInit | undefined;

  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(baseUrl, path, query), {
      method,
      headers,
      body: payload,
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    console.error(`API ${method} ${path} failed:`, error);
    return failure(NETWORK_ERROR, 0);
  }

  if (response.status === 204) {
    return success(null as T, null, null, 204);
  }

  let json: Record<string, unknown> | null = null;

  try {
    json = await response.json();
  } catch {
    // Non-JSON body (e.g. proxy error page)
  }

  if (!response.ok) {
    const message =
      typeof json?.error === "string" ? json.error : "Серверийн алдаа гарлаа.";

    return failure(message, response.status);
  }

  return success(
    (json?.data ?? null) as T,
    (json?.meta as PaginationMeta | undefined) ?? null,
    typeof json?.message === "string" ? json.message : null,
    response.status
  );
}

function success<T>(
  data: T,
  meta: PaginationMeta | null,
  message: string | null,
  status: number
): ApiSuccess<T> {
  return { data, meta, message, error: null, status };
}

function failure(error: string, status: number): ApiFailure {
  return { data: null, meta: null, message: null, error, status };
}
