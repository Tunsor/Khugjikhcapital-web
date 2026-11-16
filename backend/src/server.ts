import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 API listening on http://localhost:${env.PORT}/api/v1`);
});

function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close((error) => {
    if (error) {
      logger.error({ err: error }, "Error during shutdown");
      process.exit(1);
    }

    process.exit(0);
  });

  // Force exit if connections do not close in time.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection");
});
