import { Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "./contact-form";

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, Icon: Mail },
  { label: "Phone", value: site.phone.display, href: site.phone.href, Icon: Phone },
  { label: "LinkedIn", value: "in/debjyotisarkar13", href: site.socials.linkedin, Icon: LinkedInIcon },
  { label: "GitHub", value: "Debjyoti-sarkar", href: site.socials.github, Icon: GitHubIcon },
];

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something useful."
      description="Hiring, collaborating on a social-impact project, or putting a hackathon team together — I'd love to hear from you."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <ul className="space-y-3">
            {channels.map(({ label, value, href, Icon }) => {
              const external = href.startsWith("http");
              return (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-fg-muted transition-colors group-hover:text-accent">
                      <Icon className="size-[1.1rem]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.7rem] tracking-widest text-fg-subtle uppercase">
                        {label}
                      </span>
                      <span className="block truncate text-fg">{value}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
