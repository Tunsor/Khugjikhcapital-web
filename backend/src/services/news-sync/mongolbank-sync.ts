

import { getAdminClient as createAdminClient } from "../../config/supabase.js";
import { fetchMongolbankImage } from "./mongolbank-images.js";

type NewsCategory =
  | "loan"
  | "inflation"
  | "policy_rate"
  | "finance";

type MongolbankNews = {
  ID: number;
  TITLE: string;
  PUBLISH_DATE: string;
};

type NewsRow = {
  source_name: string;
  source_url: string;
  title: string;
  category: NewsCategory;
  published_at: string;
};

type ImageCandidate = {
  id: string;
  source_url: string;
  image_url: string | null;
  image_checked_at: string | null;
};

export type MongolbankSyncResult = {
  success: true;
  matched: number;
  deleted: number;
  images_checked: number;
  images_saved: number;
  images_missing: number;
  message: string;
};

const MONGOLBANK_ORIGIN =
  "https://www.mongolbank.mn";

const MAX_JSON_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_FETCHES = 10;

const CATEGORY_KEYWORDS: Record<
  NewsCategory,
  string[]
> = {
  loan: [
    "зээл",
    "зээлийн",
    "зээлдэгч",
    "зээлжих",
  ],
  inflation: [
    "инфляц",
    "үнийн өсөлт",
    "хэрэглээний үнийн индекс",
  ],
  policy_rate: [
    "бодлогын хүү",
    "мөнгөний бодлого",
    "мөнгөний бодлогын хороо",
  ],
  finance: [
    "санхүү",
    "банк",
    "валют",
    "ханш",
    "төлбөрийн систем",
  ],
};

// Мэдээг гарчгаар нь ангилах
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

// Монголбанкны API өгөгдлийг шалгах
function isMongolbankNews(
  value: unknown
): value is MongolbankNews {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.ID === "number" &&
    Number.isSafeInteger(item.ID) &&
    item.ID > 0 &&
    typeof item.TITLE === "string" &&
    item.TITLE.trim().length > 0 &&
    item.TITLE.trim().length <= 500 &&
    typeof item.PUBLISH_DATE === "string"
  );
}

// Огноог UTC ISO формат руу хөрвүүлэх
function parsePublishDate(
  value: string
): string | null {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
  );

  if (!match) return null;

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

  // UTC+08:00 огнооны календарийн шалгалт
  const daysInMonth = new Date(
    Date.UTC(year, month, 0)
  ).getUTCDate();

  if (day > daysInMonth) {
    return null;
  }

  const iso =
    `${match[1]}-${match[2]}-${match[3]}` +
    `T${match[4]}:${match[5]}:${match[6]}+08:00`;

  const date = new Date(iso);

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
}

// Сүүлийн 2 жилийн огнооны хязгаар
function getTwoYearCutoff(): string {
  const cutoff = new Date();

  cutoff.setUTCFullYear(
    cutoff.getUTCFullYear() - 2
  );

  return cutoff.toISOString();
}

// Хэмжээний хязгаартай JSON унших
async function readLimitedJson(
  response: Response
): Promise<unknown> {
  if (!response.body) {
    throw new Error(
      "Mongolbank API response body is empty"
    );
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_JSON_BYTES) {
        console.error(
          "Mongolbank JSON exceeded limit:",
          {
            receivedMiB: (
              totalBytes / (1024 * 1024)
            ).toFixed(2),
            limitMiB: (
              MAX_JSON_BYTES / (1024 * 1024)
            ).toFixed(2),
          }
        );

        throw new Error(
          `Mongolbank API response exceeds ${
            MAX_JSON_BYTES / (1024 * 1024)
          } MiB`
        );
      }

      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  const jsonText = new TextDecoder("utf-8").decode(
    Buffer.concat(chunks)
  );

  return JSON.parse(jsonText) as unknown;
}

