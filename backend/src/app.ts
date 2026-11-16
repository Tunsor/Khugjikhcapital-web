import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");

  // Needed for correct req.ip / protocol behind Vercel, Nginx, Cloudflare...
  if (env.TRUST_PROXY) {
    app.set("trust proxy", 1);
  }

  app.use(helmet());

  app.use(
    cors({
      origin(origin, callback) {
        // Server-to-server calls (Next.js SSR, cron) send no Origin header.
        if (!origin || env.CORS_ORIGINS.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Authorization", "Content-Type", "X-Turnstile-Token"],
      exposedHeaders: ["Content-Disposition", "Retry-After"],
      maxAge: 600,
    })
  );

  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => req.url === "/api/v1/health" },
    })
  );

  app.use(express.json({ limit: "200kb" }));

  app.use("/api/v1", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
