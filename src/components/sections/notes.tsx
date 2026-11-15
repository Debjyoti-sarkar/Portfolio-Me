import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPosts } from "@/lib/data/content";
import { formatDate, readingMinutes } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export async function NotesPreview() {
  const posts = (await getPosts()).slice(0, 3);
  return (
    <Section
      id="notes"
      eyebrow="Notes"
      title="Writing about what I build."
      className="bg-surface-muted/50"
      action={
        posts.length > 0 ? (
          <ButtonLink href="/notes" variant="secondary" size="sm" className="self-start sm:self-auto">
            All notes <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        ) : null
      }
    >
      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-fg-muted">
          First notes are on the way — write-ups on HearMe&apos;s backend, BLE security and hackathon lessons.
        </p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/notes/${p.slug}`}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <time
                  dateTime={p.published_at ?? undefined}
                  className="shrink-0 font-mono text-xs text-fg-subtle sm:w-28"
                >
                  {p.published_at ? formatDate(p.published_at, "day") : ""}
                </time>
                <span className="flex-1">
                  <span className="font-semibold text-fg transition-colors group-hover:text-accent">{p.title}</span>
                  <span className="mt-1 block text-sm text-fg-muted">{p.excerpt}</span>
                </span>
                <span className="text-xs text-fg-subtle">{readingMinutes(p.content)} min read</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
