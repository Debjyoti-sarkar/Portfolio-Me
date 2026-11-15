import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/supabase/database.types";

type Row<T extends keyof Database["portfolio"]["Tables"]> = Database["portfolio"]["Tables"][T]["Row"];
export type Project = Row<"projects">;
export type Skill = Row<"skills">;
export type Experience = Row<"experiences">;
export type Achievement = Row<"achievements">;
export type Post = Row<"blog_posts">;
export type GalleryItem = { src: string; alt: string; caption?: string };

export const TAGS = {
  projects: "projects",
  skills: "skills",
  experiences: "experiences",
  achievements: "achievements",
  posts: "posts",
} as const;

/**
 * All reads below are cached ('use cache') and revalidated hourly or on
 * demand from /admin via revalidateTag/updateTag. If Supabase is unreachable
 * (e.g. a paused free-tier project) the error propagates so Next.js keeps
 * serving the last good cached version instead of caching an empty page.
 */
function unwrap<T>(result: { data: T | null; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`Failed to load ${what}: ${result.error.message}`);
  return result.data as T;
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.projects);
  const res = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("social_impact", { ascending: false })
    .order("sort_order", { ascending: true });
  return unwrap(res, "projects");
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.projects, `project:${slug}`);
  const res = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return unwrap(res, `project ${slug}`);
}

export async function getSkillGroups(): Promise<{ group: string; skills: string[] }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.skills);
  const rows = unwrap(
    await createPublicClient().from("skills").select("*").order("group_order").order("sort_order"),
    "skills",
  );
  const groups = new Map<string, string[]>();
  for (const row of rows) groups.set(row.group_name, [...(groups.get(row.group_name) ?? []), row.name]);
  return [...groups].map(([group, skills]) => ({ group, skills }));
}

export async function getExperiences(): Promise<Experience[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.experiences);
  return unwrap(await createPublicClient().from("experiences").select("*").order("sort_order"), "experiences");
}

export async function getAchievements(): Promise<Achievement[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.achievements);
  return unwrap(
    await createPublicClient().from("achievements").select("*").order("date", { ascending: false }),
    "achievements",
  );
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.posts);
  return unwrap(
    await createPublicClient()
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false }),
    "posts",
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.posts, `post:${slug}`);
  return unwrap(
    await createPublicClient().from("blog_posts").select("*").eq("published", true).eq("slug", slug).maybeSingle(),
    `post ${slug}`,
  );
}

export function parseGallery(value: Project["gallery"]): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === "object" && !Array.isArray(item) && typeof item.src === "string") {
      return [
        {
          src: item.src,
          alt: typeof item.alt === "string" ? item.alt : "",
          caption: typeof item.caption === "string" ? item.caption : undefined,
        },
      ];
    }
    return [];
  });
}