// Монголбанкны мэдээ синк хийх
export async function syncMongolbankNews():
  Promise<MongolbankSyncResult> {

  // 1. Монголбанкны API-аас мэдээ авах
  const response = await fetch(
    `${MONGOLBANK_ORIGIN}/mn/category/5010`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({}),
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Mongolbank API HTTP ${response.status}`
    );
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  if (
    !contentType
      .toLowerCase()
      .includes("application/json")
  ) {
    throw new Error(
      "Mongolbank API returned non-JSON response"
    );
  }

  // 2. JSON-г хэмжээний хязгаартай унших
  const result = await readLimitedJson(response);

  if (
    typeof result !== "object" ||
    result === null ||
    !("data" in result) ||
    !Array.isArray(result.data)
  ) {
    throw new Error(
      "Invalid Mongolbank API response"
    );
  }

  // 3. Сүүлийн 2 жилийн мэдээг ангилах
  const cutoff = getTwoYearCutoff();
  const now = new Date().toISOString();

  const rows: NewsRow[] = result.data
    .filter(isMongolbankNews)
    .map((item): NewsRow | null => {
      const category = classifyNews(item.TITLE);

      const publishedAt = parsePublishDate(
        item.PUBLISH_DATE
      );

      if (
        !category ||
        !publishedAt ||
        publishedAt < cutoff ||
        publishedAt > now
      ) {
        return null;
      }

      return {
        source_name: "Монголбанк",
        source_url:
          `${MONGOLBANK_ORIGIN}/mn/r/${item.ID}`,
        title: item.TITLE.trim(),
        category,
        published_at: publishedAt,
      };
    })
    .filter(
      (item): item is NewsRow =>
        item !== null
    )
    .sort((a, b) =>
      b.published_at.localeCompare(
        a.published_at
      )
    );

  const admin = createAdminClient();

  // 4. Мэдээг Supabase-д хадгалах
  if (rows.length > 0) {
    const { error } = await admin
      .from("external_news")
      .upsert(rows, {
        onConflict: "source_url",
        ignoreDuplicates: true,
      });

    if (error) {
      throw new Error(
        `External news insert failed: ${error.message}`
      );
    }
  }

  // 5. Хоёр жилээс хуучин мэдээг устгах
  const {
    data: deletedCount,
    error: cleanupError,
  } = await admin.rpc(
    "cleanup_old_external_news"
  );

  if (cleanupError) {
    throw new Error(
      `External news cleanup failed: ${cleanupError.message}`
    );
  }

  // 6. Зураг шалгаагүй мэдээнүүдийг авах
  const {
    data: candidates,
    error: imageQueryError,
  } = await admin
    .from("external_news")
    .select(
      "id, source_url, image_url, image_checked_at"
    )
    .eq("source_name", "Монголбанк")
    .gte("published_at", cutoff)
    .lte("published_at", now)
    .is("image_checked_at", null)
    .order("published_at", {
      ascending: false,
    })
    .limit(MAX_IMAGE_FETCHES);

  if (imageQueryError) {
    throw new Error(
      `Image query failed: ${imageQueryError.message}`
    );
  }

  const imageCandidates =
    (candidates ?? []) as ImageCandidate[];

  let imagesSaved = 0;
  let imagesMissing = 0;

  // 7. Мэдээний үндсэн зургийг шалгах
  for (const item of imageCandidates) {
    const imageUrl = await fetchMongolbankImage(
      item.source_url
    );

    const checkedAt = new Date().toISOString();

    const updateData: {
      image_checked_at: string;
      updated_at: string;
      image_url?: string;
    } = {
      image_checked_at: checkedAt,
      updated_at: checkedAt,
    };

    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const { error: updateError } = await admin
      .from("external_news")
      .update(updateData)
      .eq("id", item.id);

    if (updateError) {
      console.error(
        "Mongolbank image update error:",
        updateError
      );

      imagesMissing++;
      continue;
    }

    if (imageUrl) {
      imagesSaved++;
    } else {
      imagesMissing++;
    }
  }

  // 8. Үр дүн буцаах
  return {
    success: true,
    matched: rows.length,
    deleted: deletedCount ?? 0,
    images_checked: imageCandidates.length,
    images_saved: imagesSaved,
    images_missing: imagesMissing,
    message:
      "Монголбанкны мэдээ болон зургуудыг синк хийлээ.",
  };
}
