import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <main id="main" className="grid min-h-dvh place-items-center px-4 py-24 text-center">
        <div className="max-w-md">
          <p className="font-mono text-sm tracking-[0.2em] text-accent">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">This page doesn&apos;t exist.</h1>
          <p className="mt-4 text-fg-muted">The link may be broken, or the page may have moved.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">Go home</ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Browse projects
            </ButtonLink>
          </div>
        </div>
      </main>
    </>
  );
}
