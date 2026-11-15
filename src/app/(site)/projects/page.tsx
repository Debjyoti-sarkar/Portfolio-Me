import type { Metadata } from "next";
import { getProjects } from "@/lib/data/content";
import { Container } from "@/components/ui/section";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies from Debjyoti Sarkar: women's safety (HearMe), secure rural banking (SIH 2025 finalist), sign-language recognition, fintech, agentic AI and IoT.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <Container className="py-16 sm:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 font-mono text-xs tracking-[0.18em] text-accent uppercase">Projects</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Things I&apos;ve built.</h1>
        <p className="mt-4 text-lg text-pretty text-fg-muted">
          Social-impact work first. Filter by area or technology, and open any project for the full case study.
        </p>
      </header>
      <ProjectsExplorer projects={projects} />
    </Container>
  );
}
