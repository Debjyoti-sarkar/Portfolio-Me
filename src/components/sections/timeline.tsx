import { Briefcase, GraduationCap, Trophy, Users } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getAchievements, getExperiences, type Experience } from "@/lib/data/content";
import { formatDate, formatDateRange, isPlaceholder, type DatePrecision } from "@/lib/utils";
import { Placeholder } from "@/components/ui/placeholder";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const kindIcon = { work: Briefcase, leadership: Users, education: GraduationCap } as const;

export async function Timeline() {
  // Cached as a whole so "(expected)" end dates are evaluated at most hourly.
  "use cache";
  cacheLife("hours");
  const [experiences, achievements] = await Promise.all([getExperiences(), getAchievements()]);
  return (
    <Section id="experience" eyebrow="Journey" title="Experience, hackathons & achievements.">
      <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <h3 className="mb-6 font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">Experience & education</h3>
          <ol className="relative space-y-10 border-l border-border pl-8">
            {experiences.map((e, i) => (
              <ExperienceItem key={e.id} item={e} index={i} />
            ))}
          </ol>
        </div>
        <div>
          <h3 className="mb-6 font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">Hackathons & awards</h3>
          <ol className="space-y-4">
            {achievements.map((a, i) => (
              <li key={a.id}>
                <Reveal delay={i * 0.05}>
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="flex items-center gap-2 font-semibold">
                        <Trophy className="size-4 shrink-0 text-accent" aria-hidden="true" />
                        {a.title}
                      </p>
                      <time dateTime={a.date} className="shrink-0 font-mono text-xs text-fg-subtle">
                        {formatDate(a.date, a.date_precision as DatePrecision)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm font-medium text-fg">{a.event}</p>
                    {a.description && <p className="mt-2 text-sm text-pretty text-fg-muted">{a.description}</p>}
                    {a.project_slug && (
                      <Link
                        href={`/projects/${a.project_slug}`}
                        className="mt-3 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
                      >
                        Read the case study →
                      </Link>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function ExperienceItem({ item, index }: { item: Experience; index: number }) {
  const Icon = kindIcon[item.kind as keyof typeof kindIcon] ?? Briefcase;
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute top-0.5 -left-[2.85rem] grid size-7 place-items-center rounded-full border border-border bg-bg text-accent"
      >
        <Icon className="size-3.5" />
      </span>
      <Reveal delay={index * 0.05}>
        <p className="font-mono text-xs text-fg-subtle">{formatDateRange(item.start_date, item.end_date)}</p>
        <h4 className="mt-1 text-lg font-semibold tracking-tight text-balance">{item.role}</h4>
        <p className="text-[0.95rem] text-fg-muted">
          {item.organization}
          {item.location ? <span className="text-fg-subtle"> · {item.location}</span> : null}
        </p>
        {item.highlights.length > 0 && (
          <ul className="mt-3 space-y-2 text-[0.95rem] text-pretty text-fg-muted">
            {item.highlights.map((h) =>
              isPlaceholder(h) ? (
                <li key={h}>
                  <Placeholder text={h} />
                </li>
              ) : (
                <li
                  key={h}
                  className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-accent"
                >
                  {h}
                </li>
              ),
            )}
          </ul>
        )}
      </Reveal>
    </li>
  );
}
