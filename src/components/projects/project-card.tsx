import { ArrowUpRight, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data/content";
import { categoryLabels } from "@/lib/site";
import { mediaUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/** Whole card is one link (stretched ::after) so it's a single tab stop. */
export function ProjectCard({
  project,
  className,
  headingLevel = "h3",
}: {
  project: Project;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const cover = mediaUrl(project.cover_image);
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_12px_40px_-16px_rgb(0_0_0/0.18)] motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-surface-muted">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <GeneratedCover project={project} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {project.social_impact && <Badge tone="accent">Social impact</Badge>}
          {project.categories
            .filter((c) => c !== "social-impact")
            .slice(0, 2)
            .map((c) => (
              <Badge key={c}>{categoryLabels[c] ?? c}</Badge>
            ))}
        </div>
        <Heading className="text-lg font-semibold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none after:focus-visible:rounded-2xl after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-ring"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="text-[0.95rem] text-pretty text-fg-muted">{project.tagline}</p>
        {project.award && (
          <p className="flex items-center gap-2 text-sm font-medium text-fg">
            <Trophy className="size-4 shrink-0 text-accent" aria-hidden="true" />
            {project.award}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <p className="font-mono text-xs leading-relaxed text-fg-subtle">{project.tech.slice(0, 4).join(" · ")}</p>
          <ArrowUpRight
            className="size-5 shrink-0 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}

/** Typographic cover used until real screenshots are uploaded. */
function GeneratedCover({ project }: { project: Project }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between p-5">
      <div className="absolute inset-0 [background-image:radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.5]" />
      <span className="relative font-mono text-[0.7rem] tracking-widest text-fg-subtle uppercase">
        {project.period ?? project.categories.map((c) => categoryLabels[c] ?? c)[0]}
      </span>
      <span className="relative text-3xl font-semibold tracking-tight text-fg/85 sm:text-4xl">{project.title}</span>
    </div>
  );
}
