import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Cookie-less client for public content. Safe to call inside `'use cache'`
 * functions because it never touches request data. RLS limits it to
 * published rows.
 */
export function createPublicClient() {
  return createClient<Database, "portfolio">(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    db: { schema: "portfolio" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
