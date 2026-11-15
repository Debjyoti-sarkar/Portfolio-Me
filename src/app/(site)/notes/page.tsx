import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/data/content";
import { formatDate, readingMinutes } from "@/lib/utils";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Notes",
  description: "Notes and write-ups by Debjyoti Sarkar on building secure, real-time systems.",
  alternates: { canonical: "/notes" },
};

export default async function NotesPage() {
  const posts = await getPosts();
  return (
    <Container className="py-16 sm:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 font-mono text-xs tracking-[0.18em] text-accent uppercase">Notes</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Notes & write-ups.</h1>
        <p className="mt-4 text-lg text-fg-muted">Lessons from building — backends, hardware and hackathons.</p>
      </header>
      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-strong p-10 text-center text-fg-muted">
          No notes published yet — check back soon.
        </p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.id}>
              <article className="py-6">
                <time dateTime={p.published_at ?? undefined} className="font-mono text-xs text-fg-subtle">
                  {p.published_at ? formatDate(p.published_at, "day") : ""} · {readingMinutes(p.content)} min read
                </time>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  <Link href={`/notes/${p.slug}`} className="hover:text-accent">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-2 text-fg-muted">{p.excerpt}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
