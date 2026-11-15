import { describe, expect, it } from "vitest";
import { parseList, postSchema, projectSchema } from "@/lib/validation/admin";

const baseProject = {
  title: "HearMe",
  slug: "hearme",
  tagline: "Safety platform",
  summary: "Summary",
  problem: "",
  role: "",
  architecture: "",
  challenges: "",
  results: "",
  tech: "React Native, Supabase, , React Native",
  categories: ["social-impact"],
  social_impact: true,
  featured: true,
  award: "",
  period: "",
  credits: "",
  github_url: "",
  live_url: "",
  cover_image: "",
  gallery: [],
  status: "published",
  sort_order: "10",
};

describe("parseList", () => {
  it("splits, trims, drops blanks and de-duplicates", () => {
    expect(parseList(" a, b ,, a ,c")).toEqual(["a", "b", "c"]);
  });
});

describe("projectSchema", () => {
  it("normalises empty optionals to null and coerces numbers", () => {
    const p = projectSchema.parse(baseProject);
    expect(p.tech).toEqual(["React Native", "Supabase"]);
    expect(p.problem).toBeNull();
    expect(p.github_url).toBeNull();
    expect(p.sort_order).toBe(10);
  });
  it("rejects bad slugs, non-https links and unknown categories", () => {
    expect(projectSchema.safeParse({ ...baseProject, slug: "Hear Me" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...baseProject, github_url: "http://github.com/x" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...baseProject, github_url: "javascript:alert(1)" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...baseProject, categories: ["crypto"] }).success).toBe(false);
  });
});

describe("postSchema", () => {
  it("parses tags", () => {
    const p = postSchema.parse({
      title: "T",
      slug: "t",
      excerpt: "",
      content: "",
      tags: "rls, supabase",
      cover_image: "",
      published: false,
    });
    expect(p.tags).toEqual(["rls", "supabase"]);
  });
});
