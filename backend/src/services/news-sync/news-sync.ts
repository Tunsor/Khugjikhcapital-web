

import { syncMongolbankNews } from "./mongolbank-sync.js";
import { syncFrcNews } from "./frc-sync.js";

export async function syncAllNews() {
  const [mongolbank, frc] = await Promise.allSettled([
    syncMongolbankNews(),
    syncFrcNews(),
  ]);

  if (mongolbank.status === "rejected") {
    console.error(
      "Mongolbank sync failed:",
      mongolbank.reason
    );
  }

  if (frc.status === "rejected") {
    console.error(
      "FRC sync failed:",
      frc.reason
    );
  }

  return {
    success:
      mongolbank.status === "fulfilled" &&
      frc.status === "fulfilled",

    mongolbank:
      mongolbank.status === "fulfilled"
        ? mongolbank.value
        : {
            success: false,
            message: "Монголбанкны синк амжилтгүй.",
          },

    frc:
      frc.status === "fulfilled"
        ? frc.value
        : {
            success: false,
            message: "СЗХ-ийн синк амжилтгүй.",
          },
  };
}
