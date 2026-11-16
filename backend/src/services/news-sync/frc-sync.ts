

import { getAdminClient as createAdminClient } from "../../config/supabase.js";

// ======================================================
// TYPES
// ======================================================

type NewsCategory =
  | "loan"
  | "inflation"
  | "policy_rate"
  | "finance";

type FrcNews = {
  iDs: number;
  subject: string;
  ognoo: string;
  picurl?: string | null;
  menuname?: string | null;
};

type NewsRow = {
  source_name: string;
  source_url: string;
  title: string;
  category: NewsCategory;
  published_at: string;
  image_url: string | null;
  image_checked_at: string;
};

export type FrcSyncResult = {
  success: true;
  received: number;
  matched: number;
  message: string;
};

// ======================================================
// CONSTANTS
// ======================================================

const FRC_API =
  "https://www.frc.mn:5001/api/news?site=main&lang=mn";

const FRC_ORIGIN = "https://www.frc.mn";

const SOURCE_NAME = "Санхүүгийн зохицуулах хороо";

const MAX_JSON_BYTES = 10 * 1024 * 1024;

const CATEGORY_KEYWORDS: Record<
  NewsCategory,
  string[]
> = {
  loan: [
    "зээл",
    "зээлийн",
    "зээлдэгч",
    "ббсб",
    "банк бус",
    "хоршоо",
  ],

  inflation: [
    "инфляц",
    "үнийн өсөлт",
    "хэрэглээний үнийн индекс",
  ],

  policy_rate: [
    "бодлогын хүү",
    "мөнгөний бодлого",
  ],

  finance: [
    "санхүү",
    "санхүүгийн",
    "банк",
    "хөрөнгө оруулалт",
    "үнэт цаас",
    "даатгал",
    "зохицуулалт",
  ],
};

// ======================================================
// CATEGORY CLASSIFICATION
// ======================================================

function classifyNews(
  title: string
): NewsCategory | null {
  const normalized = title.toLowerCase();

  for (const [category, keywords] of Object.entries(
    CATEGORY_KEYWORDS
  ) as [NewsCategory, string[]][]) {
    if (
      keywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return category;
    }
  }

  return null;
}

// ======================================================
// API DATA VALIDATION
// ======================================================

function isFrcNews(
  value: unknown
): value is FrcNews {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.iDs === "number" &&
    Number.isSafeInteger(item.iDs) &&
    item.iDs > 0 &&
    typeof item.subject === "string" &&
    item.subject.trim().length > 0 &&
    item.subject.trim().length <= 500 &&
    typeof item.ognoo === "string" &&
    (
      item.picurl === undefined ||
      item.picurl === null ||
      typeof item.picurl === "string"
    )
  );
}

// ======================================================
// DATE PARSING
// ======================================================

function parseFrcDate(
  value: string
): string | null {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?$/
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);

  if (
    year < 1 ||
    year > 9999 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return null;
  }

  const daysInMonth = new Date(
    Date.UTC(year, month, 0)
  ).getUTCDate();

  if (day > daysInMonth) {
    return null;
  }

  // СЗХ-ийн огноог Монголын UTC+08:00
  // цагийн бүсээр хөрвүүлнэ.
  const iso =
    `${match[1]}-${match[2]}-${match[3]}` +
    `T${match[4]}:${match[5]}:${match[6]}+08:00`;

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

// ======================================================
// IMAGE URL
// ======================================================

