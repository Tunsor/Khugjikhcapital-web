import { conflict } from "../../utils/http-error.js";
import { syncAllNews } from "./news-sync.js";
import { withMongolbankSyncLock } from "./sync-lock.js";

/**
 * Runs the Mongolbank + FRC news sync under a distributed lock.
 * Throws 409 if another sync is already running.
 */
export async function runNewsSync() {
  const result = await withMongolbankSyncLock(() => syncAllNews());

  if (result === null) {
    throw conflict("Мэдээ синк хийх ажиллагаа аль хэдийн явагдаж байна.", {
      "Retry-After": "60",
    });
  }

  return result;
}
