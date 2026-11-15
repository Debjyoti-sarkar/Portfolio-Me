import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

/** Verifies Row Level Security from the public (anon) client's point of view. */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

test.describe("row level security (anon)", () => {
  test.skip(!url || !key, "Supabase env not set");
  test.describe.configure({ mode: "serial" });
  test.skip(({ isMobile }) => isMobile, "run once");

  const db = () => createClient(url!, key!, { db: { schema: "portfolio" }, auth: { persistSession: false } });

  test("can read published content only", async () => {
    const { data, error } = await db().from("projects").select("slug, status");
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
    expect(data!.every((p) => p.status === "published")).toBe(true);

    const { data: posts } = await db().from("blog_posts").select("published");
    expect(posts!.every((p) => p.published)).toBe(true);
  });

  test("cannot read or write the contact inbox directly", async () => {
    const read = await db().from("contact_messages").select("*");
    expect(read.error ?? read.data?.length === 0).toBeTruthy();
    const write = await db()
      .from("contact_messages")
      .insert({ name: "x", email: "x@x.co", message: "bypass attempt!", ip_hash: "x" });
    expect(write.error).not.toBeNull();
  });

  test("cannot modify content tables", async () => {
    const insert = await db().from("projects").insert({ slug: "hacked", title: "x", tagline: "x", summary: "x" });
    expect(insert.error).not.toBeNull();
    const update = await db().from("skills").update({ name: "hacked" }).neq("name", "").select();
    expect(update.data ?? []).toHaveLength(0);
  });

  test("can record analytics events but not read them", async () => {
    const insert = await db().from("analytics_events").insert({ event: "page_view", path: "/rls-test" });
    expect(insert.error).toBeNull();
    const bad = await db().from("analytics_events").insert({ event: "page_view", path: "no-leading-slash" });
    expect(bad.error).not.toBeNull();
    const read = await db().from("analytics_events").select("*");
    expect(read.data ?? []).toHaveLength(0);
  });

  test("cannot write to storage buckets", async () => {
    const { error } = await db()
      .storage.from("portfolio-media")
      .upload(`rls-${Date.now()}.txt`, new Blob(["x"], { type: "image/png" }));
    expect(error).not.toBeNull();
  });
});
