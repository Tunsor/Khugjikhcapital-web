import { z } from "zod";

const booleanString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    ),
  TRUST_PROXY: booleanString,
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  TURNSTILE_SECRET_KEY: z.string().min(1),
  TURNSTILE_EXPECTED_HOSTNAME: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
  CRON_SECRET: z.string().min(32),
  RATE_LIMIT_HASH_SECRET: z.string().min(32),
  // Shared with the Next.js server so SSR traffic (one IP for every
  // visitor) is exempt from per-IP limits on public reads.
  INTERNAL_API_SECRET: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined)
    .pipe(z.string().min(32).optional()),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment configuration:\n" +
      z.prettifyError(parsed.error)
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
