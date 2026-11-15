import { Braces, Cpu, Layers, ServerCog, ShieldCheck, type LucideIcon } from "lucide-react";
import { getSkillGroups } from "@/lib/data/content";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const icons: Record<string, LucideIcon> = {
  Languages: Braces,
  "Web, Mobile & Backend": Layers,
  "DevOps & Tools": ServerCog,
  "AI/ML & Security": ShieldCheck,
  "Embedded & IoT": Cpu,
};

export async function Skills() {
  const groups = await getSkillGroups();
  return (
    <Section id="skills" eyebrow="Toolbox" title="Skills, grouped by where I use them." className="bg-surface-muted/50">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(({ group, skills }, i) => {
          const Icon = icons[group] ?? Braces;
          return (
            <Reveal key={group} delay={i * 0.04} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-surface p-6">
                <h3 className="flex items-center gap-2.5 font-semibold">
                  <Icon className="size-[1.1rem] text-accent" aria-hidden="true" />
                  {group}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-border bg-bg px-2.5 py-1 font-mono text-[0.78rem] text-fg-muted"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
