import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { parseGallery } from "@/lib/data/content";
import type { ProjectFormInput } from "@/lib/validation/admin";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "Edit project" };

const empty: ProjectFormInput = {
  title: "",
  slug: "",
  tagline: "",
  summary: "",
  problem: "",
  role: "",
  architecture: "",
  challenges: "",
  results: "",
  tech: "",
  categories: [],
  social_impact: false,
  featured: false,
  award: "",
  period: "",
  credits: "",
  github_url: "",
  live_url: "",
  cover_image: "",
  gallery: [],
  status: "draft",
  sort_order: 100,
};

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  let defaults = empty;

  if (id !== "new") {
    const { data: p } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    if (!p) notFound();
    defaults = {
      ...p,
      problem: p.problem ?? "",
      role: p.role ?? "",
      architecture: p.architecture ?? "",
      challenges: p.challenges ?? "",
      results: p.results ?? "",
      tech: p.tech.join(", "),
      categories: p.categories as ProjectFormInput["categories"],
      award: p.award ?? "",
      period: p.period ?? "",
      credits: p.credits ?? "",
      github_url: p.github_url ?? "",
      live_url: p.live_url ?? "",
      cover_image: p.cover_image ?? "",
      gallery: parseGallery(p.gallery).map((g) => ({ ...g, caption: g.caption ?? "" })),
      status: p.status as "draft" | "published",
    };
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{id === "new" ? "New project" : defaults.title}</h1>
        {id !== "new" && defaults.status === "published" && (
          <Link href={`/projects/${defaults.slug}`} target="_blank" className="text-sm text-accent hover:underline">
            View live →
          </Link>
        )}
      </div>
      <ProjectForm
        id={id === "new" ? null : id}
        defaults={defaults}
        mediaBase={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-media`}
      />
    </div>
  );
}
