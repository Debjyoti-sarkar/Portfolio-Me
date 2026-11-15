"use client";

import { Command } from "cmdk";
import {
  ArrowUpRight,
  Copy,
  FileText,
  FolderGit2,
  Home,
  Mail,
  Monitor,
  Moon,
  NotebookPen,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { site } from "@/lib/site";

type PaletteProject = { slug: string; title: string; tagline: string };

const PaletteContext = createContext<{ open: () => void } | null>(null);

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used inside <CommandPaletteProvider>");
  return ctx;
}

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted data-[selected=true]:bg-surface-muted data-[selected=true]:text-fg";
const groupClass =
  "px-2 pb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.7rem] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-fg-subtle [&_[cmdk-group-heading]]:uppercase";

/** ⌘K / Ctrl+K quick navigation across sections, projects and actions. */
export function CommandPaletteProvider({ projects, children }: { projects: PaletteProject[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const go = useCallback((href: string) => run(() => router.push(href as never)), [router, run]);

  const ctx = useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <PaletteContext.Provider value={ctx}>
      {children}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command menu"
        loop
        overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        contentClassName="fixed top-[12vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-fg-subtle" aria-hidden="true" />
          <Command.Input
            placeholder="Search pages, projects, actions…"
            className="h-12 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-fg-subtle"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[0.7rem] text-fg-subtle sm:block">
            Esc
          </kbd>
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain pb-2">
          <Command.Empty className="px-4 py-8 text-center text-sm text-fg-subtle">No results.</Command.Empty>

          <Command.Group heading="Navigate" className={groupClass}>
            <Command.Item className={itemClass} onSelect={() => go("/")}>
              <Home className="size-4" aria-hidden="true" /> Home
            </Command.Item>
            <Command.Item className={itemClass} onSelect={() => go("/#about")}>
              <User className="size-4" aria-hidden="true" /> About
            </Command.Item>
            <Command.Item className={itemClass} onSelect={() => go("/projects")}>
              <FolderGit2 className="size-4" aria-hidden="true" /> All projects
            </Command.Item>
            <Command.Item className={itemClass} onSelect={() => go("/#experience")}>
              <ArrowUpRight className="size-4" aria-hidden="true" /> Experience & achievements
            </Command.Item>
            <Command.Item className={itemClass} onSelect={() => go("/notes")}>
              <NotebookPen className="size-4" aria-hidden="true" /> Notes
            </Command.Item>
            <Command.Item className={itemClass} onSelect={() => go("/#contact")}>
              <Mail className="size-4" aria-hidden="true" /> Contact
            </Command.Item>
          </Command.Group>

          {projects.length > 0 && (
            <Command.Group heading="Projects" className={groupClass}>
              {projects.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`${p.title} ${p.tagline}`}
                  className={itemClass}
                  onSelect={() => go(`/projects/${p.slug}`)}
                >
                  <FolderGit2 className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    <span className="text-fg">{p.title}</span>
                    <span className="ml-2 text-fg-subtle">{p.tagline}</span>
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Actions" className={groupClass}>
            <Command.Item className={itemClass} onSelect={() => run(() => window.open(site.resumePath, "_blank"))}>
              <FileText className="size-4" aria-hidden="true" /> Open résumé (PDF)
            </Command.Item>
            <Command.Item
              className={itemClass}
              keywords={["email", "copy"]}
              onSelect={() => {
                void navigator.clipboard.writeText(site.email).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
            >
              <Copy className="size-4" aria-hidden="true" /> {copied ? "Copied!" : `Copy email (${site.email})`}
            </Command.Item>
            <Command.Item
              className={itemClass}
              onSelect={() => run(() => window.open(site.socials.github, "_blank", "noopener"))}
            >
              <ArrowUpRight className="size-4" aria-hidden="true" /> GitHub
            </Command.Item>
            <Command.Item
              className={itemClass}
              onSelect={() => run(() => window.open(site.socials.linkedin, "_blank", "noopener"))}
            >
              <ArrowUpRight className="size-4" aria-hidden="true" /> LinkedIn
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Theme" className={groupClass}>
            <Command.Item className={itemClass} onSelect={() => run(() => setTheme("light"))}>
              <Sun className="size-4" aria-hidden="true" /> Light
            </Command.Item>
            <Command.Item className={itemClass} onSelect={() => run(() => setTheme("dark"))}>
              <Moon className="size-4" aria-hidden="true" /> Dark
            </Command.Item>
            <Command.Item className={itemClass} onSelect={() => run(() => setTheme("system"))}>
              <Monitor className="size-4" aria-hidden="true" /> System
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </PaletteContext.Provider>
  );
}
