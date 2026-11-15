"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

let client: ReturnType<typeof createBrowserClient<Database, "portfolio">> | undefined;

/** Singleton browser client (admin uploads). Uses only public credentials. */
export function getBrowserClient() {
  client ??= createBrowserClient<Database, "portfolio">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { db: { schema: "portfolio" } },
  );
  return client;
}
