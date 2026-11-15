"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";
import { usePalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const { open: openPalette } = usePalette();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and on Escape (returning focus).
  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync UI with route changes
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300",
        scrolled || menuOpen ? "border-border bg-bg/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-fg font-mono text-sm text-bg transition-colors group-hover:bg-accent group-hover:text-accent-fg"
          >
            DS
          </span>
          {/* Real text (not aria-label) so the accessible name matches what's visible. */}
          <span className="sr-only sm:not-sr-only">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as never}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg",
                    isActive(item.href) && "text-fg",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-9 items-center gap-2 rounded-full border border-border px-3 text-sm text-fg-subtle transition-colors hover:border-border-strong hover:text-fg sm:inline-flex"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search className="size-3.5" aria-hidden="true" />
            <span>Search</span>
            <kbd className="font-mono text-[0.7rem]" aria-hidden="true">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={openPalette}
            className="inline-flex size-9 items-center justify-center rounded-full text-fg-muted hover:bg-surface-muted hover:text-fg sm:hidden"
            aria-label="Open command menu"
          >
            <Search className="size-[1.1rem]" aria-hidden="true" />
          </button>
          <ThemeToggle />
          <a href={site.resumePath} className={buttonClasses("primary", "sm", "ml-1 hidden lg:inline-flex")}>
            Résumé
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full text-fg hover:bg-surface-muted lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Mobile" hidden={!menuOpen} className="border-t border-border lg:hidden">
        <ul className="mx-auto flex max-w-5xl flex-col px-4 py-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href as never}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-base text-fg-muted hover:bg-surface-muted hover:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 px-3 pb-2">
            <a href={site.resumePath} className={buttonClasses("primary", "md", "w-full")}>
              Résumé (PDF)
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
