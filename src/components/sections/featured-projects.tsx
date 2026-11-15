import { ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/data/content";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";

export async function FeaturedProjects() {
  const projects = (await getProjects()).filter((p) => p.featured).slice(0, 4);
  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Projects that put people first."
      description="Social-impact work leads — each project has a full case study covering the problem, my role, architecture and results."
      action={
        <ButtonLink href="/projects" variant="secondary" size="sm" className="self-start sm:self-auto">
          All projects <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      }
    >
      <ul className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <li key={p.id} className={i === 0 && projects.length % 2 === 1 ? "sm:col-span-2" : undefined}>
            <Reveal delay={i * 0.05} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
