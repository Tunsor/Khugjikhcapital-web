import { z } from "zod";

export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "approved",
  "rejected",
] as const;

const INVALID_INPUT = "Оруулсан мэдээлэл дутуу эсвэл буруу байна.";
const TOO_LONG = "Оруулсан текстийн урт хэтэрсэн байна.";

/**
 * Multipart text fields of the public loan application form.
 * The Turnstile token travels in the `X-Turnstile-Token` header instead.
 */
export const createApplicationSchema = z.object({
  lastName: z
    .string({ error: INVALID_INPUT })
    .trim()
    .min(1, { error: INVALID_INPUT })
    .max(100, { error: TOO_LONG }),
  firstName: z
    .string({ error: INVALID_INPUT })
    .trim()
    .min(1, { error: INVALID_INPUT })
    .max(100, { error: TOO_LONG }),
  phone: z
    .string({ error: INVALID_INPUT })
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^\d{8}$/, { error: "Утасны дугаар 8 оронтой байх ёстой." })),
  registerNumber: z
    .string({ error: INVALID_INPUT })
    .transform((value) => value.replace(/\s/g, "").toUpperCase())
    .pipe(
      z.string().regex(/^[А-ЯӨҮЁ]{2}\d{8}$/, {
        error: "Регистрийн дугаар 2 кирилл үсэг, 8 цифртэй байх ёстой.",
      })
    ),
  loanType: z
    .string({ error: INVALID_INPUT })
    .trim()
    .min(1, { error: INVALID_INPUT })
    .max(100, { error: TOO_LONG }),
  amount: z.coerce
    .number({ error: INVALID_INPUT })
    .finite({ error: INVALID_INPUT })
    .positive({ error: INVALID_INPUT }),
  term: z.coerce
    .number({ error: INVALID_INPUT })
    .int({ error: INVALID_INPUT })
    .positive({ error: INVALID_INPUT }),
  monthlyIncome: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? Number(value) : null))
    .refine(
      (value) => value === null || (Number.isFinite(value) && value >= 0),
      { error: "Сарын орлогын хэмжээ буруу байна." }
    ),
  note: z
    .string()
    .trim()
    .max(2000, { error: TOO_LONG })
    .optional()
    .transform((value) => value || null),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES, {
    error: "Зөвшөөрөгдөөгүй төлөв байна.",
  }),
});
