

import { getAdminClient as createAdminClient } from "../../config/supabase.js";

const LOCK_NAME = "mongolbank_news";
const LOCK_SECONDS = 600;
const RENEW_INTERVAL_MS = 60_000;

export async function withMongolbankSyncLock<T>(
  task: () => Promise<T>
): Promise<T | null> {
  const admin = createAdminClient();

  const { data: token, error: acquireError } =
    await admin.rpc("acquire_sync_lock", {
      p_lock_name: LOCK_NAME,
      p_lock_seconds: LOCK_SECONDS,
    });

  if (acquireError) {
    throw new Error(
      `Failed to acquire sync lock: ${acquireError.message}`
    );
  }

  if (!token) {
    return null;
  }

  let lockLost = false;
  // Давхар renewal хүсэлт явуулахгүй.
  let renewing = false;

  const renewTimer = setInterval(async () => {
    if (renewing || lockLost) return;

    renewing = true;

    try {
      const { data: renewed, error } =
        await admin.rpc("renew_sync_lock", {
          p_lock_name: LOCK_NAME,
          p_lock_token: token,
          p_lock_seconds: LOCK_SECONDS,
        });

      if (error || !renewed) {
        lockLost = true;

        console.error(
          "Mongolbank sync lock renewal failed:",
          error?.message ?? "Lock expired or ownership lost"
        );
      }
    } catch (error) {
      lockLost = true;
      console.error("Mongolbank sync renewal error:", error);
    } finally {
      renewing = false;
    }
  }, RENEW_INTERVAL_MS);

  try {
    const result = await task();

    if (lockLost) {
      throw new Error(
        "Mongolbank sync lock was lost during execution"
      );
    }

    return result;
  } finally {
    clearInterval(renewTimer);

    const { data: released, error: releaseError } =
      await admin.rpc("release_sync_lock", {
        p_lock_name: LOCK_NAME,
        p_lock_token: token,
      });

    if (releaseError) {
      console.error(
        "Failed to release Mongolbank sync lock:",
        releaseError.message
      );
    } else if (!released) {
      console.warn(
        "Mongolbank sync lock was not released; it may have expired."
      );
    }
  }
}
