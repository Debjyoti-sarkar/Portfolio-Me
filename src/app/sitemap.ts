import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/data/content";
import { siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/notes`, changeFrequency: "weekly", priority: 0.6 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.8 : 0.6,
    })),
    ...posts.map((p) => ({
      url: `${base}/notes/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
