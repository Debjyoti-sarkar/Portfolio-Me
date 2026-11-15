import { Mail } from "lucide-react";
import { site } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

const socialClass =
  "inline-flex size-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-fg-subtle sm:flex-row sm:px-6">
        <p>
          © <CopyrightYear /> {site.name}. Built with Next.js & Supabase.
        </p>
        <div className="flex items-center gap-1">
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="GitHub"
          >
            <GitHubIcon className="size-[1.1rem]" />
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="size-[1.1rem]" />
          </a>
          <a href={`mailto:${site.email}`} className={socialClass} aria-label="Email">
            <Mail className="size-[1.1rem]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
