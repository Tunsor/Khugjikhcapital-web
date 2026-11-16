

const MONGOLBANK_ORIGIN = "https://www.mongolbank.mn";

const MAX_HTML_BYTES = 1024 * 1024;

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const code = parseInt(hex, 16);
      return code >= 0 &&
        code <= 0x10ffff &&
        !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code)
        : "";
    })
    .replace(/&#(\d+);/g, (_, decimal: string) => {
      const code = parseInt(decimal, 10);
      return code >= 0 &&
        code <= 0x10ffff &&
        !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code)
        : "";
    });
}

function getAttribute(
  tag: string,
  name: string
): string | null {
  const attributes =
    /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

  for (const match of tag.matchAll(attributes)) {
    if (match[1].toLowerCase() === name.toLowerCase()) {
      return decodeHtml(match[2] ?? match[3] ?? "");
    }
  }

  return null;
}

function normalizeImageUrl(
  value: string | null
): string | null {
  if (!value) return null;

  try {
    const url = new URL(value, MONGOLBANK_ORIGIN);

    if (
      url.origin !== MONGOLBANK_ORIGIN ||
      url.username ||
      url.password
    ) {
      return null;
    }

    const path = url.pathname.toLowerCase();

    if (!path.startsWith("/file/")) {
      return null;
    }

    const excludedPaths = [
      "/thumb/",
      "/images/logos/",
      "/images/cover/",
      "/images/icons/",
      "/images/icon/",
      "/logo",
      "/banner",
    ];

    if (
      excludedPaths.some((excluded) =>
        path.includes(excluded)
      )
    ) {
      return null;
    }

    if (!/\.(jpg|jpeg|png|webp)$/i.test(path)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function extractArticleImage(
  html: string
): string | null {
  const contentStart = html.search(
    /<div\b[^>]*class=["'][^"']*\bnews-content\b[^"']*["'][^>]*>/i
  );

  if (contentStart === -1) {
    return null;
  }

  const content = html.slice(
    contentStart,
    contentStart + 100_000
  );

  const imageTags =
    content.match(/<img\b[^>]*>/gi) ?? [];

  for (const tag of imageTags) {
    const source =
      getAttribute(tag, "data-src") ??
      getAttribute(tag, "src");

    const imageUrl = normalizeImageUrl(source);

    if (!imageUrl) continue;

    const width = Number(
      getAttribute(tag, "width") ?? "0"
    );

    const height = Number(
      getAttribute(tag, "height") ?? "0"
    );

    if (
      (width > 0 && width < 400) ||
      (height > 0 && height < 250)
    ) {
      continue;
    }

    return imageUrl;
  }

  return null;
}

export async function fetchMongolbankImage(
  sourceUrl: string
): Promise<string | null> {
  try {
    const url = new URL(sourceUrl);

    if (
      url.origin !== MONGOLBANK_ORIGIN ||
      url.username ||
      url.password ||
      !/^\/mn\/r\/\d+$/.test(url.pathname)
    ) {
      return null;
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "text/html",
      },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return null;
    }

    const contentType =
      response.headers.get("content-type") ?? "";

    if (
      !contentType
        .toLowerCase()
        .includes("text/html")
    ) {
      return null;
    }

    if (!response.body) {
      return null;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        totalBytes += value.byteLength;

        if (totalBytes > MAX_HTML_BYTES) {
          return null;
        }

        chunks.push(value);
      }
    } finally {
      await reader.cancel().catch(() => {});
    }

    const html = new TextDecoder("utf-8").decode(
      Buffer.concat(chunks)
    );

    return extractArticleImage(html);
  } catch (error) {
    console.error(
      "Mongolbank image fetch error:",
      error instanceof Error
        ? error.message
        : error
    );

    return null;
  }
}
