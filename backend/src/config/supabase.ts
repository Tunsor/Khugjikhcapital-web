import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { env } from "./env.js";

const SERVER_AUTH_OPTIONS = {
  autoRefreshToken: false,
  persistSession: false,
  detectSessionInUrl: false,
} as const;

let adminClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

/**
 * Service-role client. Bypasses RLS — use ONLY after the caller has
 * been authorized (admin middleware) or for trusted server jobs.
 */
export function getAdminClient(): SupabaseClient {
  adminClient ??= createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: SERVER_AUTH_OPTIONS }
  );

  return adminClient;
}

/**
 * Anonymous client. Subject to RLS — used for public read endpoints.
 */
export function getPublicClient(): SupabaseClient {
  publicClient ??= createClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    { auth: SERVER_AUTH_OPTIONS }
  );

  return publicClient;
}

/**
 * Per-request client acting as the authenticated user, so database
 * RLS policies and auth.uid()-based RPCs keep working.
 */
export function createUserClient(accessToken: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: SERVER_AUTH_OPTIONS,
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
