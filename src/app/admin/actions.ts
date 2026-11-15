"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data/content";
import { createSessionClient } from "@/lib/supabase/server";
import {
  loginSchema,
  postSchema,
  projectSchema,
  type PostFormInput,
  type ProjectFormInput,
} from "@/lib/validation/admin";

export type ActionResult =
  { ok: true; id?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const uuid = z.uuid();

function fail(error: string, fieldErrors?: Record<string, string[] | undefined>): ActionResult {
  return { ok: false, error, fieldErrors: fieldErrors as Record<string, string[]> | undefined };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function signIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return fail("Check your email and password.", z.flattenError(parsed.error).fieldErrors);

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message for unknown user / wrong password: don't leak which.
  if (error) return fail("Invalid email or password.");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return fail("This account doesn't have admin access.");
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function saveProject(id: string | null, input: ProjectFormInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  if (id && !uuid.safeParse(id).success) return fail("Invalid project id.");

  const values = parsed.data;
  const query = id
    ? supabase.from("projects").update(values).eq("id", id).select("id, slug").single()
    : supabase.from("projects").insert(values).select("id, slug").single();
  const { data, error } = await query;
  if (error) {
    return fail(error.code === "23505" ? "That slug is already used by another project." : error.message);
  }

  updateTag(TAGS.projects);
  updateTag(`project:${data.slug}`);
  return { ok: true, id: data.id };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!uuid.safeParse(id).success) return fail("Invalid project id.");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return fail(error.message);
  updateTag(TAGS.projects);
  updateTag(TAGS.achievements);
  redirect("/admin/projects");
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------
export async function savePost(id: string | null, input: PostFormInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  if (id && !uuid.safeParse(id).success) return fail("Invalid post id.");

  let publishedAt: string | null = null;
  if (parsed.data.published) {
    // Keep the original publish date when re-saving a published post.
    const existing = id
      ? (await supabase.from("blog_posts").select("published_at").eq("id", id).maybeSingle()).data
      : null;
    publishedAt = existing?.published_at ?? new Date().toISOString();
  }

  const values = { ...parsed.data, published_at: publishedAt };
  const query = id
    ? supabase.from("blog_posts").update(values).eq("id", id).select("id, slug").single()
    : supabase.from("blog_posts").insert(values).select("id, slug").single();
  const { data, error } = await query;
  if (error) return fail(error.code === "23505" ? "That slug is already used by another note." : error.message);

  updateTag(TAGS.posts);
  updateTag(`post:${data.slug}`);
  return { ok: true, id: data.id };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!uuid.safeParse(id).success) return fail("Invalid post id.");
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return fail(error.message);
  updateTag(TAGS.posts);
  redirect("/admin/notes");
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!uuid.safeParse(id).success) return;
  await supabase.from("contact_messages").update({ read }).eq("id", id);
  refresh();
}

export async function deleteMessage(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!uuid.safeParse(id).success) return;
  await supabase.from("contact_messages").delete().eq("id", id);
  refresh();
}