function getFrcImageUrl(
  picurl: string | null | undefined
): string | null {
  if (!picurl?.trim()) {
    return null;
  }

  try {
    const url = new URL(
      picurl.trim(),
      FRC_ORIGIN
    );

    // Зөвхөн СЗХ-ийн HTTPS зураг
    if (
      url.protocol !== "https:" ||
      url.hostname !== "www.frc.mn" ||
      url.port !== "" ||
      url.username !== "" ||
      url.password !== ""
    ) {
      return null;
    }

    // Зөвхөн мэдээний зургийн хавтас
    if (
      !url.pathname.startsWith(
        "/resources/Image/News/"
      )
    ) {
      return null;
    }

    // Зургийн өргөтгөлийг шалгах
    if (
      !/\.(jpg|jpeg|png|webp)$/i.test(
        url.pathname
      )
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

// ======================================================
// TWO YEAR CUTOFF
// ======================================================

function getTwoYearCutoff(): string {
  const cutoff = new Date();

  cutoff.setUTCFullYear(
    cutoff.getUTCFullYear() - 2
  );

  return cutoff.toISOString();
}

// ======================================================
// LIMITED JSON READER
// ======================================================

async function readLimitedJson(
  response: Response
): Promise<unknown> {
  if (!response.body) {
    throw new Error(
      "FRC API response body is empty"
    );
  }

  const reader = response.body.getReader();

  const chunks: Uint8Array[] = [];

  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } =
        await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.byteLength;

      if (totalBytes > MAX_JSON_BYTES) {
        throw new Error(
          `FRC API response exceeds ${
            MAX_JSON_BYTES / (1024 * 1024)
          } MiB`
        );
      }

      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  const jsonText = new TextDecoder(
    "utf-8"
  ).decode(
    Buffer.concat(chunks)
  );

  return JSON.parse(jsonText) as unknown;
}

// ======================================================
// MAIN SYNC FUNCTION
// ======================================================

export async function syncFrcNews():
  Promise<FrcSyncResult> {

  // ----------------------------------------------------
  // 1. СЗХ-ийн API-аас мэдээ татах
  // ----------------------------------------------------

  const response = await fetch(
    FRC_API,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },

      redirect: "error",


      signal: AbortSignal.timeout(30000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `FRC API HTTP ${response.status}`
    );
  }

  // ----------------------------------------------------
  // 2. Content-Type шалгах
  // ----------------------------------------------------

  const contentType =
    response.headers.get(
      "content-type"
    ) ?? "";

  if (
    !contentType
      .toLowerCase()
      .includes("application/json")
  ) {
    throw new Error(
      "FRC API returned non-JSON response"
    );
  }

  // ----------------------------------------------------
  // 3. JSON унших
  // ----------------------------------------------------

  const payload =
    await readLimitedJson(response);

  if (!Array.isArray(payload)) {
    throw new Error(
      "Invalid FRC API response"
    );
  }

  // ----------------------------------------------------
  // 4. Огнооны хязгаар
  // ----------------------------------------------------

  const cutoff =
    getTwoYearCutoff();

  const now =
    new Date().toISOString();

  // ----------------------------------------------------
  // 5. Мэдээ ангилах
  // ----------------------------------------------------

  const rows: NewsRow[] = payload
    .filter(isFrcNews)
    .map(
      (item): NewsRow | null => {
        const title =
          item.subject.trim();

        const category =
          classifyNews(title);

        const publishedAt =
          parseFrcDate(
            item.ognoo
          );

        if (
          !category ||
          !publishedAt ||
          publishedAt < cutoff ||
          publishedAt > now
        ) {
          return null;
        }

        const imageUrl =
          getFrcImageUrl(
            item.picurl
          );

        return {
          source_name: SOURCE_NAME,

          source_url:
            `${FRC_ORIGIN}/#/view/${item.iDs}`,

          title,

          category,

          published_at:
            publishedAt,

          image_url:
            imageUrl,

          image_checked_at:
            now,
        };
      }
    )
    .filter(
      (item): item is NewsRow =>
        item !== null
    );

  // ----------------------------------------------------
  // 6. Давхардсан мэдээг арилгах
  // ----------------------------------------------------

  const uniqueRows = Array.from(
    new Map(
      rows.map(
        (row) => [
          row.source_url,
          row,
        ]
      )
    ).values()
  );

  // ----------------------------------------------------
  // 7. Supabase client
  // ----------------------------------------------------

  const admin =
    createAdminClient();

  // ----------------------------------------------------
  // 8. Мэдээг хадгалах
  // ----------------------------------------------------

  if (uniqueRows.length > 0) {
    const { error } = await admin
      .from("external_news")
      .upsert(
        uniqueRows,
        {
          onConflict: "source_url",
          ignoreDuplicates: true,
        }
      );

    if (error) {
      throw new Error(
        `FRC news insert failed: ${
          error.message
        }`
      );
    }
  }

  // ----------------------------------------------------
  // 9. Үр дүн буцаах
  // ----------------------------------------------------

  return {
    success: true,

    received: payload.length,

    matched: uniqueRows.length,

    message:
      "Санхүүгийн зохицуулах хорооны мэдээг амжилттай синк хийлээ.",
  };
}
