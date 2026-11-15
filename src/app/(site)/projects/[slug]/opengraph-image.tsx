import { getProject, getProjects } from "@/lib/data/content";
import { ogCard, ogSize } from "@/lib/og/card";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  return ogCard({
    eyebrow: project?.award ? "Case study · Award-winning" : "Case study",
    title: project?.title ?? "Project",
    subtitle: project?.tagline,
  });
}
