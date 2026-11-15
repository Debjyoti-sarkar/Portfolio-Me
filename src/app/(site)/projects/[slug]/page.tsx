import { ArrowLeft, ArrowUpRight, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects, parseGallery } from "@/lib/data/content";
import { categoryLabels } from "@/lib/site";
import { mediaUrl } from "@/lib/storage";
import { isPlaceholder } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";
import { Markdown } from "@/components/ui/markdown";
import { Placeholder } from "@/components/ui/placeholder";
import { Container } from "@/components/ui/section";

const EMPTY = "__placeholder__";

export async function generateStaticParams() {
  const projects = await getProjects();
  // Cache Components requires at least one param; EMPTY resolves to 404.
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: EMPTY }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = slug === EMPTY ? null : await getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.tagline,
      url: `/projects/${project.slug}`,
    },
  };
}

const sections = [
  { key: "problem", title: "The problem" },
  { key: "role", title: "My role" },
  { key: "architecture", title: "Architecture" },
  { key: "challenges", title: "Challenges" },
  { key: "results", title: "Results" },
] as const;

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = slug === EMPTY ? null : await getProject(slug);
  if (!project) notFound();

  const cover = mediaUrl(project.cover_image);
  const gallery = parseGallery(project.gallery);
  const present = sections.filter((s) => project[s.key]);

  return (
    <article>
      <Container className="pt-10 pb-12 sm:pt-16">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden="true" /> All projects
        </Link>
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {project.social_impact && <Badge tone="accent">Social impact</Badge>}
            {project.categories
              .filter((c) => c !== "social-impact")
              .map((c) => (
                <Badge key={c}>{categoryLabels[c] ?? c}</Badge>
              ))}
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{project.title}</h1>
          <p className="mt-4 text-xl text-pretty text-fg-muted">{project.tagline}</p>
          {project.award && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm font-medium text-fg">
              <Trophy className="size-4 text-accent" aria-hidden="true" /> {project.award}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.github_url && (
              <ButtonLink href={project.github_url} external variant="secondary">
                <GitHubIcon className="size-4" /> Source code
              </ButtonLink>
            )}
            {project.live_url && (
              <ButtonLink href={project.live_url} external>
                Live demo <ArrowUpRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            )}
            {!project.github_url && !project.live_url && (
              <p className="text-sm text-fg-subtle">Source is private — happy to walk through it in an interview.</p>
            )}
          </div>
        </header>
      </Container>

      <Container>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-muted">
          {cover ? (
            <Image
              src={cover}
              alt={`${project.title} cover`}
              fill
              preload
              sizes="(min-width: 1024px) 976px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6">
              <Placeholder text="PLACEHOLDER: upload a cover screenshot or demo GIF from /admin." />
            </div>
          )}
        </div>
      </Container>

      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_16rem]">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="overview">
            <h2 id="overview" className="mb-4 text-2xl font-semibold tracking-tight">
              Overview
            </h2>
            <Markdown>{project.summary}</Markdown>
          </section>
          {present.map(({ key, title }) => (
            <section key={key} aria-labelledby={key}>
              <h2 id={key} className="mb-4 text-2xl font-semibold tracking-tight">
                {title}
              </h2>
              {isPlaceholder(project[key]) ? (
                <Placeholder text={project[key]!} />
              ) : (
                <Markdown>{project[key]!}</Markdown>
              )}
            </section>
          ))}
          <section aria-labelledby="gallery">
            <h2 id="gallery" className="mb-4 text-2xl font-semibold tracking-tight">
              Screenshots & demo
            </h2>
            {gallery.length === 0 ? (
              <Placeholder text="PLACEHOLDER: add screenshots or a demo video for this project from /admin." />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {gallery.map((g) => {
                  const src = mediaUrl(g.src);
                  return src ? (
                    <li key={g.src}>
                      <figure>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-muted">
                          <Image
                            src={src}
                            alt={g.alt}
                            fill
                            sizes="(min-width: 640px) 360px, 100vw"
                            className="object-cover"
                          />
                        </div>
                        {g.caption && <figcaption className="mt-2 text-sm text-fg-subtle">{g.caption}</figcaption>}
                      </figure>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </section>
          {project.credits && (
            <aside className="rounded-xl border border-border bg-surface-muted p-4 text-sm text-fg-muted">
              <strong className="font-semibold text-fg">Credits.</strong> {project.credits}
            </aside>
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {project.period && (
            <div>
              <h2 className="font-mono text-[0.7rem] tracking-widest text-fg-subtle uppercase">When</h2>
              <p className="mt-2 text-fg">{project.period}</p>
            </div>
          )}
          <div>
            <h2 className="font-mono text-[0.7rem] tracking-widest text-fg-subtle uppercase">Tech stack</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[0.78rem] text-fg-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          {present.length > 1 && (
            <nav aria-label="On this page">
              <h2 className="font-mono text-[0.7rem] tracking-widest text-fg-subtle uppercase">On this page</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[{ key: "overview", title: "Overview" }, ...present].map((s) => (
                  <li key={s.key}>
                    <a href={`#${s.key}`} className="text-fg-muted hover:text-accent">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </Container>
    </article>
  );
}
