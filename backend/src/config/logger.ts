import { pino } from "pino";

import { env, isProduction } from "./env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    remove: true,
  },
  // pino-pretty is a devDependency: never use it in production or on
  // Vercel (it is not installed there, whatever NODE_ENV says).
  ...(isProduction || process.env.VERCEL
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss" },
        },
      }),
});
