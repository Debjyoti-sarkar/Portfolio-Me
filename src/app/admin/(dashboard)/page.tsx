import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

const projectTextFields = ["summary", "problem", "role", "architecture", "challenges", "results"] as const;

export default async function AdminOverview() {
  const { supabase } = await requireAdmin();
  const [projects, posts, unread, experiences, summary] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id, slug, title, status, cover_image, gallery, summary, problem, role, architecture, challenges, results",
      ),
    supabase.from("blog_posts").select("id, title, published"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
    supabase.from("experiences").select("role, highlights"),
    supabase.rpc("analytics_summary", { days: 30 }),
  ]);

  // Content still to be written (PLACEHOLDER: …) or media still missing.
  const todos: { label: string; href?: string }[] = [];
  for (const p of projects.data ?? []) {
    for (const f of projectTextFields) {
      if (p[f]?.includes("PLACEHOLDER:")) todos.push({ label: `${p.title}: ${f}`, href: `/admin/projects/${p.id}` });
    }
    if (!p.cover_image) todos.push({ label: `${p.title}: cover image`, href: `/admin/projects/${p.id}` });
    if (!Array.isArray(p.gallery) || p.gallery.length === 0)
      todos.push({ label: `${p.title}: screenshots`, href: `/admin/projects/${p.id}` });
  }
  for (const e of experiences.data ?? []) {
    if (e.highlights.some(isPlaceholder)) todos.push({ label: `Experience: ${e.role}` });
  }

  const events = summary.data ?? [];
  const totals = events.reduce<Record<string, number>>(
    (acc, r) => ({ ...acc, [r.event]: (acc[r.event] ?? 0) + Number(r.total) }),
    {},
  );
  const topPages = events.filter((r) => r.event === "page_view").slice(0, 8);

  const stats = [
    {
      label: "Published projects",
      value: (projects.data ?? []).filter((p) => p.status === "published").length,
      href: "/admin/projects",
    },
    { label: "Published notes", value: (posts.data ?? []).filter((p) => p.published).length, href: "/admin/notes" },
    { label: "Unread messages", value: unread.count ?? 0, href: "/admin/messages" },
    { label: "Page views (30d)", value: totals.page_view ?? 0 },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
            <dt className="text-xs text-fg-subtle">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold">
              {s.href ? (
                <Link href={s.href as never} className="hover:text-accent">
                  {s.value}
                </Link>
              ) : (
                s.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="analytics">
        <h2 id="analytics" className="mb-3 font-semibold">
          Last 30 days
        </h2>
        <p className="mb-4 text-sm text-fg-muted">
          Résumé downloads: <strong className="text-fg">{totals.resume_download ?? 0}</strong> · Outbound clicks:{" "}
          <strong className="text-fg">{totals.outbound_click ?? 0}</strong>
        </p>
        {topPages.length === 0 ? (
          <p className="text-sm text-fg-subtle">
            No page views recorded yet (analytics only run in production builds).
          </p>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">Top pages by views</caption>
            <thead>
              <tr className="border-b border-border text-left text-fg-subtle">
                <th scope="col" className="py-2 font-normal">
                  Page
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  Views
                </th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((r) => (
                <tr key={r.path} className="border-b border-border">
                  <td className="py-2 font-mono">{r.path}</td>
                  <td className="py-2 text-right">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section aria-labelledby="todo">
        <h2 id="todo" className="mb-3 font-semibold">
          Content to fill in ({todos.length})
        </h2>
        {todos.length === 0 ? (
          <p className="text-sm text-fg-muted">Nothing left — every placeholder has been replaced. 🎉</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-surface text-sm">
            {todos.map((t, i) => (
              <li key={`${t.label}-${i}`} className="px-4 py-2.5">
                {t.href ? (
                  <Link href={t.href as never} className="hover:text-accent">
                    {t.label}
                  </Link>
                ) : (
                  t.label
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
