import type { SupabaseClient, User } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      /** Populated by `requireAdmin` middleware. */
      auth?: {
        user: User;
        /** Supabase client scoped to the caller (RLS applies). */
        supabase: SupabaseClient;
      };
    }
  }
}

export {};
