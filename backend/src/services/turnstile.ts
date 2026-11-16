import { env } from "../config/env.js";

type TurnstileResult = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Verifies a Cloudflare Turnstile token. Throws if the service is down. */
export async function verifyTurnstile(
  token: string,
  ip: string | null
): Promise<boolean> {
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });

  if (ip) {
    body.set("remoteip", ip);
  }

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("Turnstile service unavailable");
  }

  const result = (await response.json()) as TurnstileResult;

  if (!result.success) {
    return false;
  }

  if (
    env.TURNSTILE_EXPECTED_HOSTNAME &&
    result.hostname !== env.TURNSTILE_EXPECTED_HOSTNAME
  ) {
    return false;
  }

  return true;
}
