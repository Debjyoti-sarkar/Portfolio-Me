import { site } from "@/lib/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const facts = [
  { label: "Based in", value: site.location },
  { label: "Studying", value: `${site.education.degree}, ${site.education.school} · 2023–2027` },
  { label: "Focus", value: "Secure mobile & cloud backends, DevOps, embedded/IoT" },
  { label: "Community", value: "Google Developer Student Clubs · Institution's Innovation Council" },
];

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Engineering for the people technology usually leaves out.">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-pretty text-fg-muted">
          <p>
            I&apos;m Deb — a final-year Computer Science (Data Science) student at SJB Institute of Technology,
            Bangalore. I like problems where software meets the physical world and the stakes are real: a woman walking
            home alone, a first-time UPI user facing a phishing link, a patient who needs care that is easier to reach.
          </p>
          <p>
            That&apos;s led me to build across the whole stack — Supabase backends with row-level security, React Native
            apps, ML pipelines and BLE firmware on nRF52 wearables. Most of my best work started at a hackathon,
            including <strong className="font-medium text-fg">HearMe</strong> (2nd place at a national project expo) and
            a <strong className="font-medium text-fg">secure rural banking framework</strong> that reached the Smart
            India Hackathon 2025 national finals.
          </p>
          <p>
            Most recently I was a summer research intern at <strong className="font-medium text-fg">IIT Mandi</strong>.
            I&apos;m looking for software engineering, full-stack or DevOps roles where I can ship reliable systems that
            matter.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {facts.map((f) => (
              <div key={f.label} className="px-5 py-4">
                <dt className="font-mono text-[0.7rem] tracking-widest text-fg-subtle uppercase">{f.label}</dt>
                <dd className="mt-1 text-[0.95rem] text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
