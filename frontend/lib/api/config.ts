/**
 * Base URL of the REST API, as seen by the browser.
 * e.g. https://api.khugjikh.mn/api/v1
 */
export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

/**
 * Base URL used by Server Components / Proxy. Can point to an internal
 * address (e.g. http://api:4000/api/v1 in Docker) — falls back to the
 * public URL.
 */
export function getServerApiUrl(): string {
  return process.env.API_URL ?? PUBLIC_API_URL;
}
