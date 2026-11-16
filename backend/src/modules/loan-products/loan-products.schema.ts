import { z } from "zod";

const stringList = z
  .array(z.string().trim().max(500))
  .max(50)
  .default([])
  .transform((items) => items.filter(Boolean));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);

export const loanProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Бүтээгдэхүүний нэр болон slug заавал шаардлагатай." })
    .max(200),
  slug: z
    .string()
    .trim()
    .min(1, { error: "Бүтээгдэхүүний нэр болон slug заавал шаардлагатай." })
    .max(100)
    .regex(/^[^\s/?#%\\]+$/, {
      error: "Slug хоосон зай болон тусгай тэмдэгт агуулж болохгүй.",
    }),
  interest_rate: z
    .number({ error: "Зээлийн хүүг зөв оруулна уу." })
    .finite()
    .min(0, { error: "Зээлийн хүүг зөв оруулна уу." }),
  max_amount: z
    .number({ error: "Зээлийн дээд хэмжээг зөв оруулна уу." })
    .finite()
    .positive({ error: "Зээлийн дээд хэмжээг зөв оруулна уу." })
    .nullish()
    .transform((value) => value ?? null),
  max_term: z
    .number({ error: "Зээлийн хугацааг зөв оруулна уу." })
    .int({ error: "Зээлийн хугацааг зөв оруулна уу." })
    .min(1, { error: "Зээлийн хугацааг зөв оруулна уу." }),
  short_description: optionalText(1000),
  description: optionalText(20_000),
  requirements: stringList,
  documents: stringList.refine((items) => items.length <= 10, {
    error: "Шаардлагатай баримт бичгийн тоо 10-аас ихгүй байна.",
  }),
  is_active: z.boolean().default(true),
});

export const reorderSchema = z.object({
  ids: z
    .array(z.uuid())
    .min(1)
    .max(500)
    .refine((ids) => new Set(ids).size === ids.length, {
      error: "Давхардсан ID байна.",
    }),
});

export type LoanProductInput = z.infer<typeof loanProductSchema>;
