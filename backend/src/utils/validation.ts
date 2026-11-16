import type { z } from "zod";

import { badRequest } from "./http-error.js";

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Parse input with a zod schema, throwing a 400 with the first issue. */
export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  input: unknown,
  fallbackMessage = "Илгээсэн мэдээлэл буруу байна."
): z.infer<T> {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    const message =
      issue && issue.message && !issue.message.startsWith("Invalid")
        ? issue.message
        : fallbackMessage;

    throw badRequest(message);
  }

  return result.data;
}

export function assertUuid(id: string, message = "ID буруу байна.") {
  if (!UUID_REGEX.test(id)) {
    throw badRequest(message);
  }
}
