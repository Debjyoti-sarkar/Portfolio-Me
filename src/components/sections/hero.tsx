import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const highlights = ["SIH 2025 National Finalist", "Research Intern, IIT Mandi", "CGPA 9.1 / 10"];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <Reveal>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-fg-muted">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Open to SWE, full-stack &amp; DevOps roles
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 id="hero-heading" className="text-display font-semibold text-balance">
              {site.name}
              <span className="sr-only"> — </span>
              <span className="mt-3 block text-fg-muted">
                I build <span className="text-accent">secure, real-time systems</span> for safety, finance and
                accessibility.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-pretty text-fg-muted">
              Final-year B.Tech CSE (Data Science) student working across full-stack mobile, cloud backends, DevOps and
              embedded/IoT — from React Native apps to the BLE wearables they talk to.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={site.resumePath}>
                View résumé <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/#contact" variant="secondary">
                Get in touch
              </ButtonLink>
              <div className="ml-1 flex items-center gap-1">
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
                >
                  <GitHubIcon className="size-5" />
                </a>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
                >
                  <LinkedInIcon className="size-5" />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs tracking-wide text-fg-subtle uppercase">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mx-auto w-48 sm:w-56 lg:w-64">
          <figure className="relative">
            <div className="relative aspect-[418/596] overflow-hidden rounded-[2rem] border border-border bg-surface-muted">
              <Image
                src="/photo.jpg"
                alt="Portrait of Debjyoti Sarkar"
                fill
                preload
                sizes="(min-width: 1024px) 256px, 224px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs whitespace-nowrap text-fg-muted shadow-sm">
              <MapPin className="size-3.5 text-accent" aria-hidden="true" /> {site.location}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
