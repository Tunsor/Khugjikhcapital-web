import { z } from "zod";

import { UUID_REGEX } from "../../utils/validation.js";

const nullToEmpty = (value: unknown) => (value === null ? "" : value);

const required = (label: string, max: number) =>
  z.preprocess(
    nullToEmpty,
    z
      .string({ error: `${label} текст байх ёстой.` })
      .trim()
      .min(1, { error: `${label} хоосон байж болохгүй.` })
      .max(max, { error: `${label} хэт урт байна.` })
  );

const optional = (label: string, max: number) =>
  z
    .preprocess(
      nullToEmpty,
      z
        .string({ error: `${label} текст байх ёстой.` })
        .trim()
        .max(max, { error: `${label} хэт урт байна.` })
    )
    .transform((value) => (value === "" ? null : value));

export const paymentAccountSchema = z.object({
  bank_name: required("Банкны нэр", 200),
  account_holder: required("Данс эзэмшигч", 200),
  account_number: required("Дансны дугаар", 64),
  iban: optional("IBAN", 64),
  description: optional("Тайлбар", 1000),
  is_active: z.boolean({ error: "Төлөв буруу байна." }).default(true),
});

export type PaymentAccountInput = z.infer<typeof paymentAccountSchema>;

export const reorderSchema = z.object({
  ids: z
    .array(z.string().regex(UUID_REGEX, { error: "ID буруу байна." }))
    .min(1)
    .max(100),
});
