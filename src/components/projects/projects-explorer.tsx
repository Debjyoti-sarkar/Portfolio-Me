"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { Project } from "@/lib/data/content";
import { categoryLabels } from "@/lib/site";
import { cn, facetCounts, filterProjects } from "@/lib/utils";
import { ProjectCard } from "./project-card";

const chip =
  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg";

/** Client-side filtering by category (chips) and technology (select). */
export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const techId = useId();
  const [category, setCategory] = useState<string | null>(null);
  const [tech, setTech] = useState<string | null>(null);

  const categories = useMemo(() => facetCounts(projects.map((p) => p.categories)), [projects]);
  const techs = useMemo(() => facetCounts(projects.map((p) => p.tech)), [projects]);
  const visible = useMemo(() => filterProjects(projects, { category, tech }), [projects, category, tech]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={category === null}
            onClick={() => setCategory(null)}
            className={cn(chip, "border-border text-fg-muted hover:text-fg")}
          >
            All <span className="font-mono text-xs opacity-70">{projects.length}</span>
          </button>
          {categories.map(({ value, count }) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory((c) => (c === value ? null : value))}
              className={cn(chip, "border-border text-fg-muted hover:text-fg")}
            >
              {categoryLabels[value] ?? value} <span className="font-mono text-xs opacity-70">{count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={techId} className="text-sm text-fg-muted">
            Tech
          </label>
          <select
            id={techId}
            value={tech ?? ""}
            onChange={(e) => setTech(e.target.value || null)}
            className="h-9 rounded-full border border-border bg-surface px-3 text-sm text-fg"
          >
            <option value="">Any</option>
            {techs.map(({ value, count }) => (
              <option key={value} value={value}>
                {value} ({count})
              </option>
            ))}
          </select>
          {(category || tech) && (
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                setTech(null);
              }}
              className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm text-fg-muted hover:text-fg"
            >
              <X className="size-3.5" aria-hidden="true" /> Clear
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-strong p-10 text-center text-fg-muted">
          No projects match those filters.
        </p>
      ) : (
        <motion.ul layout className="grid gap-5 sm:grid-cols-2">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectCard project={p} headingLevel="h2" />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
