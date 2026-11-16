import { z } from "zod";

export const CALCULATOR_IDS = ["property", "car", "phone"] as const;

const finite = (field: string) =>
  z.number({ error: `${field} буруу байна.` }).finite({
    error: `${field} буруу байна.`,
  });

export const updateCalculatorSettingSchema = z
  .object({
    id: z.enum(CALCULATOR_IDS, { error: "Зээлийн төрөл буруу байна." }),
    monthly_interest_rate: finite("monthly_interest_rate")
      .min(0, { error: "Сарын хүү 0–100% байх ёстой." })
      .max(100, { error: "Сарын хүү 0–100% байх ёстой." }),
    max_dti_ratio: finite("max_dti_ratio")
      .gt(0, {
        error: "Өр-орлогын харьцаа 0-ээс их, 100%-иас хэтрэхгүй байх ёстой.",
      })
      .max(100, {
        error: "Өр-орлогын харьцаа 0-ээс их, 100%-иас хэтрэхгүй байх ёстой.",
      }),
    min_term_months: z.number().int().min(1),
    max_term_months: z.number().int().max(360),
    max_loan_amount: z
      .number({ error: "Зээлийн дээд хэмжээ буруу байна." })
      .finite()
      .positive({ error: "Зээлийн дээд хэмжээ буруу байна." })
      .nullable()
      .optional()
      .transform((value) => value ?? null),
    is_active: z.boolean({ error: "Идэвхтэй эсэх утга буруу байна." }),
  })
  .refine((value) => value.max_term_months >= value.min_term_months, {
    error: "Зээлийн хугацаа 1–360 сарын хооронд байх ёстой.",
  });

export type UpdateCalculatorSettingInput = z.infer<
  typeof updateCalculatorSettingSchema
>;
