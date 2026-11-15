import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * Data Access Layer: the single place that decides "is this request the
 * site owner?". Verified against Supabase Auth (getUser hits the auth
 * server) plus the admins allow-list via the is_admin() SQL function.
 */
export const getAdmin = cache(async () => {
  // Admin UI is always request-time: never prerender anything session-derived.
  await connection();
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return isAdmin ? { user, supabase } : null;
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login?error=forbidden");
  return admin;
}
