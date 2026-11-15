import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import type { PostFormInput } from "@/lib/validation/admin";
import { PostForm } from "@/components/admin/post-form";

export const metadata: Metadata = { title: "Edit note" };

export default async function EditNote({ params }: PageProps<"/admin/notes/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  let defaults: PostFormInput = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    cover_image: "",
    published: false,
  };

  if (id !== "new") {
    const { data: p } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
    if (!p) notFound();
    defaults = { ...p, tags: p.tags.join(", "), cover_image: p.cover_image ?? "" };
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{id === "new" ? "New note" : defaults.title}</h1>
      <PostForm
        id={id === "new" ? null : id}
        defaults={defaults}
        mediaBase={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-media`}
      />
    </div>
  );
}
