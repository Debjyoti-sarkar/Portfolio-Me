/**
 * Grants portfolio admin access to one account.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='long-random-pass' npm run admin:create
 *
 * - If the user does not exist, it is created with ADMIN_PASSWORD.
 * - If it already exists (e.g. you also use the same Supabase project for
 *   another app), its password is left untouched unless RESET_PASSWORD=1.
 *
 * Uses the service-role key, so it only ever runs on your machine — never
 * in the browser and never in the Next.js app.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const resetPassword = process.env.RESET_PASSWORD === "1";

if (!url || !serviceKey || !email) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAIL.");
  process.exit(1);
}
if (password !== undefined && password.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  db: { schema: "portfolio" },
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: list, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;
  let user = list.users.find((u) => u.email?.toLowerCase() === email!.toLowerCase());

  if (!user) {
    if (!password) throw new Error("ADMIN_PASSWORD is required to create a new user.");
    const { data, error } = await admin.auth.admin.createUser({ email: email!, password, email_confirm: true });
    if (error) throw error;
    user = data.user;
    console.log(`Created user ${email}`);
  } else if (resetPassword && password) {
    const { error } = await admin.auth.admin.updateUserById(user.id, { password });
    if (error) throw error;
    console.log(`User ${email} exists — password reset (RESET_PASSWORD=1)`);
  } else {
    // Shared project: never silently change the password of an existing account.
    console.log(`User ${email} exists — keeping their current password`);
  }

  const { error: upsertError } = await admin.from("admins").upsert({ user_id: user.id });
  if (upsertError) throw upsertError;
  console.log("Admin access granted.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
