import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Notes" };

export default async function AdminNotes() {
  const { supabase } = await requireAdmin();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
        <ButtonLink href="/admin/notes/new" size="sm">
          <Plus className="size-4" aria-hidden="true" /> New note
        </ButtonLink>
      </div>
      {(posts ?? []).length === 0 ? (
        <p className="text-fg-muted">No notes yet.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {(posts ?? []).map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Link href={`/admin/notes/${p.id}`} className="font-medium hover:text-accent">
                {p.title}
              </Link>
              <span className="font-mono text-xs text-fg-subtle">/{p.slug}</span>
              <span className="ml-auto">
                <Badge tone={p.published ? "accent" : "neutral"}>{p.published ? "Published" : "Draft"}</Badge>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
