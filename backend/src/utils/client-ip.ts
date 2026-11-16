import { isIPv4, isIPv6 } from "node:net";

import type { Request } from "express";

import { env } from "../config/env.js";

/**
 * Client IP as reported by a trusted reverse proxy. Returns null when no
 * proxy is configured — used where a wrong IP would be worse than none
 * (e.g. Turnstile's optional `remoteip`).
 */
export function getClientIp(req: Request): string | null {
  return env.TRUST_PROXY ? req.ip ?? null : null;
}

/**
 * Key for per-IP rate limiting. Always returns a value: with `trust proxy`
 * Express resolves X-Forwarded-For, otherwise `req.ip` is the socket
 * address, which the client cannot spoof.
 *
 * IPv6 addresses are bucketed by their /64 prefix, since a single host
 * usually controls a whole /64 and could otherwise rotate addresses.
 */
export function getRateLimitIp(req: Request): string {
  const raw = req.ip ?? req.socket.remoteAddress ?? "";
  return normalizeIp(raw) ?? "unknown";
}

function normalizeIp(raw: string): string | null {
  const ip = raw.trim();

  // IPv4-mapped IPv6 (::ffff:1.2.3.4) → plain IPv4.
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  if (mapped) return mapped[1]!;

  if (isIPv4(ip)) return ip;

  if (isIPv6(ip)) {
    const groups = expandIPv6(ip.split("%")[0]!);
    return groups ? `${groups.slice(0, 4).join(":")}::/64` : ip;
  }

  return ip || null;
}

function expandIPv6(ip: string): string[] | null {
  const [head = "", tail] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];

  // An embedded IPv4 tail counts as two groups; it only affects the last 64
  // bits, so a placeholder is enough for /64 bucketing.
  const fix = (parts: string[]) =>
    parts.flatMap((part) => (part.includes(".") ? ["0", "0"] : [part]));

  const l = fix(left);
  const r = fix(right);
  const missing = tail === undefined ? 0 : 8 - l.length - r.length;

  if (missing < 0) return null;

  const groups = [...l, ...Array<string>(missing).fill("0"), ...r];
  if (groups.length !== 8) return null;

  return groups.map((group) => (parseInt(group, 16) || 0).toString(16));
}
