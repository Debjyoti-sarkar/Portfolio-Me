import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjects() {
  const { supabase } = await requireAdmin();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug, status, featured, social_impact, sort_order")
    .order("social_impact", { ascending: false })
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <ButtonLink href="/admin/projects/new" size="sm">
          <Plus className="size-4" aria-hidden="true" /> New project
        </ButtonLink>
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {(projects ?? []).map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <Link href={`/admin/projects/${p.id}`} className="font-medium hover:text-accent">
              {p.title}
            </Link>
            <span className="font-mono text-xs text-fg-subtle">/{p.slug}</span>
            <span className="ml-auto flex gap-2">
              {p.social_impact && <Badge tone="accent">Impact</Badge>}
              {p.featured && <Badge>Featured</Badge>}
              <Badge>{p.status}</Badge>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
