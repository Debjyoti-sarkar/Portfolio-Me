import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/data/content";
import { siteUrl } from "@/lib/env";
import { site } from "@/lib/site";
import { formatDate, readingMinutes } from "@/lib/utils";
import { Markdown } from "@/components/ui/markdown";
import { Container } from "@/components/ui/section";

const EMPTY = "__placeholder__";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: EMPTY }];
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = slug === EMPTY ? null : await getPost(slug);
  if (!post) return { title: "Note not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/notes/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/notes/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      authors: [site.name],
    },
  };
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const post = slug === EMPTY ? null : await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: site.name, url: siteUrl() },
    mainEntityOfPage: `${siteUrl()}/notes/${post.slug}`,
  };

  return (
    <Container className="max-w-3xl py-12 sm:py-20">
      <Link href="/notes" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft className="size-4" aria-hidden="true" /> All notes
      </Link>
      <article className="mt-8">
        <header className="mb-10">
          <p className="font-mono text-xs text-fg-subtle">
            {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at, "day")}</time>} ·{" "}
            {readingMinutes(post.content)} min read
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-xl text-fg-muted">{post.excerpt}</p>}
        </header>
        <Markdown>{post.content}</Markdown>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </Container>
  );
}
