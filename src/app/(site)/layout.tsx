import { Analytics } from "@/components/layout/analytics";
import { CommandPaletteProvider } from "@/components/layout/command-palette";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getProjects } from "@/lib/data/content";
import { siteUrl } from "@/lib/env";
import { site } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const projects = await getProjects();
  const url = siteUrl();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    url,
    image: `${url}/photo.jpg`,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: site.education.school },
    knowsAbout: ["React Native", "Next.js", "Node.js", "Supabase", "Docker", "Embedded systems", "IoT", "Python"],
    sameAs: [site.socials.github, site.socials.linkedin],
  };

  return (
    <CommandPaletteProvider projects={projects.map(({ slug, title, tagline }) => ({ slug, title, tagline }))}>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-medium text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <Analytics />
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </CommandPaletteProvider>
  );
}
